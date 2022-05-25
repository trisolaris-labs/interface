import styled from 'styled-components'

import { AutoColumn } from '../../components/Column'

export const StyledContainer = styled(AutoColumn)<{ disabled?: boolean }>`
background: #0e3f69
border-radius: 10px;
width: 100%;
padding: 2rem;
`

export const StepsContainer = styled.div`
  // display: grid;
  // grid-template-columns: auto auto auto;
  // grid-column-gap: 20px;
  display: flex;
  justify-content: space-around;
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

export const StyledAutoColumn = styled(AutoColumn)`
  max-width: 230px;
  align-items: center;
  justify-items: center;
  text-align: center;
`
