import React from 'react'
import styled from 'styled-components'
import { ButtonOutlined, ButtonSecondary } from '../../components/Button'
import CurrencyLogo from '../../components/CurrencyLogo'
import { StableSwapPoolName, STABLESWAP_POOLS } from '../../state/stableswap/constants'
import { unwrappedToken } from '../../utils/wrappedCurrency'

const CurrencySymbol = styled('span')`
  margin-left: 4px;
`

type Props = {
  stableSwapPoolName: StableSwapPoolName
  tokenIndex: number | null
  onSelectTokenIndex: (value: number | null) => void
}

export default function StableSwapRemoveLiquidityTokenSelector({
  stableSwapPoolName,
  tokenIndex,
  onSelectTokenIndex
}: Props) {
  const { poolTokens } = STABLESWAP_POOLS[stableSwapPoolName]
  const currencies = poolTokens.map(token => unwrappedToken(token))

  const AllButton = tokenIndex === null ? ButtonSecondary : ButtonOutlined

  return (
    <>
      <AllButton
        margin="4px"
        padding="8px"
        borderRadius="8px"
        maxWidth="fit-content"
        onClick={() => onSelectTokenIndex(null)}
      >
        All
      </AllButton>
      {currencies.map((currency, i) => {
        const Button = tokenIndex === i ? ButtonSecondary : ButtonOutlined

        return (
          <Button
            key={currency.symbol}
            margin="4px"
            padding="8px"
            borderRadius="8px"
            maxWidth="fit-content"
            onClick={() => onSelectTokenIndex(i)}
          >
            <CurrencyLogo currency={currency} size={'24px'} />
            <CurrencySymbol>
              {currency && currency.symbol && currency.symbol.length > 20
                ? currency.symbol.slice(0, 4) +
                  '...' +
                  currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                : currency?.symbol}
            </CurrencySymbol>
          </Button>
        )
      })}
    </>
  )
}
