import { Fraction, JSBI, Percent } from '@trisolaris/sdk'
import _ from 'lodash'
import { useMemo } from 'react'
import { BIG_INT_ZERO } from '../constants'
import { useFetchPTRIAPR } from '../fetchers/pTRI'

export default function usePTRIAPR() {
  const aprData = useFetchPTRIAPR()

  const data = aprData.map(({ apr, triBalance }) => ({ apr, triBalance }))

  return useMemo(
    (): Percent | null =>
      _.chain(data)
        .map(({ apr, triBalance }) => {
          const [int = '0', decimal = '0'] = apr.toString().split('.')

          const aprJSBI = new Fraction(decimal, 1 + '0'.repeat(decimal.length)) // Create the decimal portion
            .add(JSBI.BigInt(int)) // Add the integer portion
            .divide('100') // Divide by 100 (APR comes in as a percent)

          return {
            apr: aprJSBI,
            triBalance: JSBI.BigInt(triBalance)
          }
        })
        .reduce(
          (acc, { apr, triBalance }) => ({
            numerator: apr.multiply(triBalance).add(acc.numerator),
            denominator: JSBI.add(acc.denominator, triBalance)
          }),
          { numerator: new Fraction('0'), denominator: BIG_INT_ZERO }
        )
        .thru(({ numerator, denominator }) =>
          JSBI.equal(denominator, BIG_INT_ZERO) ? null : numerator.divide(denominator)
        )
        .thru(fraction => (fraction != null ? new Percent(fraction.numerator, fraction.denominator) : null))
        .value(),
    [data]
  )
}
