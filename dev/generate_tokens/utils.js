/* eslint-disable @typescript-eslint/no-var-requires */
const { ChainId, Token } = require('@trisolaris/sdk')
const _ = require('lodash')

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

function createDummyToken({ chainID, ...props }) {
  return new Token(
    chainID,
    props?.address ?? ZERO_ADDRESS,
    props?.decimals ?? 18,
    props?.symbol ?? 'ZERO',
    props?.name ?? 'ZERO'
  )
}

function createXChainToken(props = {}) {
  // get shared properties from the first populated item
  const tokenProps =
    _.chain(props)
      .values()
      .head()
      .pick(['decimals', 'name', 'symbol'])
      .value() ?? {}

  return _.defaultsDeep(props, {
    [ChainId.FUJI]: createDummyToken({ chainID: ChainId.FUJI, ...tokenProps }),
    [ChainId.AVALANCHE]: createDummyToken({ chainID: ChainId.AVALANCHE, ...tokenProps }),
    [ChainId.POLYGON]: createDummyToken({ chainID: ChainId.POLYGON, ...tokenProps }),
    [ChainId.AURORA]: createDummyToken({ chainID: ChainId.AURORA, ...tokenProps })
  })
}

module.exports = {
  createDummyToken,
  createXChainToken,
  ZERO_ADDRESS
}
