import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV2Pool({
  ID: 20,
  poolId: 13,
  tokens: [TOKENS.AURORA[ChainId.AURORA], TOKENS.XNL[ChainId.AURORA]],
  lpAddress: '0xb419ff9221039Bdca7bb92A131DD9CF7DEb9b8e5',
  rewarderAddress: '0xb84293D04137c9061afe34118Dac9931df153826',
  allocPoint: 1,
  noTriRewards: true
})
