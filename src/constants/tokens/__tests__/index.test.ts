import _ from 'lodash';
import * as TOKENS from '../../tokens'

const  {
  PNG,
USDT,
WBTC,
DAI,
TRI,
XTRI,
AURORA,
ATUST,
ATLUNA,
USDC,
AAVE,
WNEAR,
AVAX,
MATIC,
BNB,
FLX,
MECHA,
SOLACE,
STNEAR,
META,
GBA,
XNL,
} = TOKENS

const BASE_TOKENS = {
  PNG,
USDT,
WBTC,
DAI,
TRI,
XTRI,
AURORA,
ATUST,
ATLUNA,
USDC,
AAVE,
WNEAR,
AVAX,
MATIC,
BNB,
FLX,
MECHA,
SOLACE,
STNEAR,
META,
GBA,
XNL,
}

describe('constants/index.ts', () => {
    test('Base Tokens', () => {
        _.map(BASE_TOKENS, (symbol, token) => {
            expect({[token]: symbol}).toMatchSnapshot()
        })
    })
});