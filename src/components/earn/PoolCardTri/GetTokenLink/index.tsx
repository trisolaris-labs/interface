import React from 'react'
import { Token, ChainId } from '@trisolaris/sdk'

import { getTokenList } from './GetTokenLink.constants'

import { StyledExternalLink } from './GetTokenLink.styles'

const GetTokenLink = ({ tokens }: { tokens: Token[] }) => {
  const foundToken = getTokenList.find(tokenListToken =>
    tokens.some(cardToken => tokenListToken.token[ChainId.AURORA] === cardToken)
  )

  return foundToken ? (
    <StyledExternalLink href={foundToken.link}>Get {foundToken.token[ChainId.AURORA].symbol} ↗</StyledExternalLink>
  ) : null
}

export default GetTokenLink
