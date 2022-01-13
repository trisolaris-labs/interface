import React, { useContext } from 'react'
import { AlertCircle, CheckCircle } from 'react-feather'
import styled, { ThemeContext } from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { TYPE } from '../../theme'
import { ExternalLink } from '../../theme/components'
import { getEtherscanLink } from '../../utils'
import { AutoColumn } from '../Column'
import { AutoRow } from '../Row'
import { useTranslation } from 'react-i18next'

const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
`

export default function ErrorAlertPopup({ content }: { content?: string }) {
  const theme = useContext(ThemeContext)

  return (
    <RowNoFlex>
      <div style={{ paddingRight: 16 }}>
        <AlertCircle color={theme.red1} size={24} />
      </div>
      <AutoColumn gap="8px">
        <TYPE.body fontWeight={500}>{content}</TYPE.body>
        <AutoRow justifyContent="space-between">
          <ExternalLink href="https://twitter.com/trisolarislabs">Twitter</ExternalLink>
          <ExternalLink href="http://discord.gg/my6GtSTmmX">Discord</ExternalLink>
          <ExternalLink href="https://t.me/TrisolarisLabs">Telegram</ExternalLink>
        </AutoRow>
      </AutoColumn>
    </RowNoFlex>
  )
}
