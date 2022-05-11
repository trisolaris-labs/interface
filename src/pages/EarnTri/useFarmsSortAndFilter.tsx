import React, { useState, useMemo, useEffect } from 'react'
import _, { isEqual } from 'lodash'
import { useFarms } from '../../state/stake/apr'
import { StakingTri } from '../../state/stake/stake-constants'
import { useIsFilterActiveFarms } from '../../state/user/hooks'
import { isTokenAmountPositive } from '../../utils/pools'

enum SortingType {
  liquidity = 'Liquidity',
  totalApr = 'Total APR',
  default = 'Default'
}

type SearchableTokenProps = { symbol: string | undefined; name: string | undefined; address: string }

type FarmsSortAndFilterResult = {
  activeFarmsFilter: boolean
  dualRewardPools: StakingTri[]
  filteredFarms: StakingTri[]
  handleSort: (sortingType: SortingType) => void
  hasSeachQuery: boolean
  isSortDescending: boolean
  legacyFarms: StakingTri[]
  nonTriFarms: StakingTri[]
  onInputChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
  sortBy: SortingType
}

type Props = {
  poolsOrder: number[]
  legacyPoolsOrder: number[]
}

export default function useFarmsSortAndFilter({ poolsOrder, legacyPoolsOrder }: Props): FarmsSortAndFilterResult {
  const allFarmArrs = useFarms()
  const activeFarmsFilter = useIsFilterActiveFarms()

  const [sortBy, setSortBy] = useState<SortingType>(SortingType.default)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isSortDescending, setIsSortDescending] = useState<boolean>(true)

  const farmArrs = useMemo(
    () =>
      allFarmArrs
        .filter(farm => !legacyPoolsOrder.includes(farm.ID)) // Ignore legacy pools in sorting/filtering
        .filter(farm => poolsOrder.includes(farm.ID)), // Ignore pools that are not in the rendering list
    [allFarmArrs, legacyPoolsOrder, poolsOrder]
  )
  const farmArrsInOrder = useMemo((): StakingTri[] => {
    switch (sortBy) {
      case SortingType.default:
        return poolsOrder.map(index => allFarmArrs[index])
      case SortingType.liquidity:
        return _.orderBy(farmArrs, 'totalStakedInUSD', isSortDescending ? 'desc' : 'asc')
      case SortingType.totalApr:
        return _.orderBy(
          farmArrs,
          ({ apr: triAPR, nonTriAPRs }) => (nonTriAPRs ?? []).reduce((acc: number, { apr }) => acc + apr, triAPR ?? 0),
          isSortDescending ? 'desc' : 'asc'
        )
    }
  }, [allFarmArrs, farmArrs, isSortDescending, poolsOrder, sortBy])
  const nonDualRewardPools = farmArrsInOrder.filter(farm => !farm.doubleRewards && !farm.noTriRewards)
  const dualRewardPools = farmArrsInOrder.filter(farm => farm.doubleRewards)

  const [currentFarms, setCurrentFarms] = useState<StakingTri[]>(nonDualRewardPools)

  const legacyFarms = allFarmArrs.filter(farm => legacyPoolsOrder.includes(farm.ID))
  const nonTriFarms = farmArrsInOrder.filter(farm => farm.noTriRewards)

  function handleInput(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    const input = event.target.value.toUpperCase()
    setSearchQuery(input)
  }

  function handleSort(sortingType: SortingType) {
    if (sortingType === sortBy) {
      setIsSortDescending(!isSortDescending)
    } else {
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

  const filteredFarms = useMemo(() => {
    return currentFarms
      .filter(farm => (activeFarmsFilter ? isTokenAmountPositive(farm.stakedAmount) : farm))
      .filter(
        farm =>
          farm.tokens.some(({ symbol, name, address }) =>
            farmTokensIncludesQuery({ symbol, name, address }, searchQuery)
          ) ||
          (searchQuery.length > 5 && farm.lpAddress.toUpperCase().includes(searchQuery))
      )
  }, [activeFarmsFilter, currentFarms, searchQuery])

  useEffect(() => {
    const farmsToCompare = searchQuery.length || activeFarmsFilter ? farmArrsInOrder : nonDualRewardPools

    if (!isEqual(currentFarms, farmsToCompare)) {
      setCurrentFarms(farmsToCompare)
    }
  }, [activeFarmsFilter, currentFarms, farmArrs, farmArrsInOrder, nonDualRewardPools, searchQuery.length])

  return {
    activeFarmsFilter,
    dualRewardPools,
    filteredFarms,
    handleSort,
    hasSeachQuery: searchQuery.length > 0,
    legacyFarms,
    nonTriFarms,
    onInputChange: handleInput,
    isSortDescending,
    sortBy
  }
}
