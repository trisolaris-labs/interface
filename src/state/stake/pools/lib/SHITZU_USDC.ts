import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV2Pool({
  ID: 26,
  poolId: 19,
  tokens: [TOKENS.SHITZU[ChainId.AURORA], TOKENS.USDC[ChainId.AURORA]],
  lpAddress: '0x5E74D85311fe2409c341Ce49Ce432BB950D221DE',
  allocPoint: 1,
  inStaging: false
})
