import { Contract } from '@ethersproject/contracts'
import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { BigNumber } from '@ethersproject/bignumber'
import IUniswapV2Router02_ABI from '../constants/abis/polygon/IUniswapV2Router02.json'
import { ETHERSCAN_PREFIXES } from '../constants/index'
import { ChainId, JSBI, Percent, Token, CurrencyAmount, Currency, CETH, ROUTER_ADDRESS } from '@trisolaris/sdk'
import { TokenAddressMap } from '../state/lists/hooks'
import { NETWORK_CHAIN_ID, network } from '../connectors'

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

export function getEtherscanLink(
  chainId: ChainId,
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block'
): string {
  const prefix = ETHERSCAN_PREFIXES[chainId]

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`
    }
    case 'token': {
      return `${prefix}/tokens/${data}`
    }
    case 'block': {
      return `${prefix}/block/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`
    }
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
}

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000))
}

export function calculateSlippageAmount(value: CurrencyAmount, slippage: number): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`)
  }
  return [
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)), JSBI.BigInt(10000)),
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)), JSBI.BigInt(10000))
  ]
}

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(
  library: Web3Provider,
  account?: string,
  chainId?: number
): Web3Provider | JsonRpcSigner {
  return account && chainId === NETWORK_CHAIN_ID
    ? getSigner(library, account)
    : (network.customProvider as Web3Provider)
}

// account is optional
export function getContract(
  address: string,
  ABI: any,
  library: Web3Provider,
  account?: string,
  chainId?: number
): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  const _provider = getProviderOrSigner(library, account, chainId)
  return new Contract(address, ABI, _provider)
}

// account is optional
export function getRouterContract(chainId: ChainId, library: Web3Provider, account?: string): Contract {
  return getContract(
    chainId ? ROUTER_ADDRESS[chainId] : ROUTER_ADDRESS[ChainId.POLYGON],
    IUniswapV2Router02_ABI,
    library,
    account,
    chainId
  )
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function isTokenOnList(defaultTokens: TokenAddressMap, currency?: Currency): boolean {
  if (currency === CETH) return true
  return Boolean(currency instanceof Token && defaultTokens[currency.chainId]?.[currency.address])
}

export function addCommasToNumber(string: string): string {
  const regex = /\B(?=(\d{3})+(?!\d))/g
  const [integer, decimals] = string.split('.')
  const formattedInteger = integer.replace(regex, ',')

  return decimals == null ? formattedInteger : `${formattedInteger}.${decimals}`
}

export function setIntersection<T>(set1: Set<T>, set2: Set<T>): Set<T> {
  return new Set([...set1].filter(item => set2.has(item)))
}

// Divides CurrencyAmount by a non-JSBI number
export function divideCurrencyAmountByNumber(numerator: CurrencyAmount | undefined, denominator: number) {
  if (numerator == null) {
    return null
  }

  const currency = numerator.currency
  const divisionResult = JSBI.divide(numerator.raw, JSBI.BigInt(denominator))

  return CurrencyAmount.fromRawAmount(currency, divisionResult)
}

export function replaceUnderscoresWithSlashes(value: string) {
  return value.replace(/_/g, '/')
}

export function roundDecimal(apr: number) {
  return apr >= 1 ? Math.round(apr) : +apr.toFixed(2)
}

export function isMetamask() {
  return !!(window?.ethereum && window?.ethereum.isMetaMask)
}

export function isBraveWallet() {
  return !!(window?.ethereum && window?.ethereum.isBraveWallet)
}
