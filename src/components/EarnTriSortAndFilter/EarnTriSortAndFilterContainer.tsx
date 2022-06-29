import React from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'rebass'
import Toggle from '../Toggle'
import { useToggleFilterActiveFarms, useToggleFarmsView } from '../../state/user/hooks'

import { LayoutGrid, List } from 'lucide-react'

import {
  StyledSearchInput,
  StyledFiltersContainer,
  StyledToggleContainer,
  StyledSortContainer,
  StyledSortOption,
  StyledArrowContainer,
  StyledFarmsViewContainer
} from '../../pages/EarnTri/EarnTri.styles'
import { SortingType } from './EarnTriSortAndFilterSortingType'
import SortingArrow from './SortingArrow'

export default function EarnTriSortAndFilterContainer({
  activeFarmsFilter,
  handleSort,
  isSortDescending,
  onInputChange,
  sortBy,
  farmsGridView
}: {
  activeFarmsFilter: boolean
  handleSort: (sortingType: SortingType) => void
  isSortDescending: boolean
  onInputChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
  sortBy: SortingType
  farmsGridView: boolean
}) {
  const { t } = useTranslation()
  const toggleActiveFarms = useToggleFilterActiveFarms()
  const toggleFarmsView = useToggleFarmsView()

  return (
    <>
      <StyledSearchInput placeholder={t('earnPage.farmsSearchPlaceholder')} onChange={onInputChange} />
      <StyledFiltersContainer>
        <StyledToggleContainer>
          <Text fontWeight={400} fontSize={16} marginRight={10}>
            {`${t('earnPage.filterUserPools')}: `}
          </Text>

          <Toggle id="toggle-user-farms-toggle" isActive={activeFarmsFilter} toggle={toggleActiveFarms} />
        </StyledToggleContainer>
        <StyledFarmsViewContainer>
          <Text fontWeight={400} fontSize={16} marginRight={10}>
            {`Layout:`}
          </Text>

          <Toggle
            id="toggle-farms-view-toggle"
            customToggleText={{ on: <LayoutGrid size={20} />, off: <List size={20} /> }}
            isActive={farmsGridView}
            toggle={() => toggleFarmsView()}
            fontSize="12px"
          />
        </StyledFarmsViewContainer>

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
