import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV1Pool({
  ID: 0,
  poolId: 0,
  tokens: [TOKENS.WETH[ChainId.AURORA], TOKENS.WNEAR[ChainId.AURORA]],
  lpAddress: '0x63da4DB6Ef4e7C62168aB03982399F9588fCd198',
  allocPoint: 1
})
