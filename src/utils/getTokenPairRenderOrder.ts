import { Token, CETH } from '@trisolaris/sdk';
import { TRI } from '../constants';
import { unwrappedToken } from './wrappedCurrency';

export default function getTokenPairRenderOrder(
    token0: Token,
    token1: Token,
) {
    const currency0 = unwrappedToken(token0);
    const currency1 = unwrappedToken(token1);

    // If pair has CETH, put CETH second
    if (currency0 === CETH || currency1 === CETH) {
        return currency0 === CETH
            ? [token1, token0]
            : [token0, token1];
    }

    // If pair has TRI, put TRI second
    return token0.equals(TRI[token0.chainId])
        ? [token0, token1]
        : [token1, token0];
}
