import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV2Pool({
  ID: 39,
  poolId: 32,
  tokens: STABLESWAP_POOLS[StableSwapPoolName.NUSD_USDC_USDT].poolTokens,
  lpAddress: STABLESWAP_POOLS[StableSwapPoolName.NUSD_USDC_USDT].lpToken.address,
  rewarderAddress: '0xf4ac19e819f5940E92543B544126E7F20b5f6978',
  allocPoint: 1,
  inStaging: false,
  stableSwapPoolName: StableSwapPoolName.NUSD_USDC_USDT,
  friendlyFarmName: STABLESWAP_POOLS[StableSwapPoolName.NUSD_USDC_USDT].friendlyName,
  isFeatured: true
})
