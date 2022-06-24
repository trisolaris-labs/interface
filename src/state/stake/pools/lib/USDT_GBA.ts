import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV2Pool({
  ID: 22,
  poolId: 15,
  tokens: [TOKENS.USDT[ChainId.AURORA], TOKENS.GBA[ChainId.AURORA]],
  lpAddress: '0x7B273238C6DD0453C160f305df35c350a123E505',
  rewarderAddress: '0xDAc58A615E2A1a94D7fb726a96C273c057997D50',
  allocPoint: 1
})
