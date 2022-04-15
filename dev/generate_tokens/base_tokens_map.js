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
  }
}
