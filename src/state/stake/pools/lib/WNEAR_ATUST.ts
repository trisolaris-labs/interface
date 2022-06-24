import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV2Pool({
  ID: 10,
  poolId: 3,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.ATUST[ChainId.AURORA]],
  lpAddress: '0xa9eded3E339b9cd92bB6DEF5c5379d678131fF90',
  rewarderAddress: '0x17d1597ec86fD6aecbfE0F32Ab2F2aD9c37E6750',
  allocPoint: 1
})
