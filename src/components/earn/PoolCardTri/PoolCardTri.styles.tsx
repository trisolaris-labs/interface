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
  padding: 0.75rem 20px 0.75rem 20px;
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

export const ActionsContainer = styled.div`
  display: flex;
  min-width: 110px;
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        display:none;
  `};
`

export const StyledPairContainer = styled(PairContainer)`
  max-width: 200px;
  justify-self: flex-start;
  ${({ theme }) => theme.mediaWidth.upToXxSmall`
  order: 1;
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
  min-width: 100px;
  justify-content: flex-start;
  ${({ theme }) => theme.mediaWidth.upToXxSmall`
    order: 4;
  `};
`

export const CardContainer = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr 1fr 110px 20px;
  width: 100%;
  align-items: center;
  justify-items: center;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    // display:flex;
    // align-items: center;
    // justify-content: space-between;
    // flex-wrap: wrap;
    // row-gap:12px;
    grid-template-columns: 200px  1fr 110px 0.25fr;
   `};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    grid-template-columns: 185px  1fr 0.25fr;
  `};
`

export const CardExpandableContainer = styled.div`
  margin-top: 10px;
`

export const DetailsContainer = styled.div`
  // margin-left: 15px;
  // display: flex;
  align-items: center;
  position: absolute;
  right:15px;
  // ${({ theme }) => theme.mediaWidth.upToSmall`
  // order:5;
  // grid-column: span 2;
  // `};
`

// export const DetailsText = styled.span`
//   display: none;

//   ${({ theme }) => theme.mediaWidth.upToXxSmall`
//     display:flex;
//     font-size: 14px;
//   `};
// `

export const StyledMutedSubHeader = styled(TYPE.mutedSubHeader)`
  display: NONE;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  display:flex;
  `};
`
