import { ChainId } from '@trisolaris/sdk'
import { STAKING } from '../stake-constants'

describe('stake-constants.ts', () => {
  test('Polygon Pools', () => {
    STAKING[ChainId.POLYGON].forEach(pool => expect(pool).toMatchSnapshot(`Polygon Pool [ID: ${pool.ID}]`))
  })
  test('Aurora Pools', () => {
    STAKING[ChainId.AURORA].forEach(pool => expect(pool).toMatchSnapshot(`Aurora Pool [ID: ${pool.ID}]`))
  })
})
