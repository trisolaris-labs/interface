import React from 'react'
import { ButtonOutlined, ButtonSecondary } from '../../components/Button'

type Props = {
  tokenIndex: number | null
  onSelectTokenIndex: (value: number | null) => void
}

export default function StableSwapRemoveLiquidityTokenSelector({ tokenIndex, onSelectTokenIndex }: Props) {
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
      {/*
       TODO: Uncomment when better liquidity in stableswap pool to allow uneven liquidity removals
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
      })} */}
    </>
  )
}
