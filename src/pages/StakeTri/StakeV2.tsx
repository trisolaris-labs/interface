import React from 'react'

import { PageWrapper } from '../../components/Page'
import StakeBox from './StakeBox'
import MigrateXtri from './MigrateXtri'
import ClaimPtri from './ClaimPtri'

function StakeV2() {
  return (
    <PageWrapper gap="lg" justify="center">
      <MigrateXtri />
      <StakeBox />
      <ClaimPtri />
    </PageWrapper>
  )
}

export default StakeV2
