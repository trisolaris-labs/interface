import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { PoolTabs } from '../../components/NavigationTabs'

import FullStablePositionCard from '../../components/PositionCard/StablePositionCard'
import { TYPE, HideSmall } from '../../theme'
import { RowBetween } from '../../components/Row'
import { AutoColumn } from '../../components/Column'

import { useTranslation } from 'react-i18next'
import { PageWrapper } from '../../components/Page'
import { StableSwapPoolName } from '../../state/stableswap/constants'
import _ from 'lodash'

const TitleRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column-reverse;
  `};
`

export default function Pool() {
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()

  return (
    <PageWrapper>
      <PoolTabs active="/pool/stable" />
      <AutoColumn gap="lg" justify="center">
        <AutoColumn gap="lg" style={{ width: '100%' }}>
          <TitleRow style={{ marginTop: '1rem' }} padding={'0'}>
            <HideSmall>
              <TYPE.mediumHeader style={{ marginTop: '0.5rem', justifySelf: 'flex-start' }}>
                Stable Pools
              </TYPE.mediumHeader>
            </HideSmall>
          </TitleRow>
          <FullStablePositionCard poolName={StableSwapPoolName.USDC_USDT_USN} />
          <FullStablePositionCard poolName={StableSwapPoolName.USDC_USDT} />
          <FullStablePositionCard poolName={StableSwapPoolName.USDC_USDT_UST_FRAX_USN} />
        </AutoColumn>
      </AutoColumn>
    </PageWrapper>
  )
}
