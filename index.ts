require('dotenv').config()

import { LocalAccountSigner } from '@alchemy/aa-core'
import { Hash, parseAbi } from 'viem'
import { generatePrivateKey } from 'viem/accounts'

const projectId = process.env.PROJECT_ID!
const privateKey = process.env.PRIVATE_KEY as Hash

const owner = LocalAccountSigner.privateKeyToAccountSigner(privateKey ?? generatePrivateKey())

const contractAddress = '0x34bE7f35132E97915633BC1fc020364EA5134863'

const contractABI = parseAbi([
  'function mint(address _to) public',
  'function balanceOf(address owner) external view returns (uint256 balance)',
])

const main = async () => {}

main().then(() => process.exit(0))
