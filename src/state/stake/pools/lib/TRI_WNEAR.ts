import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV1Pool({
  ID: 5,
  poolId: 5,
  tokens: [TOKENS.TRI[ChainId.AURORA], TOKENS.WNEAR[ChainId.AURORA]],
  lpAddress: '0x84b123875F0F36B966d0B6Ca14b31121bd9676AD',
  allocPoint: 1
})
