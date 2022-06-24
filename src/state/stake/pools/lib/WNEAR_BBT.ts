import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV2Pool({
  ID: 24,
  poolId: 17,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.BBT[ChainId.AURORA]],
  lpAddress: '0xadAbA7E2bf88Bd10ACb782302A568294566236dC',
  rewarderAddress: '0x41A7e26a2cC7DaDc5A31fE9DD77c30Aeb029184d',
  allocPoint: 1,
  inStaging: false,
  noTriRewards: true
})
