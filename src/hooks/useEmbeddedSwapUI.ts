import _ from 'lodash'
import React from 'react'
import useParsedQueryString from './useParsedQueryString'

const EMBEDDED_QUERY_PARAM = 'embedded'

export default function useEmbeddedSwapUI() {
  const parsedQs = useParsedQueryString()

  return _(parsedQs)
    .keys()
    .map(key => key.toLowerCase())
    .includes(EMBEDDED_QUERY_PARAM)
}
