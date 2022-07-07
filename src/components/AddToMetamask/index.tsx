import React from 'react'
import { Token } from '@trisolaris/sdk'
import styled from 'styled-components'

import { StyledMenuButton } from '../../components/StyledMenu'
import { MouseoverTooltip } from '../Tooltip'

import { useActiveWeb3React } from '../../hooks'
import { useAddPopup } from '../../state/application/hooks'

import { registerToken } from '../../utils/wallet'

import MetamaskIcon from '../../assets/images/metamask.png'
import { ICON_TYPES } from '../Popups/CustomPopup'

const StyledMetamaskButton = styled(StyledMenuButton)`
  width: 35px;
`
const StyledMetamaskImg = styled.img`
  display: flex;
  width: 20px;
  :hover {
    cursor: pointer;
  }
`

function AddToMetamaskButton({ token, noBackground, ...otherProps }: { token: Token; noBackground?: boolean }) {
  const { library } = useActiveWeb3React()
  const addPopup = useAddPopup()

  if (!token) {
    return null
  }

  const { symbol, address, decimals } = token

  async function addToken() {
    try {
      await registerToken(address, symbol!, decimals)
    } catch (e) {
      addPopup({
        customContent: {
          text: 'User Rejected adding the token to MetaMask.',
          icon: ICON_TYPES.ALERT
        }
      })
    }
  }

  return library?.provider?.isMetaMask ? (
    <MouseoverTooltip text={`Add ${symbol} to Metamask`}>
      {noBackground ? (
        <StyledMetamaskImg src={MetamaskIcon} alt={'Metamask logo'} onClick={addToken} {...otherProps} />
      ) : (
        <StyledMetamaskButton onClick={() => registerToken(address, symbol!, decimals)} {...otherProps}>
          <img src={MetamaskIcon} alt={'Metamask logo'} style={{ width: '100%' }} />
        </StyledMetamaskButton>
      )}
    </MouseoverTooltip>
  ) : null
}

export default AddToMetamaskButton
