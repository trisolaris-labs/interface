import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV2Pool({
  ID: 38,
  poolId: 31,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.BRRR[ChainId.AURORA]],
  lpAddress: '0x71dBEB011EAC90C51b42854A77C45C1E53242698',
  rewarderAddress: '0x9a418aB67F94164EB931344A4EBF1F7bDd3E97aE',
  allocPoint: 1,
  isFeatured: true
})
