import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { TokenAmount, Token, ChainId } from '@trisolaris/sdk'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { ButtonPrimary } from '../../Button'
import Toggle from '../../Toggle'
import { AutoRow } from '../../Row'
import StakingModal from './StakingModalTri'
import UnstakingModal from './UnstakingModalTri'

import { useWalletModalToggle } from '../../../state/application/hooks'

import { BIG_INT_ZERO } from '../../../constants'

import { StableSwapPoolName } from '../../../state/stableswap/constants'
import { ChefVersions, EarnedNonTriRewards } from '../../../state/stake/stake-constants'
import { MASTERCHEF_ADDRESS_V1, MASTERCHEF_ADDRESS_V2 } from '../../../state/stake/hooks-sushi'

import { StyledMutedSubHeader } from './PoolCardTri.styles'

const StyledZapButton = styled(ButtonPrimary)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 100% !important;
  `};
`

type ManageStakeProps = {
  stakedAmount: TokenAmount | null | undefined
  isStaking: boolean
  stableSwapPoolName?: StableSwapPoolName | null
  tokens: Token[]
  lpAddress: string
  chefVersion: ChefVersions
  poolId: number
  lpToken: Token
  noTriRewards: boolean
  earnedNonTriRewards: EarnedNonTriRewards[]
  earnedAmount?: TokenAmount
  userLiquidityUnstaked?: TokenAmount
  account?: string | null
  isLegacy: boolean
  zapEnabled: boolean
}

function ManageStake({
  stakedAmount,
  isStaking,
  stableSwapPoolName,
  tokens,
  lpAddress,
  chefVersion,
  poolId,
  lpToken,
  noTriRewards,
  earnedNonTriRewards,
  earnedAmount,
  userLiquidityUnstaked,
  account,
  isLegacy,
  zapEnabled
}: ManageStakeProps) {
  const toggleWalletModal = useWalletModalToggle()
  const history = useHistory()
  const { t } = useTranslation()

  const userHasLiquidity = userLiquidityUnstaked?.greaterThan(BIG_INT_ZERO)

  const [showStakingModal, setShowStakingModal] = useState(false)
  const [showUnstakingModal, setShowUnstakingModal] = useState(false)
  const [toggleIsStaking, setToggleIsStaking] = useState(isStaking || userHasLiquidity)

  const stakingRewardAddress =
    chefVersion === ChefVersions.V1 ? MASTERCHEF_ADDRESS_V1[ChainId.AURORA] : MASTERCHEF_ADDRESS_V2[ChainId.AURORA]

  const enableDepositModal = useCallback(() => {
    if (account) {
      setShowStakingModal(true)
    } else {
      toggleWalletModal()
    }
  }, [account, toggleWalletModal])

  function handleDepositClick(event: React.MouseEvent) {
    event.stopPropagation()
    enableDepositModal()
  }

  function handleWithDrawClick(event: React.MouseEvent) {
    event.stopPropagation()
    setShowUnstakingModal(true)
  }

  function handleToggle() {
    setToggleIsStaking(!toggleIsStaking)
  }

  function handleAddLp(event: React.MouseEvent) {
    event.stopPropagation()
    history.push(addLpLink)
  }

  function handleRemoveLp(event: React.MouseEvent) {
    event.stopPropagation()
    history.push(removeLpLink)
  }

  useEffect(() => {
    if (userHasLiquidity && !toggleIsStaking) {
      setToggleIsStaking(true)
    }
  }, [userHasLiquidity])

  const addLpLink = stableSwapPoolName
    ? `/pool/stable/add/${stableSwapPoolName}`
    : `add/${tokens[0].address}/${tokens[1].address}`

  const removeLpLink = stableSwapPoolName
    ? `/pool/stable/remove/${stableSwapPoolName}`
    : `remove/${tokens[0].address}/${tokens[1].address}`

  return (
    <>
      {showStakingModal && (
        <StakingModal
          isOpen={showStakingModal}
          onDismiss={() => setShowStakingModal(false)}
          userLiquidityUnstaked={userLiquidityUnstaked}
          stakedToken={lpToken}
          tokens={tokens}
          lpAddress={lpAddress}
          chefVersion={chefVersion}
          stakingRewardAddress={stakingRewardAddress}
          poolId={poolId}
        />
      )}
      {showUnstakingModal && (
        <UnstakingModal
          isOpen={showUnstakingModal}
          onDismiss={() => setShowUnstakingModal(false)}
          chefVersion={chefVersion}
          earnedAmount={earnedAmount}
          earnedNonTriRewards={earnedNonTriRewards}
          noTriRewards={noTriRewards}
          poolId={poolId}
          stakedAmount={stakedAmount}
        />
      )}

      <AutoRow justifyContent="space-between">
        <StyledMutedSubHeader>Manage</StyledMutedSubHeader>
        <Toggle
          customToggleText={{ on: 'Pool', off: 'Stake' }}
          isActive={!toggleIsStaking}
          toggle={handleToggle}
          fontSize="12px"
          padding="2px 6px"
          stopPropagation
        />
      </AutoRow>
      <AutoRow justifyContent="space-between">
        <ButtonPrimary
          borderRadius="8px"
          disabled={(toggleIsStaking && !userHasLiquidity) || (toggleIsStaking && isLegacy)}
          width="98px"
          padding="5px"
          fontSize="14px"
          onClick={toggleIsStaking ? handleDepositClick : handleAddLp}
        >
          {toggleIsStaking ? t('earnPage.depositPglTokens') : 'Add LP'}
        </ButtonPrimary>
        <ButtonPrimary
          disabled={
            (toggleIsStaking && (stakedAmount == null || stakedAmount?.equalTo(BIG_INT_ZERO))) ||
            (!toggleIsStaking && !userHasLiquidity)
          }
          padding="5px"
          borderRadius="8px"
          width="98px"
          onClick={toggleIsStaking ? handleWithDrawClick : handleRemoveLp}
          fontSize="14px"
        >
          {toggleIsStaking ? 'Withdraw' : 'Remove LP'}
        </ButtonPrimary>
      </AutoRow>
    </>
  )
}

export default ManageStake
