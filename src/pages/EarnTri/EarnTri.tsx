import React, { useState } from 'react'
import { AutoColumn } from '../../components/Column'
import PoolCardTRI from '../../components/earn/PoolCardTri'
import { TYPE } from '../../theme'
import { isTokenAmountPositive } from '../../utils/pools'
import { PoolSection, DataRow } from './EarnTri.styles'

import EarnTriSortAndFilterContainer from '../../components/EarnTriSortAndFilter/EarnTriSortAndFilterContainer'
import useFarmsSortAndFilter from './useFarmsSortAndFilter'
import styled from 'styled-components'
import Toggle from '../../components/Toggle'

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

  return (
    <>
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
                  zapEnabled={farm.zapEnabled}
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
                zapEnabled={farm.zapEnabled}
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
                  zapEnabled={farm.zapEnabled}
                />
              ))}
            </PoolSection>
          ) : null}
        </AutoColumn>
      )}
    </>
  )
}
