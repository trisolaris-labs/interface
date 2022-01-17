import { ChainId, Fraction, JSBI } from '@trisolaris/sdk'
import { TRI, USDC } from '../constants'
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

  const [wnearUsdcContractReserves, wnearTriContractReserves] = [
    wnearUsdcContractCall.result,
    wnearTriContractCall.result
  ]

  const wnearUSDCPairReserves__usdc: BigNumber = wnearUsdcContractReserves?.[0] ?? null
  const wnearUSDCPairReserves__wnear: BigNumber = wnearUsdcContractReserves?.[1] ?? null
  const wnearTriPairReserves__wnear: BigNumber = wnearTriContractReserves?.[0] ?? null
  const wnearTriPairReserves__tri: BigNumber = wnearTriContractReserves?.[1] ?? null

  const isLoading = [
    wnearUSDCPairReserves__usdc,
    wnearUSDCPairReserves__wnear,
    wnearTriPairReserves__wnear,
    wnearTriPairReserves__tri
  ].some(v => v == null)

  const getTriPrice = useCallback(() => {
    if (isLoading) {
      return null
    }

    // USDC contract uses 6 decimals
    // TRI and wNEAR use 18 decimals
    // Multiply USDC balance by 10^(18-6) to normalize
    const normalizedUSDCRatio = JSBI.multiply(
      JSBI.BigInt(wnearUSDCPairReserves__usdc),
      JSBI.BigInt(10 ** (TRI[ChainId.AURORA].decimals - USDC[ChainId.AURORA].decimals))
    )

    // USDC/NEAR
    const usdcToWnearRatio = new Fraction(normalizedUSDCRatio, wnearUSDCPairReserves__wnear.toString())

    // TRI/NEAR
    const WnearToTriRatio = new Fraction(wnearTriPairReserves__tri.toString(), wnearTriPairReserves__wnear.toString())

    // USDC/NEAR / TRI/NEAR => USDC/TRI
    // Price is USDC/TRI (where TRI = 1)
    const result = usdcToWnearRatio.divide(WnearToTriRatio)

    return result
  }, [
    isLoading,
    wnearUSDCPairReserves__usdc,
    wnearUSDCPairReserves__wnear,
    wnearTriPairReserves__wnear,
    wnearTriPairReserves__tri,
    latestBlock
  ])

  const triPriceFriendly = useMemo(() => getTriPrice()?.toFixed(2) ?? null, [getTriPrice, latestBlock])

  return { getTriPrice, triPriceFriendly }
}
