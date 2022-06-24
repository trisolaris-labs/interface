const t = {
  WETH_WNEAR: `POOL_UTILS.createMCV1Pool({
  ID: 0,
  poolId: 0,
  tokens: [TOKENS.WETH[ChainId.AURORA], TOKENS.WNEAR[ChainId.AURORA]],
  lpAddress: '0x63da4DB6Ef4e7C62168aB03982399F9588fCd198',
  allocPoint: 1
})`,
  WNEAR_USDC_LEGACY: `POOL_UTILS.createMCV1Pool({
  ID: 1,
  poolId: 1,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.USDC[ChainId.AURORA]],
  lpAddress: '0x20F8AeFB5697B77E0BB835A8518BE70775cdA1b0',
  allocPoint: 1
})`,
  WNEAR_USDT_LEGACY: `POOL_UTILS.createMCV1Pool({
  ID: 2,
  poolId: 2,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.USDT[ChainId.AURORA]],
  lpAddress: '0x03B666f3488a7992b2385B12dF7f35156d7b29cD',
  allocPoint: 1
})`,
  USDT_USDC: `POOL_UTILS.createMCV1Pool({
  ID: 3,
  poolId: 3,
  tokens: [TOKENS.USDT[ChainId.AURORA], TOKENS.USDC[ChainId.AURORA]],
  lpAddress: '0x2fe064B6c7D274082aa5d2624709bC9AE7D16C77',
  allocPoint: 1
})`,
  WNEAR_WBTC: `POOL_UTILS.createMCV1Pool({
  ID: 4,
  poolId: 4,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.WBTC[ChainId.AURORA]],
  lpAddress: '0xbc8A244e8fb683ec1Fd6f88F3cc6E565082174Eb',
  allocPoint: 1
})`,
  TRI_WNEAR: `POOL_UTILS.createMCV1Pool({
  ID: 5,
  poolId: 5,
  tokens: [TOKENS.TRI[ChainId.AURORA], TOKENS.WNEAR[ChainId.AURORA]],
  lpAddress: '0x84b123875F0F36B966d0B6Ca14b31121bd9676AD',
  allocPoint: 1
})`,
  AURORA_WETH_LEGACY: `POOL_UTILS.createMCV1Pool({
  ID: 6,
  poolId: 6,
  tokens: [TOKENS.AURORA[ChainId.AURORA], TOKENS.WETH[ChainId.AURORA]],
  lpAddress: '0x5eeC60F348cB1D661E4A5122CF4638c7DB7A886e',
  allocPoint: 1
})`,
  AURORA_WETH: `POOL_UTILS.createMCV2Pool({
  ID: 7,
  poolId: 0,
  tokens: [TOKENS.AURORA[ChainId.AURORA], TOKENS.WETH[ChainId.AURORA]],
  lpAddress: '0x5eeC60F348cB1D661E4A5122CF4638c7DB7A886e',
  rewarderAddress: '0x94669d7a170bfe62FAc297061663e0B48C63B9B5',
  allocPoint: 1,
  isFeatured: true
})`,
  TRI_AURORA: `POOL_UTILS.createMCV2Pool({
  ID: 8,
  poolId: 1,
  tokens: [TOKENS.TRI[ChainId.AURORA], TOKENS.AURORA[ChainId.AURORA]],
  lpAddress: '0xd1654a7713617d41A8C9530Fb9B948d00e162194',
  rewarderAddress: '0x78EdEeFdF8c3ad827228d07018578E89Cf159Df1',
  allocPoint: 1,
  isFeatured: true
})`,
  WNEAR_ATLUNA: `POOL_UTILS.createMCV2Pool({
  ID: 9,
  poolId: 2,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.ATLUNA[ChainId.AURORA]],
  lpAddress: '0xdF8CbF89ad9b7dAFdd3e37acEc539eEcC8c47914',
  rewarderAddress: '0x89F6628927fdFA2592E016Ba5B14389a4b08D681',
  allocPoint: 1
})`,
  WNEAR_ATUST: `POOL_UTILS.createMCV2Pool({
  ID: 10,
  poolId: 3,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.ATUST[ChainId.AURORA]],
  lpAddress: '0xa9eded3E339b9cd92bB6DEF5c5379d678131fF90',
  rewarderAddress: '0x17d1597ec86fD6aecbfE0F32Ab2F2aD9c37E6750',
  allocPoint: 1
})`,
  TRI_USDT: `POOL_UTILS.createMCV2Pool({
  ID: 11,
  poolId: 4,
  tokens: [TOKENS.TRI[ChainId.AURORA], TOKENS.USDT[ChainId.AURORA]],
  lpAddress: '0x61C9E05d1Cdb1b70856c7a2c53fA9c220830633c',
  allocPoint: 1
})`,
  WNEAR_AVAX: `POOL_UTILS.createMCV2Pool({
  ID: 12,
  poolId: 5,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.AVAX[ChainId.AURORA]],
  lpAddress: '0x6443532841a5279cb04420E61Cf855cBEb70dc8C',
  allocPoint: 1
})`,
  WNEAR_BNB: `POOL_UTILS.createMCV2Pool({
  ID: 13,
  poolId: 6,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.BNB[ChainId.AURORA]],
  lpAddress: '0x7be4a49AA41B34db70e539d4Ae43c7fBDf839DfA',
  allocPoint: 1
})`,
  WNEAR_MATIC: `POOL_UTILS.createMCV2Pool({
  ID: 14,
  poolId: 7,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.MATIC[ChainId.AURORA]],
  lpAddress: '0x3dC236Ea01459F57EFc737A12BA3Bb5F3BFfD071',
  allocPoint: 1
})`,
  WNEAR_FLX: `POOL_UTILS.createMCV2Pool({
  ID: 15,
  poolId: 8,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.FLX[ChainId.AURORA]],
  lpAddress: '0x48887cEEA1b8AD328d5254BeF774Be91B90FaA09',
  rewarderAddress: '0x42b950FB4dd822ef04C4388450726EFbF1C3CF63',
  allocPoint: 1,
  isFeatured: true
})`,
  WNEAR_MECHA: `POOL_UTILS.createMCV2Pool({
  ID: 16,
  poolId: 9,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.MECHA[ChainId.AURORA]],
  lpAddress: '0xd62f9ec4C4d323A0C111d5e78b77eA33A2AA862f',
  rewarderAddress: '0x9847F7e33CCbC0542b05d15c5cf3aE2Ae092C057',
  allocPoint: 1
})`,
  WNEAR_SOLACE: `POOL_UTILS.createMCV2Pool({
  ID: 17,
  poolId: 10,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.SOLACE[ChainId.AURORA]],
  lpAddress: '0xdDAdf88b007B95fEb42DDbd110034C9a8e9746F2',
  rewarderAddress: '0xbbE41F699B0fB747cd4bA21067F6b27e0698Bc30',
  allocPoint: 1
})`,
  XTRI_STNEAR: `POOL_UTILS.createMCV2Pool({
  ID: 18,
  poolId: 11,
  tokens: [TOKENS.XTRI[ChainId.AURORA], TOKENS.STNEAR[ChainId.AURORA]],
  lpAddress: '0x5913f644A10d98c79F2e0b609988640187256373',
  rewarderAddress: '0x7B9e31BbEdbfdc99e3CC8b879b9a3B1e379Ce530',
  allocPoint: 1
})`,
  WNEAR_STNEAR: `POOL_UTILS.createMCV2Pool({
  ID: 19,
  poolId: 12,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.STNEAR[ChainId.AURORA]],
  lpAddress: '0x47924Ae4968832984F4091EEC537dfF5c38948a4',
  rewarderAddress: '0xf267212F1D8888e0eD20BbB0c7C87A089cDe6E88',
  allocPoint: 1,
  isFeatured: true
})`,
  AURORA_XNL: `POOL_UTILS.createMCV2Pool({
  ID: 20,
  poolId: 13,
  tokens: [TOKENS.AURORA[ChainId.AURORA], TOKENS.XNL[ChainId.AURORA]],
  lpAddress: '0xb419ff9221039Bdca7bb92A131DD9CF7DEb9b8e5',
  rewarderAddress: '0xb84293D04137c9061afe34118Dac9931df153826',
  allocPoint: 1,
  noTriRewards: true
})`,
  WNEAR_XNL: `POOL_UTILS.createMCV2Pool({
  ID: 21,
  poolId: 14,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.XNL[ChainId.AURORA]],
  lpAddress: '0xFBc4C42159A5575a772BebA7E3BF91DB508E127a',
  rewarderAddress: '0x028Fbc4BB5787e340524EF41d95875Ac2C382101',
  allocPoint: 1
})`,
  USDT_GBA: `POOL_UTILS.createMCV2Pool({
  ID: 22,
  poolId: 15,
  tokens: [TOKENS.USDT[ChainId.AURORA], TOKENS.GBA[ChainId.AURORA]],
  lpAddress: '0x7B273238C6DD0453C160f305df35c350a123E505',
  rewarderAddress: '0xDAc58A615E2A1a94D7fb726a96C273c057997D50',
  allocPoint: 1
})`,
  USDT_AUSDO: `POOL_UTILS.createMCV2Pool({
  ID: 23,
  poolId: 16,
  tokens: [TOKENS.USDT[ChainId.AURORA], TOKENS.AUSDO[ChainId.AURORA]],
  lpAddress: '0x6277f94a69Df5df0Bc58b25917B9ECEFBf1b846A',
  rewarderAddress: '0x170431D69544a1BC97855C6564E8460d39508844',
  allocPoint: 1,
  inStaging: false,
  isFeatured: true
})`,
  WNEAR_BBT: `POOL_UTILS.createMCV2Pool({
  ID: 24,
  poolId: 17,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.BBT[ChainId.AURORA]],
  lpAddress: '0xadAbA7E2bf88Bd10ACb782302A568294566236dC',
  rewarderAddress: '0x41A7e26a2cC7DaDc5A31fE9DD77c30Aeb029184d',
  allocPoint: 1,
  inStaging: false,
  noTriRewards: true
})`,
  // Needed to add the this pool due to some functions and features breaking when jumping from ID 24 to 26.
  // TODO:  Will be replaced by stable farm pool in stable farms PR.
  USDC_USDT: `POOL_UTILS.createMCV2Pool({
  ID: 25,
  poolId: 18,
  tokens: STABLESWAP_POOLS[StableSwapPoolName.USDC_USDT].poolTokens,
  lpAddress: STABLESWAP_POOLS[StableSwapPoolName.USDC_USDT].lpToken.address,
  rewarderAddress: '',
  allocPoint: 1,
  inStaging: true,
  stableSwapPoolName: StableSwapPoolName.USDC_USDT
})`,
  SHITZU_USDC: `POOL_UTILS.createMCV2Pool({
  ID: 26,
  poolId: 19,
  tokens: [TOKENS.SHITZU[ChainId.AURORA], TOKENS.USDC[ChainId.AURORA]],
  lpAddress: '0x5E74D85311fe2409c341Ce49Ce432BB950D221DE',
  allocPoint: 1,
  inStaging: false
})`,
  WNEAR_ROSE: `POOL_UTILS.createMCV2Pool({
  ID: 27,
  poolId: 20,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.ROSE[ChainId.AURORA]],
  lpAddress: '0xbe753E99D0dBd12FB39edF9b884eBF3B1B09f26C',
  rewarderAddress: '0xfe9B7A3bf38cE0CA3D5fA25d371Ff5C6598663d4',
  allocPoint: 1,
  inStaging: false,
  isFeatured: true
})`,
  WNEAR_RUSD: `POOL_UTILS.createMCV2Pool({
  ID: 28,
  poolId: 21,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.RUSD[ChainId.AURORA]],
  lpAddress: '0xbC0e71aE3Ef51ae62103E003A9Be2ffDe8421700',
  rewarderAddress: '0x87a03aFA70302a5a0F6156eBEd27f230ABF0e69C',
  allocPoint: 1,
  inStaging: false,
  isFeatured: true
})`,
  WNEAR_LINEAR: `POOL_UTILS.createMCV2Pool({
  ID: 29,
  poolId: 22,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.LINEAR[ChainId.AURORA]],
  lpAddress: '0xbceA13f9125b0E3B66e979FedBCbf7A4AfBa6fd1',
  rewarderAddress: '0x1616B20534d1d1d731C31Ca325F4e909b8f3E0f0',
  allocPoint: 1,
  inStaging: false,
  isFeatured: true
})`,
  WNEAR_BSTN: `POOL_UTILS.createMCV2Pool({
  ID: 30,
  poolId: 23,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.BSTN[ChainId.AURORA]],
  lpAddress: '0xBBf3D4281F10E537d5b13CA80bE22362310b2bf9',
  rewarderAddress: '0xDc6d09f5CC085E29972d192cB3AdCDFA6495a741',
  allocPoint: 1,
  inStaging: false,
  isFeatured: true
})`,
  WNEAR_AURORA: `POOL_UTILS.createMCV2Pool({
  ID: 31,
  poolId: 24,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.AURORA[ChainId.AURORA]],
  lpAddress: '0x1e0e812FBcd3EB75D8562AD6F310Ed94D258D008',
  rewarderAddress: '0x34c58E960b80217fA3e0323d37563c762a131AD9',
  allocPoint: 1,
  inStaging: false,
  isFeatured: true
})`,
  WNEAR_USDC: `POOL_UTILS.createMCV2Pool({
  ID: 32,
  poolId: 25,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.USDC[ChainId.AURORA]],
  lpAddress: '0x20F8AeFB5697B77E0BB835A8518BE70775cdA1b0',
  rewarderAddress: '0x84C8B673ddBF0F647c350dEd488787d3102ebfa3',
  allocPoint: 1,
  inStaging: false,
  isFeatured: true
})`,
  WNEAR_USDT: `POOL_UTILS.createMCV2Pool({
  ID: 33,
  poolId: 26,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.USDT[ChainId.AURORA]],
  lpAddress: '0x03B666f3488a7992b2385B12dF7f35156d7b29cD',
  rewarderAddress: '0x4e0152b260319e5131f853AeCB92c8f992AA0c97',
  allocPoint: 1,
  inStaging: false,
  isFeatured: true
})`,
  KSW_WNEAR: `POOL_UTILS.createMCV2Pool({
  ID: 34,
  poolId: 27,
  tokens: [TOKENS.KSW[ChainId.AURORA], TOKENS.WNEAR[ChainId.AURORA]],
  lpAddress: '0x29C160d2EF4790F9A23B813e7544D99E539c28Ba',
  rewarderAddress: '0x0Cc7e9D333bDAb07b2C8d41363C72c472B7E9594',
  allocPoint: 1,
  inStaging: false,
  noTriRewards: true
})`,
  USDC_USDT_USN: `POOL_UTILS.createMCV2Pool({
  ID: 35,
  poolId: 28,
  tokens: STABLESWAP_POOLS[StableSwapPoolName.USDC_USDT_USN].poolTokens,
  lpAddress: STABLESWAP_POOLS[StableSwapPoolName.USDC_USDT_USN].lpToken.address,
  rewarderAddress: '0x78391f26397A099Ec9cC346A23f856d1284cBd06',
  allocPoint: 1,
  inStaging: false,
  stableSwapPoolName: StableSwapPoolName.USDC_USDT_USN,
  isFeatured: true
})`,
  WNEAR_SMARTPAD: `POOL_UTILS.createMCV2Pool({
  ID: 36,
  poolId: 29,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.SMARTPAD[ChainId.AURORA]],
  lpAddress: '0x6a29e635bcab8abee1491059728e3d6d11d6a114',
  rewarderAddress: '0xe4A4e38a30E9100a147e0C146a9AeAC74C28eD4f',
  allocPoint: 1,
  noTriRewards: true
})`,
  TRI_STNEAR: `POOL_UTILS.createMCV2Pool({
  ID: 37,
  poolId: 30,
  tokens: [TOKENS.TRI[ChainId.AURORA], TOKENS.STNEAR[ChainId.AURORA]],
  lpAddress: '0x120e713AD36eCBff171FC8B7cf19FA8B6f6Ba50C',
  rewarderAddress: '0xD59c44fb39638209ec4ADD6DcD7A230a286055ee',
  allocPoint: 1,
  isFeatured: true
})`,
  WNEAR_BRRR: `POOL_UTILS.createMCV2Pool({
  ID: 38,
  poolId: 31,
  tokens: [TOKENS.WNEAR[ChainId.AURORA], TOKENS.BRRR[ChainId.AURORA]],
  lpAddress: '0x71dBEB011EAC90C51b42854A77C45C1E53242698',
  rewarderAddress: '0x9a418aB67F94164EB931344A4EBF1F7bDd3E97aE',
  allocPoint: 1,
  isFeatured: true
})`,
  NUSD_USDC_USDT: `POOL_UTILS.createMCV2Pool({
  ID: 39,
  poolId: 32,
  tokens: STABLESWAP_POOLS[StableSwapPoolName.NUSD_USDC_USDT].poolTokens,
  lpAddress: STABLESWAP_POOLS[StableSwapPoolName.NUSD_USDC_USDT].lpToken.address,
  rewarderAddress: '0xf4ac19e819f5940E92543B544126E7F20b5f6978',
  allocPoint: 1,
  inStaging: false,
  stableSwapPoolName: StableSwapPoolName.NUSD_USDC_USDT,
  friendlyFarmName: STABLESWAP_POOLS[StableSwapPoolName.NUSD_USDC_USDT].friendlyName,
  isFeatured: true
})`
}

const fs = require('fs').promises
const path = require('path')
const _ = require('lodash')

async function main() {
  console.log(__dirname)
  const calls = Object.keys(t).map(key => {
    return async () => {
      const data = `import { ChainId } from '@trisolaris/sdk'
import * as TOKENS from '../../../../constants/tokens'
import * as POOL_UTILS from '../utils'

export default ${t[key]}
`
      await fs.writeFile(path.join(__dirname, `../../src/state/stake/pools/lib/${key}.ts`), data)
    }
  })

  return await Promise.all(calls.map(v => v()))
}

main().catch(e => console.error('Error: ', e))
