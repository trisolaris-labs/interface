import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { darken } from 'polished'

import { FixedHeightRow } from '../../../PositionCard/PositionCard.styles'
import { RowBetween } from '../../../Row'
import { AutoColumn } from '../../../Column'
import CurrencyLogo from '../../../CurrencyLogo'

export const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
`
export const ExpandableStakedContainer = styled(FixedHeightRow)`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display:flex;
  `};
`

export const ActionsContainer = styled.div`
  display: flex;
  min-width: 110px;
  justify-content: center;
  height: 34px;
`

export const RewardRow = styled(RowBetween)`
  font-size: 14px;
`

export const RewardsContainer = styled(AutoColumn)`
  flex: 1;
  max-width: 200px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    max-width:100%;
  `};
`

export const StyledCurrencyLogo = styled(CurrencyLogo)`
  margin-right: 5px;
`

export const OtherDataAndLinksContainer = styled.div`
  justify-content: flex-end;
  justify-self: flex-end;
  display: flex;
  flex-direction: column;
`

export const StyledLink = styled(Link)`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 15px;
  margin: 0;
  font-weight: 500;
  justify-content: space-between;

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }

  &:hover {
    text-decoration: underline;
  }
`
