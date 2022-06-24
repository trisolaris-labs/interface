import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV2Pool({
  ID: 30,
  poolId: 23,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.BSTN[ChainId.AURORA]],
  lpAddress: '0xBBf3D4281F10E537d5b13CA80bE22362310b2bf9',
  rewarderAddress: '0xDc6d09f5CC085E29972d192cB3AdCDFA6495a741',
  allocPoint: 1,
  inStaging: false,
  isFeatured: true
})
