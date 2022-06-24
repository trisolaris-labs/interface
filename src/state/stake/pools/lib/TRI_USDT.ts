import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV2Pool({
  ID: 11,
  poolId: 4,
  tokens: [TOKENS.TRI[ChainId.AURORA], TOKENS.USDT[ChainId.AURORA]],
  lpAddress: '0x61C9E05d1Cdb1b70856c7a2c53fA9c220830633c',
  allocPoint: 1
})
