import React from 'react'
import { ArrowLeft } from 'react-feather'
import { Link as HistoryLink, useHistory } from 'react-router-dom'
import styled from 'styled-components'

const StyledArrowLeft = styled(ArrowLeft)`
  color: ${({ theme }) => theme.text1};
`

export default function BackButton({ fallbackPath }: { fallbackPath: string }) {
  const history = useHistory()
  return (
    <HistoryLink
      to="#"
      onClick={e => {
        e.preventDefault()
        if (history.length > 0) {
          history.goBack()
        } else {
          history.push(fallbackPath)
        }
      }}
    >
      <StyledArrowLeft />
    </HistoryLink>
  )
}
