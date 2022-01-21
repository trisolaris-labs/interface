import usePrevious from '../../hooks/usePrevious'
import React from 'react'
import { CountUp as CountUpImpl } from 'use-count-up'

export default function CountUp({
  enabled,
  value,
  decimalPlaces = 4
}: {
  enabled: boolean
  value: number
  decimalPlaces?: number
}) {
  const previousValue = usePrevious(value)

  return (
    <CountUpImpl
      isCounting={enabled}
      decimalPlaces={decimalPlaces}
      start={previousValue!}
      end={value}
      thousandsSeparator={','}
      duration={1}
    />
  )
}
