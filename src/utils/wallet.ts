import { getTokenLogoURL } from '../components/CurrencyLogo'

export const registerToken = async (
  tokenAddress: string,
  tokenSymbol: string,
  tokenDecimals: number,
  tokenLogoUrl?: string
) => {
  const doesImageExist = (url: string): Promise<boolean> =>
    new Promise(resolve => {
      const img = new Image()

      img.src = url
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
    })

  const logoUrls = getTokenLogoURL(tokenAddress)

  const availableLogos = await Promise.all(logoUrls.map(async url => ({ url: url, exists: await doesImageExist(url) })))
  const src: string | undefined = availableLogos.find(logo => logo.exists)?.url
  const image = tokenLogoUrl ?? src

  try {
    const wasAdded = await (window as any).ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: tokenAddress,
          symbol: tokenSymbol,
          decimals: tokenDecimals,
          image
        }
      }
    })

    if (wasAdded) {
      return wasAdded
    }
  } catch (error) {
    console.log(error)
  }
}
