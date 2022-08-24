import React from 'react'
import { Token, ChainId } from '@trisolaris/sdk'

import { SPONSORED_TOKENS, FARMS_CUSTOM_HEADING } from './SponsoredFarmLink.constants'

import { StyledExternalLink } from './SponsoredFarmLink.styles'

const SponsoredFarmLink = ({ tokens, farmID }: { tokens: Token[]; farmID: number }) => {
  const foundToken = SPONSORED_TOKENS.find(sponsoredToken =>
    tokens.some(cardToken => sponsoredToken.token[ChainId.AURORA] === cardToken)
  )
  const customSponsoredFarm = FARMS_CUSTOM_HEADING[farmID]

  return customSponsoredFarm ? (
    <StyledExternalLink href={customSponsoredFarm.customLink}>{customSponsoredFarm.customText} ↗</StyledExternalLink>
  ) : foundToken ? (
    <StyledExternalLink href={foundToken.link}>Get {foundToken.token[ChainId.AURORA].symbol} ↗</StyledExternalLink>
  ) : null
}

export default SponsoredFarmLink
