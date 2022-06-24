import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV2Pool({
  ID: 12,
  poolId: 5,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.AVAX[ChainId.AURORA]],
  lpAddress: '0x6443532841a5279cb04420E61Cf855cBEb70dc8C',
  allocPoint: 1
})
