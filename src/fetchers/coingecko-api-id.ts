import useSWR from 'swr'

export interface Coin {
  id: string
  name: string
  api_symbol: string
  symbol: string
}

interface CoinGeckoSearchResponse {
  coins: Array<Coin>
}

const fetcher = async (url: string, tokenName: string): Promise<Coin> => {
  const response = await fetch(`${url}?query=${encodeURIComponent(tokenName)}`)
  if (response.ok) {
    const data: CoinGeckoSearchResponse = await response.json()
    if (data && data.coins) {
      const coin: Coin | undefined = data.coins?.find(({ symbol }) => symbol.toLowerCase() === tokenName.toLowerCase())
      if (!coin) {
        throw new Error('No coins found')
      }
      // eslint-disable-next-line @typescript-eslint/camelcase
      return { id: coin.id, name: coin.name, api_symbol: coin.api_symbol, symbol: coin.symbol }
    } else {
      throw new Error('No coins found')
    }
  }

  throw new Error('response not ok')
}

const useCoinSearch = (tokenName: string | undefined) => {
  const { data, error } = useSWR<Coin, Error>(
    tokenName ? [`https://api.coingecko.com/api/v3/search`, tokenName] : null,
    fetcher
  )
  if (error) {
    console.error(error)
  }

  return {
    coin: data,
    isLoading: !error && !data,
    error
  }
}

export default useCoinSearch
