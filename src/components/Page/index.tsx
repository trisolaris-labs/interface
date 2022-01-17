import styled from 'styled-components'
import { AutoColumn } from '../Column'

export const PageWrapper = styled(AutoColumn)`
  max-width: ${({ theme }) => theme.pageWidth};
  width: 100%;
`
