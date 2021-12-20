import { ChainId } from '@trisolaris/sdk';
import { USDC, WNEAR } from '../constants';
import { useUSDCWNEARPoolContract } from './useContract';
import usePoolReserves from './usePoolReserves';

export default function useUSDCWNEARPoolReserves() {
    const wnearUsdcContract = useUSDCWNEARPoolContract();
    const reserves = usePoolReserves({
        contract: wnearUsdcContract,
        token0: USDC[ChainId.AURORA],
        token1: WNEAR[ChainId.AURORA],
    });

    return reserves == null
        ? null
        : {
            usdcReserve: reserves.token0,
            wnearReserve: reserves.token1,
        };
}