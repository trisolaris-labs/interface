import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Link } from 'react-router-dom'
import { SwapPoolTabs } from '../../components/NavigationTabs'

import FullStablePositionCard from '../../components/StablePositionCard'
import { TYPE, HideSmall } from '../../theme'
import { Text } from 'rebass'
import Card from '../../components/Card'
import { RowBetween, RowFixed } from '../../components/Row'
import { ButtonPrimary, ButtonSecondary } from '../../components/Button'
import { AutoColumn } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'
import { ChainId } from '@trisolaris/sdk'
import { useTranslation } from 'react-i18next'
import { PageWrapper } from '../../components/Page'
import { STABLESWAP_POOLS } from '../../state/stableswap/constants'
import _ from 'lodash'

const TitleRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column-reverse;
  `};
`

const ButtonRow = styled(RowFixed)`
  gap: 8px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    flex-direction: row-reverse;
    justify-content: space-between;
  `};
`

const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
`

const ResponsiveButtonSecondary = styled(ButtonSecondary)`
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
`

export default function Pool() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()

  return (
    <PageWrapper>
      <SwapPoolTabs active={'pool'} />

      <AutoColumn gap="lg" justify="center">
        <AutoColumn gap="lg" style={{ width: '100%' }}>
          <TitleRow style={{ marginTop: '1rem' }} padding={'0'}>
            <HideSmall>
              <TYPE.mediumHeader style={{ marginTop: '0.5rem', justifySelf: 'flex-start' }}>
                {t('pool.yourLiquidity')}
              </TYPE.mediumHeader>
            </HideSmall>
            <ButtonRow>
              <ResponsiveButtonSecondary as={Link} padding="6px 8px" to="/create/ETH">
                {t('pool.createPair')}
              </ResponsiveButtonSecondary>
              <ResponsiveButtonPrimary id="join-pool-button" as={Link} padding="6px 8px" to="/add/ETH">
                <Text fontWeight={500} fontSize={16}>
                  {t('pool.addLiquidity')}
                </Text>
              </ResponsiveButtonPrimary>
            </ButtonRow>
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
