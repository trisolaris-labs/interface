import { useEffect, useState } from 'react'
import { ExternalStakeConstant, Service, STAKING_TOKEN_LIST } from './external-stake-constants'


export interface ExternalStakeConstants {
  results: ExternalStakeConstant[]
}

const useExternalDataService = () => {
  const [result, setResult] = useState<Service<ExternalStakeConstants[]>>()

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
              token0: STAKING_TOKEN_LIST['0x20F8AeFB5697B77E0BB835A8518BE70775cdA1b0'][0],
              token1: STAKING_TOKEN_LIST['0x20F8AeFB5697B77E0BB835A8518BE70775cdA1b0'][1]
            } as ExternalStakeConstant)
        )
        setResult(parsedResponseArr)
      })
  }, [])

  return result
}

// mapping object with id, lpaddress

export default useExternalDataService
