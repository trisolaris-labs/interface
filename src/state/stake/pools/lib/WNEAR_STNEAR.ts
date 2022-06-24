import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV2Pool({
  ID: 19,
  poolId: 12,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.STNEAR[ChainId.AURORA]],
  lpAddress: '0x47924Ae4968832984F4091EEC537dfF5c38948a4',
  rewarderAddress: '0xf267212F1D8888e0eD20BbB0c7C87A089cDe6E88',
  allocPoint: 1,
  isFeatured: true
})
