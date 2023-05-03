import React, { useContext, useMemo } from 'react'
import { ThemeContext } from 'styled-components'
import { Pair, ChainId } from '@trisolaris/sdk'
import { Link } from 'react-router-dom'
import { Text } from 'rebass'
import { useTranslation } from 'react-i18next'

import { PoolTabs } from '../../components/NavigationTabs'
import FullPositionCard from '../../components/PositionCard'
import Card from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import { StyledInternalLink, TYPE, HideSmall } from '../../theme'
import { Dots } from '../../components/swap/styleds'
import { PageWrapper } from '../../components/Page'

import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { useActiveWeb3React } from '../../hooks'
import { usePairs } from '../../data/Reserves'
import { useTrackedTokenPairs, toV2LiquidityToken } from '../../state/user/hooks'

import { TitleRow, ButtonRow, ResponsiveButtonPrimary, ResponsiveButtonSecondary, EmptyProposals } from './styleds'

export default function Pool() {
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()

  const { account, chainId } = useActiveWeb3React()

  const trackedTokenPairs = useTrackedTokenPairs()

  const tokenPairsWithLiquidityTokens = useMemo(
    () =>
      trackedTokenPairs.map(tokens => ({
        liquidityToken: toV2LiquidityToken(tokens, chainId ?? ChainId.AURORA),
        tokens
      })),
    [trackedTokenPairs, chainId]
  )
  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens
  ])
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )
  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some(V2Pair => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))
  const hasV1Liquidity = undefined
  return (
    <PageWrapper>
      <PoolTabs active="/pool" />
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

          {!account ? (
            <Card padding="40px">
              <TYPE.body color={theme.text3} textAlign="center">
                {t('pool.connectWalletToView')}
              </TYPE.body>
            </Card>
          ) : v2IsLoading ? (
            <EmptyProposals>
              <TYPE.body color={theme.text3} textAlign="center">
                <Dots>{t('pool.loading')}</Dots>
              </TYPE.body>
            </EmptyProposals>
          ) : allV2PairsWithLiquidity?.length > 0 ? (
            <>
              {allV2PairsWithLiquidity.map(v2Pair => (
                <FullPositionCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
              ))}
            </>
          ) : (
            <EmptyProposals>
              <TYPE.body color={theme.text3} textAlign="center">
                {t('pool.noLiquidity')}
              </TYPE.body>
            </EmptyProposals>
          )}

          <AutoColumn justify={'center'} gap="md">
            <Text textAlign="center" fontSize={14} style={{ padding: '.5rem 0 .5rem 0' }}>
              {hasV1Liquidity ? t('pool.uniswapV1Found') : t('pool.noSeePoolJoined')}{' '}
              <StyledInternalLink id="import-pool-link" to={hasV1Liquidity ? '/migrate/v1' : '/find'}>
                {hasV1Liquidity ? t('pool.migrateNow') : t('pool.importIt')}
              </StyledInternalLink>
            </Text>
          </AutoColumn>
        </AutoColumn>
      </AutoColumn>
    </PageWrapper>
  )
}
