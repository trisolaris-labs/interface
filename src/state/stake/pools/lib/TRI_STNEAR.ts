import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV2Pool({
  ID: 37,
  poolId: 30,
  tokens: [TOKENS.TRI[ChainId.AURORA], TOKENS.STNEAR[ChainId.AURORA]],
  lpAddress: '0x120e713AD36eCBff171FC8B7cf19FA8B6f6Ba50C',
  rewarderAddress: '0xD59c44fb39638209ec4ADD6DcD7A230a286055ee',
  allocPoint: 1,
  isFeatured: true
})
