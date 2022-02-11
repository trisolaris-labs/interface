import { ChainId, Token } from '@trisolaris/sdk'

export const stNEAR: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'stNEAR',
    'Staked NEAR'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'stNEAR', 'Staked NEAR'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'stNEAR',
    'Staked NEAR'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x07F9F7f963C5cD2BBFFd30CcfB964Be114332E30', 18, 'stNEAR', 'Staked NEAR')
}
