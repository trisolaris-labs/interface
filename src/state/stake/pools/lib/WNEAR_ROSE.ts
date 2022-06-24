import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV2Pool({
  ID: 27,
  poolId: 20,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.ROSE[ChainId.AURORA]],
  lpAddress: '0xbe753E99D0dBd12FB39edF9b884eBF3B1B09f26C',
  rewarderAddress: '0xfe9B7A3bf38cE0CA3D5fA25d371Ff5C6598663d4',
  allocPoint: 1,
  inStaging: false,
  isFeatured: true
})
