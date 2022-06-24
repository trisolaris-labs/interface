import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV2Pool({
  ID: 21,
  poolId: 14,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.XNL[ChainId.AURORA]],
  lpAddress: '0xFBc4C42159A5575a772BebA7E3BF91DB508E127a',
  rewarderAddress: '0x028Fbc4BB5787e340524EF41d95875Ac2C382101',
  allocPoint: 1
})
