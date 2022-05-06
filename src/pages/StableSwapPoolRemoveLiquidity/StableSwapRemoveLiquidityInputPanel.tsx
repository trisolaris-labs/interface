import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'

import { RowBetween } from '../../components/Row'
import { Input as NumericalInput } from '../../components/NumericalInput'
import { Props as BalanceButtonProps } from '../../components/BalanceButton'

import { useActiveWeb3React } from '../../hooks'
import { useTranslation } from 'react-i18next'

import { TYPE } from '../../theme'

import {
  InputRow,
  LabelRow,
  Aligner,
  InputPanel,
  Container,
  StyledTokenName,
  StyledBalanceButton
} from './StableSwapPoolRemoveLiquidity.styles'
import { StableSwapPoolName, STABLESWAP_POOLS } from '../../state/stableswap/constants'
import useStablePoolsData from '../../hooks/useStablePoolsData'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import CurrencyLogo from '../../components/CurrencyLogo'
import { TokenAmount } from '@trisolaris/sdk'
import { addCommasToNumber } from '../../utils'

type Props = {
  id: string
  stableSwapPoolName: StableSwapPoolName
  hideInput?: boolean
  usdEstimate: TokenAmount | null
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
}

export default function StableSwapRemoveLiquidityInputPanel({
  id,
  onMax,
  onUserInput,
  stableSwapPoolName,
  usdEstimate,
  value,
  disableMaxButton,
  disableHalfButton,
  onClickBalanceButton
}: Props & BalanceButtonProps) {
  const { t } = useTranslation()
  const [_poolData, userShareData] = useStablePoolsData(stableSwapPoolName)
  const currency = unwrappedToken(STABLESWAP_POOLS[stableSwapPoolName].lpToken)

  const { account } = useActiveWeb3React()
  const theme = useContext(ThemeContext)

  return (
    <InputPanel id={id}>
      <Container>
        <LabelRow>
          <RowBetween>
            {account ? (
              <TYPE.body
                id={'remove-liquidity-balance'}
                onClick={onMax}
                color={theme.text2}
                fontWeight={500}
                fontSize={14}
                style={{ display: 'inline', cursor: 'pointer' }}
              >
                {!!currency ? t('currencyInputPanel.balance') + userShareData?.lpTokenBalance?.toSignificant(6) : ' -'}
              </TYPE.body>
            ) : null}
            {account && currency ? (
              <StyledBalanceButton
                onClickBalanceButton={onClickBalanceButton}
                disableMaxButton={disableMaxButton}
                disableHalfButton={disableHalfButton}
              />
            ) : null}
          </RowBetween>
        </LabelRow>
        <InputRow selected={true}>
          <NumericalInput className="token-amount-input" value={value} onUserInput={onUserInput} />
          {usdEstimate != null ? (
            <span style={{ marginRight: '8px' }}>(${addCommasToNumber(usdEstimate.toFixed(2))})</span>
          ) : null}
          <div>
            <Aligner>
              <CurrencyLogo currency={currency} size={'24px'} />
              <StyledTokenName className="token-symbol-container" active={Boolean(currency && currency.symbol)}>
                {(currency && currency.symbol && currency.symbol.length > 20
                  ? currency.symbol.slice(0, 4) +
                    '...' +
                    currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                  : currency?.symbol) || t('currencyInputPanel.selectToken')}
              </StyledTokenName>
            </Aligner>
          </div>
        </InputRow>
      </Container>
    </InputPanel>
  )
}
