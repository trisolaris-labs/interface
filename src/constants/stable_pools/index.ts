/**********************************************************************************************
 * THIS FILE IS MANUALLY UPDATED
 **********************************************************************************************/

import { ChainId, Token } from '@trisolaris/sdk'
import { DAI, USDC, USDT } from '../tokens'

export const TriPoolOneThreeThreeSeven: { [chainId in ChainId]: Array<Token> } = {
  [ChainId.POLYGON]: [
    new Token(ChainId.POLYGON, '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', 18, 'DAI', 'Dai Stablecoin')
  ],
  [ChainId.FUJI]: [new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'DAI', 'Dai Stablecoin')],
  [ChainId.AVALANCHE]: [
    new Token(ChainId.AVALANCHE, '0xbA7dEebBFC5fA1100Fb055a87773e1E99Cd3507a', 18, 'DAI', 'Dai Stablecoin')
  ],
  [ChainId.AURORA]: [DAI[ChainId.AURORA], USDC[ChainId.AURORA], USDT[ChainId.AURORA]]
}
