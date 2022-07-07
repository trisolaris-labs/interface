import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { AlertCircle, CheckCircle } from 'lucide-react'

import { AutoColumn } from '../Column'
import { AutoRow } from '../Row'

const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
  align-items: center;
`

export enum ICON_TYPES {
  ALERT = 'alert',
  SUCCESS = 'success'
}

export default function CustomPopup({ text, icon }: { text: string; icon?: ICON_TYPES }) {
  return (
    <RowNoFlex>
      {icon && <div style={{ paddingRight: 16 }}>{icon === ICON_TYPES.ALERT ? <AlertCircle /> : <CheckCircle />}</div>}
      <AutoColumn gap="8px">{text}</AutoColumn>
    </RowNoFlex>
  )
}
