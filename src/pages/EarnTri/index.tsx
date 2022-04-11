import React, { useState, useMemo, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { isEqual } from 'lodash'
import { Text } from 'rebass'
import { ChevronDown, ChevronUp } from 'react-feather'

import { AutoColumn } from '../../components/Column'

import { PageWrapper } from '../../components/Page'
import PoolCardTRI from '../../components/earn/PoolCardTri'
import FarmBanner from '../../components/earn/FarmBanner'
import Toggle from '../../components/Toggle'
import { FarmTabs } from '../../components/NavigationTabs'
import StablePoolCardTri from '../../components/earn/StablePoolCardTri'

import { useFarms } from '../../state/stake/apr'
import { StakingTri } from '../../state/stake/stake-constants'
import { useIsFilterActiveFarms, useToggleFilterActiveFarms } from '../../state/user/hooks'
import { useStableFarms } from '../../state/stake/useStableFarms'

import { TYPE } from '../../theme'
import { isTokenAmountPositive } from '../../utils/pools'
import { StableFarm } from '../../state/stableswap/constants'

import {
  PoolSection,
  DataRow,
  StyledSearchInput,
  StyledFiltersContainer,
  StyledToggleContainer,
  StyledSortContainer,
  StyledSortOption,
  StyledArrowContainer
} from './EarnTri.styles'

enum SortingType {
  liquidity = 'Liquidity',
  totalApr = 'Total APR',
  default = 'Default'
}

type SearchableTokenProps = { symbol: string | undefined; name: string | undefined; address: string }

const POOLS_ORDER = [5, 11, 8, 7, 0, 1, 2, 3, 4, 9, 10, 15, 17, 18, 19, 20, 21, 22, 23, 24]
const LEGACY_POOLS = [6, 16, 12, 13, 14]

const MemoizedFarmBanner = React.memo(FarmBanner)
const MemoizedPoolCardTRI = React.memo(PoolCardTRI)
const MemoizedStablePoolCardTRI = React.memo(StablePoolCardTri)

export default function Earn({
  match: {
    params: { farmsType }
  }
}: RouteComponentProps<{ farmsType: 'stable' | '' }>) {
  const { t } = useTranslation()
  const allFarmArrs = useFarms()
  const stableFarmArrs = useStableFarms()

  const toggleActiveFarms = useToggleFilterActiveFarms()
  const activeFarmsFilter = useIsFilterActiveFarms()

  const [sortBy, setSortBy] = useState<SortingType>(SortingType.default)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortDescending, setSortDescending] = useState<boolean>(true)

  const stableFarmsTabActive = farmsType === 'stable'

  const tabFarmArrs = stableFarmsTabActive ? stableFarmArrs : allFarmArrs

  const getSortedFarms = () => {
    switch (sortBy) {
      case SortingType.default:
        return stableFarmsTabActive ? tabFarmArrs : POOLS_ORDER.map(index => tabFarmArrs[index])
      case SortingType.liquidity:
        return sortDescending
          ? farmArrs.sort((a, b) => (a.totalStakedInUSD < b.totalStakedInUSD ? 1 : -1))
          : farmArrs.sort((a, b) => (a.totalStakedInUSD > b.totalStakedInUSD ? 1 : -1))
      case SortingType.totalApr:
        return sortDescending
          ? farmArrs.sort((a, b) => (a.apr + a.apr2 < b.apr + b.apr2 ? 1 : -1))
          : farmArrs.sort((a, b) => (a.apr + a.apr2 > b.apr + b.apr2 ? 1 : -1))
    }
  }

  const farmArrs = tabFarmArrs.filter(farm => !LEGACY_POOLS.includes(farm.ID))
  const farmArrsInOrder = useMemo(() => getSortedFarms(), [sortBy, farmArrs])

  const nonDualRewardPools = farmArrsInOrder.filter(farm => !farm.doubleRewards && !farm.noTriRewards)

  const [currentFarms, setCurrentFarms] = useState<StakingTri[]>(nonDualRewardPools)

  const legacyFarmArrsInOrder = tabFarmArrs.filter(farm => LEGACY_POOLS.includes(farm.ID))
  const dualRewardPools = farmArrsInOrder.filter(farm => farm.doubleRewards)
  const nonTriFarms = farmArrsInOrder.filter(farm => farm.noTriRewards)

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const input = event.target.value.toUpperCase()
    setSearchQuery(input)
  }

  const handleSort = (sortingType: SortingType) => {
    if (sortingType === sortBy) {
      setSortDescending(!sortDescending)
    } else {
      setSortBy(sortingType)
    }
  }

  const farmTokensIncludesQuery = ({ symbol, name, address }: SearchableTokenProps, query: string) => {
    return (
      symbol?.toUpperCase().includes(query) ||
      name?.toUpperCase().includes(query) ||
      (query.length > 5 && address?.toUpperCase().includes(query))
    )
  }

  const filterFarms = (farms: StakingTri[], query: string) => {
    const farmsToFilter = activeFarmsFilter ? farms.filter(farm => isTokenAmountPositive(farm.stakedAmount)) : farms

    return farmsToFilter.filter(
      farm =>
        farm.tokens.some(({ symbol, name, address }) => farmTokensIncludesQuery({ symbol, name, address }, query)) ||
        (query.length > 5 && farm.lpAddress.toUpperCase().includes(query))
    )
  }

  const filteredFarms: (StableFarm | StakingTri)[] = useMemo(() => filterFarms(currentFarms, searchQuery), [
    currentFarms,
    searchQuery,
    activeFarmsFilter,
    sortBy
  ])

  useEffect(() => {
    const farmsToCompare = searchQuery.length || activeFarmsFilter ? farmArrsInOrder : nonDualRewardPools

    if (!isEqual(currentFarms, farmsToCompare)) {
      setCurrentFarms(farmsToCompare)
    }
  }, [farmArrs])

  const renderSortArrow = () => {
    return sortDescending ? <ChevronDown size={15} /> : <ChevronUp size={15} />
  }

  return (
    <PageWrapper gap="lg" justify="center">
      <MemoizedFarmBanner />
      <AutoColumn gap="lg" style={{ width: '100%' }}>
        <StyledSearchInput placeholder={t('earnPage.farmsSearchPlaceholder')} onChange={handleInput} />
        <FarmTabs active={farmsType} />
        <StyledFiltersContainer>
          <StyledToggleContainer>
            <Text fontWeight={400} fontSize={16} marginRight={20}>
              {`${t('earnPage.filterUserPools')}: `}
            </Text>

            <Toggle id="toggle-user-farms-toggle" isActive={activeFarmsFilter} toggle={toggleActiveFarms} />
          </StyledToggleContainer>
          <StyledSortContainer>
            <Text fontWeight={400} fontSize={16}>
              Sort by:{' '}
              <StyledSortOption onClick={() => handleSort(SortingType.liquidity)}>
                {SortingType.liquidity}
                <StyledArrowContainer>{sortBy === SortingType.liquidity && renderSortArrow()}</StyledArrowContainer>
              </StyledSortOption>
              |
              <StyledSortOption style={{ marginLeft: '1rem' }} onClick={() => handleSort(SortingType.totalApr)}>
                {SortingType.totalApr}
                <StyledArrowContainer>{sortBy === SortingType.totalApr && renderSortArrow()}</StyledArrowContainer>
              </StyledSortOption>
            </Text>
          </StyledSortContainer>
        </StyledFiltersContainer>
        {!searchQuery.length && !activeFarmsFilter && dualRewardPools.length > 0 && (
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
                  token0={farm.tokens[0]}
                  token1={farm.tokens[1]}
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
        {!searchQuery.length && !activeFarmsFilter && (
          <DataRow style={{ alignItems: 'baseline' }}>
            <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>TRI Pools</TYPE.mediumHeader>
          </DataRow>
        )}
        <PoolSection>
          {filteredFarms.map((farm: StakingTri | StableFarm) => {
            return stableFarmsTabActive && 'name' in farm ? (
              <MemoizedStablePoolCardTRI
                key={farm.name}
                apr={farm.apr}
                apr2={farm.apr2}
                chefVersion={farm.chefVersion}
                isPeriodFinished={farm.isPeriodFinished}
                token0={farm.tokens[0]}
                token1={farm.tokens[1]}
                totalStakedInUSD={farm.totalStakedInUSD}
                doubleRewards={farm.doubleRewards}
                inStaging={farm.inStaging}
                noTriRewards={farm.noTriRewards}
                doubleRewardToken={farm.doubleRewardToken}
                isStaking={isTokenAmountPositive(farm.stakedAmount)}
                stableFarm={farm.name}
              />
            ) : (
              <MemoizedPoolCardTRI
                key={farm.ID}
                apr={farm.apr}
                apr2={farm.apr2}
                chefVersion={farm.chefVersion}
                isPeriodFinished={farm.isPeriodFinished}
                token0={farm.tokens[0]}
                token1={farm.tokens[1]}
                totalStakedInUSD={farm.totalStakedInUSD}
                version={farm.ID}
                doubleRewards={farm.doubleRewards}
                inStaging={farm.inStaging}
                noTriRewards={farm.noTriRewards}
                doubleRewardToken={farm.doubleRewardToken}
                isStaking={isTokenAmountPositive(farm.stakedAmount)}
              />
            )
          })}
        </PoolSection>
      </AutoColumn>
      <AutoColumn gap="lg" style={{ width: '100%' }}>
        {!searchQuery.length && !activeFarmsFilter && nonTriFarms.length > 0 && (
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
                  token0={farm.tokens[0]}
                  token1={farm.tokens[1]}
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
      {!searchQuery.length && !activeFarmsFilter && legacyFarmArrsInOrder.length > 0 && (
        <AutoColumn gap="lg" style={{ width: '100%' }}>
          <DataRow style={{ alignItems: 'baseline' }}>
            <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>Legacy Pools</TYPE.mediumHeader>
          </DataRow>
          <PoolSection>
            {legacyFarmArrsInOrder.map(farm => (
              <MemoizedPoolCardTRI
                key={farm.ID}
                apr={farm.apr}
                apr2={farm.apr2}
                chefVersion={farm.chefVersion}
                isLegacy={true}
                isPeriodFinished={farm.isPeriodFinished}
                token0={farm.tokens[0]}
                token1={farm.tokens[1]}
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
    </PageWrapper>
  )
}
