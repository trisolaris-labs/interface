import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV2Pool({
  ID: 7,
  poolId: 0,
  tokens: [TOKENS.AURORA[ChainId.AURORA], TOKENS.WETH[ChainId.AURORA]],
  lpAddress: '0x5eeC60F348cB1D661E4A5122CF4638c7DB7A886e',
  rewarderAddress: '0x94669d7a170bfe62FAc297061663e0B48C63B9B5',
  allocPoint: 1,
  isFeatured: true
})
