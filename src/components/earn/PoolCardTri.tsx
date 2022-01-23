import React, { useState } from 'react'
import { Token, TokenAmount, JSBI } from '@trisolaris/sdk'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { TYPE } from '../../theme'
import { AutoColumn } from '../Column'
import DoubleCurrencyLogo from '../DoubleLogo'
import { ButtonGold } from '../Button'
import { AutoRow, RowBetween } from '../Row'
import ClaimRewardModal from '../../components/earn/ClaimRewardModalTri'
import { ReactComponent as Withdraw } from '../../assets/svg/withdraw.svg'

import { ChefVersions } from '../../state/stake/stake-constants'
import { useSingleFarm } from '../../state/stake/user-farms'
import { useColorForToken } from '../../hooks/useColor'
import { currencyId } from '../../utils/currencyId'
import { addCommasToNumber } from '../../utils'
import { getPairRenderOrder, isTokenAmountPositive } from '../../utils/pools'

import {
  Wrapper,
  PairContainer,
  ResponsiveCurrencyLabel,
  TokenPairBackgroundColor,
  StyledActionsContainer,
  Button
} from './PoolCardTri.styles'

type Props = {
  apr: number
  apr2: number
  doubleRewards: boolean
  chefVersion: ChefVersions
  inStaging: boolean
  isLegacy?: boolean
  isPeriodFinished: boolean
  stakedAmount: TokenAmount | null
  token0: Token
  token1: Token
  totalStakedInUSD: number
  version: number
  doubleRewardToken: Token
  isStaking: boolean
}

const ZERO = JSBI.BigInt(0)

export default function PoolCardTRI({
  apr,
  apr2,
  chefVersion,
  doubleRewards,
  inStaging,
  isLegacy,
  isPeriodFinished,
  stakedAmount,
  token0: _token0,
  token1: _token1,
  totalStakedInUSD,
  version,
  doubleRewardToken,
  isStaking
}: Props) {
  const isDualRewards = chefVersion == 1

  const stakingInfo = useSingleFarm(Number(version))
console.log(stakingInfo)
  const { earnedAmount } = stakingInfo

  const { currency0, currency1, token0, token1 } = getPairRenderOrder(_token0, _token1)

  const { t } = useTranslation()
  // get the color of the token
  const backgroundColor1 = useColorForToken(token0)

  // Only override `backgroundColor2` if it's a dual rewards pool
  const backgroundColor2 = useColorForToken(token1, () => isDualRewards)

  const history = useHistory()

  const totalStakedInUSDFriendly = addCommasToNumber(totalStakedInUSD.toString())

  const [showClaimRewardModal, setShowClaimRewardModal] = useState(false)


  return (
    <Wrapper bgColor1={backgroundColor1} bgColor2={backgroundColor2} isDoubleRewards={doubleRewards}>
      {showClaimRewardModal && stakingInfo && (
        <ClaimRewardModal
          isOpen={showClaimRewardModal}
          onDismiss={() => setShowClaimRewardModal(false)}
          stakingInfo={stakingInfo}
        />
      )}

      <TokenPairBackgroundColor bgColor1={backgroundColor1} bgColor2={backgroundColor2} />
      <AutoRow justifyContent="space-between">
        <PairContainer>
          <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={20} />
          <ResponsiveCurrencyLabel>
            {currency0.symbol}-{currency1.symbol}
          </ResponsiveCurrencyLabel>
        </PairContainer>
        {isLegacy && !isStaking ? (
          <Button disabled={true} isStaking={isStaking}>
            {t('earn.deposit')}
          </Button>
        ) : (
          <StyledActionsContainer>
            {(!earnedAmount == null || !earnedAmount?.equalTo(ZERO)) && (
              <ButtonGold padding="8px" borderRadius="8px" onClick={() => setShowClaimRewardModal(true)} width="32px">
                <Withdraw style={{ height: 30, width: 30 }} />
              </ButtonGold>
            )}

            <Button
              disabled={(isStaking || !isPeriodFinished) === false}
              isStaking={isStaking}
              onClick={() => {
                history.push(`/tri/${currencyId(currency0)}/${currencyId(currency1)}/${version}`)
              }}
              marginLeft="0.5rem"
            >
              {isStaking ? t('earn.manage') : t('earn.deposit')}
            </Button>
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
              : `${apr}%`}
          </TYPE.white>
        </AutoColumn>
      </RowBetween>
    </Wrapper>
  )
}
