export const NetworkConnector = jest.fn().mockImplementation(
  () =>
    class NetworkConnectorMock {
      public get provider(): MiniRpcProvider {
        return jest.fn()
      }

      public async activate(): Promise<ConnectorUpdate> {
        return jest.fn()
      }

      public async getProvider(): Promise<MiniRpcProvider> {
        return jest.fn()
      }

      public async getChainId(): Promise<number> {
        return jest.fn()
      }

      public async getAccount(): Promise<null> {
        return jest.fn()
      }

      public deactivate() {
        return
      }
    }
)
