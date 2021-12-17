import { ChainId, Fraction, JSBI, Token } from '@trisolaris/sdk';
import { TRI, USDC, WNEAR } from '../constants';
import IUniswapV2Pair_ABI from '../constants/abis/polygon/IUniswapV2Pair.json'
import { useContract } from '../state/stake/hooks-sushi';
import { STAKING } from '../state/stake/stake-constants';
import { Contract } from '@ethersproject/contracts';
import { useCallback, useEffect, useRef, useState } from 'react';

type LPData = {
    [key: string]: JSBI,
}

export default function useTriPrice() {
    const wnearUsdcPool = findPoolContract(WNEAR[ChainId.AURORA], USDC[ChainId.AURORA]);
    const wnearTriPool = findPoolContract(WNEAR[ChainId.AURORA], TRI[ChainId.AURORA]);

    const wnearUsdcContract = useContract(wnearUsdcPool?.lpAddress, IUniswapV2Pair_ABI);
    const wnearTriContract = useContract(wnearTriPool?.lpAddress, IUniswapV2Pair_ABI);

    const wnearUsdcLPData = useRef<LPData | null>(null);
    const wnearTriLPData = useRef<LPData | null>(null);

    const price = useRef<Fraction | null>(null);

    const calculatePrice = useCallback(() => {
        if (wnearUsdcLPData.current == null || wnearTriLPData.current == null) {
            return null;
        }

        // USDC contract uses 6 decimals
        // TRI and wNEAR use 18 decimals
        // Multiply USDC balance by 10^(18-6) to normalize
        const normalizedUSDCRatio = JSBI.multiply(
            JSBI.BigInt(wnearUsdcLPData.current.usdcReserve!),
            JSBI.BigInt(
                10 ** (TRI[ChainId.AURORA].decimals - USDC[ChainId.AURORA].decimals)
            ),
        );

        // USDC/NEAR
        const usdcToWnearRatio = new Fraction(
            normalizedUSDCRatio,
            wnearUsdcLPData.current.wnearReserve!,
        );

        // TRI/NEAR
        const WnearToTriRatio = new Fraction(
            wnearTriLPData.current.triReserve!,
            wnearTriLPData.current.wnearReserve!,
        );

        // USDC/NEAR / TRI/NEAR => USDC/TRI
        // Price is USDC/TRI (where TRI = 1)
        const result = usdcToWnearRatio.divide(WnearToTriRatio);

        return result;
    }, [wnearUsdcLPData, wnearTriLPData]);

    async function getWnearUSDCPairReserves(contract?: Contract | null) {
        if (contract == null) {
            return;
        }

        const {
            reserves,
            token0,
            token1: _token1,
        } = await getPairReserves(contract);

        if (token0 === USDC[ChainId.AURORA].address) {
            wnearUsdcLPData.current = {
                usdcReserve: reserves[0],
                wnearReserve: reserves[1],
            };
        } else {
            wnearUsdcLPData.current = {
                usdcReserve: reserves[1],
                wnearReserve: reserves[0],
            };
        }
    }

    async function getWnearTriPairReserves(contract?: Contract | null) {
        if (contract == null) {
            return;
        }

        const {
            reserves,
            token0,
            token1: _token1,
        } = await getPairReserves(contract);

        if (token0 === TRI[ChainId.AURORA].address) {
            wnearTriLPData.current = {
                triReserve: reserves[0],
                wnearReserve: reserves[1],
            };
        } else {
            wnearTriLPData.current = {
                triReserve: reserves[1],
                wnearReserve: reserves[0],
            };
        }
    }

    useEffect(() => {
        if (wnearUsdcLPData.current == null) {
            getWnearUSDCPairReserves(wnearUsdcContract);
        }
        if (wnearTriLPData.current == null) {
            getWnearTriPairReserves(wnearTriContract);
        }

        if (wnearUsdcLPData.current != null && wnearTriLPData.current != null) {
            price.current = calculatePrice();
        }
    }, [
        wnearUsdcLPData,
        wnearTriLPData,
        getWnearUSDCPairReserves,
        getWnearTriPairReserves,
        wnearUsdcContract,
        wnearTriContract,
        calculatePrice
    ]);

    return price.current;
}

async function getPairReserves(contract: Contract) {
    const [token0, token1, reserves] = await Promise.all([
        contract?.token0(),
        contract?.token1(),
        contract?.getReserves(),
    ]);

    return {
        token0,
        token1,
        reserves,
    }
}

function findPoolContract(tokenA: Token, tokenB: Token) {
    const pools = STAKING[ChainId.AURORA];

    return pools.find(pool => {
        const [poolTokenA, poolTokenB] = pool.tokens;
        const hasTokenA = [poolTokenA.address, poolTokenB.address].includes(tokenA.address);
        const hasTokenB = [poolTokenA.address, poolTokenB.address].includes(tokenB.address);

        return (hasTokenA && hasTokenB);
    });
}