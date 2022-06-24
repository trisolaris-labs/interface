import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV2Pool({
  ID: 8,
  poolId: 1,
  tokens: [TOKENS.TRI[ChainId.AURORA], TOKENS.AURORA[ChainId.AURORA]],
  lpAddress: '0xd1654a7713617d41A8C9530Fb9B948d00e162194',
  rewarderAddress: '0x78EdEeFdF8c3ad827228d07018578E89Cf159Df1',
  allocPoint: 1,
  isFeatured: true
})
