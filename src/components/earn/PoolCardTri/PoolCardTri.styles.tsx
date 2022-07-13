import styled from 'styled-components'
import { lighten } from 'polished'

import { TYPE } from '../../../theme'
import Card from '../../Card'
import { ButtonPrimary } from '../../Button'
import { AutoColumn } from '../../Column'

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
  padding: 0.75rem;
  padding-left: ${({ currenciesQty }) => (currenciesQty > 3 ? '10px' : '20px')};
  padding-right: ${({ currenciesQty }) => (currenciesQty > 3 ? '10px' : '20px')};

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
      grid-template-rows: auto 1fr;
      padding: 1.1rem .75rem;
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
  ${({ theme }) => theme.mediaWidth.upToSmall`
      font-size: 14 !important;
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

export const ActionsContainer = styled.div`
  display: flex;
  min-width: 110px;
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  order:2;
  `};
`

export const StyledPairContainer = styled(PairContainer)`
  min-width: 200px;
  max-width: 200px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  order:1;
  `};
`

export const StakedContainer = styled(AutoColumn)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
  order:3;
  margin-top:15px;
  `};
`

export const AprContainer = styled(AutoColumn)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
  order:4;
  margin-top:15px;
  `};
`

export const CardContainer = styled.div`
  display: grid;
  grid-template-columns: 200px auto auto 110px;
  width: 100%;
  align-items: center;
  justify-items: center;
`

export const CardExpandableContainer = styled.div`
  margin-top: 10px;
`
