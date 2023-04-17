import { Currency } from '@trisolaris/sdk'
import React, { useEffect, useRef } from 'react'
import useCoinSearch, { Coin } from '../../fetchers/coingecko-api-id'
import styled from 'styled-components'

type Props = {
  coin: Coin | undefined
}

// NOTE - Can't style rendered coingecko script tag, cause it's external zzz
const CoingeckoContainer = styled.div`
  padding-top: 20px;
`

const CoinGeckoWidget: React.FC<Props> = ({ coin }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://widgets.coingecko.com/coingecko-coin-price-chart-widget.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (coin) {
      if (containerRef.current) {
        containerRef.current.innerHTML = '' // Clear the container

        const widget = document.createElement('coingecko-coin-price-chart-widget')
        widget.setAttribute('coin-id', coin.api_symbol)
        widget.setAttribute('currency', 'usd')
        widget.setAttribute('height', '500')
        widget.setAttribute('locale', 'en')
        containerRef.current.appendChild(widget)
      }
    }
  }, [coin])

  return <CoingeckoContainer ref={containerRef}></CoingeckoContainer>
}

export default CoinGeckoWidget
