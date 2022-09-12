import React, { useCallback, useState } from 'react'
import { TokenAmount, Token, ChainId } from '@trisolaris/sdk'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { ButtonPrimary } from '../../Button'
import Toggle from '../../Toggle'
import { AutoRow } from '../../Row'
import StakingModal from './StakingModalTri'
import UnstakingModal from './UnstakingModalTri'

import { useTokenBalance } from '../../../state/wallet/hooks'
import { useActiveWeb3React } from '../../../hooks'
import { useWalletModalToggle } from '../../../state/application/hooks'

import { BIG_INT_ZERO } from '../../../constants'

import { StableSwapPoolName } from '../../../state/stableswap/constants'
import { ChefVersions } from '../../../state/stake/stake-constants'
import { MASTERCHEF_ADDRESS_V1, MASTERCHEF_ADDRESS_V2 } from '../../../state/stake/hooks-sushi'
import { ZERO_ADDRESS } from '../../../constants'

import { StyledMutedSubHeader } from './PoolCardTri.styles'

type ManageStakeProps = {
  stakedAmount: TokenAmount | null | undefined
  isStaking: boolean
  stableSwapPoolName?: StableSwapPoolName | null
  tokens: Token[]
  lpAddress: string
  chefVersion: ChefVersions
  poolId: number
  lpToken: Token
}

function ManageStake({
  stakedAmount,
  isStaking,
  stableSwapPoolName,
  tokens,
  lpAddress,
  chefVersion,
  poolId,
  lpToken
}: ManageStakeProps) {
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const history = useHistory()
  const { t } = useTranslation()

  const [showStakingModal, setShowStakingModal] = useState(false)
  const [showUnstakingModal, setShowUnstakingModal] = useState(false)
  const [toggleIsStaking, setToggleIsStaking] = useState(isStaking)

  const userLiquidityUnstaked = useTokenBalance(account ?? undefined, lpToken)

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
    enableDepositModal()
    event.stopPropagation()
  }

  function handleWithDrawClick(event: React.MouseEvent) {
    setShowUnstakingModal(true)
    event.stopPropagation()
  }

  function handleToggle(event: React.MouseEvent) {
    setToggleIsStaking(!toggleIsStaking)
    event.stopPropagation()
  }

  function handleAddLp(event: React.MouseEvent) {
    history.push(addLpLink)
    event.stopPropagation()
  }

  function handleRemoveLp(event: React.MouseEvent) {
    history.push(removeLpLink)
    event.stopPropagation()
  }

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
      {/* {showUnstakingModal && (
        <UnstakingModal
          isOpen={showUnstakingModal}
          onDismiss={() => setShowUnstakingModal(false)}
          stakingInfo={stakingInfo}
        />
      )} */}
      <AutoRow justifyContent="space-between">
        <StyledMutedSubHeader>Manage</StyledMutedSubHeader>
        <Toggle
          customToggleText={{ on: 'Pool', off: 'Stake' }}
          isActive={!toggleIsStaking}
          toggle={handleToggle}
          fontSize="12px"
          padding="2px 6px"
        />
      </AutoRow>
      <AutoRow justifyContent="space-between">
        <ButtonPrimary
          borderRadius="8px"
          disabled={isStaking && (userLiquidityUnstaked == null || userLiquidityUnstaked?.equalTo(BIG_INT_ZERO))}
          width="98px"
          padding="5px"
          fontSize="14px"
          onClick={toggleIsStaking ? handleDepositClick : handleAddLp}
        >
          {toggleIsStaking ? t('earnPage.depositPglTokens') : 'Add LP'}
        </ButtonPrimary>
        <ButtonPrimary
          disabled={
            (isStaking && (stakedAmount == null || stakedAmount?.equalTo(BIG_INT_ZERO))) ||
            (!isStaking && userLiquidityUnstaked?.equalTo(BIG_INT_ZERO))
          }
          padding="5px"
          borderRadius="8px"
          width="98px"
          onClick={isStaking ? handleWithDrawClick : handleRemoveLp}
          fontSize="14px"
        >
          {isStaking ? 'Withdraw' : 'Remove LP'}
        </ButtonPrimary>
      </AutoRow>
    </>
  )
}

export default ManageStake
