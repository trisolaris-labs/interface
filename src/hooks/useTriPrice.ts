import { BigintIsh, ChainId, Currency, JSBI, Pair, Token, TokenAmount } from '@trisolaris/sdk';
import { TRI, USDC, WNEAR } from '../constants';
import IUniswapV2Pair_ABI from '../constants/abis/polygon/IUniswapV2Pair.json'
import { usePair } from '../data/Reserves';
import { useMultipleContractSingleData, useSingleContractMultipleData } from '../state/multicall/hooks';
import { useContract } from '../state/stake/hooks-sushi';
import { STAKING } from '../state/stake/stake-constants';
import { Interface } from '@ethersproject/abi'
import { Contract } from '@ethersproject/contracts';
import { useEffect, useState } from 'react';
import { BigNumberish } from '@ethersproject/bignumber';

const PAIR_INTERFACE = new Interface(IUniswapV2Pair_ABI)


export default function useTriPrice() {
    const pools = STAKING[ChainId.AURORA];

    const wnearUsdcPool = pools.find(pool => {
        const [tokenA, tokenB] = pool.tokens;

        const hasWnear = tokenA.address === WNEAR[ChainId.AURORA].address || 
        tokenB.address === WNEAR[ChainId.AURORA].address;
        const hasUsdc = tokenA.address === USDC[ChainId.AURORA].address || 
        tokenB.address === USDC[ChainId.AURORA].address;

        return (hasWnear && hasUsdc);
    });
    const wnearTriPool = pools.find(pool => {
        const [tokenA, tokenB] = pool.tokens;

        const hasWnear = tokenA.address === WNEAR[ChainId.AURORA].address || 
        tokenB.address === WNEAR[ChainId.AURORA].address;
        const hasTri = tokenA.address === TRI[ChainId.AURORA].address || 
        tokenB.address === TRI[ChainId.AURORA].address;

        return (hasWnear && hasTri);
    });

    const wnearUsdcContract = useContract(wnearUsdcPool?.lpAddress, IUniswapV2Pair_ABI);
    const wnearTriContract = useContract(wnearTriPool?.lpAddress, IUniswapV2Pair_ABI);
    const [price, setPrice] = useState<BigintIsh | null>(null);

    useEffect(() => {
        if (price != null && price !== JSBI.BigInt(0)) {
            return;
        }

        getTriPrice()
            .then(triPrice => {
                console.log('triPricetriPrice: ', triPrice);
                setPrice(triPrice);
            });
    }, [getTriPrice, price]);

    async function getTriPrice() {
        if (wnearUsdcContract == null || wnearTriContract == null) {
            return null;
        }

        const {
            reserves: wnearUsdcReserves,
            token0: wnearUsdcToken0,
            token1: wnearUsdcToken1,
        } = await getPairReserves(wnearUsdcContract);
        
        const wnearUsdcPairRatio = wnearUsdcToken0 === WNEAR[ChainId.AURORA].address 
        ? JSBI.divide(JSBI.BigInt(wnearUsdcReserves[0]), JSBI.BigInt(wnearUsdcReserves[1]))
        : JSBI.divide(JSBI.BigInt(wnearUsdcReserves[1]), JSBI.BigInt(wnearUsdcReserves[0]));
        
        const {
            reserves: wnearTriReserves,
            token0: wnearTriToken0,
            token1: wnearTriToken1,
        } = await getPairReserves(wnearTriContract);

        const wnearTriPairRatio = wnearTriToken0 === WNEAR[ChainId.AURORA].address
            ? JSBI.divide(JSBI.BigInt(wnearTriReserves[1]), JSBI.BigInt(wnearTriReserves[0]))
            : JSBI.divide(JSBI.BigInt(wnearTriReserves[0]), JSBI.BigInt(wnearTriReserves[1]));
        
        const price = JSBI.multiply(wnearTriPairRatio, wnearUsdcPairRatio);


        return price;
    }

    return price;
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
