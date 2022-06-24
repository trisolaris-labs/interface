import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV2Pool({
  ID: 35,
  poolId: 28,
  tokens: STABLESWAP_POOLS[StableSwapPoolName.USDC_USDT_USN].poolTokens,
  lpAddress: STABLESWAP_POOLS[StableSwapPoolName.USDC_USDT_USN].lpToken.address,
  rewarderAddress: '0x78391f26397A099Ec9cC346A23f856d1284cBd06',
  allocPoint: 1,
  inStaging: false,
  stableSwapPoolName: StableSwapPoolName.USDC_USDT_USN,
  isFeatured: true
})
