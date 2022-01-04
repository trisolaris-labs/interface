import { Currency, CETH, JSBI, TokenAmount } from '@trisolaris/sdk'
import React, { useCallback, useEffect, useState } from 'react'
import { Plus } from 'react-feather'
import { Text } from 'rebass'
import { ButtonDropdownLight } from '../../components/Button'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import CurrencyLogo from '../../components/CurrencyLogo'
import { FindPoolTabs } from '../../components/NavigationTabs'
import { MinimalPositionCard } from '../../components/PositionCard'
import Row from '../../components/Row'
import CurrencySearchModal from '../../components/SearchModal/CurrencySearchModal'
import { PairState, usePair } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'
import { usePairAdder } from '../../state/user/hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { StyledInternalLink } from '../../theme'
import { currencyId } from '../../utils/currencyId'
import AppBody from '../AppBody'
import { Dots } from '../Pool/styleds'
import { useTranslation } from 'react-i18next'
import { GreyCard } from '../../components/Card'

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1
}

export default function PoolFinder() {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()

  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1)

  const [currency0, setCurrency0] = useState<Currency | null>(CETH)
  const [currency1, setCurrency1] = useState<Currency | null>(null)

  const [pairState, pair] = usePair(currency0 ?? undefined, currency1 ?? undefined)
  const addPair = usePairAdder()
  useEffect(() => {
    if (pair) {
      addPair(pair)
    }
  }, [pair, addPair])

  const validPairNoLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(
      pairState === PairState.EXISTS &&
        pair &&
        JSBI.equal(pair.reserve0.raw, JSBI.BigInt(0)) &&
        JSBI.equal(pair.reserve1.raw, JSBI.BigInt(0))
    )

  const position: TokenAmount | undefined = useTokenBalance(account ?? undefined, pair?.liquidityToken)
  const hasPosition = Boolean(position && JSBI.greaterThan(position.raw, JSBI.BigInt(0)))

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency)
      } else {
        setCurrency1(currency)
      }
    },
    [activeField]
  )

  const handleSearchDismiss = useCallback(() => {
    setShowSearch(false)
  }, [setShowSearch])

  const prerequisiteMessage = (
    <GreyCard padding="45px 10px">
      <Text textAlign="center">
        {!account ? t('poolFinder.connectToFind') : t('poolFinder.selectTokenToFind')}
      </Text>
    </GreyCard>
  )

  return (
    <AppBody>
      <FindPoolTabs />
      <AutoColumn gap="md">
        <ButtonDropdownLight
          onClick={() => {
            setShowSearch(true)
            setActiveField(Fields.TOKEN0)
          }}
        >
          {currency0 ? (
            <Row>
              <CurrencyLogo currency={currency0} />
              <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>
                {currency0.symbol}
              </Text>
            </Row>
          ) : (
            <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>
              {t('poolFinder.selectToken')}
            </Text>
          )}
        </ButtonDropdownLight>

        <ColumnCenter>
          <Plus size="16" color="#888D9B" />
        </ColumnCenter>

        <ButtonDropdownLight
          onClick={() => {
            setShowSearch(true)
            setActiveField(Fields.TOKEN1)
          }}
        >
          {currency1 ? (
            <Row>
              <CurrencyLogo currency={currency1} />
              <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>
                {currency1.symbol}
              </Text>
            </Row>
          ) : (
            <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>
              {t('poolFinder.selectToken')}
            </Text>
          )}
        </ButtonDropdownLight>

        {hasPosition && (
          <ColumnCenter
            style={{ justifyItems: 'center', backgroundColor: '', padding: '12px 0px', borderRadius: '12px' }}
          >
            <Text textAlign="center" fontWeight={500}>
              {t('poolFinder.poolFound')}
            </Text>
            <StyledInternalLink to={`/pool`}>
              <Text textAlign="center">{t('poolFinder.managePool')}</Text>
            </StyledInternalLink>
          </ColumnCenter>
        )}

        {currency0 && currency1 ? (
          pairState === PairState.EXISTS ? (
            hasPosition && pair ? (
              <MinimalPositionCard pair={pair} border="1px solid #CED0D9" />
            ) : (
              <GreyCard padding="45px 10px">
                <AutoColumn gap="sm" justify="center">
                  <Text textAlign="center">{t('poolFinder.noLiquidityYet')}</Text>
                  <StyledInternalLink to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                    <Text textAlign="center">{t('poolFinder.addLiquidity')}</Text>
                  </StyledInternalLink>
                </AutoColumn>
              </GreyCard>
            )
          ) : validPairNoLiquidity ? (
            <GreyCard padding="45px 10px">
              <AutoColumn gap="sm" justify="center">
                <Text textAlign="center">{t('poolFinder.noPoolFound')}</Text>
                <StyledInternalLink to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                  {t('poolFinder.createPool')}
                </StyledInternalLink>
              </AutoColumn>
            </GreyCard>
          ) : pairState === PairState.INVALID ? (
            <GreyCard padding="45px 10px">
              <AutoColumn gap="sm" justify="center">
                <Text textAlign="center" fontWeight={500}>
                  {t('poolFinder.invalidPair')}
                </Text>
              </AutoColumn>
            </GreyCard>
          ) : pairState === PairState.LOADING ? (
            <GreyCard padding="45px 10px">
              <AutoColumn gap="sm" justify="center">
                <Text textAlign="center">
                  {t('poolFinder.loading')}
                  <Dots />
                </Text>
              </AutoColumn>
            </GreyCard>
          ) : null
        ) : (
          prerequisiteMessage
        )}
      </AutoColumn>

      <CurrencySearchModal
        isOpen={showSearch}
        onCurrencySelect={handleCurrencySelect}
        onDismiss={handleSearchDismiss}
        showCommonBases
        selectedCurrency={(activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined}
      />
    </AppBody>
  )
}
