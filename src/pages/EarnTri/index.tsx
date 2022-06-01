import React from 'react'
import { PageWrapper } from '../../components/Page'
import FarmBanner from '../../components/earn/FarmBanner'
import EarnTri from './EarnTri'

export default function Earn() {
  return (
    <PageWrapper gap="lg" justify="center">
      <FarmBanner />
      <EarnTri />
    </PageWrapper>
  )
}
