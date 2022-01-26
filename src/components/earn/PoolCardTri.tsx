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
import { Settings2 } from 'lucide-react'

import { ChefVersions } from '../../state/stake/stake-constants'
import { useSingleFarm } from '../../state/stake/user-farms'
import { useColorForToken } from '../../hooks/useColor'
import { currencyId } from '../../utils/currencyId'
import { addCommasToNumber } from '../../utils'
import { getPairRenderOrder } from '../../utils/pools'

import { BIG_INT_ZERO } from '../../constants'

import {
  Wrapper,
  PairContainer,
  ResponsiveCurrencyLabel,
  TokenPairBackgroundColor,
  StyledActionsContainer,
  Button
} from './PoolCardTri.styles'

type PoolCardTriProps = {
  apr: number
  apr2: number
  doubleRewards: boolean
  chefVersion: ChefVersions
  inStaging: boolean
  isLegacy?: boolean
  isPeriodFinished: boolean
  token0: Token
  token1: Token
  totalStakedInUSD: number
  doubleRewardToken: Token
  isStaking: boolean
  version: number
}

const DefaultPoolCardtri = ({
  apr,
  apr2,
  chefVersion,
  doubleRewards,
  inStaging,
  isLegacy,
  isPeriodFinished,
  token0: _token0,
  token1: _token1,
  totalStakedInUSD,
  doubleRewardToken,
  isStaking,
  version,
  enableClaimButton = false,
  enableModal = () => null
}: { enableClaimButton?: boolean; enableModal?: () => void } & PoolCardTriProps) => {
  const isDualRewards = chefVersion == 1

  const { currency0, currency1, token0, token1 } = getPairRenderOrder(_token0, _token1)

  const { t } = useTranslation()
  // get the color of the token
  const backgroundColor1 = useColorForToken(token0)

  // Only override `backgroundColor2` if it's a dual rewards pool
  const backgroundColor2 = useColorForToken(token1, () => isDualRewards)

  const history = useHistory()

  const totalStakedInUSDFriendly = addCommasToNumber(totalStakedInUSD.toString())

  return (
    <Wrapper bgColor1={backgroundColor1} bgColor2={backgroundColor2} isDoubleRewards={doubleRewards}>
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
            {enableClaimButton && (
              <ButtonGold padding="8px" borderRadius="8px" onClick={enableModal} >
                Claim
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

const StakingPoolCardTRI = (props: PoolCardTriProps) => {
  const { version } = props

  const stakingInfo = useSingleFarm(Number(version))
  const { earnedAmount } = stakingInfo

  const amountIsClaimable = (earnedAmount?.greaterThan(BIG_INT_ZERO) ?? false) === true
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
  const { isStaking } = props
  return isStaking ? <StakingPoolCardTRI {...props} /> : <DefaultPoolCardtri {...props}></DefaultPoolCardtri>
}

export default PoolCardTRI
