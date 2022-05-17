import React from 'react'
import { PageWrapper } from '../../components/Page'
import FarmBanner from '../../components/earn/FarmBanner'
import EarnTri from './EarnTri'

import EarnTriSortAndFilterContainer from '../../components/EarnTriSortAndFilter/EarnTriSortAndFilterContainer'
import useFarmsSortAndFilter from './useFarmsSortAndFilter'

const POOLS_ORDER = [32, 33, 5, 11, 31, 8, 30, 7, 0, 3, 4, 15, 17, 18, 19, 20, 21, 22, 23, 24, 26, 27, 28, 29, 34]
const LEGACY_POOLS = [1, 2, 6, 16, 12, 13, 14, 9, 10]
const STABLE_POOLS = [25, 35]

const MemoizedFarmBanner = React.memo(FarmBanner)

export default function Earn() {
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
  } = useFarmsSortAndFilter({
    poolsOrder: POOLS_ORDER,
    legacyPoolsOrder: LEGACY_POOLS,
    stablePoolsOrder: STABLE_POOLS
  })

  return (
    <PageWrapper gap="lg" justify="center">
      <MemoizedFarmBanner />
      <EarnTriSortAndFilterContainer
        activeFarmsFilter={activeFarmsFilter}
        handleSort={handleSort}
        isSortDescending={isSortDescending}
        onInputChange={onInputChange}
        sortBy={sortBy}
      />
      <EarnTri
        poolsOrder={POOLS_ORDER}
        legacyPoolsOrder={LEGACY_POOLS}
        activeFarmsFilter={activeFarmsFilter}
        hasSearchQuery={hasSearchQuery}
        dualRewardPools={dualRewardPools}
        filteredFarms={filteredFarms}
        nonTriFarms={nonTriFarms}
        legacyFarms={legacyFarms}
        stableFarms={stablePoolFarms}
      />
    </PageWrapper>
  )
}
