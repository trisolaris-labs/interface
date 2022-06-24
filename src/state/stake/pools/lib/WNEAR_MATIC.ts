import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV2Pool({
  ID: 14,
  poolId: 7,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.MATIC[ChainId.AURORA]],
  lpAddress: '0x3dC236Ea01459F57EFc737A12BA3Bb5F3BFfD071',
  allocPoint: 1
})
