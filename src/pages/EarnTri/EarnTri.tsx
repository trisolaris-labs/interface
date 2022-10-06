import React, { useState } from 'react'
import { AutoColumn } from '../../components/Column'
import PoolCardTRI from '../../components/earn/PoolCardTri'
import { TYPE } from '../../theme'
import { isTokenAmountPositive } from '../../utils/pools'
import { PoolSection, DataRow, PoolHeader, HeaderColumn } from './EarnTri.styles'

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
    dualRewardPools,
    stablePoolFarms,
    filteredFarms,
    handleSort,
    hasSearchQuery,
    legacyFarms,
    nonTriFarms,
    onInputChange,
    isSortDescending,
    sortBy
  } = useFarmsSortAndFilter()

  return (
    <>
      <EarnTriSortAndFilterContainer
        activeFarmsFilter={activeFarmsFilter}
        handleSort={handleSort}
        isSortDescending={isSortDescending}
        onInputChange={onInputChange}
        sortBy={sortBy}
      />

      <AutoColumn gap="md" style={{ width: '100%' }}>
        <PoolSection>
          {!hasSearchQuery && !activeFarmsFilter && (
            <>
              {stablePoolFarms.map(farm =>
                farm.stableSwapPoolName == null ? null : (
                  <MemoizedPoolCardTRI
                    key={farm.ID}
                    apr={farm.apr}
                    nonTriAPRs={farm.nonTriAPRs}
                    chefVersion={farm.chefVersion}
                    isPeriodFinished={farm.isPeriodFinished}
                    tokens={farm.tokens}
                    stableSwapPoolName={farm.stableSwapPoolName}
                    totalStakedInUSD={farm.totalStakedInUSD}
                    version={farm.ID}
                    hasNonTriRewards={farm.hasNonTriRewards}
                    inStaging={farm.inStaging}
                    noTriRewards={farm.noTriRewards}
                    isStaking={isTokenAmountPositive(farm.stakedAmount)}
                    friendlyFarmName={farm.friendlyFarmName}
                    isFeatured={farm.isFeatured}
                    poolType={farm.poolType}
                    lpAddress={farm.lpAddress}
                    poolId={farm.poolId}
                  />
                )
              )}
              {dualRewardPools.map(farm => (
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
                  isFeatured={farm.isFeatured}
                  stableSwapPoolName={farm.stableSwapPoolName}
                  poolType={farm.poolType}
                  lpAddress={farm.lpAddress}
                  poolId={farm.poolId}
                />
              ))}
              {filteredFarms.map(farm => (
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
                  isFeatured={farm.isFeatured}
                  stableSwapPoolName={farm.stableSwapPoolName}
                  poolType={farm.poolType}
                  lpAddress={farm.lpAddress}
                  poolId={farm.poolId}
                />
              ))}
              {nonTriFarms.map(farm => (
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
                  isLegacy={true}
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
