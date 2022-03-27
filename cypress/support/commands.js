import { JsonRpcBatchProvider } from '@ethersproject/providers'
import { Wallet } from '@ethersproject/wallet'
import { Eip1193Bridge } from '@ethersproject/experimental'

export const TEST_ADDRESS_NEVER_USE_SHORTENED = Cypress.env('PRIVATE_TEST_WALLET_ADDRESS_SHORTENED')

class CustomizedBridge extends Eip1193Bridge {
  async sendAsync(...args) {
    return this.send(...args)
  }
  async send(...args) {
    const isCallbackForm = typeof args[0] === 'object' && typeof args[1] === 'function'
    let callback
    let method
    let params
    if (isCallbackForm) {
      callback = args[1]
      method = args[0].method
      params = args[0].params
    } else {
      method = args[0]
      params = args[1]
    }
    console.log(`method: ${method}`)
    function wrapResponse(result, error = null) {
      if (result == null && result == null) {
        error = new Error(`Something went wrong on result, result is${result}`)
      }
      if (isCallbackForm) {
        callback(error, result ? { result } : null)
      } else {
        return result ? Promise.resolve(result) : Promise.reject(error)
      }
    }
    if (method === 'eth_requestAccounts' || method === 'eth_accounts') {
      return wrapResponse([Cypress.env('PRIVATE_TEST_WALLET_ADDRESS')])
    }
    if (method === 'eth_chainId') {
      return wrapResponse(
        `0x${Number(Cypress.env('NETWORK_ID'))
          .toString(16)
          .toUpperCase()}`
      )
    }
    const [argsObject, ...paramsRest] = params || []
    if ((method === 'eth_call' || method === 'eth_sendTransaction') && typeof argsObject === 'object') {
      // this seems to throw unless the from arg is removed
      delete argsObject.from
    }
    if (method === 'eth_sendTransaction') {
      argsObject = { ...argsObject, gasPrice: params.gas }
      delete argsObject.gas
    }
    try {
      const result = await super.send(method, [argsObject, ...paramsRest])
      return wrapResponse(result)
    } catch (error) {
      return wrapResponse(null, error)
    }
  }
}
Cypress.Commands.overwrite('visit', (original, url, options) => {
  return original(url.startsWith('/') && url.length > 2 && !url.startsWith('/#') ? `/#${url}` : url, {
    ...options,
    onBeforeLoad(win) {
      options && options.onBeforeLoad && options.onBeforeLoad(win)
      win.localStorage.clear()
      const provider = new JsonRpcBatchProvider('https://mainnet.aurora.dev', {
        name: 'aurora',
        chainId: Number(Cypress.env('NETWORK_ID'))
      })
      const signer = new Wallet(Cypress.env('PRIVATE_TEST_WALLET_PK'), provider)
      win.ethereum = new CustomizedBridge(signer, provider)
      win.ethereum.isMetaMask = true
    }
  })
})
