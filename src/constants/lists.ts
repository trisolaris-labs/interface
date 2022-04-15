import { ChainId } from '@trisolaris/sdk'

// the Pangolin Default token list lives here
export const AEB_TOKENLIST = 'https://raw.githubusercontent.com/pangolindex/tokenlists/main/aeb.tokenlist.json'
export const TOP_15_TOKEN_List = 'https://raw.githubusercontent.com/pangolindex/tokenlists/main/top15.tokenlist.json'
export const DEFI_TOKEN_LIST = 'https://raw.githubusercontent.com/pangolindex/tokenlists/main/defi.tokenlist.json'
export const AVAX_STABLECOIN_TOKEN_LIST =
  'https://raw.githubusercontent.com/pangolindex/tokenlists/main/stablecoin.tokenlist.json'
export const AVAX_BRIDGE_LIST = 'https://raw.githubusercontent.com/pangolindex/tokenlists/main/ab.tokenlist.json'
export const POLYGON_BRIDGE_LIST =
  'https://gist.githubusercontent.com/baboobhaiya/8ba0cdfc6d942e2d828500dee3ff1a16/raw/07dc935f7ebc8e1716296719b8b06ebf5ee977bd/polygon_token_list'

export const TRISOLARIS_LIST =
  'https://raw.githubusercontent.com/trisolaris-labs/tokens/master/lists/1313161554/list.json'

const DEFAULT_LISTS: Map<ChainId, string> = new Map([
  [ChainId.AVALANCHE, AVAX_BRIDGE_LIST],
  [ChainId.POLYGON, POLYGON_BRIDGE_LIST],
  [ChainId.AURORA, TRISOLARIS_LIST]
])
const STABLECOIN_LISTS: Map<ChainId, string> = new Map([[ChainId.AVALANCHE, AVAX_STABLECOIN_TOKEN_LIST]])
const LIST_OF_LISTS: Map<ChainId, string[]> = new Map([
  [
    ChainId.AVALANCHE,
    [AEB_TOKENLIST, TOP_15_TOKEN_List, DEFI_TOKEN_LIST, AVAX_STABLECOIN_TOKEN_LIST, AVAX_BRIDGE_LIST]
  ],
  [ChainId.POLYGON, [POLYGON_BRIDGE_LIST]],
  [ChainId.AURORA, [TRISOLARIS_LIST]]
])

export const DEFAULT_LIST_OF_LISTS = LIST_OF_LISTS.get(ChainId.AURORA)!
export const DEFAULT_TOKEN_LIST_URL = DEFAULT_LISTS.get(ChainId.AURORA)!
export const STABLECOIN_TOKEN_LIST = STABLECOIN_LISTS.get(ChainId.AVALANCHE)!
