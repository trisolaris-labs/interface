import React from 'react'
import { useTranslation } from 'react-i18next'

import BalanceButtonValueEnum from './BalanceButtonValueEnum'
import { TYPE } from '../../theme'

import { StyledBalanceLeftButton, StyledBalanceRightButton, StyledRowFlat } from './BalanceButton.styles'

export type Props = {
  disableHalfButton?: boolean
  disableMaxButton?: boolean
  onClickBalanceButton?: (value: BalanceButtonValueEnum) => void
}

export default function BalanceButton({ disableHalfButton, disableMaxButton, onClickBalanceButton, ...rest }: Props) {
  const { t } = useTranslation()

  if (onClickBalanceButton == null) {
    return null
  }

  return (
    <StyledRowFlat {...rest}>
      <StyledBalanceLeftButton
        disabled={disableHalfButton}
        onClick={() => onClickBalanceButton(BalanceButtonValueEnum.HALF)}
      >
        <TYPE.small>50%</TYPE.small>
      </StyledBalanceLeftButton>
      <StyledBalanceRightButton
        disabled={disableMaxButton}
        onClick={() => onClickBalanceButton(BalanceButtonValueEnum.MAX)}
      >
        <TYPE.small>{t('currencyInputPanel.max')}</TYPE.small>
      </StyledBalanceRightButton>
    </StyledRowFlat>
  )
}
