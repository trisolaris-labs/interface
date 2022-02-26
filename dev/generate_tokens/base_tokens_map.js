/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * This file is used to override the token data imported from the Tokens repo (https://github.com/trisolaris-labs/tokens)
 *
 * The items in the exported object take precedence over the tokens imported from the Tokens repo.
 */

const { ChainId, Token } = require('@trisolaris/sdk')

const { ZERO_ADDRESS } = require('./utils')

module.exports = {
  PNG: {
    [ChainId.FUJI]: new Token(ChainId.FUJI, '0x83080D4b5fC60e22dFFA8d14AD3BB41Dde48F199', 18, 'PNG', 'Pangolin'),
    [ChainId.AVALANCHE]: new Token(
      ChainId.AVALANCHE,
      '0x60781C2586D68229fde47564546784ab3fACA982',
      18,
      'PNG',
      'Pangolin'
    ),
    [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x831753dd7087cac61ab5644b308642cc1c33dc13', 18, 'QUICK', 'Quick'),
    [ChainId.AURORA]: new Token(ChainId.AURORA, '0x0b20972b45ffb8e5d4d37af4024e1bf0b03f15ae', 18, 'WETH', 'Ethereum')
  },

  USDT: {
    [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 6, 'USDT', 'Tether USD'),
    [ChainId.AVALANCHE]: new Token(
      ChainId.AVALANCHE,
      '0xde3A24028580884448a5397872046a019649b084',
      6,
      'USDT',
      'Tether USD'
    ),
    [ChainId.POLYGON]: new Token(
      ChainId.POLYGON,
      '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
      6,
      'USDT',
      'Tether USD'
    ),
    [ChainId.AURORA]: new Token(ChainId.AURORA, '0x4988a896b1227218e4a686fde5eabdcabd91571f', 6, 'USDT', 'Tether USD')
  },

  WBTC: {
    [ChainId.AVALANCHE]: new Token(
      ChainId.AVALANCHE,
      '0x408D4cD0ADb7ceBd1F1A1C33A0Ba2098E1295bAB',
      8,
      'WBTC',
      'Wrapped Bitcoin'
    ),
    [ChainId.POLYGON]: new Token(
      ChainId.POLYGON,
      '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
      8,
      'WBTC',
      'Wrapped Bitcoin'
    ),
    [ChainId.AURORA]: new Token(
      ChainId.AURORA,
      '0xf4eb217ba2454613b15dbdea6e5f22276410e89e',
      8,
      'WBTC',
      'Wrapped Bitcoin'
    )
  },

  DAI: {
    [ChainId.AVALANCHE]: new Token(
      ChainId.AVALANCHE,
      '0xbA7dEebBFC5fA1100Fb055a87773e1E99Cd3507a',
      18,
      'DAI',
      'Dai Stablecoin'
    ),
    [ChainId.POLYGON]: new Token(
      ChainId.POLYGON,
      '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
      18,
      'DAI',
      'Dai Stablecoin'
    ),
    [ChainId.AURORA]: new Token(
      ChainId.AURORA,
      '0xe3520349f477a5f6eb06107066048508498a291b',
      18,
      'DAI',
      'Dai Stablecoin'
    )
  },

  TRI: {
    [ChainId.AURORA]: new Token(
      ChainId.AURORA,
      '0xFa94348467f64D5A457F75F8bc40495D33c65aBB',
      18,
      'TRI',
      'Trisolaris Token'
    )
  },

  AURORA: {
    [ChainId.AURORA]: new Token(ChainId.AURORA, '0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79', 18, 'AURORA', 'Aurora')
  },

  UST: {
    [ChainId.AURORA]: new Token(
      ChainId.AURORA,
      '0x5ce9F0B6AFb36135b5ddBF11705cEB65E634A9dC',
      18,
      'atUST',
      'Wrapped UST'
    )
  },

  LUNA: {
    [ChainId.AURORA]: new Token(
      ChainId.AURORA,
      '0xC4bdd27c33ec7daa6fcfd8532ddB524Bf4038096',
      18,
      'atLUNA',
      'Wrapped LUNA'
    )
  },

  USDC: {
    [ChainId.AVALANCHE]: new Token(
      ChainId.AVALANCHE,
      '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664',
      6,
      'USDC',
      'USD Coin'
    ),
    [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', 6, 'USDC', 'USD Coin')
  },

  AAVE: {
    [ChainId.AVALANCHE]: new Token(
      ChainId.AVALANCHE,
      '0x63a72806098Bd3D9520cC43356dD78afe5D386D9',
      18,
      'AAVE',
      'AAVE Token'
    ),
    [ChainId.POLYGON]: new Token(
      ChainId.POLYGON,
      '0xd6df932a45c0f255f85145f286ea0b292b21c90b',
      18,
      'AAVE',
      'AAVE Token'
    )
  },

  WNEAR: {
    [ChainId.AURORA]: new Token(
      ChainId.AURORA,
      '0xc42c30ac6cc15fac9bd938618bcaa1a1fae8501d',
      24,
      'wNEAR',
      'WNEAR Token'
    )
  },

  MECHA: {
    [ChainId.AURORA]: new Token(ChainId.AURORA, '0xa33C3B53694419824722C10D99ad7cB16Ea62754', 18, 'MECHA', 'Mecha')
  },

  STNEAR: {
    [ChainId.AURORA]: new Token(
      ChainId.AURORA,
      '0x07f9f7f963c5cd2bbffd30ccfb964be114332e30',
      24,
      'stNEAR',
      'Staked NEAR'
    )
  },

  META: {
    [ChainId.AURORA]: new Token(ChainId.AURORA, '0xc21ff01229e982d7c8b8691163b0a3cb8f357453', 24, 'META', 'Meta Pool')
  },

  GBA: {
    [ChainId.AURORA]: new Token(
      ChainId.AURORA,
      '0xc2ac78FFdDf39e5cD6D83bbD70c1D67517C467eF',
      18,
      'GBA',
      'Golden Banana'
    )
  },

  XNL: {
    [ChainId.AURORA]: new Token(ChainId.AURORA, '0x7cA1C28663b76CFDe424A9494555B94846205585', 18, 'XNL', 'Chronicle')
  }
}
