import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV1Pool({
  ID: 2,
  poolId: 2,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.USDT[ChainId.AURORA]],
  lpAddress: '0x03B666f3488a7992b2385B12dF7f35156d7b29cD',
  allocPoint: 1
})
