import { ChainId } from '@trisolaris/sdk';
import { TRI, WNEAR } from '../constants';
import { useTRIWNEARPoolContract } from './useContract';
import usePoolReserves from './usePoolReserves';

export default function useTRIWNEARPoolReserves() {
    const wnearTriContract = useTRIWNEARPoolContract();
    const reserves = usePoolReserves({
        contract: wnearTriContract,
        token0: TRI[ChainId.AURORA],
        token1: WNEAR[ChainId.AURORA],
    });

    return reserves == null
        ? null
        : {
            triReserve: reserves.token0,
            wnearReserve: reserves.token1,
        };
}