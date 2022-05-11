import React, { useState } from 'react'
import { Token } from '@trisolaris/sdk'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { Settings2 as ManageIcon } from 'lucide-react'

import { TYPE } from '../../../theme'
import { AutoColumn } from '../../Column'
import { ButtonGold } from '../../Button'
import { AutoRow, RowBetween } from '../../Row'
import ClaimRewardModal from '../ClaimRewardModalTri'
import PoolCardWrapper from './PoolCardWrapper'
import PoolCardTokens from './PoolCardTokens'

import { ChefVersions } from '../../../state/stake/stake-constants'
import { useSingleFarm } from '../../../state/stake/user-farms'
import { currencyId } from '../../../utils/currencyId'
import { addCommasToNumber } from '../../../utils'
import { getPairRenderOrder, isTokenAmountPositive } from '../../../utils/pools'

import { StyledActionsContainer, Button } from './PoolCardTri.styles'

import { StableSwapPoolName } from '../../../state/stableswap/constants'
import { useSingleStableFarm } from '../../../state/stake/user-stable-farms'

type PoolCardTriProps = {
  apr: number
  apr2: number
  doubleRewards: boolean
  chefVersion: ChefVersions
  inStaging: boolean
  noTriRewards: boolean
  isLegacy?: boolean
  isPeriodFinished: boolean
  tokens: Token[]
  totalStakedInUSD: number
  doubleRewardToken: Token
  isStaking: boolean
  version: number
  stableSwapPoolName?: StableSwapPoolName
}

const DefaultPoolCardtri = ({
  apr,
  apr2,
  chefVersion,
  doubleRewards,
  inStaging,
  noTriRewards,
  isLegacy,
  isPeriodFinished,
  tokens: _tokens,
  totalStakedInUSD,
  doubleRewardToken,
  isStaking,
  version,
  enableClaimButton = false,
  enableModal = () => null,
  stableSwapPoolName
}: { enableClaimButton?: boolean; enableModal?: () => void } & PoolCardTriProps) => {
  const history = useHistory()
  const { t } = useTranslation()

  const isDualRewards = chefVersion === ChefVersions.V2

  const { currencies, tokens } = getPairRenderOrder(_tokens)

  const totalStakedInUSDFriendly = addCommasToNumber(totalStakedInUSD.toString())

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

  const currenciesQty = currencies.length

  return (
    <PoolCardWrapper tokens={tokens} doubleRewards={doubleRewards} currenciesQty={currenciesQty}>
      <AutoRow justifyContent="space-between">
        <PoolCardTokens tokens={tokens} />
        {isLegacy && !isStaking ? (
          <Button disabled={true} isStaking={isStaking}>
            {t('earn.deposit')}
          </Button>
        ) : (
          <StyledActionsContainer>
            {enableClaimButton && (
              <ButtonGold padding="8px" borderRadius="8px" maxWidth="65px" onClick={enableModal}>
                Claim
              </ButtonGold>
            )}
            {renderManageOrDepositButton()}
          </StyledActionsContainer>
        )}
      </AutoRow>
      <RowBetween>
        <AutoColumn>
          <TYPE.mutedSubHeader>{t('earn.totalStaked')}</TYPE.mutedSubHeader>
          <TYPE.white>{`$${totalStakedInUSDFriendly}`}</TYPE.white>
        </AutoColumn>
        <AutoColumn>
          <TYPE.mutedSubHeader textAlign="end">APR</TYPE.mutedSubHeader>
          <TYPE.white textAlign="end">
            {isDualRewards && doubleRewards && !inStaging
              ? `${apr}% TRI + ${`${apr2}%`} ${`${doubleRewardToken.symbol}`}`
              : inStaging
              ? `Coming Soon`
              : noTriRewards
              ? `${`${apr2}%`} ${`${doubleRewardToken.symbol}`}`
              : `${apr}%`}
          </TYPE.white>
        </AutoColumn>
      </RowBetween>
    </PoolCardWrapper>
  )
}

type StablePoolCardTriProps = PoolCardTriProps & { stableSwapPoolName: StableSwapPoolName }

const StableStakingPoolCardTRI = (props: StablePoolCardTriProps) => {
  const { version } = props

  const stakingInfo = useSingleStableFarm(Number(version), props.stableSwapPoolName)
  const { earnedAmount, doubleRewardAmount } = stakingInfo

  const amountIsClaimable = isTokenAmountPositive(earnedAmount) || isTokenAmountPositive(doubleRewardAmount)
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
  const { earnedAmount, doubleRewardAmount } = stakingInfo

  const amountIsClaimable = isTokenAmountPositive(earnedAmount) || isTokenAmountPositive(doubleRewardAmount)
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
