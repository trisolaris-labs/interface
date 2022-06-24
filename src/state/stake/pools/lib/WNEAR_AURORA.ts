import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV2Pool({
  ID: 31,
  poolId: 24,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.AURORA[ChainId.AURORA]],
  lpAddress: '0x1e0e812FBcd3EB75D8562AD6F310Ed94D258D008',
  rewarderAddress: '0x34c58E960b80217fA3e0323d37563c762a131AD9',
  allocPoint: 1,
  inStaging: false,
  isFeatured: true
})
