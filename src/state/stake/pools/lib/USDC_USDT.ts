import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV2Pool({
  ID: 25,
  poolId: 18,
  tokens: STABLESWAP_POOLS[StableSwapPoolName.USDC_USDT].poolTokens,
  lpAddress: STABLESWAP_POOLS[StableSwapPoolName.USDC_USDT].lpToken.address,
  rewarderAddress: '',
  allocPoint: 1,
  inStaging: true,
  stableSwapPoolName: StableSwapPoolName.USDC_USDT
})
