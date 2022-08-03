import styled from 'styled-components'

import AddToMetaMaskButton from '../../components/AddToMetaMask'

export const WarningWrapper = styled.div`
  max-width: 420px;
  width: 100%;
  margin: 0 0 2rem 0;
`

export const Root = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  min-height: 80vh;
`

export const SwapContainer = styled.div`
  display: flex;
  flex: 1 1 420px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 420px;
  height: 100%;
  position: relative;
`

export const IconContainer = styled.div`
  margin-right: 10em;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
`};
  ${({ theme }) => theme.mediaWidth.upToLarge`
      & > * {
          height: 400px;
      }
`};
`

export const HeadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const HeaderButtonsContainer = styled.div`
  display: flex;
`

export const StyledAddToMetaMaskButton = styled(AddToMetaMaskButton)<{ swapDetailsOpen: boolean }>`
  position: absolute;
  top: ${({ swapDetailsOpen }) => (swapDetailsOpen ? '' : '440px')};
  bottom: ${({ swapDetailsOpen }) => (swapDetailsOpen ? '-30px' : '')};
  color: ${({ theme }) => theme.white}
  text-decoration: underline;
`
