import usePrevious from '../../hooks/usePrevious'
import React from 'react'
import { CountUp as CountUpImpl } from 'use-count-up'

export default function CountUp({
  enabled,
  value,
  decimalPlaces
}: {
  enabled: boolean
  value: number
  decimalPlaces?: number
}) {
  const previousValue = usePrevious(value)

  return (
    <CountUpImpl
      isCounting={enabled}
      decimalPlaces={decimalPlaces ?? 4}
      start={previousValue!}
      end={value}
      thousandsSeparator={','}
      duration={1}
    />
  )
}
