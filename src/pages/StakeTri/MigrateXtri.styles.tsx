import styled from 'styled-components'

import { AutoColumn } from '../../components/Column'

export const StyledContainer = styled(AutoColumn)<{ disabled?: boolean }>`
// TODO: Decide on bg color 
// background: linear-gradient(90deg, #2474cc 0%, #7f7f7f 90%);
// background: rgb(36, 38, 76);
background: #191b35
border-radius: 10px;
width: 100%;
padding: 2rem;
`

export const StepsContainer = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
  grid-column-gap: 20px;
`

export const StyledStepNumber = styled.div`
  font-size: 7rem;
  justify-self: center;
  max-width: 150px;
`

export const StyledStepNumberDone = styled(StyledStepNumber)`
  font-size: 3rem;
  align-self: center;
  min-width: 150px;
`
