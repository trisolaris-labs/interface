import React, { useState } from 'react'
import { Token } from '@trisolaris/sdk'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { Settings2 as ManageIcon, ChevronDown, ChevronUp } from 'lucide-react'
import { isMobileOnly } from 'react-device-detect'
import { Text } from 'rebass'

import { TYPE } from '../../../theme'
import { ButtonGold } from '../../Button'
import ClaimRewardModal from './ClaimRewardModalTri'
import MultipleCurrencyLogo from '../../MultipleCurrencyLogo'

import { ChefVersions, NonTriAPR } from '../../../state/stake/stake-constants'
import { useSingleFarm } from '../../../state/stake/user-farms'
import { useColorForToken } from '../../../hooks/useColor'
import { currencyId } from '../../../utils/currencyId'
import { addCommasToNumber } from '../../../utils'
import { getPairRenderOrder, isTokenAmountPositive } from '../../../utils/pools'

import {
  ResponsiveCurrencyLabel,
  TokenPairBackgroundColor,
  Button,
  Wrapper,
  ActionsContainer,
  StyledPairContainer,
  StakedContainer,
  AprContainer,
  CardContainer,
  DetailsContainer,
  StyledMutedSubHeader,
  ExpandableStakedContainer,
  ExpandableActionsContainer,
  RowActionsContainer
} from './PoolCardTri.styles'
import SponsoredFarmLink from '../../SponsoredFarmLink'
import { StableSwapPoolName } from '../../../state/stableswap/constants'
import { useSingleStableFarm } from '../../../state/stake/user-stable-farms'
import PoolCardTriRewardText from './PoolCardTriRewardText'

export type PoolCardTriProps = {
  apr: number
  hasNonTriRewards: boolean
  chefVersion: ChefVersions
  inStaging: boolean
  noTriRewards: boolean
  isLegacy?: boolean
  isPeriodFinished: boolean
  tokens: Token[]
  totalStakedInUSD: number
  isStaking: boolean
  version: number
  stableSwapPoolName: StableSwapPoolName | null
  nonTriAPRs: NonTriAPR[]
  friendlyFarmName: string | null
  isFeatured?: boolean
}

const DefaultPoolCardtri = ({
  apr,
  chefVersion,
  inStaging,
  isLegacy,
  isPeriodFinished,
  tokens: _tokens,
  totalStakedInUSD,
  isStaking,
  version,
  enableClaimButton = false,
  enableModal = () => null,
  stableSwapPoolName,
  nonTriAPRs,
  hasNonTriRewards,
  friendlyFarmName,
  isFeatured = false
}: { enableClaimButton?: boolean; enableModal?: () => void } & PoolCardTriProps) => {
  const history = useHistory()
  const { t } = useTranslation()

  const [showMore, setShowMore] = useState(isMobileOnly && isStaking ? true : false)

  const isDualRewards = chefVersion === ChefVersions.V2

  const { currencies, tokens } = getPairRenderOrder(_tokens)

  const backgroundColor1 = useColorForToken(tokens[0])

  const backgroundColor2 = useColorForToken(tokens[tokens.length - 1], () => isDualRewards)

  const totalStakedInUSDFriendly = addCommasToNumber(totalStakedInUSD.toString())

  function onCardClick() {
    setShowMore(!showMore)
  }

  function renderManageOrDepositButton() {
    const sharedProps = {
      marginLeft: '0.5rem',
      onClick: () => {
        history.push(
          stableSwapPoolName
            ? `/tri/${stableSwapPoolName}/${version}`
            : `/tri/${currencyId(currencies[0])}/${currencyId(currencies[1])}/${version}`
        )
      }
    }

    return isStaking ? (
      <Button isStaking={true} {...sharedProps}>
        <ManageIcon size={20} />
      </Button>
    ) : (
      <Button disabled={isPeriodFinished} isStaking={false} {...sharedProps}>
        {t('earn.deposit')}
      </Button>
    )
  }

  function renderActionsContainer() {
    return isLegacy && !isStaking ? (
      <Button disabled={true} isStaking={isStaking}>
        {t('earn.deposit')}
      </Button>
    ) : (
      <ActionsContainer>
        {enableClaimButton && (
          <ButtonGold padding="8px" borderRadius="8px" maxWidth="65px" onClick={enableModal}>
            Claim
          </ButtonGold>
        )}
        {renderManageOrDepositButton()}
      </ActionsContainer>
    )
  }

  const currenciesQty = currencies.length

  return (
    <Wrapper
      bgColor1={backgroundColor1}
      bgColor2={backgroundColor2}
      isFeatured={isFeatured}
      currenciesQty={currenciesQty}
      onClick={onCardClick}
    >
      <TokenPairBackgroundColor bgColor1={backgroundColor1} bgColor2={backgroundColor2} />
      <CardContainer>
        <StyledPairContainer>
          <SponsoredFarmLink tokens={tokens} farmID={version} />
          <MultipleCurrencyLogo currencies={currencies} size={20} />
          <ResponsiveCurrencyLabel currenciesQty={currenciesQty}>
            {friendlyFarmName ?? currencies.map(({ symbol }) => symbol).join('-')}
          </ResponsiveCurrencyLabel>
        </StyledPairContainer>
        <StakedContainer>
          <StyledMutedSubHeader>{t('earn.totalStaked')}</StyledMutedSubHeader>
          <TYPE.white>{`$${totalStakedInUSDFriendly}`}</TYPE.white>
        </StakedContainer>
        <AprContainer>
          <StyledMutedSubHeader justifyContent="flex-start">APR</StyledMutedSubHeader>
          <PoolCardTriRewardText apr={apr} inStaging={inStaging} nonTriAPRs={nonTriAPRs} isLegacy={isLegacy} />
        </AprContainer>
        <RowActionsContainer>{renderActionsContainer()}</RowActionsContainer>
        <DetailsContainer>
          {showMore ? (
            <>
              <ChevronUp size="15" />
            </>
          ) : (
            <>
              <ChevronDown size="15" />
            </>
          )}
        </DetailsContainer>
      </CardContainer>

      {showMore && (
        <div>
          <ExpandableStakedContainer>
            <Text>{t('earn.totalStaked')}</Text>
            <TYPE.white fontWeight={500}>{`$${totalStakedInUSDFriendly}`}</TYPE.white>
          </ExpandableStakedContainer>
          <ExpandableActionsContainer>
            <Text>Manage this Farm</Text>
            {renderActionsContainer()}
          </ExpandableActionsContainer>
        </div>
      )}
    </Wrapper>
  )
}

type StablePoolCardTriProps = PoolCardTriProps & { stableSwapPoolName: StableSwapPoolName }

const StableStakingPoolCardTRI = (props: StablePoolCardTriProps) => {
  const { version } = props

  const stakingInfo = useSingleStableFarm(Number(version), props.stableSwapPoolName)
  const { earnedAmount, earnedNonTriRewards } = stakingInfo

  const amountIsClaimable =
    isTokenAmountPositive(earnedAmount) || earnedNonTriRewards.some(({ amount }) => isTokenAmountPositive(amount))
  const [showClaimRewardModal, setShowClaimRewardModal] = useState(false)

  const enableModal = () => setShowClaimRewardModal(true)
  return (
    <>
      {showClaimRewardModal && stakingInfo && (
        <ClaimRewardModal
          isOpen={showClaimRewardModal}
          onDismiss={() => setShowClaimRewardModal(false)}
          stakingInfo={stakingInfo}
        />
      )}
      <DefaultPoolCardtri {...props} enableClaimButton={amountIsClaimable} enableModal={enableModal} />
    </>
  )
}

const StakingPoolCardTRI = (props: PoolCardTriProps) => {
  const { version } = props

  const stakingInfo = useSingleFarm(Number(version))
  const { earnedAmount, earnedNonTriRewards } = stakingInfo

  const amountIsClaimable =
    isTokenAmountPositive(earnedAmount) || earnedNonTriRewards.some(({ amount }) => isTokenAmountPositive(amount))
  const [showClaimRewardModal, setShowClaimRewardModal] = useState(false)

  const enableModal = () => setShowClaimRewardModal(true)
  return (
    <>
      {showClaimRewardModal && stakingInfo && (
        <ClaimRewardModal
          isOpen={showClaimRewardModal}
          onDismiss={() => setShowClaimRewardModal(false)}
          stakingInfo={stakingInfo}
        />
      )}
      <DefaultPoolCardtri {...props} enableClaimButton={amountIsClaimable} enableModal={enableModal} />
    </>
  )
}

const PoolCardTRI = (props: PoolCardTriProps) => {
  const { isStaking, stableSwapPoolName } = props

  if (!isStaking) {
    return <DefaultPoolCardtri {...props} />
  }

  return stableSwapPoolName == null ? (
    <StakingPoolCardTRI {...props} />
  ) : (
    <StableStakingPoolCardTRI {...props} stableSwapPoolName={stableSwapPoolName} />
  )
}

export default PoolCardTRI
