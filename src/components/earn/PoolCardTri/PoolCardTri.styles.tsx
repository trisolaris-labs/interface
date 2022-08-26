import styled from 'styled-components'
import { lighten } from 'polished'

import { TYPE } from '../../../theme'
import Card from '../../Card'
import { ButtonPrimary } from '../../Button'
import { AutoColumn } from '../../Column'
import CurrencyLogo from '../../CurrencyLogo'
import { RowBetween } from '../../Row'
import { ButtonGold } from '../../Button'

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
  padding: 10px 20px 10px 20px;
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

export const StakedContainer = styled(AutoColumn)`
  min-width: 100px;
  justify-content: flex-start;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display:none;
  `};
`

export const AprContainer = styled(AutoColumn)`
  min-width: 100px;
  justify-content: flex-start;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  display:none;
`};
`

export const CardContainer = styled.div`
  display: grid;
  grid-template-columns: 200px 110px 110px 160px 80px;
  width: 100%;
  align-items: center;
  justify-items: center;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: 200px  1fr 110px 0.25fr;
   `};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    grid-template-columns: 180px  auto 75px;
  `};
  ${({ theme }) => theme.mediaWidth.upToXxSmall`
    grid-template-columns: 170px 80px 55px
  `};
`

export const DetailsContainer = styled.div`
  align-items: center;
  position: absolute;
  right: 15px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    right:7.5px;
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
