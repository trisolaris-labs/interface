/* eslint-disable @typescript-eslint/no-var-requires */
const { ChainId, Token } = require('@trisolaris/sdk')
const { readdir, readFile, writeFile } = require('fs')
const path = require('path')
const _ = require('lodash')

const TOKEN_MAP = require('./base_tokens_map')
const { createXChainToken } = require('./utils')

const TOKENS_FOLDER_PATH = path.join(__dirname, '../../src/constants/tokens')
const TOKEN_SUBMODULE_TOKENLISTS_PATH = path.join(__dirname, '../../tokens/lists')

// This kicks it all off
init()

async function init() {
  const allTokens = await getAllTokensFromTokenLists()

  const mergedTokenMap = createMergedTokenMap(allTokens)

  const generatedFileWarningMessage =
    '/**********************************************************************************************' +
    '\n * THIS FILE IS GENERATED' +
    '\n *' +
    '\n * DO NOT MODIFY THIS FILE MANUALLY -- IT WILL BE OVERWRITTEN' +
    '\n *' +
    '\n * THIS FILE UPDATES BASED ON THE `master` BRANCH OF https://github.com/trisolaris-labs/tokens/' +
    '\n * RUN `yarn build-tokens` TO UPDATE THIS FILE' +
    '\n **********************************************************************************************/'

  const imports = "\n\nimport { ChainId, Token } from '@trisolaris/sdk'"

  const tokens = _.map(mergedTokenMap, (tokenObj, symbol) => {
    // Removes extra whitespace and replaces spaces with `_`
    const formattedSymbol = symbol
      .toUpperCase()
      .trim()
      .replace(/\W+/g, '_')
    const token =
      `\n\nexport const ${formattedSymbol}: { [chainId in ChainId]: Token } = {` +
      `${_.map(tokenObj, (token, chainID) => {
        let chainEnumString = null

        switch (Number(chainID)) {
          case ChainId.FUJI: {
            chainEnumString = 'ChainId.FUJI'
            break
          }
          case ChainId.AVALANCHE: {
            chainEnumString = 'ChainId.AVALANCHE'
            break
          }
          case ChainId.POLYGON: {
            chainEnumString = 'ChainId.POLYGON'
            break
          }
          case ChainId.AURORA: {
            chainEnumString = 'ChainId.AURORA'
            break
          }
          default:
            throw new Error('ChainID not found: ' + chainID)
        }

        return `\n  [${chainEnumString}]: new Token(${chainEnumString}, '${token.address}', ${token.decimals}, '${token.symbol}', '${token.name}'),`
      }).join('')}` +
      '\n}'

    return token
  })

  await createTokenFile(generatedFileWarningMessage + imports + tokens.join(''))
}

async function createTokenFile(contents) {
  return new Promise((resolve, reject) =>
    writeFile(`${TOKENS_FOLDER_PATH}/index.ts`, contents, err => (err ? reject(err) : resolve()))
  )
}

function createMergedTokenMap(allTokens) {
  const tokensRepoMap = _.reduce(
    allTokens,
    (acc, tokenData) => {
      if (tokenData?.symbol == null) {
        throw new Error('No symbol found in ' + JSON.stringify(tokenData, null, ' '))
      }

      const { address, chainId, decimals, name, symbol } = tokenData
      const symbolUpperCase = symbol.toUpperCase()

      if (acc[symbolUpperCase] == null) {
        acc[symbolUpperCase] = {}
      }

      acc[symbolUpperCase][chainId] = new Token(chainId, address, decimals, symbol, name)

      return acc
    },
    {}
  )

  // Merges base_tokens_map data in to tokensRepoMap.  Source objects
  // are applied from left to right. Subsequent sources overwrite property
  // assignments of previous sources.
  const mergedTokenMap = _.merge(tokensRepoMap, TOKEN_MAP)

  // Fill in partially-filled xchain tokens with xchain compatible token data
  return _.transform(
    mergedTokenMap,
    (acc, xchainTokenObj, symbol) => {
      const completeXChainTokenData = createXChainToken(xchainTokenObj)

      acc[symbol] = completeXChainTokenData

      return acc
    },
    {}
  )
}

// @returns Array<Token>
async function getAllTokensFromTokenLists() {
  const chainIDs = await getTokenListChainIDs()
  const allTokens = await _.attempt(async () =>
    (await Promise.all(chainIDs.map(getTokenListForChainID))).map(JSON.parse).map(({ tokens }) => tokens)
  )

  return _.flatten(allTokens)
}

async function getTokenListForChainID(chainID) {
  return new Promise((resolve, reject) =>
    readFile(`${TOKEN_SUBMODULE_TOKENLISTS_PATH}/${chainID}/list.json`, 'utf-8', (err, data) =>
      err ? reject(err) : resolve(data)
    )
  )
}

async function getTokenListChainIDs() {
  return new Promise((resolve, reject) =>
    readdir(TOKEN_SUBMODULE_TOKENLISTS_PATH, { withFileTypes: true }, (err, dirent) =>
      err ? reject(err) : resolve(dirent.filter(dir => dir.isDirectory()).map(({ name }) => name))
    )
  )
}
