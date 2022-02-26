import React from 'react'
import { useTranslation } from 'react-i18next'
import { TYPE } from '../../theme'
import { RowFlat } from '../Row'
import { StyledBalanceLeftButton, StyledBalanceRightButton } from './BalanceButton.styles'
import BalanceButtonValueEnum from './BalanceButtonValueEnum'

export type Props = {
  disableHalfButton?: boolean
  disableMaxButton?: boolean
  onClickBalanceButton?: (value: BalanceButtonValueEnum) => void
  height?: number
}

export default function BalanceButton({
  disableHalfButton,
  disableMaxButton,
  onClickBalanceButton,
  height,
  ...rest
}: Props) {
  const { t } = useTranslation()

  if (onClickBalanceButton == null) {
    return null
  }

  return (
    <RowFlat style={{ marginLeft: '4px'}} {...rest}>
      <StyledBalanceLeftButton
        disabled={disableHalfButton}
        onClick={() => onClickBalanceButton(BalanceButtonValueEnum.HALF)}
        height={height ?? 16}
      >
        <TYPE.small>50%</TYPE.small>
      </StyledBalanceLeftButton>
      <StyledBalanceRightButton
        disabled={disableMaxButton}
        onClick={() => onClickBalanceButton(BalanceButtonValueEnum.MAX)}
        height={height ?? 16}
      >
        <TYPE.small>{t('currencyInputPanel.max')}</TYPE.small>
      </StyledBalanceRightButton>
    </RowFlat>
  )
}
