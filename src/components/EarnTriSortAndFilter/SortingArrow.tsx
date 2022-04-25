import React from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'

export default function SortingArrow({ isDescending }: { isDescending: boolean }) {
  return isDescending ? <ChevronDown size={15} /> : <ChevronUp size={15} />
}
