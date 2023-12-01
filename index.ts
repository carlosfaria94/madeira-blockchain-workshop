require('dotenv').config()
import { LocalAccountSigner } from '@alchemy/aa-core'
import { ECDSAProvider } from '@zerodev/sdk'
import { Hash, createPublicClient, encodeFunctionData, http, parseAbi } from 'viem'
import { generatePrivateKey } from 'viem/accounts'
import { polygonMumbai } from 'viem/chains'

const projectId = process.env.PROJECT_ID!
const privateKey = process.env.PRIVATE_KEY as Hash

const owner = LocalAccountSigner.privateKeyToAccountSigner(privateKey ?? generatePrivateKey())

const contractAddress = '0x34bE7f35132E97915633BC1fc020364EA5134863'

const contractABI = parseAbi([
  'function mint(address _to) public',
  'function balanceOf(address owner) external view returns (uint256 balance)',
])

const publicClient = createPublicClient({
  chain: polygonMumbai,
  transport: http(process.env.ALCHEMY_RPC),
})

const main = async () => {
  const provider = await ECDSAProvider.init({
    projectId,
    owner,
  })

  const smartContractAddress = await provider.getAddress()
  console.log('Smart contract contrafactual address:', smartContractAddress)

  const userOp = await provider.sendUserOperation({
    target: contractAddress,
    data: encodeFunctionData({
      abi: contractABI,
      functionName: 'mint',
      args: [smartContractAddress],
    }),
  })

  console.log('User Operation', userOp)

  await provider.waitForUserOperationTransaction(userOp.hash as Hash)

  const balanceOf = await publicClient.readContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'balanceOf',
    args: [smartContractAddress],
  })
  console.log(`NFT balance: ${balanceOf}`)
}

main().then(() => process.exit(0))
