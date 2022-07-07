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

import { useIsFarmsGridView } from '../../state/user/hooks'

const MemoizedPoolCardTRI = React.memo(PoolCardTRI)

const TitleRow = styled(DataRow)`
  align-items: baseline;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: row;
  `};
`

export default function EarnTri() {
  const [showLegacyFarms, setShowLegacyFarms] = useState(false)
  const farmsGridView = useIsFarmsGridView()

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
        farmsGridView={farmsGridView}
      />

      {!hasSearchQuery && !activeFarmsFilter && (
        <AutoColumn gap="md" style={{ width: '100%' }}>
          <DataRow style={{ alignItems: 'baseline' }}>
            <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>Stable Pools</TYPE.mediumHeader>
          </DataRow>

          <PoolSection gap="md" gridView={farmsGridView}>
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
                  fullCard={farmsGridView}
                />
              )
            )}
          </PoolSection>
        </AutoColumn>
      )}

      <AutoColumn gap="md" style={{ width: '100%' }}>
        {!hasSearchQuery && !activeFarmsFilter && (
          <>
            <DataRow style={{ alignItems: 'baseline' }}>
              <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>Dual Rewards Pools</TYPE.mediumHeader>
            </DataRow>
            <PoolSection gap="md" gridView={farmsGridView}>
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
                  fullCard={farmsGridView}
                />
              ))}
            </PoolSection>
          </>
        )}
      </AutoColumn>
      <AutoColumn gap="md" style={{ width: '100%' }}>
        {!hasSearchQuery && !activeFarmsFilter && (
          <DataRow style={{ alignItems: 'baseline' }}>
            <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>TRI Pools</TYPE.mediumHeader>
          </DataRow>
        )}

        <PoolSection gap="md" gridView={farmsGridView}>
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
              fullCard={farmsGridView}
            />
          ))}
        </PoolSection>
      </AutoColumn>
      <AutoColumn gap="md" style={{ width: '100%' }}>
        {!hasSearchQuery && !activeFarmsFilter && (
          <>
            <DataRow style={{ alignItems: 'baseline' }}>
              <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>Ecosystem Pools</TYPE.mediumHeader>
            </DataRow>

            <PoolSection gap="md" gridView={farmsGridView}>
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
                  fullCard={farmsGridView}
                />
              ))}
            </PoolSection>
          </>
        )}
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
            <PoolSection gap="md" gridView={farmsGridView}>
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
                  fullCard={farmsGridView}
                />
              ))}
            </PoolSection>
          ) : null}
        </AutoColumn>
      )}
    </>
  )
}
