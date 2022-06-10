import React, { useState } from 'react'
import styled from 'styled-components'
import { PoolTabs } from '../../components/NavigationTabs'

import FullStablePositionCard from '../../components/PositionCard/StablePositionCard'
import { TYPE } from '../../theme'
import { RowBetween } from '../../components/Row'
import { AutoColumn } from '../../components/Column'

import { PageWrapper } from '../../components/Page'
import { StableSwapPoolName } from '../../state/stableswap/constants'
import _ from 'lodash'
import Toggle from '../../components/Toggle'

const TitleRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column;
  `};
`

export default function Pool() {
  const [showDeprecatedPools, setShowDeprecatedPools] = useState(false)

  return (
    <PageWrapper>
      <PoolTabs active="/pool/stable" />
      <AutoColumn gap="lg" justify="center">
        <AutoColumn gap="lg" style={{ width: '100%' }}>
          <TitleRow style={{ marginTop: '1rem' }} padding={'0'}>
            <TYPE.mediumHeader style={{ marginTop: '0.5rem', justifySelf: 'flex-start' }}>
              Stable Pools
            </TYPE.mediumHeader>
          </TitleRow>
          <FullStablePositionCard poolName={StableSwapPoolName.USDC_USDT_USN} />
          <FullStablePositionCard poolName={StableSwapPoolName.USDC_USDT_NEW} />
          <FullStablePositionCard poolName={StableSwapPoolName.NUSD_USDC_USDT} />
        </AutoColumn>
        <AutoColumn gap="lg" style={{ width: '100%' }}>
          <TitleRow style={{ marginTop: '2.5rem' }} padding={'0'}>
            <TYPE.mediumHeader style={{ justifySelf: 'flex-start' }}>Deprecated Stable Pools</TYPE.mediumHeader>
            <Toggle
              isActive={showDeprecatedPools}
              toggle={() => setShowDeprecatedPools(!showDeprecatedPools)}
              customToggleText={{ on: 'Show', off: 'Hide' }}
              fontSize="12px"
            />
          </TitleRow>
          {showDeprecatedPools ? (
            <>
              <FullStablePositionCard poolName={StableSwapPoolName.USDC_USDT} />
              <FullStablePositionCard poolName={StableSwapPoolName.USDC_USDT_UST_FRAX_USN} />
            </>
          ) : null}
        </AutoColumn>
      </AutoColumn>
    </PageWrapper>
  )
}
