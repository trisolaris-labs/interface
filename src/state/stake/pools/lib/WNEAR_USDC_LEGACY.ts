import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV1Pool({
  ID: 1,
  poolId: 1,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.USDC[ChainId.AURORA]],
  lpAddress: '0x20F8AeFB5697B77E0BB835A8518BE70775cdA1b0',
  allocPoint: 1
})
