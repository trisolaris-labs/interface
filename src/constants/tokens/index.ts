/**********************************************************************************************
 * THIS FILE IS GENERATED
 *
 * DO NOT MODIFY THIS FILE MANUALLY -- IT WILL BE OVERWRITTEN
 *
 * THIS FILE UPDATES BASED ON THE `master` BRANCH OF https://github.com/trisolaris-labs/tokens/
 * RUN `yarn build-tokens` TO UPDATE THIS FILE
 **********************************************************************************************/

import { ChainId, Token } from '@trisolaris/sdk'

export const DAI: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    18,
    'DAI',
    'Dai Stablecoin'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'DAI', 'Dai Stablecoin'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xbA7dEebBFC5fA1100Fb055a87773e1E99Cd3507a',
    18,
    'DAI',
    'Dai Stablecoin'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0xe3520349F477A5F6EB06107066048508498A291b', 18, 'DAI', 'Dai Stablecoin')
}

export const WBTC: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
    8,
    'WBTC',
    'Wrapped Bitcoin'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 8, 'WBTC', 'Wrapped Bitcoin'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x408D4cD0ADb7ceBd1F1A1C33A0Ba2098E1295bAB',
    8,
    'WBTC',
    'Wrapped Bitcoin'
  ),
  [ChainId.AURORA]: new Token(
    ChainId.AURORA,
    '0xF4eB217Ba2454613b15dBdea6e5f22276410e89e',
    8,
    'WBTC',
    'Wrapped Bitcoin'
  )
}

export const USDC: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', 6, 'USDC', 'USD Coin'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 6, 'USDC', 'USD Coin'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664',
    6,
    'USDC',
    'USD Coin'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0xB12BFcA5A55806AaF64E99521918A4bf0fC40802', 6, 'USDC', 'USD Coin')
}

export const USDT: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', 6, 'USDT', 'Tether USD'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 6, 'USDT', 'Tether USD'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xde3A24028580884448a5397872046a019649b084',
    6,
    'USDT',
    'Tether USD'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x4988a896b1227218e4A686fdE5EabdcAbd91571f', 6, 'USDT', 'Tether USD')
}

export const WNEAR: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    24,
    'wNEAR',
    'Wrapped Near'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 24, 'wNEAR', 'Wrapped Near'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    24,
    'wNEAR',
    'Wrapped Near'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d', 24, 'wNEAR', 'Wrapped Near')
}

export const TRI: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'TRI',
    'Trisolaris Token'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'TRI', 'Trisolaris Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'TRI',
    'Trisolaris Token'
  ),
  [ChainId.AURORA]: new Token(
    ChainId.AURORA,
    '0xFa94348467f64D5A457F75F8bc40495D33c65aBB',
    18,
    'TRI',
    'Trisolaris Token'
  )
}

export const AURORA: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 18, 'AURORA', 'Aurora'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'AURORA', 'Aurora'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'AURORA',
    'Aurora'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79', 18, 'AURORA', 'Aurora')
}

export const XTRI: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 18, 'xTRI', 'xTRI'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'xTRI', 'xTRI'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x0000000000000000000000000000000000000000', 18, 'xTRI', 'xTRI'),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x802119e4e253D5C19aA06A5d567C5a41596D6803', 18, 'xTRI', 'xTRI')
}

export const ATLUNA: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'atLUNA',
    'Wrapped LUNA'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'atLUNA', 'Wrapped LUNA'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'atLUNA',
    'Wrapped LUNA'
  ),
  [ChainId.AURORA]: new Token(
    ChainId.AURORA,
    '0xC4bdd27c33ec7daa6fcfd8532ddB524Bf4038096',
    18,
    'atLUNA',
    'Wrapped LUNA'
  )
}

export const ATUST: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'atUST',
    'Wrapped UST'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'atUST', 'Wrapped UST'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'atUST',
    'Wrapped UST'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x5ce9F0B6AFb36135b5ddBF11705cEB65E634A9dC', 18, 'atUST', 'Wrapped UST')
}

export const AVAX: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 18, 'AVAX', 'Avalanche'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'AVAX', 'Avalanche'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'AVAX',
    'Avalanche'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x80A16016cC4A2E6a2CACA8a4a498b1699fF0f844', 18, 'AVAX', 'Avalanche')
}

export const MATIC: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 18, 'MATIC', 'Polygon'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'MATIC', 'Polygon'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'MATIC',
    'Polygon'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x6aB6d61428fde76768D7b45D8BFeec19c6eF91A8', 18, 'MATIC', 'Polygon')
}

export const BNB: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'BNB',
    'Binance Coin'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'BNB', 'Binance Coin'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'BNB',
    'Binance Coin'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x2bF9b864cdc97b08B6D79ad4663e71B8aB65c45c', 18, 'BNB', 'Binance Coin')
}

export const EMPYR: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 9, 'EMPYR', 'Empyrean'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 9, 'EMPYR', 'Empyrean'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    9,
    'EMPYR',
    'Empyrean'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0xE9F226a228Eb58d408FdB94c3ED5A18AF6968fE1', 9, 'EMPYR', 'Empyrean')
}

export const FLX: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 18, 'FLX', 'Flux Token'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'FLX', 'Flux Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'FLX',
    'Flux Token'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0xea62791aa682d455614eaA2A12Ba3d9A2fD197af', 18, 'FLX', 'Flux Token')
}

export const SOLACE: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'SOLACE',
    'Solace Token'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'SOLACE', 'Solace Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'SOLACE',
    'Solace Token'
  ),
  [ChainId.AURORA]: new Token(
    ChainId.AURORA,
    '0x501acE9c35E60f03A2af4d484f49F9B1EFde9f40',
    18,
    'SOLACE',
    'Solace Token'
  )
}

export const META: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 24, 'META', 'Meta Pool'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 24, 'META', 'Meta Pool'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    24,
    'META',
    'Meta Pool'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0xc21Ff01229e982d7c8b8691163B0A3Cb8F357453', 24, 'META', 'Meta Pool')
}

export const STNEAR: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    24,
    'stNEAR',
    'Staked NEAR'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 24, 'stNEAR', 'Staked NEAR'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    24,
    'stNEAR',
    'Staked NEAR'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x07F9F7f963C5cD2BBFFd30CcfB964Be114332E30', 24, 'stNEAR', 'Staked NEAR')
}

export const POLAR: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 18, 'POLAR', 'Polar'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'POLAR', 'Polar'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x0000000000000000000000000000000000000000', 18, 'POLAR', 'Polar'),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0xf0f3b9Eee32b1F490A4b8720cf6F005d4aE9eA86', 18, 'POLAR', 'Polar')
}

export const SPOLAR: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'SPOLAR',
    'Polar Share'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'SPOLAR', 'Polar Share'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'SPOLAR',
    'Polar Share'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x9D6fc90b25976E40adaD5A3EdD08af9ed7a21729', 18, 'SPOLAR', 'Polar Share')
}

export const LUNAR: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 18, 'LUNAR', 'Lunar'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'LUNAR', 'Lunar'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x0000000000000000000000000000000000000000', 18, 'LUNAR', 'Lunar'),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x25e801Eb75859Ba4052C4ac4233ceC0264eaDF8c', 18, 'LUNAR', 'Lunar')
}

export const AUSDO: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 8, 'aUSDO', 'aUSDO'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 8, 'aUSDO', 'aUSDO'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x0000000000000000000000000000000000000000', 8, 'aUSDO', 'aUSDO'),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x293074789b247cab05357b08052468B5d7A23c5a', 8, 'aUSDO', 'aUSDO')
}

export const BBT: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'BBT',
    'BlueBit Token'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'BBT', 'BlueBit Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'BBT',
    'BlueBit Token'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x4148d2Ce7816F0AE378d98b40eB3A7211E1fcF0D', 18, 'BBT', 'BlueBit Token')
}

export const USD_TLP: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'USD TLP',
    'Trisolaris USDC/USDT'
  ),
  [ChainId.FUJI]: new Token(
    ChainId.FUJI,
    '0x0000000000000000000000000000000000000000',
    18,
    'USD TLP',
    'Trisolaris USDC/USDT'
  ),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'USD TLP',
    'Trisolaris USDC/USDT'
  ),
  [ChainId.AURORA]: new Token(
    ChainId.AURORA,
    '0x5EB99863f7eFE88c447Bc9D52AA800421b1de6c9',
    18,
    'USD TLP',
    'Trisolaris USDC/USDT'
  )
}

export const AAVE: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0xD6DF932A45C0f255f85145f286eA0b292B21C90B', 18, 'AAVE', 'Aave Token'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'AAVE', 'Aave Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x63a72806098Bd3D9520cC43356dD78afe5D386D9',
    18,
    'AAVE',
    'Aave Token'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x4e834cDCc911605227eedDDb89Fad336AB9dc00a', 18, 'AAVE', 'Aave Token')
}

export const ABR: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'ABR',
    'Allbridge - Allbridge'
  ),
  [ChainId.FUJI]: new Token(
    ChainId.FUJI,
    '0x0000000000000000000000000000000000000000',
    18,
    'ABR',
    'Allbridge - Allbridge'
  ),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'ABR',
    'Allbridge - Allbridge'
  ),
  [ChainId.AURORA]: new Token(
    ChainId.AURORA,
    '0x2BAe00C8BC1868a5F7a216E881Bae9e662630111',
    18,
    'ABR',
    'Allbridge - Allbridge'
  )
}

export const ABBUSD: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'abBUSD',
    'BUSD BSC - Allbridge'
  ),
  [ChainId.FUJI]: new Token(
    ChainId.FUJI,
    '0x0000000000000000000000000000000000000000',
    18,
    'abBUSD',
    'BUSD BSC - Allbridge'
  ),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'abBUSD',
    'BUSD BSC - Allbridge'
  ),
  [ChainId.AURORA]: new Token(
    ChainId.AURORA,
    '0x5C92A4A7f59A9484AFD79DbE251AD2380E589783',
    18,
    'abBUSD',
    'BUSD BSC - Allbridge'
  )
}

export const PAD: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'PAD',
    'NearPad Token'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'PAD', 'NearPad Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'PAD',
    'NearPad Token'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x885f8CF6E45bdd3fdcDc644efdcd0AC93880c781', 18, 'PAD', 'NearPad Token')
}

export const SOL: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'SOL',
    'SOL - Allbridge'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'SOL', 'SOL - Allbridge'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'SOL',
    'SOL - Allbridge'
  ),
  [ChainId.AURORA]: new Token(
    ChainId.AURORA,
    '0x0f00576d07B594Bdc1caf44b6014A6A02E5AFd48',
    18,
    'SOL',
    'SOL - Allbridge'
  )
}

export const AGEUR: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 18, 'agEUR', 'agEUR'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'agEUR', 'agEUR'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x0000000000000000000000000000000000000000', 18, 'agEUR', 'agEUR'),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0xdc7AcDE9ff18B4D189010a21a44cE51ec874eA7C', 18, 'agEUR', 'agEUR')
}

export const ANGLE: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 18, 'ANGLE', 'ANGLE'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'ANGLE', 'ANGLE'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x0000000000000000000000000000000000000000', 18, 'ANGLE', 'ANGLE'),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0xB7e3617aDB58dc34068522bD20Cfe1660780B750', 18, 'ANGLE', 'ANGLE')
}

export const AVRIT: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'AVRIT',
    'Avrit Learning'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'AVRIT', 'Avrit Learning'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'AVRIT',
    'Avrit Learning'
  ),
  [ChainId.AURORA]: new Token(
    ChainId.AURORA,
    '0xB4530AA877D25E51c18677753ACd80fFa54009b2',
    18,
    'AVRIT',
    'Avrit Learning'
  )
}

export const BAKED: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'BAKED',
    'BakedToken'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'BAKED', 'BakedToken'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'BAKED',
    'BakedToken'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x8973c9eC7B79fE880697cDBcA744892682764c37', 18, 'BAKED', 'BakedToken')
}

export const BAL: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 18, 'BAL', 'Balancer'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'BAL', 'Balancer'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'BAL',
    'Balancer'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0xb59d0FDAf498182Ff19C4E80C00ECfC4470926e2', 18, 'BAL', 'Balancer')
}

export const BAT: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'BAT',
    'Basic Attention Token'
  ),
  [ChainId.FUJI]: new Token(
    ChainId.FUJI,
    '0x0000000000000000000000000000000000000000',
    18,
    'BAT',
    'Basic Attention Token'
  ),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'BAT',
    'Basic Attention Token'
  ),
  [ChainId.AURORA]: new Token(
    ChainId.AURORA,
    '0x2b9025aecc5Ce7A8E6880D3E9c6E458927eCba04',
    18,
    'BAT',
    'Basic Attention Token'
  )
}

export const BHOME: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 6, 'bHOME', 'bHome'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 6, 'bHOME', 'bHome'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x0000000000000000000000000000000000000000', 6, 'bHOME', 'bHome'),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0xe4baf0af161bf03434d1c5A53957981493c12c99', 6, 'bHOME', 'bHome')
}

export const BIVE: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 4, 'BIVE', 'Bizverse'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 4, 'BIVE', 'Bizverse'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    4,
    'BIVE',
    'Bizverse'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x130E6203F05805cd8C44093a53C7b50775eb4ca3', 4, 'BIVE', 'Bizverse')
}

export const BSTN: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 18, 'BSTN', 'Bastion'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'BSTN', 'Bastion'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'BSTN',
    'Bastion'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x9f1F933C660a1DC856F0E0Fe058435879c5CCEf0', 18, 'BSTN', 'Bastion')
}

export const COMP: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 18, 'COMP', 'Compound'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'COMP', 'Compound'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'COMP',
    'Compound'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0xdEaCF0faa2B80aF41470003b5f6Cd113d47B4Dcd', 18, 'COMP', 'Compound')
}

export const CREAM: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'CREAM',
    'Cream Finance'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'CREAM', 'Cream Finance'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'CREAM',
    'Cream Finance'
  ),
  [ChainId.AURORA]: new Token(
    ChainId.AURORA,
    '0xAbe9818c5Fb5e751C4310BE6f0F18c8D85f9Bd7F',
    18,
    'CREAM',
    'Cream Finance'
  )
}

export const CRF: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'CRF',
    'Crafting Finance'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'CRF', 'Crafting Finance'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'CRF',
    'Crafting Finance'
  ),
  [ChainId.AURORA]: new Token(
    ChainId.AURORA,
    '0x026ddA7F0F0A2E42163C9c80D2a5b6958E35fc49',
    18,
    'CRF',
    'Crafting Finance'
  )
}

export const DLTA: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'DLTA',
    'delta.theta'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'DLTA', 'delta.theta'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'DLTA',
    'delta.theta'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0xFBD1D8dcE2F97BC14239fd507183b98Ff1354B39', 18, 'DLTA', 'delta.theta')
}

export const DODO: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 18, 'DODO', 'DODO bird'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'DODO', 'DODO bird'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'DODO',
    'DODO bird'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0xe301eD8C7630C9678c39E4E45193D1e7Dfb914f7', 18, 'DODO', 'DODO bird')
}

export const FAME: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 18, 'FAME', 'FAME'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'FAME', 'FAME'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x0000000000000000000000000000000000000000', 18, 'FAME', 'FAME'),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0xD5c997724e4b5756d08E6464C01AFbC5F6397236', 18, 'FAME', 'FAME')
}

export const RNBWFRAX: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'rnbwFRAX',
    'Frax (Rainbow Bridge)'
  ),
  [ChainId.FUJI]: new Token(
    ChainId.FUJI,
    '0x0000000000000000000000000000000000000000',
    18,
    'rnbwFRAX',
    'Frax (Rainbow Bridge)'
  ),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'rnbwFRAX',
    'Frax (Rainbow Bridge)'
  ),
  [ChainId.AURORA]: new Token(
    ChainId.AURORA,
    '0xDA2585430fEf327aD8ee44Af8F1f989a2A91A3d2',
    18,
    'rnbwFRAX',
    'Frax (Rainbow Bridge)'
  )
}

export const FXS: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 18, 'FXS', 'Frax Share'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'FXS', 'Frax Share'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'FXS',
    'Frax Share'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0xc8fdD32E0bf33F0396a18209188bb8C6Fb8747d2', 18, 'FXS', 'Frax Share')
}

export const HAK: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'HAK',
    'Hakuna Matata'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'HAK', 'Hakuna Matata'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'HAK',
    'Hakuna Matata'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x5ac53F985ea80c6Af769b9272F35F122201D0F56', 18, 'HAK', 'Hakuna Matata')
}

export const HAPI: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 18, 'HAPI', 'HAPI'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'HAPI', 'HAPI'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x0000000000000000000000000000000000000000', 18, 'HAPI', 'HAPI'),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x943F4Bf75D5854E92140403255a471950aB8a26f', 18, 'HAPI', 'HAPI')
}

export const JUMBO: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'JUMBO',
    'Jumbo Exchange'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'JUMBO', 'Jumbo Exchange'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'JUMBO',
    'Jumbo Exchange'
  ),
  [ChainId.AURORA]: new Token(
    ChainId.AURORA,
    '0x6454e4a4891C6B78a5A85304d34558DDa5F3d6D8',
    18,
    'JUMBO',
    'Jumbo Exchange'
  )
}

export const KSW: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'KSW',
    'KillSwitchToken'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'KSW', 'KillSwitchToken'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'KSW',
    'KillSwitchToken'
  ),
  [ChainId.AURORA]: new Token(
    ChainId.AURORA,
    '0xE4eB03598f4DCAB740331fa432f4b85FF58AA97E',
    18,
    'KSW',
    'KillSwitchToken'
  )
}

export const LINEAR: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 24, 'LINEAR', 'LiNEAR'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 24, 'LINEAR', 'LiNEAR'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    24,
    'LINEAR',
    'LiNEAR'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x918dBe087040A41b786f0Da83190c293DAe24749', 24, 'LINEAR', 'LiNEAR')
}

export const LINK: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'LINK',
    'ChainLink Token'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'LINK', 'ChainLink Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'LINK',
    'ChainLink Token'
  ),
  [ChainId.AURORA]: new Token(
    ChainId.AURORA,
    '0x94190d8EF039C670c6d6B9990142e0CE2A1E3178',
    18,
    'LINK',
    'ChainLink Token'
  )
}

export const MKR: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 18, 'MKR', 'Maker'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'MKR', 'Maker'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x0000000000000000000000000000000000000000', 18, 'MKR', 'Maker'),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x1d1f82D8B8fc72f29A8c268285347563CB6cD8B3', 18, 'MKR', 'Maker')
}

export const MNFT: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'MNFT',
    'MANUFACTORY'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'MNFT', 'MANUFACTORY'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'MNFT',
    'MANUFACTORY'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0xd126B48c072f4668e944A8895bC74044D5f2E85b', 18, 'MNFT', 'MANUFACTORY')
}

export const MODA: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 18, 'MODA', 'moda'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'MODA', 'moda'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x0000000000000000000000000000000000000000', 18, 'MODA', 'moda'),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x74974575D2f1668C63036D51ff48dbaa68E52408', 18, 'MODA', 'moda')
}

export const NDOL: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'NDOL',
    'Necc Dollars'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'NDOL', 'Necc Dollars'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'NDOL',
    'Necc Dollars'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0xC86Ca2BB9C9c9c9F140d832dE00BfA9e153FA1e3', 18, 'NDOL', 'Necc Dollars')
}

export const NECC: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 9, 'NECC', 'Necc'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 9, 'NECC', 'Necc'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x0000000000000000000000000000000000000000', 9, 'NECC', 'Necc'),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x6EBA841F1201fFDDe7DDC2ba995D3308f6C4aEa0', 9, 'NECC', 'Necc')
}

export const NFD: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'NFD',
    'Feisty Doge NFT'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'NFD', 'Feisty Doge NFT'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'NFD',
    'Feisty Doge NFT'
  ),
  [ChainId.AURORA]: new Token(
    ChainId.AURORA,
    '0x90eB16621274fb47A071001fBbF7550948874CB5',
    18,
    'NFD',
    'Feisty Doge NFT'
  )
}

export const NNECC: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'nNECC',
    'Wrapped Staked Necc'
  ),
  [ChainId.FUJI]: new Token(
    ChainId.FUJI,
    '0x0000000000000000000000000000000000000000',
    18,
    'nNECC',
    'Wrapped Staked Necc'
  ),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'nNECC',
    'Wrapped Staked Necc'
  ),
  [ChainId.AURORA]: new Token(
    ChainId.AURORA,
    '0x449f661c53aE0611a24c2883a910A563A7e42489',
    18,
    'nNECC',
    'Wrapped Staked Necc'
  )
}

export const OCT: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'OCT',
    'Octopus Network Token'
  ),
  [ChainId.FUJI]: new Token(
    ChainId.FUJI,
    '0x0000000000000000000000000000000000000000',
    18,
    'OCT',
    'Octopus Network Token'
  ),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'OCT',
    'Octopus Network Token'
  ),
  [ChainId.AURORA]: new Token(
    ChainId.AURORA,
    '0x951cfdC9544b726872A8faF56792ef6704731aAe',
    18,
    'OCT',
    'Octopus Network Token'
  )
}

export const OIN: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 8, 'OIN', 'oinfinance'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 8, 'OIN', 'oinfinance'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    8,
    'OIN',
    'oinfinance'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x07b2055fBD17b601C780aEb3abF4C2B3a30c7aae', 8, 'OIN', 'oinfinance')
}

export const PACHA: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'PACHA',
    'PachaVerse DAO'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'PACHA', 'PachaVerse DAO'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'PACHA',
    'PachaVerse DAO'
  ),
  [ChainId.AURORA]: new Token(
    ChainId.AURORA,
    '0xc2Aa4b56E325266e32582F5F5CEcE7E88f0C11D2',
    18,
    'PACHA',
    'PachaVerse DAO'
  )
}

export const PICKLE: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'PICKLE',
    'PickleToken'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'PICKLE', 'PickleToken'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'PICKLE',
    'PickleToken'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x291C8FCeAcA3342B29CC36171DEB98106f712C66', 18, 'PICKLE', 'PickleToken')
}

export const PLY: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'PLY',
    'Aurigami Token'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'PLY', 'Aurigami Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'PLY',
    'Aurigami Token'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x09C9D464b58d96837f8d8b6f4d9fE4aD408d3A4f', 18, 'PLY', 'Aurigami Token')
}

export const PULSE: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 18, 'PULSE', 'Pulse'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'PULSE', 'Pulse'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x0000000000000000000000000000000000000000', 18, 'PULSE', 'Pulse'),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x8828a5047D093f6354E3fe29fFCb2761300DC994', 18, 'PULSE', 'Pulse')
}

export const REF: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'REF',
    'Ref Finance Token'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'REF', 'Ref Finance Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'REF',
    'Ref Finance Token'
  ),
  [ChainId.AURORA]: new Token(
    ChainId.AURORA,
    '0x221292443758F63563a1ed04b547278B05845FCb',
    18,
    'REF',
    'Ref Finance Token'
  )
}

export const REN: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 18, 'REN', 'Republic'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'REN', 'Republic'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'REN',
    'Republic'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x18921F1E257038E538bA24D49fa6495c8b1617bC', 18, 'REN', 'Republic')
}

export const RMC: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 18, 'rMC', 'rMutantCoin'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'rMC', 'rMutantCoin'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'rMC',
    'rMutantCoin'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0xd9a4C034e69e5162AC02BEc627475470a53C9a14', 18, 'rMC', 'rMutantCoin')
}

export const SNX: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'SNX',
    'Synthetix Network Token'
  ),
  [ChainId.FUJI]: new Token(
    ChainId.FUJI,
    '0x0000000000000000000000000000000000000000',
    18,
    'SNX',
    'Synthetix Network Token'
  ),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'SNX',
    'Synthetix Network Token'
  ),
  [ChainId.AURORA]: new Token(
    ChainId.AURORA,
    '0xdC9bE1FF012D3c6dA818D136a3b2E5FDD4442F74',
    18,
    'SNX',
    'Synthetix Network Token'
  )
}

export const SUSHI: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'SUSHI',
    'SushiToken'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'SUSHI', 'SushiToken'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'SUSHI',
    'SushiToken'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x7821c773a12485b12a2b5b7BC451c3eB200986b1', 18, 'SUSHI', 'SushiToken')
}

export const TUSD: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 18, 'TUSD', 'TrueUSD'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'TUSD', 'TrueUSD'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'TUSD',
    'TrueUSD'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x5454bA0a9E3552f7828616D80a9D2D869726e6F5', 18, 'TUSD', 'TrueUSD')
}

export const UMINT: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 18, 'UMINT', 'YouMinter'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'UMINT', 'YouMinter'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'UMINT',
    'YouMinter'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x984c2505A14DA732D7271416356f535953610340', 18, 'UMINT', 'YouMinter')
}

export const VRA: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    4,
    'VRA',
    'Virtual Reality Asset'
  ),
  [ChainId.FUJI]: new Token(
    ChainId.FUJI,
    '0x0000000000000000000000000000000000000000',
    4,
    'VRA',
    'Virtual Reality Asset'
  ),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    4,
    'VRA',
    'Virtual Reality Asset'
  ),
  [ChainId.AURORA]: new Token(
    ChainId.AURORA,
    '0x17bC24b9bDD8A3E7486E3C3458a5954412F2ff60',
    4,
    'VRA',
    'Virtual Reality Asset'
  )
}

export const WANNA: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 18, 'WANNA', 'WannaSwap'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'WANNA', 'WannaSwap'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'WANNA',
    'WannaSwap'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x7faA64Faf54750a2E3eE621166635fEAF406Ab22', 18, 'WANNA', 'WannaSwap')
}

export const WOO: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'WOO',
    'Wootrade Network'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'WOO', 'Wootrade Network'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'WOO',
    'Wootrade Network'
  ),
  [ChainId.AURORA]: new Token(
    ChainId.AURORA,
    '0x99ec8F13b2AFeF5eC49073B9D20df109D25F78c0',
    18,
    'WOO',
    'Wootrade Network'
  )
}

export const WSTR: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'WSTR',
    'WrappedStar'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'WSTR', 'WrappedStar'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'WSTR',
    'WrappedStar'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0xF34d508BaC379825255cc80F66CBc89DFeFF92E4', 18, 'WSTR', 'WrappedStar')
}

export const YFI: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'YFI',
    'yearn.finance'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'YFI', 'yearn.finance'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'YFI',
    'yearn.finance'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0xA64514A8Af3Ff7366ad3d5Daa5A548EEFceF85e0', 18, 'YFI', 'yearn.finance')
}

export const MECHA: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 18, 'MECHA', 'Mecha'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'MECHA', 'Mecha'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x0000000000000000000000000000000000000000', 18, 'MECHA', 'Mecha'),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0xa33C3B53694419824722C10D99ad7cB16Ea62754', 18, 'MECHA', 'Mecha')
}

export const UNI: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 18, 'UNI', 'Uniswap'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'UNI', 'Uniswap'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x0000000000000000000000000000000000000000', 18, 'UNI', 'Uniswap'),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x1Bc741235EC0Ee86ad488fa49B69Bb6C823eE7b7', 18, 'UNI', 'Uniswap')
}

export const XNL: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 18, 'XNL', 'Chronicle'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'XNL', 'Chronicle'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'XNL',
    'Chronicle'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x7cA1C28663b76CFDe424A9494555B94846205585', 18, 'XNL', 'Chronicle')
}

export const SHITZU: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 18, 'SHITZU', 'Shitzu'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'SHITZU', 'Shitzu'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'SHITZU',
    'Shitzu'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x68e401B61eA53889505cc1366710f733A60C2d41', 18, 'SHITZU', 'Shitzu')
}

export const GBA: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'GBA',
    'Golden Banana'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'GBA', 'Golden Banana'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'GBA',
    'Golden Banana'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0xc2ac78FFdDf39e5cD6D83bbD70c1D67517C467eF', 18, 'GBA', 'Golden Banana')
}

export const TRIPOLAR: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'TRIPOLAR',
    'TRIPOLAR'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'TRIPOLAR', 'TRIPOLAR'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'TRIPOLAR',
    'TRIPOLAR'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x60527a2751A827ec0Adf861EfcAcbf111587d748', 18, 'TRIPOLAR', 'TRIPOLAR')
}

export const ROSE: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 18, 'ROSE', 'Rose Token'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'ROSE', 'Rose Token'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'ROSE',
    'Rose Token'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0xdcD6D4e2B3e1D1E1E6Fa8C21C8A323DcbecfF970', 18, 'ROSE', 'Rose Token')
}

export const RUSD: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 18, 'RUSD', 'Rose USD'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'RUSD', 'Rose USD'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'RUSD',
    'Rose USD'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x19cc40283B057D6608C22F1D20F17e16C245642E', 18, 'RUSD', 'Rose USD')
}

export const VWAVE: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    18,
    'VWAVE',
    'vaporwave.finance'
  ),
  [ChainId.FUJI]: new Token(
    ChainId.FUJI,
    '0x0000000000000000000000000000000000000000',
    18,
    'VWAVE',
    'vaporwave.finance'
  ),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    18,
    'VWAVE',
    'vaporwave.finance'
  ),
  [ChainId.AURORA]: new Token(
    ChainId.AURORA,
    '0x2451dB68DeD81900C4F16ae1af597E9658689734',
    18,
    'VWAVE',
    'vaporwave.finance'
  )
}

export const FRAX: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 18, 'FRAX', 'Frax'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'FRAX', 'Frax'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x0000000000000000000000000000000000000000', 18, 'FRAX', 'Frax'),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0xE4B9e004389d91e4134a28F19BD833cBA1d994B6', 18, 'FRAX', 'Frax')
}

export const UST: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0000000000000000000000000000000000000000',
    6,
    'UST',
    'UST (WormHole)'
  ),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 6, 'UST', 'UST (WormHole)'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x0000000000000000000000000000000000000000',
    6,
    'UST',
    'UST (WormHole)'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x8D07bBb478B84f7E940e97C8e9cF7B3645166b03', 6, 'UST', 'UST (WormHole)')
}

export const USN: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0000000000000000000000000000000000000000', 18, 'USN', 'USN'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x0000000000000000000000000000000000000000', 18, 'USN', 'USN'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x0000000000000000000000000000000000000000', 18, 'USN', 'USN'),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x5183e1B1091804BC2602586919E6880ac1cf2896', 18, 'USN', 'USN')
}

export const PNG: { [chainId in ChainId]: Token } = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x831753DD7087CaC61aB5644b308642cc1c33Dc13', 18, 'QUICK', 'Quick'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, '0x83080D4b5fC60e22dFFA8d14AD3BB41Dde48F199', 18, 'PNG', 'Pangolin'),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0x60781C2586D68229fde47564546784ab3fACA982',
    18,
    'PNG',
    'Pangolin'
  ),
  [ChainId.AURORA]: new Token(ChainId.AURORA, '0x0b20972B45ffB8e5d4D37AF4024E1bf0b03f15ae', 18, 'WETH', 'Ethereum')
}
