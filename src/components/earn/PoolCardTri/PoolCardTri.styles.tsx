import styled from 'styled-components'
import { lighten } from 'polished'

import { TYPE } from '../../../theme'
import Card from '../../Card'
import { ButtonPrimary } from '../../Button'
import { AutoColumn } from '../../Column'
import CurrencyLogo from '../../CurrencyLogo'
import { RowBetween } from '../../Row'
import MultipleCurrencyLogo from '../../MultipleCurrencyLogo'
import ClaimableRewards from './ClaimableRewards'

export const Wrapper = styled(Card)<{
  bgColor1: string | null
  bgColor2?: string | null
  isFeatured?: boolean
  currenciesQty: number
}>`
  border: ${({ theme }) => `1px solid ${theme.bg3};`};
  border-radius: 0px;
  gap: 12px;
  position: relative;
  padding: 10px 20px 16px 20px;
  display: grid;
  grid-auto-rows: auto;

  overflow: hidden;
  &:first-child {
    border-radius: 10px 10px 0 0;
  }
  &:last-child {
    border-radius: 0 0 10px 10px;
  }

  &:hover {
    background: #12141a36;
    cursor: pointer;
    box-shadow: ${({ theme }) => `1px solid ${theme.bg3};`};
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
        padding-left: 10px;
        padding-right: 10px;
    `};
`

export const PairContainer = styled.div`
  display: flex;
  align-items: center;
`

export const ResponsiveCurrencyLabel = styled(TYPE.white)<{ currenciesQty: number }>`
  font-size: ${({ currenciesQty }) => `${currenciesQty > 3 ? '14px' : '16px'} !important;`}
  margin-left: 0.5rem !important;
  max-width: 150px;
  justify-self:flex-start;
  ${({ theme }) => theme.mediaWidth.upToSmall`
      font-size: 14px !important;
      max-width: 200px;
  `};
`

export const Button = styled(ButtonPrimary)<{ isStaking: boolean }>`
  background: ${({ isStaking, theme }) => (isStaking ? theme.black : theme.primary1)};
  padding: 8px;
  border-radius: 10px;
  max-width: 80px;
  ${({ isStaking, theme }) =>
    isStaking &&
    `
        min-width: fit-content;
        max-width: fit-content;
        &:focus, &:hover, &:active {
            background-color: ${lighten(0.12, theme.black)};
        }
  `}

  ${({ theme }) => theme.mediaWidth.upToSmall`
        padding: 4px;
        border-radius: 5px;
    `};
`

export const TokenPairBackgroundColor = styled.span<{ bgColor1: string | null; bgColor2?: string | null }>`
  background: ${({ theme, bgColor1, bgColor2 }) =>
    `linear-gradient(90deg, ${bgColor1 ?? theme.blue1} 0%, ${bgColor2 ?? 'grey'} 90%);`};
  background-size: cover;
  mix-blend-mode: overlay;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  position: absolute;
  top: 0;
  left: 0;
  user-select: none;
  z-index: -1;
`

export const StyledPairContainer = styled(PairContainer)`
  max-width: 200px;
  justify-self: flex-start;
`

export const CardContainer = styled.div`
  display: grid;
  grid-template-columns: 220px auto 110px 150px 100px;
  row-gap: 20px;
  width: 100%;
  align-items: center;
  justify-items: center;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: 220px auto auto 80px;
 `};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    grid-template-columns: 180px  auto 85px;
  `};
  ${({ theme }) => theme.mediaWidth.upToXxSmall`
    grid-template-columns: 150px 79px 90px
  `};
`

export const DetailsContainer = styled.div`
  align-items: center;
  position: absolute;
  right: 15px;
  top: 20px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    right:10px;
    top: 25px;
  `};
`

export const StyledMutedSubHeader = styled(TYPE.mutedSubHeader)`
  display: flex;
`

export const RewardColumn = styled.div`
  font-size: 14px;
  display: flex;
  align-items: center;
`

export const RewardsContainer = styled(AutoColumn)`
  flex: 1;
  max-width: 200px;
  justify-self: start;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    max-width:100%;
  `};
`

export const StyledCurrencyLogo = styled(CurrencyLogo)`
  margin-right: 5px;
`

export const StyledRewardAmount = styled.span`
  max-width: 60px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const StyledLongClaimableHeader = styled(TYPE.mutedSubHeader)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display:none;
  `};
`

export const StyledShortClaimableHeader = styled(TYPE.mutedSubHeader)`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display:block;
  `};
`

export const StyledRewardsAmountContainer = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    flex-direction: column;
    align-items:flex-start;
  `};
`

export const StakedContainer = styled(AutoColumn)`
  min-width: 100px;
  justify-content: flex-start;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display:none;
  `};
`

export const AprContainer = styled(AutoColumn)`
  min-width: 50px;
  justify-content: flex-start;
  justify-self: start;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    justify-self: start;
  `};
`

export const PoolTypeContainer = styled.div`
  min-width: 100px;
  justify-content: flex-start;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display:none;
  `};
`

export const StakedMobilecontainer = styled(AutoColumn)`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display:grid;
    grid-column-start:3;
    font-size:14px;
    max-width:80px;
    justify-self:start;
  `};
`

export const StyledMultipleCurrencyLogo = styled(MultipleCurrencyLogo)`
  img {
    width: 20px;
    height: 20px;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    img {
      width: 18px;
      height: 18px;
    }
  `};

  ${({ theme }) => theme.mediaWidth.upToXxSmall`
    img {
      width: 16px;
      height: 16px;
    }
  `};
`

export const ButtonWrapper = styled.div`
  font-size: 16px;
  width: 100%;
  max-width: 74px;
  justify-self: start;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 14px;
    max-width: 55px;
  `};
`

export const StyledClaimableRewards = styled(ClaimableRewards)`
  grid-row: 2;
  grid-column: 1 2;
`

export const DepositsContainer = styled(AutoColumn)`
  grid-row: 2;
  grid-column-start: span 2;
  grid-column-end: 4;
  justify-self: start;
`
