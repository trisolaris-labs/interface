import React, { useState } from 'react'
import { Token } from '@trisolaris/sdk'
import { Text } from 'rebass'
import { Copy, Check } from 'lucide-react'

import useCopyClipboard from '../../hooks/useCopyClipboard'
import { shortenAddress } from '../../utils'

import { StyledAddressContainer, StyledContractButton, StyledTooltip, StyledText } from './ContractAddress.styles'

const ContractAddress = ({ token, address, ...rest }: { token?: Token; address?: string }) => {
  const addressToShow = address ?? token?.address ?? ''

  const [showTooltip, setShowTooltip] = useState(false)
  const [isCopied, setCopied] = useCopyClipboard(750)

  const handleMouseEnter = () => {
    setShowTooltip(true)
  }

  const handleMouseLeave = () => {
    setShowTooltip(false)
  }

  const handleClick = () => {
    if (!showTooltip) {
      setShowTooltip(true)
    }
    setCopied(addressToShow)
    setTimeout(() => {
      setShowTooltip(false)
    }, 600)
  }

  return (
    <StyledAddressContainer {...rest}>
      <StyledText {...rest}>{shortenAddress(addressToShow)}</StyledText>
      <StyledContractButton
        onMouseEnter={handleMouseEnter}
        onBlur={handleMouseLeave}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <StyledTooltip text={isCopied ? 'Copied!' : 'Copy address to clipboard'} placement="top" show={showTooltip}>
          {isCopied ? <Check size={14} /> : <Copy size={14} />}
        </StyledTooltip>
      </StyledContractButton>
    </StyledAddressContainer>
  )
}

export default ContractAddress
