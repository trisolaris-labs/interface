import styled from 'styled-components'
import { lighten, darken } from 'polished'

import { TYPE } from '../../theme'
import Card from '../Card'
import { ButtonPrimary } from '../Button'

export const Wrapper = styled(Card)<{
  bgColor1: string | null
  bgColor2?: string | null
  isDoubleRewards: boolean
  currenciesQty: number
}>`
  border: ${({ isDoubleRewards, theme }) =>
    isDoubleRewards ? `1px solid ${theme.primary1}` : `1px solid ${theme.bg3};`};
  border-radius: 10px;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 12px;
  box-shadow: ${({ isDoubleRewards, theme }) =>
    isDoubleRewards ? `0px 0px 8px 5px ${theme.primary1}` : `0 2px 8px 0 ${theme.bg3}`};
  position: relative;

  padding-left: ${({ currenciesQty }) => (currenciesQty > 3 ? '10px' : '20px')};
  padding-right: ${({ currenciesQty }) => (currenciesQty > 3 ? '10px' : '20px')};
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

export const StyledActionsContainer = styled.div`
  display: flex;
`

export const TokenPairBackgroundColor = styled.span<{ bgColor1: string | null; bgColor2?: string | null }>`
  background: ${({ theme, bgColor1, bgColor2 }) =>
    `linear-gradient(90deg, ${bgColor1 ?? theme.blue1} 0%, ${bgColor2 ?? 'grey'} 90%);`};
  background-size: cover;
  mix-blend-mode: overlay;
  border-radius: 10px;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  position: absolute;
  top: 0;
  left: 0;
  user-select: none;
`