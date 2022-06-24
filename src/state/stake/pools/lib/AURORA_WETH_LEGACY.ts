import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV1Pool({
  ID: 6,
  poolId: 6,
  tokens: [TOKENS.AURORA[ChainId.AURORA], TOKENS.WETH[ChainId.AURORA]],
  lpAddress: '0x5eeC60F348cB1D661E4A5122CF4638c7DB7A886e',
  allocPoint: 1
})
