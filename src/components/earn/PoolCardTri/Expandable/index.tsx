import React from 'react'
import styled from 'styled-components'
import { Text } from 'rebass'
import { Settings2 as ManageIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { Currency, ChainId } from '@trisolaris/sdk'

import { ButtonGold } from '../../../Button'
import { AutoColumn } from '../../../Column'
import CountUp from '../../../CountUp'
import { RowBetween } from '../../../Row'
import { TYPE } from '../../../../theme'
import CurrencyLogo from '../../../CurrencyLogo'
import { FixedHeightRow } from '../../../PositionCard/PositionCard.styles'
import { Button, StyledMutedSubHeader } from '../PoolCardTri.styles'

import { currencyId } from '../../../../utils/currencyId'

import { StakingTri } from '../../../../state/stake/stake-constants'
import { PoolCardTriProps } from '../'
import { BIG_INT_ZERO } from '../../../../constants'
import { TRI } from '../../../../constants/tokens'

export const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
`
export const ExpandableStakedContainer = styled(FixedHeightRow)`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display:flex;
  `};
`

export const ActionsContainer = styled.div`
  display: flex;
  min-width: 110px;
  justify-content: center;
  height: 34px;
`

export const RewardRow = styled(RowBetween)`
  font-size: 14px;
`

const RewardsContainer = styled(AutoColumn)`
  flex: 1;
  max-width: 200px;
`

const StyledCurrencyLogo = styled(CurrencyLogo)`
  margin-right: 5px;
`

function Expandable({
  totalStakedInUSDFriendly,
  isStaking,
  isPeriodFinished,
  currencies,
  stableSwapPoolName,
  version,
  isLegacy,
  enableClaimButton,
  stakingInfo
}: {
  totalStakedInUSDFriendly: string
  enableClaimButton?: boolean
  currencies: Currency[]
  stakingInfo?: StakingTri
} & Pick<PoolCardTriProps, 'isStaking' | 'isPeriodFinished' | 'stableSwapPoolName' | 'version' | 'isLegacy'>) {
  const history = useHistory()
  const { t } = useTranslation()

  const { chefVersion, earnedNonTriRewards, noTriRewards, poolId, earnedAmount } = stakingInfo ?? {}

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
          <ButtonGold padding="8px" borderRadius="8px" maxWidth="65px">
            Claim
          </ButtonGold>
        )}
        {renderManageOrDepositButton()}
      </ActionsContainer>
    )
  }

  return (
    <div>
      <TopContainer>
        <RewardsContainer>
          <StyledMutedSubHeader>Unclaimed rewards</StyledMutedSubHeader>
          <RowBetween>
            <AutoColumn>
              {!noTriRewards && (
                <RewardRow>
                  <StyledCurrencyLogo currency={TRI[ChainId.AURORA]} size="14px" />
                  <CountUp
                    enabled={earnedAmount?.greaterThan(BIG_INT_ZERO) ?? false}
                    value={parseFloat(earnedAmount?.toFixed(6) ?? '0')}
                  />
                </RewardRow>
              )}
              {earnedNonTriRewards?.map(({ amount, token }) => (
                <RewardRow key={token.address}>
                  <StyledCurrencyLogo currency={token} size="14px" />
                  <CountUp
                    enabled={amount?.greaterThan(BIG_INT_ZERO) ?? false}
                    value={parseFloat(amount?.toFixed(6) ?? '0')}
                  />
                </RewardRow>
              ))}
            </AutoColumn>
            <ButtonGold padding="8px" borderRadius="8px" maxWidth="55px" height="85%">
              Claim
            </ButtonGold>
          </RowBetween>
        </RewardsContainer>
      </TopContainer>
      <ExpandableStakedContainer>
        <Text>{t('earn.totalStaked')}</Text>
        <TYPE.white fontWeight={500}>{`$${totalStakedInUSDFriendly}`}</TYPE.white>
      </ExpandableStakedContainer>
    </div>
  )
}

export default Expandable
