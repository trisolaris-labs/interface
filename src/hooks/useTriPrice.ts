import { ChainId, Fraction, JSBI } from '@trisolaris/sdk'
import { TRI, USDC } from '../constants/tokens'
import { useCallback, useMemo } from 'react'
import IUniswapV2Pair_ABI from '../constants/abis/polygon/IUniswapV2Pair.json'
import { useBlockNumber } from '../state/application/hooks'
import { useTRIWNEARPoolContract, useUSDCWNEARPoolContract } from './useContract'
import { useMultipleContractSingleData } from '../state/multicall/hooks'
import { Interface } from '@ethersproject/abi'
import { BigNumber } from 'ethers'

type Result = {
  getTriPrice: () => Fraction | null
  triPriceFriendly: string | null
}

export default function useTriPrice(): Result {
  const wnearTriContract = useTRIWNEARPoolContract() // Token0: WNEAR; Token1: TRI
  const wnearUsdcContract = useUSDCWNEARPoolContract() // Token0: USDC; Token1: NEAR
  const [wnearUsdcContractCall, wnearTriContractCall] = useMultipleContractSingleData(
    [wnearTriContract?.address ?? undefined, wnearUsdcContract?.address ?? undefined],
    new Interface(IUniswapV2Pair_ABI),
    'getReserves'
  )
  const latestBlock = useBlockNumber()

  const [pool1ContractReserves, pool2ContractReserves] = [wnearUsdcContractCall.result, wnearTriContractCall.result]

  const pool1ReservesUSDC: BigNumber = pool1ContractReserves?.[0] ?? null
  const pool1ReservesWNEAR: BigNumber = pool1ContractReserves?.[1] ?? null
  const pool2ReservesWNEAR: BigNumber = pool2ContractReserves?.[0] ?? null
  const pool2ReservesTRI: BigNumber = pool2ContractReserves?.[1] ?? null

  const isLoading = [pool1ReservesUSDC, pool1ReservesWNEAR, pool2ReservesWNEAR, pool2ReservesTRI].some(v => v == null)

  const getTriPrice = useCallback(() => {
    if (isLoading) {
      return null
    }

    // USDC contract uses 6 decimals
    // TRI and wNEAR use 18 decimals
    // Multiply USDC balance by 10^(18-6) to normalize
    const normalizedUSDCRatio = JSBI.multiply(
      JSBI.BigInt(pool1ReservesUSDC),
      JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(TRI[ChainId.AURORA].decimals - USDC[ChainId.AURORA].decimals))
    )

    // USDC/NEAR
    const usdcToWnearRatio = new Fraction(normalizedUSDCRatio, pool1ReservesWNEAR.toString())

    // TRI/NEAR
    const WnearToTriRatio = new Fraction(pool2ReservesTRI.toString(), pool2ReservesWNEAR.toString())

    // USDC/NEAR / TRI/NEAR => USDC/TRI
    // Price is USDC/TRI (where TRI = 1)
    const result = usdcToWnearRatio.divide(WnearToTriRatio)

    return result
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, pool1ReservesUSDC, pool1ReservesWNEAR, pool2ReservesWNEAR, pool2ReservesTRI, latestBlock])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const triPriceFriendly = useMemo(() => getTriPrice()?.toFixed(3) ?? null, [getTriPrice, latestBlock])

  return { getTriPrice, triPriceFriendly }
}
