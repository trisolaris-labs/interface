import styled from 'styled-components'

import AddToMetamaskButton from '../../components/AddToMetamask'

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

export const StyledAddToMetamaskButton = styled(AddToMetamaskButton)`
  margin-right: 10px;
`
