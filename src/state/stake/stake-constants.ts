import { ChainId, Token } from "@trisolaris/sdk";
import {
    USDC,
    AAVE,
    DAI,
    ZERO_ADDRESS
  } from '../../constants'

export interface Staking {
    ID: number
    Tokens: [Token, Token]
    LPAddress: string
  }

const POLYGON_POOLS: {[key: string]: Staking} = {
    DAI_USDC: {
        ID: 0,
        Tokens: [DAI[ChainId.POLYGON], USDC[ChainId.POLYGON]],
        LPAddress: "0xd6f922f6eB4dfa47f53C038c7dE9bE614a49257f"
    },
    AAVE_DAI: {
        ID: 1,
        Tokens: [AAVE[ChainId.POLYGON], DAI[ChainId.POLYGON]],
        LPAddress: "0x76F4128B11f429289499BA29518Ef7E5b26025B6"
    },
}

const NULL_POOLS: {[key: string]: Staking} = {
    ZERO: {
        ID: 0,
        Tokens: [
            new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'ZERO', 'ZERO'),
            new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'ZERO', 'ZERO')],
        LPAddress: ZERO_ADDRESS,
    }
}

export const STAKING: {
    [chainid in ChainId] : {[key: string]: Staking}
  } = {
    
    [ChainId.FUJI]: NULL_POOLS,
    [ChainId.AVALANCHE]: NULL_POOLS,
    [ChainId.POLYGON]: POLYGON_POOLS,
    [ChainId.AURORA]: NULL_POOLS,
  }