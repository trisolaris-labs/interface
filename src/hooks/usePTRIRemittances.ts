import { ChainId, CurrencyAmount, JSBI } from '@trisolaris/sdk'
import _ from 'lodash'
import { useMemo } from 'react'
import { USD_TLP } from '../constants/tokens'
import { useFetchPTRIAPR } from '../fetchers/pTRI'

export default function usePTRIRemittances() {
  const aprData = useFetchPTRIAPR()

  return useMemo(
    () =>
      _(aprData)
        .map(({ convertedUsdcAmount, timestamp }) => ({
          amount: CurrencyAmount.fromRawAmount(USD_TLP[ChainId.AURORA], JSBI.BigInt(convertedUsdcAmount)),
          timestamp: new Date(timestamp * 1000)
        }))
        .orderBy(({ timestamp }) => timestamp.valueOf(), 'desc')
        .value(),
    [aprData]
  )
}
