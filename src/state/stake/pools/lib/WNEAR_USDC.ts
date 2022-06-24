import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV2Pool({
  ID: 32,
  poolId: 25,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.USDC[ChainId.AURORA]],
  lpAddress: '0x20F8AeFB5697B77E0BB835A8518BE70775cdA1b0',
  rewarderAddress: '0x84C8B673ddBF0F647c350dEd488787d3102ebfa3',
  allocPoint: 1,
  inStaging: false,
  isFeatured: true
})
