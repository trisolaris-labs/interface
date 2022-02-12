import { ChainId, JSBI, Percent, Token, WETH as _WETH } from '@trisolaris/sdk'
import { AbstractConnector } from '@web3-react/abstract-connector'

import { injected, walletlink, walletconnect } from '../connectors'

export const GAS_PRICE = 250

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const GOVERNANCE_ADDRESS = '0xb0Ff2b1047d9E8d294c2eD798faE3fA817F43Ee1'

export const BRIDGE_MIGRATOR_ADDRESS = '0x4b23Aa72A1214d0E4fd3f2c8Da7C6ba660F7483C'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

export const PNG: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x83080D4b5fC60e22dFFA8d14AD3BB41Dde48F199', 18, 'PNG', 'Pangolin'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x60781C2586D68229fde47564546784ab3fACA982',
    18,
    'PNG',
    'Pangolin'
  ),
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x831753dd7087cac61ab5644b308642cc1c33dc13', 18, 'QUICK', 'Quick'),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x0b20972b45ffb8e5d4d37af4024e1bf0b03f15ae', 18, 'WETH', 'Ethereum')
}

export const USDT: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 6, 'USDT', 'Tether USD'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xde3A24028580884448a5397872046a019649b084',
    6,
    'USDT',
    'Tether USD'
  ),
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', 6, 'USDT', 'Tether USD'),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x4988a896b1227218e4a686fde5eabdcabd91571f', 6, 'USDT', 'Tether USD')
}

export const WBTC: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 8, 'WBTC', 'Wrapped Bitcoin'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x408D4cD0ADb7ceBd1F1A1C33A0Ba2098E1295bAB',
    8,
    'WBTC',
    'Wrapped Bitcoin'
  ),
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
    8,
    'WBTC',
    'Wrapped Bitcoin'
  ),
  [ChainId.AURORA]: new Token(
    ChainId.AURORA,
    '0xf4eb217ba2454613b15dbdea6e5f22276410e89e',
    8,
    'WBTC',
    'Wrapped Bitcoin'
  )
}

export const DAI: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'DAI', 'Dai Stablecoin'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xbA7dEebBFC5fA1100Fb055a87773e1E99Cd3507a',
    18,
    'DAI',
    'Dai Stablecoin'
  ),
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
    18,
    'DAI',
    'Dai Stablecoin'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0xe3520349f477a5f6eb06107066048508498a291b', 18, 'DAI', 'Dai Stablecoin')
}

export const TRI: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'TRI', 'Trisolaris Token'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, ZERO_ADDRESS, 18, 'TRI', 'Trisolaris Token'),
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, ZERO_ADDRESS, 18, 'TRI', 'Trisolaris Token'),
  [ChainId.AURORA]: new Token(
    ChainId.AURORA,
    '0xFa94348467f64D5A457F75F8bc40495D33c65aBB',
    18,
    'TRI',
    'Trisolaris Token'
  )
}

export const XTRI: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'xTRI', 'TriBar Token'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, ZERO_ADDRESS, 18, 'xTRI', 'TriBar Token'),
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, ZERO_ADDRESS, 18, 'xTRI', 'TriBar Token'),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x802119e4e253D5C19aA06A5d567C5a41596D6803', 18, 'xTRI', 'TriBar')
}


export const AURORA: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'AURORA', 'Aurora'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, ZERO_ADDRESS, 18, 'AURORA', 'Aurora'),
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, ZERO_ADDRESS, 18, 'AURORA', 'Aurora'),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79', 18, 'AURORA', 'Aurora')
}

export const UST: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'UST', 'Wrapped UST'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, ZERO_ADDRESS, 18, 'UST', 'Wrapped UST'),
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, ZERO_ADDRESS, 18, 'UST', 'Wrapped UST'),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x5ce9F0B6AFb36135b5ddBF11705cEB65E634A9dC', 18, 'atUST', 'Wrapped UST')
}

export const LUNA: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'LUNA', 'Wrapped LUNA'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, ZERO_ADDRESS, 18, 'LUNA', 'Wrapped LUNA'),
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, ZERO_ADDRESS, 18, 'LUNA', 'Wrapped LUNA'),
  [ChainId.AURORA]: new Token(
    ChainId.AURORA,
    '0xC4bdd27c33ec7daa6fcfd8532ddB524Bf4038096',
    18,
    'atLUNA',
    'Wrapped LUNA'
  )
}

export const USDC: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 6, 'USDC', 'USDC Stablecoin'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664',
    6,
    'USDC',
    'USDC Stablecoin'
  ),
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    6,
    'USDC',
    'USDC Stablecoin'
  ),
  [ChainId.AURORA]: new Token(
    ChainId.AURORA,
    '0xB12BFcA5A55806AaF64E99521918A4bf0fC40802',
    6,
    'USDC',
    'USDC Stablecoin'
  )
}

export const AAVE: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'AAVE', 'AAVE TOken'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x63a72806098Bd3D9520cC43356dD78afe5D386D9',
    18,
    'AAVE',
    'AAVE Token'
  ),
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0xd6df932a45c0f255f85145f286ea0b292b21c90b', 18, 'AAVE', 'AAVE Token'),
  [ChainId.AURORA]: new Token(ChainId.AURORA, ZERO_ADDRESS, 18, 'AAVE', 'AAVE TOken')
}

export const WNEAR: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'WNEAR', 'WNEAR Token'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, ZERO_ADDRESS, 18, 'WNEAR', 'WNEAR Token'),
  [ChainId.POLYGON]: new Token(ChainId.AVALANCHE, ZERO_ADDRESS, 18, 'WNEAR', 'WNEAR Token'),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0xc42c30ac6cc15fac9bd938618bcaa1a1fae8501d', 24, 'WNEAR', 'WNEAR Token')
}

export const AVAX: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'AVAX', 'Avalanche'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, ZERO_ADDRESS, 18, 'AVAX', 'Avalanche'),
  [ChainId.POLYGON]: new Token(ChainId.AVALANCHE, ZERO_ADDRESS, 18, 'AVAX', 'Avalanche'),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x80A16016cC4A2E6a2CACA8a4a498b1699fF0f844', 18, 'AVAX', 'Avalanche')
}

export const MATIC: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'MATIC', 'Polygon'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, ZERO_ADDRESS, 18, 'MATIC', 'Polygon'),
  [ChainId.POLYGON]: new Token(ChainId.AVALANCHE, ZERO_ADDRESS, 18, 'MATIC', 'Polygon'),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x6aB6d61428fde76768D7b45D8BFeec19c6eF91A8', 18, 'MATIC', 'Polygon')
}

export const BNB: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'BNB', 'Binance'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, ZERO_ADDRESS, 18, 'BNB', 'Binance'),
  [ChainId.POLYGON]: new Token(ChainId.AVALANCHE, ZERO_ADDRESS, 18, 'BNB', 'Binance'),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x2bF9b864cdc97b08B6D79ad4663e71B8aB65c45c', 18, 'BNB', 'Binance')
}

export const FLX: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'FLX', 'Flux Token'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, ZERO_ADDRESS, 18, 'FLX', 'Flux Token'),
  [ChainId.POLYGON]: new Token(ChainId.AVALANCHE, ZERO_ADDRESS, 18, 'FLX', 'Flux Token'),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0xea62791aa682d455614eaa2a12ba3d9a2fd197af', 18, 'FLX', 'Flux Token')
}

export const MECHA: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'MECHA', 'Mecha'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, ZERO_ADDRESS, 18, 'MECHA', 'Mecha'),
  [ChainId.POLYGON]: new Token(ChainId.AVALANCHE, ZERO_ADDRESS, 18, 'MECHA', 'Mecha'),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0xa33C3B53694419824722C10D99ad7cB16Ea62754', 18, 'MECHA', 'Mecha')
}

export const SOLACE: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'SOLACE', 'Solace'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, ZERO_ADDRESS, 18, 'SOLACE', 'Solace'),
  [ChainId.POLYGON]: new Token(ChainId.AVALANCHE, ZERO_ADDRESS, 18, 'SOLACE', 'Solace'),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x501acE9c35E60f03A2af4d484f49F9B1EFde9f40', 18, 'SOLACE', 'Solace')
}

export const AIRDROP_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.FUJI]: ZERO_ADDRESS,
  [ChainId.AVALANCHE]: '0x0C58C2041da4CfCcF5818Bbe3b66DBC23B3902d9',
  [ChainId.POLYGON]: ZERO_ADDRESS,
  [ChainId.AURORA]: ZERO_ADDRESS
}

export const STNEAR: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'stNEAR', 'Staked Near'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, ZERO_ADDRESS, 18, 'stNEAR', 'Staked Near'),
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, ZERO_ADDRESS, 18, 'stNEAR', 'Staked Near'),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x07f9f7f963c5cd2bbffd30ccfb964be114332e30', 24, 'stNEAR', 'Staked Near')
}

export const META: { [chainId in ChainId]: Token } = {
  [ChainId.FUJI]: new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'META', 'Meta Pool'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, ZERO_ADDRESS, 18, 'META', 'Meta Pool'),
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, ZERO_ADDRESS, 18, 'META', 'Meta Pool'),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0xc21ff01229e982d7c8b8691163b0a3cb8f357453', 24, 'META', 'Meta Pool')
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
  [ChainId.AURORA]: [WNEAR[ChainId.AURORA], USDT[ChainId.AURORA], createProperlyNamedWETH(), TRI[ChainId.AURORA]]
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...COMMON_BASES
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.AVALANCHE]: {}
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...COMMON_BASES
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...COMMON_BASES
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.AVALANCHE]: []
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
