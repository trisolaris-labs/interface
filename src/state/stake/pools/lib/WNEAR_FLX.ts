import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV2Pool({
  ID: 15,
  poolId: 8,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.FLX[ChainId.AURORA]],
  lpAddress: '0x48887cEEA1b8AD328d5254BeF774Be91B90FaA09',
  rewarderAddress: '0x42b950FB4dd822ef04C4388450726EFbF1C3CF63',
  allocPoint: 1,
  isFeatured: true
})
