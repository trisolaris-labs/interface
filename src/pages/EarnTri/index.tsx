import React, { useState } from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { TYPE, ExternalLink } from '../../theme'
import PoolCard from '../../components/earn/PoolCardTri'
import { RouteComponentProps } from 'react-router-dom'
import { RowBetween } from '../../components/Row'
import { CardSection, DataCard, CardNoise, CardBGImage, HighlightCard } from '../../components/earn/styled'
import { useTranslation } from 'react-i18next'
import { useFarms } from '../../state/stake/apr'
import { PageWrapper } from '../../components/Page'
import PoolCardTRI from '../../components/earn/PoolCardTri'
import FarmBanner from '../../components/earn/FarmBanner'

const TopSection = styled(AutoColumn)`
  max-width: ${({ theme }) => theme.pageWidth};
  width: 100%;
`

const PoolSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  width: 100%;
  justify-self: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: 1fr;
 `};
`

const DataRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
   flex-direction: column;
 `};
`

const SortSection = styled.div`
  display: flex;
`
const SortField = styled.div`
  margin: 0px 5px 0px 5px;
  font-weight: 400;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  line-height: 20px;
`

const SortFieldContainer = styled.div`
  display: flex;
  ${({ theme }) => theme.mediaWidth.upToSmall`
   display: none;
 `};
`

enum SortingType {
  totalStakedInWavax = 'totalStakedInWavax',
  multiplier = 'multiplier',
  totalApr = 'totalApr'
}

const POOLS_ORDER = [5, 11, 8, 7, 0, 1, 2, 3, 4, 9, 10, 12, 13, 14]
const LEGACY_POOLS = [6]

export default function Earn({
  match: {
    params: { version }
  }
}: RouteComponentProps<{ version: string }>) {
  const { t } = useTranslation()
  const farmArrs = useFarms()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const farmArrsInOrder = POOLS_ORDER.map(index => farmArrs[index])
  const legacyFarmArrsInOrder = LEGACY_POOLS.map(index => farmArrs[index])

  const dualRewardPools = farmArrsInOrder.filter(farm => farm.doubleRewards)
  const nonDualRewardPools = farmArrsInOrder.filter(farm => !farm.doubleRewards)

  return (
    <PageWrapper gap="lg" justify="center">
      <FarmBanner />
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
        <DataRow style={{ alignItems: 'baseline' }}>
          <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>Dual Rewards Pools</TYPE.mediumHeader>
        </DataRow>
        <PoolSection>
          {dualRewardPools.map(farm => (
            <PoolCardTRI
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
          {nonDualRewardPools.map(farm => (
            <PoolCardTRI
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
            <PoolCardTRI
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
