const { Token } = require('@trisolaris/sdk')
const { writeFile } = require('fs')
const path = require('path')
const { data_sources } = require('../../configs')
const { configManager } = require('@trisolaris/sdk')
// eslint-disable-next-line no-new-func
const importDynamic = new Function('modulePath', 'return import(modulePath)')

const fetch = async (...args) => (await importDynamic('node-fetch')).default(...args)

const AVALIABLE_CHAINS_DATA_FOLDER_PATH = path.join(__dirname, '../../src/constants/availableChainsData')
const AVALIABLE_CHAINS_DATA = data_sources.available_chains_data
const CONTRACT_ADDRESSES_SOURCE_URL = data_sources.contract_addresses_base_url

async function getAvailableChainsData() {
  const response = await fetch(AVALIABLE_CHAINS_DATA)
  const { available_chains_data } = await response.json()
  return available_chains_data
}

async function getContractAddresses(chainID) {
  try {
    const response = await fetch(`${CONTRACT_ADDRESSES_SOURCE_URL}/${chainID}.json`)
    return await response.json()
  } catch (e) {
    return null
  }
}

async function init() {
  const allChainsData = await getAvailableChainsData()
  if (!allChainsData || Object.keys(allChainsData).length === 0) {
    throw new Error('No chains data found')
  }
  for (const chainID in allChainsData) {
    const contractAddresses = await getContractAddresses(chainID)
    if (contractAddresses && Object.keys(contractAddresses).length > 0) {
      allChainsData[chainID].multiCallAddress = contractAddresses['multicall']
      if (contractAddresses['weth']) {
        const contractAddress = contractAddresses['weth']
        const symbol = 'W' + allChainsData[chainID].baseCurrencyLabel
        const name =
          'Wrapped ' +
          allChainsData[chainID].baseCurrencyLabel.replace(
            /\w\S*/g,
            text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
          )
        allChainsData[chainID].WETH = {
          address: contractAddress,
          symbol,
          name,
          decimals: 18
        }
      }
      allChainsData[chainID].factoryAddress = contractAddresses['factory']
      allChainsData[chainID].routerAddress = contractAddresses['router']
      allChainsData[chainID].initCodeHash = contractAddresses['initCodeHash']
    }
  }

  writeFile(
    path.join(AVALIABLE_CHAINS_DATA_FOLDER_PATH, 'availableChainsData.json'),
    JSON.stringify(allChainsData, null, 2),
    err => {
      if (err) {
        console.error('Error writing available chains file: ', err)
      }
    }
  )
}

init()
