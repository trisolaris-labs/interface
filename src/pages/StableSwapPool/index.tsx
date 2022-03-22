import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { PoolTabs } from '../../components/NavigationTabs'

import FullStablePositionCard from '../../components/StablePositionCard'
import { TYPE, HideSmall } from '../../theme'
import Card from '../../components/Card'
import { RowBetween } from '../../components/Row'
import { AutoColumn } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'
import { ChainId } from '@trisolaris/sdk'
import { useTranslation } from 'react-i18next'
import { PageWrapper } from '../../components/Page'
import { STABLESWAP_POOLS } from '../../state/stableswap/constants'
import _ from 'lodash'
import Toggle from '../../components/Toggle'

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
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()

  return (
    <PageWrapper>
      <PoolTabs active="/pool/stable" />
      <AutoColumn gap="lg" justify="center">
        <AutoColumn gap="lg" style={{ width: '100%' }}>
          <TitleRow style={{ marginTop: '1rem' }} padding={'0'}>
            <HideSmall>
              <TYPE.mediumHeader style={{ marginTop: '0.5rem', justifySelf: 'flex-start' }}>
                {t('pool.yourLiquidity')}
              </TYPE.mediumHeader>
            </HideSmall>
          </TitleRow>

          {account ? (
            <>
              {_.map(STABLESWAP_POOLS[ChainId.AURORA]).map(({ name }) => (
                <FullStablePositionCard key={name} poolName={name} />
              ))}
            </>
          ) : (
            <Card padding="40px">
              <TYPE.body color={theme.text3} textAlign="center">
                {t('pool.connectWalletToView')}
              </TYPE.body>
            </Card>
          )}
        </AutoColumn>
      </AutoColumn>
    </PageWrapper>
  )
}
