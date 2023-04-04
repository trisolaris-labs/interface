import { STNEAR, AUSDO, NEARX } from '../../constants/tokens'

export const SPONSORED_TOKENS = [
  { token: STNEAR, link: 'https://metapool.app/dapp/mainnet/metapool-aurora/' },
  {
    token: AUSDO,
    link: 'https://v3.oin.finance/'
  },
  {
    token: NEARX,
    link: 'https://near.staderlabs.com/lt/near?tab=Stake'
  }
]

type FARMS_CUSTOM_HEADING_TYPE = {
  [id: number]: {
    customText: string
    customLink: string
  }
}

export const FARMS_CUSTOM_HEADING: FARMS_CUSTOM_HEADING_TYPE = {
  43: {
    customText: 'Deposit in Aurigami',
    customLink: 'https://app.aurigami.finance/'
  }
}
