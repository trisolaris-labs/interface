import React, { useCallback, useEffect, useState } from 'react'
import { AutoColumn } from '../../components/Column'
import PoolCardTRI from '../../components/earn/PoolCardTri'
import { TYPE } from '../../theme'
import { isTokenAmountPositive } from '../../utils/pools'
import { PoolSection, DataRow } from './EarnTri.styles'

import EarnTriSortAndFilterContainer from '../../components/EarnTriSortAndFilter/EarnTriSortAndFilterContainer'
import useFarmsSortAndFilter from './useFarmsSortAndFilter'
import styled from 'styled-components'
import Toggle from '../../components/Toggle'

import { WidoWidget } from 'wido-widget'
import { Token, getSupportedTokens, quote } from 'wido'
import { useWalletModalToggle } from '../../state/application/hooks'

import { getNetworkLibrary } from '../../connectors'
import { getProviderOrSigner } from '../../utils'
import { useActiveWeb3React } from '../../hooks'

const MemoizedPoolCardTRI = React.memo(PoolCardTRI)

const TitleRow = styled(DataRow)`
  align-items: baseline;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: row;
  `};
`

export default function EarnTri() {
  const [showLegacyFarms, setShowLegacyFarms] = useState(false)
  const {
    activeFarmsFilter,
    filteredFarms,
    handleSort,
    hasSearchQuery,
    legacyFarms,
    onInputChange,
    allFarms,
    isStaking
  } = useFarmsSortAndFilter()

  const [fromTokens, setFromTokens] = useState<Token[]>([])
  const [toTokens, setToTokens] = useState<Token[]>([])

  const { library, account } = useActiveWeb3React()
  // const provider = getProviderOrSigner(library, account) as any

  useEffect(() => {
    getSupportedTokens({
      chainId: [1313161554]
    })
      .then(tokens => {
        setFromTokens(tokens)
        setToTokens(tokens.filter(token => token.protocol === 'trisolaris'))
      })
      .catch(error => console.error(error))
  }, [setFromTokens, setToTokens])

  const toggleWalletModal = useWalletModalToggle()
  return (
    <>
      <WidoWidget
        onConnectWalletClick={toggleWalletModal}
        ethProvider={library}
        fromTokens={fromTokens}
        toTokens={toTokens}
        quoteApi={async request => {
          // To enable staking step, an override is set.
          // `$trisolaris_auto_stake` must be set to 1.
          //
          // If the var is not set, or has a different value than 1,
          //  the staking step won't be added.
          //
          // This variable will have no effect on tokens that are not
          // Trisolaris LP tokens with a valid enabled farm.
          request.varsOverride = {
            $trisolaris_auto_stake: '1'
          }
          return quote(request)
        }}
      />

      <EarnTriSortAndFilterContainer
        activeFarmsFilter={activeFarmsFilter}
        handleSort={handleSort}
        onInputChange={onInputChange}
        isStaking={isStaking}
      />

      <AutoColumn gap="md" style={{ width: '100%' }}>
        <PoolSection>
          {!hasSearchQuery && !activeFarmsFilter && (
            <>
              {allFarms.map(farm => (
                <MemoizedPoolCardTRI
                  key={farm.ID}
                  apr={farm.apr}
                  nonTriAPRs={farm.nonTriAPRs}
                  chefVersion={farm.chefVersion}
                  isPeriodFinished={farm.isPeriodFinished}
                  tokens={farm.tokens}
                  totalStakedInUSD={farm.totalStakedInUSD}
                  version={farm.ID}
                  hasNonTriRewards={farm.hasNonTriRewards}
                  inStaging={farm.inStaging}
                  noTriRewards={farm.noTriRewards}
                  isStaking={isTokenAmountPositive(farm.stakedAmount)}
                  friendlyFarmName={farm.friendlyFarmName}
                  stableSwapPoolName={farm.stableSwapPoolName}
                  poolType={farm.poolType}
                  lpAddress={farm.lpAddress}
                  poolId={farm.poolId}
                />
              ))}
            </>
          )}
          {(hasSearchQuery || activeFarmsFilter) &&
            filteredFarms.map(farm => (
              <MemoizedPoolCardTRI
                key={farm.ID}
                apr={farm.apr}
                nonTriAPRs={farm.nonTriAPRs}
                chefVersion={farm.chefVersion}
                isPeriodFinished={farm.isPeriodFinished}
                tokens={farm.tokens}
                totalStakedInUSD={farm.totalStakedInUSD}
                version={farm.ID}
                hasNonTriRewards={farm.hasNonTriRewards}
                inStaging={farm.inStaging}
                noTriRewards={farm.noTriRewards}
                isStaking={isTokenAmountPositive(farm.stakedAmount)}
                friendlyFarmName={farm.friendlyFarmName}
                stableSwapPoolName={farm.stableSwapPoolName}
                poolType={farm.poolType}
                lpAddress={farm.lpAddress}
                poolId={farm.poolId}
              />
            ))}
        </PoolSection>
      </AutoColumn>
      {!hasSearchQuery && !activeFarmsFilter && (
        <AutoColumn gap="md" style={{ width: '100%' }}>
          <TitleRow>
            <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>Legacy Pools</TYPE.mediumHeader>
            <Toggle
              customToggleText={{ on: 'Show', off: 'Hide' }}
              isActive={showLegacyFarms}
              toggle={() => setShowLegacyFarms(!showLegacyFarms)}
              fontSize="12px"
            />
          </TitleRow>
          {showLegacyFarms ? (
            <PoolSection>
              {legacyFarms.map(farm => (
                <MemoizedPoolCardTRI
                  key={farm.ID}
                  apr={farm.apr}
                  nonTriAPRs={farm.nonTriAPRs}
                  chefVersion={farm.chefVersion}
                  isPeriodFinished={farm.isPeriodFinished}
                  tokens={farm.tokens}
                  totalStakedInUSD={farm.totalStakedInUSD}
                  version={farm.ID}
                  hasNonTriRewards={farm.hasNonTriRewards}
                  inStaging={farm.inStaging}
                  noTriRewards={farm.noTriRewards}
                  isStaking={isTokenAmountPositive(farm.stakedAmount)}
                  friendlyFarmName={farm.friendlyFarmName}
                  stableSwapPoolName={farm.stableSwapPoolName}
                  poolType={farm.poolType}
                  lpAddress={farm.lpAddress}
                  poolId={farm.poolId}
                />
              ))}
            </PoolSection>
          ) : null}
        </AutoColumn>
      )}
    </>
  )
}
