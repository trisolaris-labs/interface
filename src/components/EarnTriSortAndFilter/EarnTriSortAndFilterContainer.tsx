import React from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'rebass'
import Toggle from '../Toggle'
import { useToggleFilterActiveFarms } from '../../state/user/hooks'

import Select, { OptionProps } from '../Select'

import {
  StyledSearchInput,
  StyledFiltersContainer,
  StyledToggleContainer,
  StyledSortContainer,
  StyledSortOption,
  StyledArrowContainer
} from '../../pages/EarnTri/EarnTri.styles'

import SortingArrow from './SortingArrow'
import { SortingType } from '../../pages/EarnTri/useFarmsSortAndFilter'

const SORT_OPTIONS = [
  { label: 'PoolType', value: 'default' },
  { label: 'Liquidity', value: 'liquidity' },
  { label: 'APR', value: 'totalApr' }
]

export default function EarnTriSortAndFilterContainer({
  activeFarmsFilter,
  handleSort,
  isSortDescending,
  onInputChange
}: {
  activeFarmsFilter: boolean
  handleSort: (sortingType: SortingType) => void
  isSortDescending: boolean
  onInputChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
}) {
  const { t } = useTranslation()
  const toggleActiveFarms = useToggleFilterActiveFarms()

  return (
    <>
      <StyledSearchInput placeholder={t('earnPage.farmsSearchPlaceholder')} onChange={onInputChange} />
      <StyledFiltersContainer>
        <StyledToggleContainer>
          <Text fontWeight={400} fontSize={16} marginRight={20}>
            {`${t('earnPage.filterUserPools')}: `}
          </Text>

          <Toggle id="toggle-user-farms-toggle" isActive={activeFarmsFilter} toggle={toggleActiveFarms} />
        </StyledToggleContainer>
        <StyledSortContainer>
          <Text fontWeight={400} fontSize={16} marginRight={20}>
            Sort by:
          </Text>
          <Select options={SORT_OPTIONS} onOptionChange={(option: OptionProps) => handleSort(option.value)} />
        </StyledSortContainer>
      </StyledFiltersContainer>
    </>
  )
}
