import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default POOL_UTILS.createMCV2Pool({
  ID: 17,
  poolId: 10,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.SOLACE[ChainId.AURORA]],
  lpAddress: '0xdDAdf88b007B95fEb42DDbd110034C9a8e9746F2',
  rewarderAddress: '0xbbE41F699B0fB747cd4bA21067F6b27e0698Bc30',
  allocPoint: 1
})
