import { ChainId, Token } from '@trisolaris/sdk'
import { USDC, USDT } from '../../constants'

const AURORA_STABLESWAP_TOKENS: Token[] = [USDC, USDT].map(token => token[ChainId.AURORA])

export const STABLESWAP_TOKENS: {
  [chainid in ChainId]: Token[]
} = {
  [ChainId.FUJI]: [],
  [ChainId.AVALANCHE]: [],
  [ChainId.POLYGON]: [],
  [ChainId.AURORA]: AURORA_STABLESWAP_TOKENS
}
