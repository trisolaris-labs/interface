import { Interface } from '@ethersproject/abi'
import STAKING_REWARDS_ABI from './masterchef.json'

const STAKING_REWARDS_INTERFACE = new Interface(STAKING_REWARDS_ABI)

export { STAKING_REWARDS_INTERFACE }
