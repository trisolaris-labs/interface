import React, { useState, useMemo, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { isEqual } from 'lodash'
import { Text } from 'rebass'

import { AutoColumn } from '../../components/Column'
import { RowBetween } from '../../components/Row'
import { CardSection, HighlightCard } from '../../components/earn/styled'
import { PageWrapper } from '../../components/Page'
import PoolCardTRI from '../../components/earn/PoolCardTri'
import FarmBanner from '../../components/earn/FarmBanner'
import Toggle from '../../components/Toggle'

import { TYPE, ExternalLink } from '../../theme'
import { useFarms } from '../../state/stake/apr'
import { StakingTri } from '../../state/stake/stake-constants'
import { poolIsStaking } from '../../utils/pools'

import { TopSection, PoolSection, DataRow, StyledSearchInput, StyledToggleContainer } from './EarnTri.styles'

enum SortingType {
  totalStakedInWavax = 'totalStakedInWavax',
  multiplier = 'multiplier',
  totalApr = 'totalApr'
}

const POOLS_ORDER = [5, 11, 8, 7, 0, 1, 2, 3, 4, 9, 10, 12, 13, 14]
const LEGACY_POOLS = [6]

const MemoizedFarmBanner = React.memo(FarmBanner)
const MemoizedPoolCardTRI = React.memo(PoolCardTRI)

export default function Earn({
  match: {
    params: { version }
  }
}: RouteComponentProps<{ version: string }>) {
  const { t } = useTranslation()

  const farmArrs = useFarms()

  const [searchQuery, setSearchQuery] = useState<string>('')

  const farmArrsInOrder = POOLS_ORDER.map(index => farmArrs[index])

  const [filterUserFarms, setFilterUserFarms] = useState<boolean>(false)

  const legacyFarmArrsInOrder = LEGACY_POOLS.map(index => farmArrs[index])

  const dualRewardPools = farmArrsInOrder.filter(farm => farm.doubleRewards)
  const nonDualRewardPools = farmArrsInOrder.filter(farm => !farm.doubleRewards)

  const [testFarms, setTestFarms] = useState<StakingTri[]>(nonDualRewardPools)

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const input = event.target.value.toUpperCase()
    setSearchQuery(input)
  }

  // const sortFarms = (farms: StakingTri[], order: string) => {
  //   return farms
  // }

  // const sortedFarms = useMemo(() => sortFarms(farmArrs, 'iuu'), [farmArrs])

  const filterFarms = (farms: StakingTri[], query: string) => {
    const farmsToFilter = filterUserFarms ? farms.filter(farm => poolIsStaking(farm.stakedAmount)) : farms
    return farmsToFilter.filter(farm =>
      farm.tokens.some(
        ({ symbol, name, address }) =>
          symbol?.toUpperCase().includes(query) ||
          name?.toUpperCase().includes(query) ||
          address?.toUpperCase().includes(query)
      )
    )
  }

  const filteredFarms = useMemo(() => filterFarms(testFarms, searchQuery), [testFarms, searchQuery, filterUserFarms])

  useEffect(() => {
    if (!isEqual(testFarms, nonDualRewardPools)) {
      const newFilteredFarms = filterFarms(nonDualRewardPools, searchQuery)
      setTestFarms(newFilteredFarms)
    }
  }, [farmArrs])

  return (
    <PageWrapper gap="lg" justify="center">
      <MemoizedFarmBanner />
      <TopSection gap="md">
        <HighlightCard>
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>{t('earnPage.liquidityMining')}</TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14}>{t('earnPage.depositLiquidity')}</TYPE.white>
              </RowBetween>{' '}
              <ExternalLink
                style={{ color: 'white', textDecoration: 'underline' }}
                href="https://medium.com/trisolaris-labs"
                target="_blank"
              >
                <TYPE.white fontSize={14}>{t('earnPage.readMoreAboutPng')}</TYPE.white>
              </ExternalLink>
            </AutoColumn>
          </CardSection>
        </HighlightCard>
      </TopSection>

      <AutoColumn gap="lg" style={{ width: '100%' }}>
        <StyledSearchInput placeholder={t('searchModal.tokenSearchPlaceholder')} onChange={handleInput} />
        <StyledToggleContainer>
          <Text fontWeight={400} fontSize={16} marginRight={20}>
            {`${t('earnPage.filterUserPools')}: `}
          </Text>

          <Toggle
            id="toggle-user-farms-toggle"
            isActive={filterUserFarms}
            toggle={() => setFilterUserFarms(!filterUserFarms)}
          />
        </StyledToggleContainer>
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
              stakedAmount={farm.stakedAmount}
              token0={farm.tokens[0]}
              token1={farm.tokens[1]}
              totalStakedInUSD={farm.totalStakedInUSD}
              version={farm.ID}
              doubleRewards={farm.doubleRewards}
              inStaging={farm.inStaging}
              doubleRewardToken={farm.doubleRewardToken}
            />
          ))}
        </PoolSection>
      </AutoColumn>
      <AutoColumn gap="lg" style={{ width: '100%' }}>
        <DataRow style={{ alignItems: 'baseline' }}>
          <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>Participating Pools</TYPE.mediumHeader>
        </DataRow>

        <PoolSection>
          {filteredFarms.map(farm => (
            <MemoizedPoolCardTRI
              key={farm.ID}
              apr={farm.apr}
              apr2={farm.apr2}
              chefVersion={farm.chefVersion}
              isPeriodFinished={farm.isPeriodFinished}
              stakedAmount={farm.stakedAmount}
              token0={farm.tokens[0]}
              token1={farm.tokens[1]}
              totalStakedInUSD={farm.totalStakedInUSD}
              version={farm.ID}
              doubleRewards={farm.doubleRewards}
              inStaging={farm.inStaging}
              doubleRewardToken={farm.doubleRewardToken}
            />
          ))}
        </PoolSection>
      </AutoColumn>
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
              stakedAmount={farm.stakedAmount}
              token0={farm.tokens[0]}
              token1={farm.tokens[1]}
              totalStakedInUSD={farm.totalStakedInUSD}
              version={farm.ID}
              doubleRewards={farm.doubleRewards}
              inStaging={farm.inStaging}
              doubleRewardToken={farm.doubleRewardToken}
            />
          ))}
        </PoolSection>
      </AutoColumn>
    </PageWrapper>
  )
}
