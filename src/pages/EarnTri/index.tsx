import React, { useCallback, useEffect, useState } from 'react'
import { AutoColumn } from '../../components/Column'
import { ChevronDown, ChevronUp } from 'react-feather'
import styled from 'styled-components'
import { STAKING_REWARDS_INFO, useStakingInfo } from '../../state/stake/hooks'
import { TYPE, ExternalLink } from '../../theme'
import PoolCard from '../../components/earn/PoolCardTri'
import { RouteComponentProps, NavLink } from 'react-router-dom'
import { RowBetween } from '../../components/Row'
import { CardSection, DataCard, CardNoise, CardBGImage } from '../../components/earn/styled'
import Loader from '../../components/Loader'
import { useActiveWeb3React } from '../../hooks'
import { JSBI } from '@trisolaris/sdk'
import { useTranslation } from 'react-i18next'
import { SearchInput } from '../../components/SearchModal/styleds'
import useDebounce from '../../hooks/useDebounce'
import { usePositions } from '../../state/stake/hooks-sushi'
import { useFarms } from '../../state/stake/apr'

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const TopSection = styled(AutoColumn)`
  max-width: 720px;
  width: 100%;
`

const PoolSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  column-gap: 10px;
  row-gap: 15px;
  width: 100%;
  justify-self: center;
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

export default function Earn({
  match: {
    params: { version }
  }
}: RouteComponentProps<{ version: string }>) {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const stakingInfos = useStakingInfo(Number(version))
  const [poolCards, setPoolCards] = useState<any[]>()
  const [filteredPoolCards, setFilteredPoolCards] = useState<any[]>()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortBy, setSortBy] = useState<any>({ field: '', desc: true })
  const debouncedSearchQuery = useDebounce(searchQuery, 250)
  const [stakingInfoData, setStakingInfoData] = useState<any[]>(stakingInfos)

  const stakingInfoV0 = useStakingInfo(Number(0))
  const hasPositionV0 = stakingInfoV0?.some(stakingInfo => stakingInfo.stakedAmount.greaterThan('0'))

  const handleSearch = useCallback(event => {
    setSearchQuery(event.target.value.trim().toUpperCase())
  }, [])

  const farmArr = useFarms();

  useEffect(() => {
    const filtered = poolCards?.filter(
      card =>
        card.props.stakingInfo.tokens[0].symbol.toUpperCase().includes(debouncedSearchQuery) ||
        card.props.stakingInfo.tokens[1].symbol.toUpperCase().includes(debouncedSearchQuery)
    )
    setFilteredPoolCards(filtered)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolCards, debouncedSearchQuery])

   const getSortField = (label: string, field: string, sortBy: any, setSortBy: Function) => {
    return (
      <SortField
        onClick={() => {
          const desc = sortBy?.field === field ? !sortBy?.desc : true
          setSortBy({ field, desc })
        }}
      >
        {label}
        {sortBy?.field === field && (sortBy?.desc ? <ChevronDown size="16" /> : <ChevronUp size="16" />)}
      </SortField>
    )
  }


  useEffect(() => {
    Promise.all(
      farmArr
    ).then(stakingInfos => {
      const poolCards = stakingInfos.map(stakingInfo => (
        <PoolCard
          swapFeeApr={10}
          stakingApr={50}
          key={stakingInfo.stakingRewardAddress}
          stakingInfo={stakingInfo}
          version={stakingInfo.ID}
        />
      ))
      setStakingInfoData(stakingInfos)
      setPoolCards(poolCards)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stakingInfos?.length, version])


  return (
    <PageWrapper gap="lg" justify="center">
      <TopSection gap="md">
        <DataCard>
          <CardBGImage />
          <CardNoise />
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
          <CardBGImage />
          <CardNoise />
        </DataCard>
      </TopSection>
      
      <AutoColumn gap="lg" style={{ width: '100%', maxWidth: '720px' }}>
        <DataRow style={{ alignItems: 'baseline' }}>
          <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>{t('earnPage.participatingPools')}</TYPE.mediumHeader>
        </DataRow>

        <PoolSection>
            <>
              <SearchInput
                type="text"
                id="token-search-input"
                placeholder={t('searchModal.tokenName')}
                value={searchQuery}
                onChange={handleSearch}
              />
              <SortSection>
                Sort by :{' '}
                <SortFieldContainer>
                  {getSortField('Liquidity', SortingType.totalStakedInWavax, sortBy, setSortBy)} |{' '}
                  {getSortField('Pool Weight', SortingType.multiplier, sortBy, setSortBy)} |{' '}
                </SortFieldContainer>
                {getSortField('APR', SortingType.totalApr, sortBy, setSortBy)}
              </SortSection>

              {filteredPoolCards}
            </>
        </PoolSection>
      </AutoColumn>
    </PageWrapper>
  )
}
