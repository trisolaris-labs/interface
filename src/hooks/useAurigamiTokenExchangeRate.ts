import { JSBI } from '@trisolaris/sdk'
import { BigNumberish, Contract } from 'ethers'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useAurigamiTokenContract } from './useContract'

export default function useAurigamiTokenExchangeRate(address?: string, withSignerIfPossible = true) {
  const tokenContract = useAurigamiTokenContract(address, withSignerIfPossible)

  const response = useSingleCallResult(tokenContract, 'exchangeRateStored', undefined)
  const exchangeRate = JSBI.BigInt(response.result ?? 0)

  console.log('exchangeRate: ', exchangeRate)

  return exchangeRate
}
