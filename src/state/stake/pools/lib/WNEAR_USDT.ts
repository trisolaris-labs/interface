import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV2Pool({
  ID: 33,
  poolId: 26,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.USDT[ChainId.AURORA]],
  lpAddress: '0x03B666f3488a7992b2385B12dF7f35156d7b29cD',
  rewarderAddress: '0x4e0152b260319e5131f853AeCB92c8f992AA0c97',
  allocPoint: 1,
  inStaging: false,
  isFeatured: true
})
