import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV1Pool({
  ID: 4,
  poolId: 4,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.WBTC[ChainId.AURORA]],
  lpAddress: '0xbc8A244e8fb683ec1Fd6f88F3cc6E565082174Eb',
  allocPoint: 1
})
