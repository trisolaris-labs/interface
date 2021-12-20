import { JSBI, Token } from '@trisolaris/sdk';
import { Contract } from 'ethers';
import { useEffect, useRef, useState } from 'react';
import { useBlockNumber } from '../state/application/hooks';

type LPData = {
    [key: string]: JSBI,
}

type Props = {
    contract: Contract | null,
    token0: Token,
    token1: Token,
}

export default function usePoolReserves({
    contract,
    token0,
    token1,
}: Props) {
    const [reserves, setReserves] = useState<LPData | null>(null);
    const reservesRef = useRef<LPData | null>(null);
    const latestBlock = useBlockNumber();

    useEffect(() => {
        async function doStuff() {
            if (contract == null) {
                return null;
            }

            const response = await getPairReserves(contract);

            if (response.token0 === token0.address) {
                return {
                    token0: response.reserves[0],
                    token1: response.reserves[1],
                };
            } else {
                return {
                    token0: response.reserves[1],
                    token1: response.reserves[0],
                };
            }
        }

        if (contract != null) {
            doStuff()
                .then(data => {
                    reservesRef.current = data;
                });
        }

    }, [contract, reserves, latestBlock, reservesRef]);


    if (reserves !== reservesRef.current) {
        setReserves(reservesRef.current);
    }

    return reserves;
}

async function getPairReserves(contract: Contract | null) {
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