import styled from 'styled-components'
import { darken } from 'polished'

import BalanceButton from '../BalanceButton'

export const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`

export const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 0.5rem 0 1rem;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.text2)};
  }
`

export const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme }) => theme.bg3};
  z-index: 1;
`

export const Container = styled.div`
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.bg3};
  background-color: ${({ theme }) => theme.bg3};
`

export const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.75rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size:  ${({ active }) => (active ? '20px' : '16px')};

`

export const StyledBalanceButton = styled(BalanceButton)`
  width: 78px;
  height: 24px;
  margin-left: 10px;
`
