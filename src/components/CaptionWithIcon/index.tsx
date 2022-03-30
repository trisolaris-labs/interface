import React, { useContext } from 'react'
import { Info } from 'react-feather'
import styled, { ThemeContext } from 'styled-components'
import { TYPE } from '../../theme'

const CaptionContainer = styled.span`
  display: inline-flex;
  align-items: center;
  margin-top: 0.25rem;
`

type Props = {
  children: React.ReactText
}

export default function CaptionWithIcon({ children }: Props) {
  const theme = useContext(ThemeContext)

  return (
    <CaptionContainer>
      <Info size="16" color={theme.text2} />
      <TYPE.small display="inline-block" marginLeft="4px">
        {children}
      </TYPE.small>
    </CaptionContainer>
  )
}
