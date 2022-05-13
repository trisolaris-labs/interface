import { ChainId, JSBI, Percent, Token, WETH as _WETH } from '@trisolaris/sdk'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { injected, walletlink, walletconnect } from '../connectors'
import {
  DAI,
  TRI,
  USDT,
  WNEAR,
  ATLUNA,
  AURORA,
  POLAR,
  SPOLAR,
  LUNAR,
  STNEAR,
  XTRI,
  USDC,
  TRIPOLAR,
  PLY
} from './tokens'

export const GAS_PRICE = 250

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const GOVERNANCE_ADDRESS = '0xb0Ff2b1047d9E8d294c2eD798faE3fA817F43Ee1'

export const BRIDGE_MIGRATOR_ADDRESS = '0x4b23Aa72A1214d0E4fd3f2c8Da7C6ba660F7483C'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

export const AIRDROP_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.FUJI]: ZERO_ADDRESS,
  [ChainId.AVALANCHE]: '0x0C58C2041da4CfCcF5818Bbe3b66DBC23B3902d9',
  [ChainId.POLYGON]: ZERO_ADDRESS,
  [ChainId.AURORA]: ZERO_ADDRESS
}

// This is actually WETH
function createProperlyNamedWETH() {
  const { address, decimals, name } = _WETH[ChainId.AURORA]

  return new Token(ChainId.AURORA, address, decimals, 'WETH', name)
}

const COMMON_BASES: ChainTokenList = {
  [ChainId.FUJI]: [DAI[ChainId.FUJI], USDT[ChainId.FUJI]],
  [ChainId.AVALANCHE]: [DAI[ChainId.AVALANCHE], USDT[ChainId.AVALANCHE]],
  [ChainId.POLYGON]: [DAI[ChainId.POLYGON], USDT[ChainId.POLYGON]],
  [ChainId.AURORA]: [
    USDC[ChainId.AURORA],
    USDT[ChainId.AURORA],
    createProperlyNamedWETH(),
    TRI[ChainId.AURORA],
    ATLUNA[ChainId.AURORA],
    XTRI[ChainId.AURORA],
    WNEAR[ChainId.AURORA],
    STNEAR[ChainId.AURORA],
    PLY[ChainId.AURORA]
  ]
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...COMMON_BASES
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...COMMON_BASES
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...COMMON_BASES
}

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  WALLET_LINK: {
    connector: walletlink,
    name: 'Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Use Coinbase Wallet app on mobile device',
    href: null,
    color: '#315CF5'
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'Wallet Connect',
    iconName: 'walletConnectIcon.svg',
    description: 'Use Wallet Connect',
    href: null,
    color: '#315CF5'
  }
}

export const NetworkContextName = 'NETWORK'

export const CHAIN_PARAMS = {
  [ChainId.FUJI]: {
    chainId: '0xA869', // A 0x-prefixed hexadecimal chainId
    chainName: 'Avalanche FUJI C-Chain',
    nativeCurrency: {
      name: 'Avax',
      symbol: 'AVAX',
      decimals: 18
    },
    rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://cchain.explorer.avax-test.network']
  },
  [ChainId.AVALANCHE]: {
    chainId: '0xa86a', // A 0x-prefixed hexadecimal chainId
    chainName: 'Avalanche Mainnet',
    nativeCurrency: {
      name: 'Avax',
      symbol: 'AVAX',
      decimals: 18
    },
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://avascan.info/blockchain/c/']
  },
  [ChainId.POLYGON]: {
    chainId: '0x89', // A 0x-prefixed hexadecimal chainId
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: ['https://rpc-mainnet.matic.network'],
    blockExplorerUrls: ['https://polygonscan.com/']
  },
  [ChainId.AURORA]: {
    chainId: '0x4e454152', // A 0x-prefixed hexadecimal chainId
    chainName: 'Aurora Mainnet',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://mainnet.aurora.dev'],
    blockExplorerUrls: ['https://aurorascan.dev/']
  }
}

export const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.FUJI]: 'Fuji',
  [ChainId.AVALANCHE]: 'Avalanche',
  [ChainId.POLYGON]: 'Polygon',
  [ChainId.AURORA]: 'Aurora'
}

export const BASE_CURRENCIES: { [chainId in ChainId]?: string } = {
  [ChainId.FUJI]: 'AVAX',
  [ChainId.AVALANCHE]: 'AVAX',
  [ChainId.POLYGON]: 'MATIC',
  [ChainId.AURORA]: 'ETH'
}

export const ETHERSCAN_PREFIXES: { [chainId in ChainId]: string } = {
  [ChainId.FUJI]: 'https://cchain.explorer.avax-test.network',
  [ChainId.AVALANCHE]: 'https://cchain.explorer.avax.network',
  [ChainId.POLYGON]: 'https://polygonscan.com/',
  [ChainId.AURORA]: 'https://aurorascan.dev'
}
//TODO NEED TO CHANGE WITH CORRECT EXPLORER LINK

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 60 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 60

export const BIG_INT_ZERO = JSBI.BigInt(0)

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// remove the min eth condition

export const BETTER_TRADE_LINK_THRESHOLD = new Percent(JSBI.BigInt(75), JSBI.BigInt(10000))

export const WYRE_API_KEY = process.env.REACT_APP_WYRE_API_KEY ? process.env.REACT_APP_WYRE_API_KEY : ''
export const WYRE_SECRET_KEY = process.env.REACT_APP_WYRE_SECRET_KEY ? process.env.REACT_APP_WYRE_SECRET_KEY : ''
export const WYRE_ID = process.env.REACT_APP_WYRE_ID ? process.env.REACT_APP_WYRE_ID : ''
export const WYRE_API_URL = 'https://api.sendwyre.com'
export const WYRE_QUOTE_API_ENDPOINT = '/v3/orders/quote/partner'
export const WYRE_RESERVE_API_ENDPOINT = '/v3/orders/reserve'
export const WYRE_CALLBACK_URL = 'https://app.pangolin.exchange/'

export const TOKEN_WARNING_MODAL_ALLOWLIST = new Set(
  [
    AURORA[ChainId.AURORA],
    POLAR[ChainId.AURORA],
    SPOLAR[ChainId.AURORA],
    LUNAR[ChainId.AURORA],
    TRIPOLAR[ChainId.AURORA]
  ].map(({ address }) => address.toLowerCase())
)

export const CUSTOM_TOKEN_MAX_HOPS = {
  [TRIPOLAR[ChainId.AURORA].address]: 4,
  [XTRI[ChainId.AURORA].address]: 4,
  [LUNAR[ChainId.AURORA].address]: 4
}

export const PRICE_IMPACT_NEGLIGIBLE_THRESHOLD = new Percent('1', '10000')
export const PRICE_IMPACT_ERROR_THRESHOLD = new Percent('5', '100')
export const PRICE_IMPACT_ERROR_THRESHOLD_NEGATIVE = new Percent('-5', '100')
