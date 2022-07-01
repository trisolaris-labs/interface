import React from 'react'
import { Token } from '@trisolaris/sdk'
import styled from 'styled-components'

import { StyledMenuButton } from '../../components/StyledMenu'
import { MouseoverTooltip } from '../Tooltip'

import { useActiveWeb3React } from '../../hooks'

import { registerToken } from '../../utils/wallet'

import MetamaskIcon from '../../assets/images/metamask.png'

const StyledMetamaskButton = styled(StyledMenuButton)`
  width: 35px;
`
const StyledMetamaskImg = styled.img`
 display:flex;
  width: 20px;
  :hover {
    cursor: pointer;
  }
`

function AddToMetamaskButton({ token, noBackground, ...otherProps }: { token: Token; noBackground?: boolean }) {
  const { library } = useActiveWeb3React()

  if (!token) {
    return null
  }

  const { symbol, address, decimals } = token

  return library?.provider?.isMetaMask ? (
    <MouseoverTooltip text={`Add ${symbol} to Metamask`}>
      {noBackground ? (
        <StyledMetamaskImg
          src={MetamaskIcon}
          alt={'Metamask logo'}
          onClick={() => registerToken(address, symbol!, decimals)}
          {...otherProps}
        />
      ) : (
        <StyledMetamaskButton onClick={() => registerToken(address, symbol!, decimals)} {...otherProps}>
          <img src={MetamaskIcon} alt={'Metamask logo'} style={{ width: '100%' }} />
        </StyledMetamaskButton>
      )}
    </MouseoverTooltip>
  ) : null
}

export default AddToMetamaskButton
