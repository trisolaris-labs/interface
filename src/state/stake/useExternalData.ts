import { useEffect, useState } from 'react'
import { ChainId, Token, TokenAmount, WETH, JSBI } from '@trisolaris/sdk'
import { ExternalStakeConstant, Service, STAKING_TOKEN_LIST } from './external-stake-constants'
import { USDC, AAVE, DAI, ZERO_ADDRESS, WNEAR, USDT } from '../../constants'

export interface ExternalStakeConstants {
  results: ExternalStakeConstant[]
}

const useExternalDataService = () => {
  const [result, setResult] = useState<Service<ExternalStakeConstants[]>>()
  const dummyToken = new Token(ChainId.AURORA, ZERO_ADDRESS, 18, 'ZERO', 'ZERO')

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/trisolaris-labs/apr/master/data.json')
      .then(response => response.json())
      .then(response => {
        const parsedResponseArr = response.map(
          (responseobj: ExternalStakeConstant) =>
            ({
              id: responseobj.id,
              lpAddress: responseobj.lpAddress,
              totalSupply: responseobj.totalSupply,
              totalStaked: responseobj.totalStaked,
              totalStakedInUSD: responseobj.totalStakedInUSD,
              totalRewardRate: responseobj.totalRewardRate,
              allocPoint: responseobj.allocPoint,
              apr: responseobj.apr,
              // token0: responseobj ? STAKING_TOKEN_LIST[responseobj.lpAddress][0] : dummyToken, //hardcoded lp address
              // token1: responseobj ? STAKING_TOKEN_LIST[responseobj.lpAddress][1] : dummyToken //hardcoded lp address
            } as ExternalStakeConstant)
        )
        setResult(parsedResponseArr)
      })
  }, [])
  return result
}

// mapping object with id, lpaddress

export default useExternalDataService
