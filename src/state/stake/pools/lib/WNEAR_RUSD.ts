import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV2Pool({
  ID: 28,
  poolId: 21,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.RUSD[ChainId.AURORA]],
  lpAddress: '0xbC0e71aE3Ef51ae62103E003A9Be2ffDe8421700',
  rewarderAddress: '0x87a03aFA70302a5a0F6156eBEd27f230ABF0e69C',
  allocPoint: 1,
  inStaging: false,
  isFeatured: true
})
