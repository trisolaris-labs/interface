import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV2Pool({
  ID: 18,
  poolId: 11,
  tokens: [TOKENS.XTRI[ChainId.AURORA], TOKENS.STNEAR[ChainId.AURORA]],
  lpAddress: '0x5913f644A10d98c79F2e0b609988640187256373',
  rewarderAddress: '0x7B9e31BbEdbfdc99e3CC8b879b9a3B1e379Ce530',
  allocPoint: 1
})
