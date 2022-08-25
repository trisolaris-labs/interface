import React from 'react'
import { Text } from 'rebass'
import { ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Currency } from '@trisolaris/sdk'

import { TYPE } from '../../../../theme'

import { StakingTri } from '../../../../state/stake/stake-constants'
import { PoolCardTriProps } from '../'

import { currencyId } from '../../../../utils/currencyId'

import { TopContainer, OtherDataAndLinksContainer, StyledLink, ExpandableStakedContainer } from './Expandable.styles'

function Expandable({
  totalStakedInUSDFriendly,
  currencies,
  stableSwapPoolName,
  farmName
}: {
  totalStakedInUSDFriendly: string
  enableClaimButton?: boolean
  currencies: Currency[]
  stakingInfo?: StakingTri
  farmName: string
} & Pick<PoolCardTriProps, 'isStaking' | 'isPeriodFinished' | 'stableSwapPoolName' | 'version' | 'isLegacy'>) {
  const { t } = useTranslation()

  const lpLink = stableSwapPoolName
    ? `/pool/stable/add/${stableSwapPoolName}`
    : `/add/${currencyId(currencies[0])}/${currencyId(currencies[1])}`

  return (
    <div>
      <TopContainer>
        <OtherDataAndLinksContainer>
          <StyledLink onClick={event => event.stopPropagation()} to={lpLink} target="_blank" rel="noopener noreferrer">
            Get {farmName} TLP
            <ArrowUpRight size={14} />
          </StyledLink>
        </OtherDataAndLinksContainer>
      </TopContainer>
      <ExpandableStakedContainer>
        <Text>{t('earn.totalStaked')}</Text>
        <TYPE.white fontWeight={500}>{`$${totalStakedInUSDFriendly}`}</TYPE.white>
      </ExpandableStakedContainer>
    </div>
  )
}

export default Expandable
