import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { PageWrapper } from '../../components/Page'
import FarmBanner from '../../components/earn/FarmBanner'
import EarnTri from './EarnTri'
import EarnTriStable from './EarnTriStable'
import { FarmType } from './FarmType'
import { ENABLE_STABLE_FARMS } from '../../constants'

const POOLS_ORDER = [32, 33, 5, 11, 31, 8, 30, 7, 0, 3, 4, 15, 17, 18, 19, 20, 21, 22, 23, 24, 26, 27, 28, 29, 34]
const LEGACY_POOLS = [1, 2, 6, 16, 12, 13, 14, 9, 10]
const STABLE_POOLS = [35]

const MemoizedFarmBanner = React.memo(FarmBanner)

export default function Earn({
  match: {
    params: { farmType = FarmType.NORMAL }
  }
}: RouteComponentProps<{ farmType?: FarmType }>) {
  return (
    <PageWrapper gap="lg" justify="center">
      <MemoizedFarmBanner />
      {farmType === FarmType.STABLE && ENABLE_STABLE_FARMS ? (
        <EarnTriStable stablePoolsOrder={STABLE_POOLS} />
      ) : (
        <EarnTri poolsOrder={POOLS_ORDER} legacyPoolsOrder={LEGACY_POOLS} />
      )}
    </PageWrapper>
  )
}
