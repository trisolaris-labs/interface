import React, { useState, useMemo, useEffect } from 'react'
import _, { isEqual } from 'lodash'
import { useFarms } from '../../state/stake/apr'
import { StakingTri } from '../../state/stake/stake-constants'
import { useIsFilterActiveFarms } from '../../state/user/hooks'
import { isTokenAmountPositive } from '../../utils/pools'

import {
  DUAL_REWARDS_POOLS,
  TRI_ONLY_REWARDS_POOLS,
  ECOSYSTEM_POOLS,
  STABLE_POOLS,
  LEGACY_POOLS,
  MULTIPLE_REWARD_POOLS
} from '../../constants/farms'

export enum SortingType {
  liquidity = 'liquidity',
  totalApr = 'totalApr',
  default = 'default'
}

const legacyPoolsOrderSet = new Set(LEGACY_POOLS)

type SearchableTokenProps = { symbol: string | undefined; name: string | undefined; address: string }

type FarmsSortAndFilterResult = {
  activeFarmsFilter: boolean
  filteredFarms: StakingTri[]
  handleSort: (sortingType: SortingType) => void
  hasSearchQuery: boolean
  legacyFarms: StakingTri[]
  onInputChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
  sortBy: SortingType
  allFarms: StakingTri[]
  isStaking: boolean
}

export default function useFarmsSortAndFilter(): FarmsSortAndFilterResult {
  const allFarmArrs = useFarms()
  // console.log({ allFarmArrs })
  const activeFarmsFilter = useIsFilterActiveFarms()
  const allPools = STABLE_POOLS.concat(
    MULTIPLE_REWARD_POOLS,
    DUAL_REWARDS_POOLS,
    TRI_ONLY_REWARDS_POOLS,
    ECOSYSTEM_POOLS
  )

  const [sortBy, setSortBy] = useState<SortingType>(SortingType.default)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const farmArrs = useMemo(
    () =>
      allFarmArrs
        .filter(farm => !legacyPoolsOrderSet.has(farm.ID)) // Ignore legacy pools in sorting/filtering
        .filter(farm => allPools.includes(farm.ID)), // Ignore pools that are not in the rendering list
    [allFarmArrs, allPools]
  )
  const farmArrsInOrder = useMemo((): StakingTri[] => {
    switch (sortBy) {
      case SortingType.default:
        return allPools.map(index => allFarmArrs[index])
      case SortingType.liquidity:
        return _.orderBy(farmArrs, 'totalStakedInUSD', 'desc')
      case SortingType.totalApr:
        return _.orderBy(
          farmArrs,
          ({ apr: triAPR, nonTriAPRs }) => nonTriAPRs.reduce((acc: number, { apr }) => acc + apr, triAPR ?? 0),
          'desc'
        )
    }
  }, [allFarmArrs, farmArrs, allPools, sortBy])

  const [currentFarms, setCurrentFarms] = useState<StakingTri[]>(farmArrs)

  const legacyFarms = allFarmArrs.filter(farm => legacyPoolsOrderSet.has(farm.ID))

  function handleInput(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    const input = event.target.value.toUpperCase()
    setSearchQuery(input)
  }

  function handleSort(sortingType: SortingType) {
    if (sortingType !== sortBy) {
      setSortBy(sortingType)
    }
  }

  function farmTokensIncludesQuery({ symbol, name, address }: SearchableTokenProps, query: string) {
    return (
      symbol?.toUpperCase().includes(query) ||
      name?.toUpperCase().includes(query) ||
      (query.length > 5 && address?.toUpperCase().includes(query))
    )
  }

  const stakedFarms = useMemo(() => {
    return currentFarms.filter(farm => isTokenAmountPositive(farm.stakedAmount))
  }, [currentFarms])

  const farmsToFilter = activeFarmsFilter ? stakedFarms : currentFarms

  const filteredFarms = useMemo(() => {
    return farmsToFilter.filter(
      farm =>
        farm.tokens.some(({ symbol, name, address }) =>
          farmTokensIncludesQuery({ symbol, name, address }, searchQuery)
        ) ||
        (searchQuery.length > 5 && farm.lpAddress.toUpperCase().includes(searchQuery))
    )
  }, [searchQuery, farmsToFilter])

  useEffect(() => {
    const farmsToCompare = searchQuery.length || activeFarmsFilter ? farmArrsInOrder : farmArrs

    if (!isEqual(currentFarms, farmsToCompare)) {
      setCurrentFarms(farmsToCompare)
    }
  }, [activeFarmsFilter, currentFarms, farmArrs, farmArrsInOrder, searchQuery.length])

  return {
    activeFarmsFilter,
    filteredFarms,
    handleSort,
    hasSearchQuery: searchQuery.length > 0,
    legacyFarms,
    onInputChange: handleInput,
    sortBy,
    allFarms: farmArrsInOrder,
    isStaking: stakedFarms.length > 0
  }
}
