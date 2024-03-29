import { ChainId, CurrencyAmount, JSBI } from '@trisolaris/sdk'
import _ from 'lodash'
import { useMemo } from 'react'
import { USDC_E_USDT_E_TLP } from '../constants/tokens'
import { useFetchPTRIAPR } from '../fetchers/pTRI'

export default function usePTRIRemittances() {
  const aprData = useFetchPTRIAPR()

  return useMemo(
    () =>
      _(aprData)
        .map(({ convertedUsdcAmount, timestamp }) => ({
          amount: CurrencyAmount.fromRawAmount(USDC_E_USDT_E_TLP[ChainId.AURORA], JSBI.BigInt(convertedUsdcAmount)),
          timestamp: new Date(timestamp * 1000)
        }))
        .orderBy(({ timestamp }) => timestamp.valueOf(), 'desc')
        .slice(0, 7)
        .value(),
    [aprData]
  )
}
