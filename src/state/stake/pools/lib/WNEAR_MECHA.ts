import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV2Pool({
  ID: 16,
  poolId: 9,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.MECHA[ChainId.AURORA]],
  lpAddress: '0xd62f9ec4C4d323A0C111d5e78b77eA33A2AA862f',
  rewarderAddress: '0x9847F7e33CCbC0542b05d15c5cf3aE2Ae092C057',
  allocPoint: 1
})
