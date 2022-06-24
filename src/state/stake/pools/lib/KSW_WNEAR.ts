import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV2Pool({
  ID: 34,
  poolId: 27,
  tokens: [TOKENS.KSW[ChainId.AURORA], TOKENS.WNEAR[ChainId.AURORA]],
  lpAddress: '0x29C160d2EF4790F9A23B813e7544D99E539c28Ba',
  rewarderAddress: '0x0Cc7e9D333bDAb07b2C8d41363C72c472B7E9594',
  allocPoint: 1,
  inStaging: false,
  noTriRewards: true
})
