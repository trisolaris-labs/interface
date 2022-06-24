import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV2Pool({
  ID: 9,
  poolId: 2,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.ATLUNA[ChainId.AURORA]],
  lpAddress: '0xdF8CbF89ad9b7dAFdd3e37acEc539eEcC8c47914',
  rewarderAddress: '0x89F6628927fdFA2592E016Ba5B14389a4b08D681',
  allocPoint: 1
})
