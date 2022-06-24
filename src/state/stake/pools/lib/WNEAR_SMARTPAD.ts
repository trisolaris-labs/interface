import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV2Pool({
  ID: 36,
  poolId: 29,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.SMARTPAD[ChainId.AURORA]],
  lpAddress: '0x6a29e635bcab8abee1491059728e3d6d11d6a114',
  rewarderAddress: '0xe4A4e38a30E9100a147e0C146a9AeAC74C28eD4f',
  allocPoint: 1,
  noTriRewards: true
})
