import React from 'react'
import { AutoColumn } from '../Column'
import styled from 'styled-components'
import { TYPE } from '../../theme'
import DoubleCurrencyLogo from '../DoubleLogo'
import { Token, TokenAmount } from '@trisolaris/sdk'
import { ButtonPrimary } from '../Button'
import { AutoRow, RowBetween } from '../Row'
import { ChefVersions } from '../../state/stake/stake-constants'
import { useColorForToken } from '../../hooks/useColor'
import { currencyId } from '../../utils/currencyId'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { useTranslation } from 'react-i18next'
import Card from '../Card'
import { useHistory } from 'react-router-dom'
import { addCommasToNumber } from '../../utils'
import getTokenPairRenderOrder from '../../utils/getTokenPairRenderOrder'
import { darken, lighten } from 'polished'

const Wrapper = styled(Card) < { bgColor1: string | null, bgColor2?: string | null, isDoubleRewards: boolean }>`
  border: ${({ isDoubleRewards, theme }) =>
        isDoubleRewards 
            ? `1px solid ${theme.primary1}` 
            : `1px solid ${theme.bg3};`
    }
  border-radius: 10px;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 12px;
  box-shadow: ${({ isDoubleRewards, theme }) =>
        isDoubleRewards 
            ? `0px 0px 8px 5px ${theme.primary1}` 
            : `0 2px 8px 0 ${theme.bg3}`
    }
  position: relative;
`

const BackgroundColor = styled.span< { bgColor1: string | null, bgColor2?: string | null }>`
   background: ${({ theme, bgColor1, bgColor2 }) =>
        `linear-gradient(90deg, ${bgColor1 ?? theme.blue1} 0%, ${bgColor2 ?? 'grey'} 90%);`
    }
   background-size: cover;
   mix-blend-mode: overlay;
   border-radius: 10px;
   width: 100%;
   height: 100%;
   opacity: 0.5;
   position: absolute;
   top: 0;
   left: 0;
   user-select: none;
 `

const PairContainer = styled.div`
   display: flex;
   align-items: center;
 `

type Props = {
    apr: number
    apr2: number
    doubleRewards: boolean
    chefVersion: ChefVersions
    inStaging: boolean
    isPeriodFinished: boolean
    stakedAmount: TokenAmount | null
    token0: Token
    token1: Token
    totalStakedInUSD: number
    version: number
}

const Button = styled(ButtonPrimary) < { isStaking: boolean }>`
  background: ${({ isStaking, theme }) => isStaking ? theme.black : darken(0.15, theme.primary1)}

  ${({ isStaking, theme }) => isStaking && `
        &:focus, &:hover, &:active {
            background-color: ${lighten(0.12, theme.black)};
        }
  `}
`

export default function PoolCardTRI({
    apr,
    apr2,
    chefVersion,
    doubleRewards,
    inStaging,
    isPeriodFinished,
    stakedAmount,
    token0: _token0,
    token1: _token1,
    totalStakedInUSD,
    version,
}: Props) {
    const [token0, token1] = getTokenPairRenderOrder(_token0, _token1)
    const currency0 = unwrappedToken(token0)
    const currency1 = unwrappedToken(token1)

    const { t } = useTranslation()
    const isStaking = Boolean(stakedAmount?.greaterThan('0') ?? false)
    const history = useHistory();
    const isDualRewards = chefVersion == 1

    // get the color of the token
    const backgroundColor1 = useColorForToken(token0)

    // Only override `backgroundColor2` if it's a dual rewards pool
    const backgroundColor2 = useColorForToken(token1, () => isDualRewards);

    const totalStakedInUSDFriendly = addCommasToNumber(totalStakedInUSD.toString())
    return (
        <Wrapper bgColor1={backgroundColor1} bgColor2={backgroundColor2} isDoubleRewards={doubleRewards}>
            <BackgroundColor bgColor1={backgroundColor1} bgColor2={backgroundColor2} />
            <AutoRow justifyContent="space-between">
                <PairContainer>
                    <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={24} />
                    <TYPE.main marginLeft="0.5rem">
                        {currency0.symbol}-{currency1.symbol}
                    </TYPE.main>
                </PairContainer>
                <Button
                    disabled={(isStaking || !isPeriodFinished) === false}
                    isStaking={isStaking}
                    padding="8px"
                    borderRadius="10px"
                    maxWidth="80px"
                    onClick={() => {
                        history.push(`/tri/${currencyId(currency0)}/${currencyId(currency1)}/${version}`)
                    }}
                >
                    {isStaking ? t('earn.manage') : t('earn.deposit')}
                </Button>
            </AutoRow>

            <RowBetween>
                <AutoColumn>
                    <TYPE.subHeader>
                        {t('earn.totalStaked')}
                    </TYPE.subHeader>
                    <TYPE.main>
                        {`$${totalStakedInUSDFriendly}`}
                    </TYPE.main>
                </AutoColumn>
                <AutoColumn >
                    <TYPE.subHeader textAlign="end">
                        APR
                    </TYPE.subHeader>
                    <TYPE.main textAlign="end">
                        {(isDualRewards && doubleRewards
                            ? `${apr}% TRI + ${`${apr2}%`} AURORA`
                            : inStaging
                                ? `Coming Soon`
                                : `${apr}%`
                        )}
                    </TYPE.main>
                </AutoColumn>
            </RowBetween>
        </Wrapper>
    )
}
