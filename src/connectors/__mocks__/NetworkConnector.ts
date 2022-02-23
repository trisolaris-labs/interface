class MiniRpcProvider {}

export const NetworkConnector = jest.fn().mockImplementation(
  () =>
    class NetworkConnectorMock {
      public get provider(): MiniRpcProvider {
        return jest.fn()
      }

      public async activate(): Promise<any> {
        return jest.fn()
      }

      public async getProvider(): Promise<any> {
        return jest.fn()
      }

      public async getChainId(): Promise<any> {
        return jest.fn()
      }

      public async getAccount(): Promise<null> {
        return null
      }

      public deactivate() {
        return
      }
    }
)
