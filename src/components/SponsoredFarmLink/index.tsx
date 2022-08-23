import React from 'react'
import { Token, ChainId } from '@trisolaris/sdk'

import { getTokenList, FARMS_CUSTOM_HEADING } from './SponsoredFarmLink.constants'

import { StyledExternalLink } from './SponsoredFarmLink.styles'

const SponsoredFarmLink = ({ tokens, farmID }: { tokens: Token[]; farmID: number }) => {
  const foundToken = getTokenList.find(tokenListToken =>
    tokens.some(cardToken => tokenListToken.token[ChainId.AURORA] === cardToken)
  )
  const customSponsoredFarm = FARMS_CUSTOM_HEADING[farmID]

  return customSponsoredFarm ? (
    <StyledExternalLink href={customSponsoredFarm.customLink}>{customSponsoredFarm.customText} ↗</StyledExternalLink>
  ) : foundToken ? (
    <StyledExternalLink href={foundToken.link}>Get {foundToken.token[ChainId.AURORA].symbol} ↗</StyledExternalLink>
  ) : null
}

export default SponsoredFarmLink
