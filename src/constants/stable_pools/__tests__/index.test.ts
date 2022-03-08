import _ from 'lodash';
import * as STABLE_POOLS from '../index'

describe('constants/stable_pools/index.ts', () => {
    test('Stable Pools', () => {
        _.map(STABLE_POOLS, (tokens, stablePoolName) => {
            expect({[stablePoolName]: tokens}).toMatchSnapshot()
        })
    })
});