import { Token, ChainId } from '@trisolaris/sdk'
import _ from 'lodash'
import { useCallback } from 'react'
import { useAllTokens } from './Tokens'
import React from 'react'

export default function useGetTokenByAddress(): (address: string) => Token {
  const allTokens = useAllTokens()
  const getTokenByAddress = useCallback(
    address =>
      _.find(allTokens, token => token.address.toLowerCase() === address.toLowerCase()) ??
      new Token(ChainId.AURORA, address, 18),
    [allTokens]
  )

  return getTokenByAddress
}
