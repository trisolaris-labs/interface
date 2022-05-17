import React from 'react'
import { PageWrapper } from '../../components/Page'
import FarmBanner from '../../components/earn/FarmBanner'
import EarnTri from './EarnTri'

const MemoizedFarmBanner = React.memo(FarmBanner)

export default function Earn() {
  return (
    <PageWrapper gap="lg" justify="center">
      <MemoizedFarmBanner />
      <EarnTri />
    </PageWrapper>
  )
}
