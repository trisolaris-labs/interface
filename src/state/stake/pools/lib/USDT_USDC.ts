import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV1Pool({
  ID: 3,
  poolId: 3,
  tokens: [TOKENS.USDT[ChainId.AURORA], TOKENS.USDC[ChainId.AURORA]],
  lpAddress: '0x2fe064B6c7D274082aa5d2624709bC9AE7D16C77',
  allocPoint: 1
})
