import React from 'react'
import { Token } from '@trisolaris/sdk'
import styled from 'styled-components'

import { StyledMenuButton } from '../../components/StyledMenu'

import { useActiveWeb3React } from '../../hooks'

import { registerToken } from '../../utils/wallet'

import MetamaskIcon from '../../assets/images/metamask.png'

const StyledMetamaskButton = styled(StyledMenuButton)`
  width: 35px;
  margin-right: 10px;
`

function AddToMetamaskButton({ token }: { token: Token }) {
  const { library } = useActiveWeb3React()

  const { symbol, address, decimals } = token
  return library?.provider?.isMetaMask ? (
    <StyledMetamaskButton onClick={() => registerToken(address, symbol!, decimals)}>
      <img src={MetamaskIcon} alt={'Metamask logo'} style={{ width: '100%' }} />
    </StyledMetamaskButton>
  ) : null
}

export default AddToMetamaskButton
