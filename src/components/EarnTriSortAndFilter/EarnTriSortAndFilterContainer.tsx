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
  StyledSortContainer
} from '../../pages/EarnTri/EarnTri.styles'

import { SortingType } from '../../pages/EarnTri/useFarmsSortAndFilter'

const SORT_OPTIONS = [
  { label: 'PoolType', value: 'default' },
  { label: 'Liquidity', value: 'liquidity' },
  { label: 'APR', value: 'totalApr' }
]

export default function EarnTriSortAndFilterContainer({
  activeFarmsFilter,
  handleSort,
  onInputChange,
  isStaking
}: {
  activeFarmsFilter: boolean
  handleSort: (sortingType: SortingType) => void
  onInputChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
  isStaking: boolean
}) {
  const { t } = useTranslation()
  const toggleActiveFarms = useToggleFilterActiveFarms()

  return (
    <>
      <StyledSearchInput placeholder={t('earnPage.farmsSearchPlaceholder')} onChange={onInputChange} />
      <StyledFiltersContainer>
        {isStaking && (
          <StyledToggleContainer>
            <Text fontWeight={400} fontSize={16} marginRight={20}>
              {`${t('earnPage.filterUserPools')}: `}
            </Text>

            <Toggle id="toggle-user-farms-toggle" isActive={activeFarmsFilter} toggle={toggleActiveFarms} />
          </StyledToggleContainer>
        )}
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
