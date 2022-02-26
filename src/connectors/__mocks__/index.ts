export const NETWORK_CHAIN_ID: number = parseInt(process.env.REACT_APP_CHAIN_ID ?? '1313161554')

export const network = jest.fn()

export const getNetworkLibrary = jest.fn()

export const injected = jest.fn()

export const walletlink = jest.fn()

export const walletconnect = jest.fn()
