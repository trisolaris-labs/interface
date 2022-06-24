import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV2Pool({
  ID: 23,
  poolId: 16,
  tokens: [TOKENS.USDT[ChainId.AURORA], TOKENS.AUSDO[ChainId.AURORA]],
  lpAddress: '0x6277f94a69Df5df0Bc58b25917B9ECEFBf1b846A',
  rewarderAddress: '0x170431D69544a1BC97855C6564E8460d39508844',
  allocPoint: 1,
  inStaging: false,
  isFeatured: true
})
