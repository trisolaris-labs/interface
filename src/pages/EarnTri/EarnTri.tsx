import React from 'react'
import { AutoColumn } from '../../components/Column'
import PoolCardTRI from '../../components/earn/PoolCardTri'
import EarnTriSortAndFilterContainer from '../../components/EarnTriSortAndFilter/EarnTriSortAndFilterContainer'
import { FarmTabs } from '../../components/NavigationTabs'
import { StakingTri } from '../../state/stake/stake-constants'
import { TYPE } from '../../theme'
import { isTokenAmountPositive } from '../../utils/pools'
import { PoolSection, DataRow } from './EarnTri.styles'
import useFarmsSortAndFilter from './useFarmsSortAndFilter'

const MemoizedPoolCardTRI = React.memo(PoolCardTRI)

export default function EarnTri({
  poolsOrder,
  legacyPoolsOrder,
  activeFarmsFilter,
  hasSearchQuery,
  dualRewardPools,
  filteredFarms,
  nonTriFarms,
  legacyFarms,
  stableFarms
}: {
  poolsOrder: number[]
  legacyPoolsOrder: number[]
  activeFarmsFilter: boolean
  hasSearchQuery: boolean
  dualRewardPools: StakingTri[]
  filteredFarms: StakingTri[]
  nonTriFarms: StakingTri[]
  legacyFarms: StakingTri[]
  stableFarms: StakingTri[]
}) {
  return (
    <>
      {!hasSearchQuery && !activeFarmsFilter && (
        <AutoColumn gap="lg" style={{ width: '100%' }}>
          <DataRow style={{ alignItems: 'baseline' }}>
            <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>Stable Pools</TYPE.mediumHeader>
          </DataRow>

          <PoolSection>
            {stableFarms.map(farm =>
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
                  doubleRewards={farm.doubleRewards}
                  inStaging={farm.inStaging}
                  noTriRewards={farm.noTriRewards}
                  doubleRewardToken={farm.doubleRewardToken}
                  isStaking={isTokenAmountPositive(farm.stakedAmount)}
                />
              )
            )}
          </PoolSection>
        </AutoColumn>
      )}

      <AutoColumn gap="lg" style={{ width: '100%' }}>
        {!hasSearchQuery && !activeFarmsFilter && (
          <>
            <DataRow style={{ alignItems: 'baseline' }}>
              <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>Dual Rewards Pools</TYPE.mediumHeader>
            </DataRow>
            <PoolSection>
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
        {!hasSearchQuery && !activeFarmsFilter && (
          <DataRow style={{ alignItems: 'baseline' }}>
            <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>TRI Pools</TYPE.mediumHeader>
          </DataRow>
        )}

        <PoolSection>
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
        {!hasSearchQuery && !activeFarmsFilter && (
          <>
            <DataRow style={{ alignItems: 'baseline' }}>
              <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>Ecosystem Pools</TYPE.mediumHeader>
            </DataRow>

            <PoolSection>
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
      {!hasSearchQuery && !activeFarmsFilter && (
        <AutoColumn gap="lg" style={{ width: '100%' }}>
          <DataRow style={{ alignItems: 'baseline' }}>
            <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>Legacy Pools</TYPE.mediumHeader>
          </DataRow>
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
