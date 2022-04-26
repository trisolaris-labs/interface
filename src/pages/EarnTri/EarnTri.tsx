import React from 'react'
import { AutoColumn } from '../../components/Column'
import PoolCardTRI from '../../components/earn/PoolCardTri'
import EarnTriSortAndFilterContainer from '../../components/EarnTriSortAndFilter/EarnTriSortAndFilterContainer'
import { FarmTabs } from '../../components/NavigationTabs'
import { TYPE } from '../../theme'
import { isTokenAmountPositive } from '../../utils/pools'
import { PoolSection, DataRow } from './EarnTri.styles'
import useFarmsSortAndFilter from './useFarmsSortAndFilter'

const MemoizedPoolCardTRI = React.memo(PoolCardTRI)

export default function EarnTri({
  poolsOrder,
  legacyPoolsOrder
}: {
  poolsOrder: number[]
  legacyPoolsOrder: number[]
}) {
  const {
    activeFarmsFilter,
    dualRewardPools,
    filteredFarms,
    handleSort,
    hasSeachQuery,
    legacyFarms,
    nonTriFarms,
    onInputChange,
    isSortDescending,
    sortBy
  } = useFarmsSortAndFilter({
    poolsOrder,
    legacyPoolsOrder
  })

  return (
    <>
      <AutoColumn gap="lg" style={{ width: '100%' }}>
        <FarmTabs active="normal" />
        <EarnTriSortAndFilterContainer
          activeFarmsFilter={activeFarmsFilter}
          handleSort={handleSort}
          isSortDescending={isSortDescending}
          onInputChange={onInputChange}
          sortBy={sortBy}
        />
        {!hasSeachQuery && !activeFarmsFilter && (
          <>
            <DataRow style={{ alignItems: 'baseline' }}>
              <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>Dual Rewards Pools</TYPE.mediumHeader>
            </DataRow>
            <PoolSection>
              {dualRewardPools.map(farm => (
                <MemoizedPoolCardTRI
                  key={farm.ID}
                  apr={farm.apr}
                  apr2={farm.apr2}
                  chefVersion={farm.chefVersion}
                  isPeriodFinished={farm.isPeriodFinished}
                  tokens={farm.tokens}
                  totalStakedInUSD={farm.totalStakedInUSD}
                  version={farm.ID}
                  doubleRewards={farm.doubleRewards}
                  inStaging={farm.inStaging}
                  noTriRewards={farm.noTriRewards}
                  doubleRewardToken={farm.doubleRewardToken}
                  isStaking={isTokenAmountPositive(farm.stakedAmount)}
                />
              ))}
            </PoolSection>
          </>
        )}
      </AutoColumn>
      <AutoColumn gap="lg" style={{ width: '100%' }}>
        {!hasSeachQuery && !activeFarmsFilter && (
          <DataRow style={{ alignItems: 'baseline' }}>
            <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>TRI Pools</TYPE.mediumHeader>
          </DataRow>
        )}

        <PoolSection>
          {filteredFarms.map(farm => (
            <MemoizedPoolCardTRI
              key={farm.ID}
              apr={farm.apr}
              apr2={farm.apr2}
              chefVersion={farm.chefVersion}
              isPeriodFinished={farm.isPeriodFinished}
              tokens={farm.tokens}
              totalStakedInUSD={farm.totalStakedInUSD}
              version={farm.ID}
              doubleRewards={farm.doubleRewards}
              inStaging={farm.inStaging}
              noTriRewards={farm.noTriRewards}
              doubleRewardToken={farm.doubleRewardToken}
              isStaking={isTokenAmountPositive(farm.stakedAmount)}
            />
          ))}
        </PoolSection>
      </AutoColumn>
      <AutoColumn gap="lg" style={{ width: '100%' }}>
        {!hasSeachQuery && !activeFarmsFilter && (
          <>
            <DataRow style={{ alignItems: 'baseline' }}>
              <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>Ecosystem Pools</TYPE.mediumHeader>
            </DataRow>

            <PoolSection>
              {nonTriFarms.map(farm => (
                <MemoizedPoolCardTRI
                  key={farm.ID}
                  apr={farm.apr}
                  apr2={farm.apr2}
                  chefVersion={farm.chefVersion}
                  isPeriodFinished={farm.isPeriodFinished}
                  tokens={farm.tokens}
                  totalStakedInUSD={farm.totalStakedInUSD}
                  version={farm.ID}
                  doubleRewards={farm.doubleRewards}
                  inStaging={farm.inStaging}
                  noTriRewards={farm.noTriRewards}
                  doubleRewardToken={farm.doubleRewardToken}
                  isStaking={isTokenAmountPositive(farm.stakedAmount)}
                />
              ))}
            </PoolSection>
          </>
        )}
      </AutoColumn>
      {!hasSeachQuery && !activeFarmsFilter && (
        <AutoColumn gap="lg" style={{ width: '100%' }}>
          <DataRow style={{ alignItems: 'baseline' }}>
            <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>Legacy Pools</TYPE.mediumHeader>
          </DataRow>
          <PoolSection>
            {legacyFarms.map(farm => (
              <MemoizedPoolCardTRI
                key={farm.ID}
                apr={farm.apr}
                apr2={farm.apr2}
                chefVersion={farm.chefVersion}
                isLegacy={true}
                isPeriodFinished={farm.isPeriodFinished}
                tokens={farm.tokens}
                totalStakedInUSD={farm.totalStakedInUSD}
                version={farm.ID}
                doubleRewards={farm.doubleRewards}
                inStaging={farm.inStaging}
                noTriRewards={farm.noTriRewards}
                doubleRewardToken={farm.doubleRewardToken}
                isStaking={isTokenAmountPositive(farm.stakedAmount)}
              />
            ))}
          </PoolSection>
        </AutoColumn>
      )}
    </>
  )
}
