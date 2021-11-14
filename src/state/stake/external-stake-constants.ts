import { ChainId, Token, TokenAmount, WETH, JSBI } from '@trisolaris/sdk'
import { USDC, AAVE, DAI, ZERO_ADDRESS, WNEAR, USDT } from '../../constants'

interface ServiceInit {
  status: 'init'
}
interface ServiceLoading {
  status: 'loading'
}
interface ServiceLoaded<T> {
  status: 'loaded'
  payload: T
}
interface ServiceError {
  status: 'error'
  error: Error
}
export type Service<T> = ServiceInit | ServiceLoading | ServiceLoaded<T> | ServiceError

export interface ExternalStakeConstant {
  id: number
  lpAddress: string
  totalSupply: number
  totalStaked: number
  totalStakedInUSD: number
  totalRewardRate: number
  allocPoint: number
  apr: number
  token0: Token
  token1: Token
}

export const STAKING_TOKEN_LIST: { [key: string]: Array<Token> } = {
  '0x20F8AeFB5697B77E0BB835A8518BE70775cdA1b0': [WNEAR[ChainId.AURORA], USDC[ChainId.AURORA]],
  '0x2F41AF687164062f118297cA10751F4b55478ae1': [WETH[ChainId.AURORA], USDC[ChainId.AURORA]],
  '0x63da4DB6Ef4e7C62168aB03982399F9588fCd198': [WETH[ChainId.AURORA], WNEAR[ChainId.AURORA]]
}
