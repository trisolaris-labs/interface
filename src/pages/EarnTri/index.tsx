import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { PageWrapper } from '../../components/Page'
import FarmBanner from '../../components/earn/FarmBanner'
import EarnTri from './EarnTri'

const POOLS_ORDER = [5, 11, 8, 30, 7, 0, 1, 2, 3, 4, 15, 17, 18, 19, 20, 21, 22, 23, 24, 26, 27, 28]
const LEGACY_POOLS = [6, 16, 12, 13, 14, 9, 10]

const MemoizedFarmBanner = React.memo(FarmBanner)

export default function Earn({
  match: {
    params: { version }
  }
}: RouteComponentProps<{ version: string }>) {
  return (
    <PageWrapper gap="lg" justify="center">
      <MemoizedFarmBanner />
      <EarnTri poolsOrder={POOLS_ORDER} legacyPoolsOrder={LEGACY_POOLS} />
    </PageWrapper>
  )
}