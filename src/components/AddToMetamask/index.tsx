import React from 'react'
import { Token } from '@trisolaris/sdk'
import styled from 'styled-components'

import { StyledMenuButton } from '../StyledMenu'
import { MouseoverTooltip } from '../Tooltip'
import { LinkStyledButton } from '../../theme'

import { useActiveWeb3React } from '../../hooks'

import { registerToken } from '../../utils/wallet'

import MetaMaskIcon from '../../assets/images/metamask.png'

const StyledMetaMaskImg = styled.img`
  display: flex;
  width: 20px;
  :hover {
    cursor: pointer;
  }
`

function AddToMetaMaskButton({ token, textOnly, ...otherProps }: { token: Token; textOnly?: boolean }) {
  const { library } = useActiveWeb3React()

  if (!token) {
    return null
  }

  const { symbol, address, decimals } = token

  function addToken() {
    registerToken(address, symbol!, decimals)
  }

  return library?.provider?.isMetaMask ? (
    textOnly ? (
      <LinkStyledButton onClick={addToken}>Add {symbol} to MetaMask</LinkStyledButton>
    ) : (
      <MouseoverTooltip text={`Add ${symbol} to Metamask`}>
        <StyledMetaMaskImg src={MetaMaskIcon} alt={'MetaMask logo'} onClick={addToken} {...otherProps} />
      </MouseoverTooltip>
    )
  ) : null
}

export default AddToMetaMaskButton
