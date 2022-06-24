import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV2Pool({
  ID: 13,
  poolId: 6,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.BNB[ChainId.AURORA]],
  lpAddress: '0x7be4a49AA41B34db70e539d4Ae43c7fBDf839DfA',
  allocPoint: 1
})
