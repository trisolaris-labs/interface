import React from 'react'
import { Percent, Price } from '@trisolaris/sdk'
import { useTranslation } from 'react-i18next'
import { LightCard } from '../../components/Card'
import Row from '../../components/Row'
import { TYPE } from '../../theme'
import { PoolPriceBar } from './PoolPriceBar'

type Props = {
  currencies: React.ComponentProps<typeof PoolPriceBar>['currencies']
  noLiquidity?: boolean
  poolTokenPercentage?: Percent
  price?: Price
}

export default function PriceAndPoolShare({ currencies, noLiquidity, poolTokenPercentage, price }: Props) {
  const { t } = useTranslation()

  return (
    <LightCard borderRadius={'20px'}>
      <Row marginBottom="1.5rem">
        <TYPE.subHeader fontWeight={500} fontSize={14}>
          {noLiquidity ? t('addLiquidity.initialPrices') : t('addLiquidity.prices')} {t('addLiquidity.poolShare')}
        </TYPE.subHeader>
      </Row>
      <PoolPriceBar
        currencies={currencies}
        poolTokenPercentage={poolTokenPercentage}
        noLiquidity={noLiquidity}
        price={price}
      />
    </LightCard>
  )
}
