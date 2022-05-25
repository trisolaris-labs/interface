import styled from 'styled-components'

import { AutoColumn } from '../../components/Column'

export const StyledContainer = styled(AutoColumn)<{ disabled?: boolean }>`
background: #0e3f69
border-radius: 10px;
width: 100%;
padding: 1rem 2rem;
border: 1px solid #1350ff;
box-shadow:0px 0px 8px 5px #1350ff;
`

export const StepsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
`

export const StyledStepNumber = styled.div`
  font-size: 7rem;
  justify-self: center;
  max-width: 150px;
`

export const StyledStepNumberDone = styled(StyledStepNumber)`
  font-size: 2rem;
  align-self: center;
  min-width: 150px;
`

export const StyledAutoColumn = styled(AutoColumn)`
  max-width: 230px;
  align-items: center;
  justify-items: center;
  text-align: center;
`
