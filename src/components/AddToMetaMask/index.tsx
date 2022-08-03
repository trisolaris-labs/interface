import React from 'react'
import { Token } from '@trisolaris/sdk'

import { LinkStyledButton } from '../../theme'

import { useActiveWeb3React } from '../../hooks'

import { registerToken } from '../../utils/wallet'

function AddToMetaMaskButton({ token, ...otherProps }: { token: Token }) {
  const { library } = useActiveWeb3React()

  if (!token || token?.symbol == null || library?.provider?.isMetaMask == null) {
    return null
  }

  const { symbol, address, decimals } = token

  function addToken() {
    registerToken(address, symbol, decimals)
  }

  return (
    <LinkStyledButton onClick={addToken} {...otherProps}>
      Add {symbol} to MetaMask
    </LinkStyledButton>
  )
}

export default AddToMetaMaskButton
