import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV2Pool({
  ID: 29,
  poolId: 22,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.LINEAR[ChainId.AURORA]],
  lpAddress: '0xbceA13f9125b0E3B66e979FedBCbf7A4AfBa6fd1',
  rewarderAddress: '0x1616B20534d1d1d731C31Ca325F4e909b8f3E0f0',
  allocPoint: 1,
  inStaging: false,
  isFeatured: true
})
