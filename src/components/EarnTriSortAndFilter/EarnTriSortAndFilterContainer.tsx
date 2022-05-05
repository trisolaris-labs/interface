import React from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'rebass'
import Toggle from '../Toggle'
import { useToggleFilterActiveFarms } from '../../state/user/hooks'

import {
  StyledSearchInput,
  StyledFiltersContainer,
  StyledToggleContainer,
  StyledSortContainer,
  StyledSortOption,
  StyledArrowContainer
} from '../../pages/EarnTri/EarnTri.styles'
import { SortingType } from './EarnTriSortAndFilterSortingType'
import SortingArrow from './SortingArrow'

export default function EarnTriSortAndFilterContainer({
  activeFarmsFilter,
  handleSort,
  isSortDescending,
  onInputChange,
  sortBy
}: {
  activeFarmsFilter: boolean
  handleSort: (sortingType: SortingType) => void
  isSortDescending: boolean
  onInputChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
  sortBy: SortingType
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
          <Text fontWeight={400} fontSize={16}>
            Sort by:{' '}
            <StyledSortOption onClick={() => handleSort(SortingType.liquidity)}>
              {SortingType.liquidity}
              <StyledArrowContainer>
                {sortBy === SortingType.liquidity && <SortingArrow isDescending={isSortDescending} />}
              </StyledArrowContainer>
            </StyledSortOption>
            |
            <StyledSortOption style={{ marginLeft: '1rem' }} onClick={() => handleSort(SortingType.totalApr)}>
              {SortingType.totalApr}
              <StyledArrowContainer>
                {sortBy === SortingType.totalApr && <SortingArrow isDescending={isSortDescending} />}
              </StyledArrowContainer>
            </StyledSortOption>
          </Text>
        </StyledSortContainer>
      </StyledFiltersContainer>
    </>
  )
}
