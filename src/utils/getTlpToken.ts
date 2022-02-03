import { ChainId, Token } from '@trisolaris/sdk'

export default function getTlpToken(lpAddress: string, token0: Token, token1: Token) {
  return new Token(ChainId.AURORA, lpAddress, 18, 'TLP', `TLP ${token0?.symbol}-${token1?.symbol}`)
}
