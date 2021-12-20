import { ChainId, Fraction, JSBI } from '@trisolaris/sdk';
import { TRI, USDC } from '../constants';
import useUSDCWNEARPoolReserves from './useUSDCWNEARReserves';
import useTRIWNEARPoolReserves from './useTRIWNEARReserves';

export default function useTriPrice() {
    const wnearUSDCPairReserves = useUSDCWNEARPoolReserves();
    const wnearTriPairReserves = useTRIWNEARPoolReserves();

    if (wnearUSDCPairReserves == null || wnearTriPairReserves == null) {
        return null;
    }

    // USDC contract uses 6 decimals
    // TRI and wNEAR use 18 decimals
    // Multiply USDC balance by 10^(18-6) to normalize
    const normalizedUSDCRatio = JSBI.multiply(
        JSBI.BigInt(wnearUSDCPairReserves.usdcReserve!),
        JSBI.BigInt(
            10 ** (TRI[ChainId.AURORA].decimals - USDC[ChainId.AURORA].decimals)
        ),
    );

    // USDC/NEAR
    const usdcToWnearRatio = new Fraction(
        normalizedUSDCRatio,
        wnearUSDCPairReserves.wnearReserve!,
    );

    // TRI/NEAR
    const WnearToTriRatio = new Fraction(
        wnearTriPairReserves.triReserve!,
        wnearTriPairReserves.wnearReserve!,
    );

    // USDC/NEAR / TRI/NEAR => USDC/TRI
    // Price is USDC/TRI (where TRI = 1)
    const result = usdcToWnearRatio.divide(WnearToTriRatio);

    return result;
}