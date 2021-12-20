import { JSBI, Token, TokenAmount } from '@trisolaris/sdk';
import { useTotalSupply } from '../../data/TotalSupply';

type Props = {
    lpToken?: Token,
    userLPStakedAmount?: TokenAmount | null,
    totalPoolAmountUSD?: number,
}

export default function useUserFarmStatistics({
    lpToken,
    userLPStakedAmount,
    totalPoolAmountUSD,
}: Props) {
    const totalSupply = useTotalSupply(lpToken);

    if (
        totalSupply == null ||
        lpToken == null ||
        userLPStakedAmount == null ||
        totalPoolAmountUSD == null ||
        userLPStakedAmount.equalTo(JSBI.BigInt(0))
    ) {
        return null;
    }

    const userLPShare = userLPStakedAmount.divide(totalSupply);
    const userLPAmountUSD = userLPShare?.multiply(JSBI.BigInt(totalPoolAmountUSD));
    const userLPAmountUSDFormatted = userLPAmountUSD != null
        ? `$${userLPAmountUSD?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
        : null;

    return {
        totalSupply,
        userLPShare,
        userLPAmountUSD,
        userLPAmountUSDFormatted,
    };
}