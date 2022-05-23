import React from 'react'

import { PageWrapper } from '../../components/Page'
import StakeBox from './StakeBox'
import MigrateXtri from './MigrateXtri'

function StakeV2() {
  return (
    <PageWrapper gap="lg" justify="center">
      <MigrateXtri />
      <StakeBox />
    </PageWrapper>
  )
}

export default StakeV2
