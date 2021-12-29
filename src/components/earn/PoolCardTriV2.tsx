import React from 'react'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import styled from 'styled-components'
import { TYPE, StyledInternalLink } from '../../theme'
import DoubleCurrencyLogo from '../DoubleLogo'
import { CETH, Token, TokenAmount } from '@trisolaris/sdk'
import { ButtonPrimary } from '../Button'
import { AutoRow } from '../Row'
import { ChefVersions, StakingTri, StakingTriFarms, StakingTriStakedAmounts } from '../../state/stake/stake-constants'
import { useColor } from '../../hooks/useColor'
import { currencyId } from '../../utils/currencyId'
import { Break, CardNoise, CardBGImage } from './styled'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { PNG } from '../../constants'
import { useTranslation } from 'react-i18next'
import Card from '../Card'
import { useHistory } from 'react-router-dom'
import { addCommasToNumber } from '../../utils'

const Wrapper = styled(Card) < { bgColor1: string | null, bgColor2?: string | null, isDualRewards: boolean }>`
  border: ${({ isDualRewards, theme }) =>
        isDualRewards ? `1px solid ${theme.primary1}` : `1px solid ${theme.bg3};`
    }
  border-radius: 10px;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr;
  // grid-template-rows: 1fr 1fr 1fr;
  gap: 12px;
  box-shadow: ${({ isDualRewards, theme }) =>
        isDualRewards ? `0px 0px 8px 5px ${theme.primary1}` : `0 2px 8px 0 ${theme.bg3}`
    }

`

// @TODO -- Add indicator for pools user is participating in
const BackgroundColor = styled.span< { bgColor1: string | null, bgColor2?: string | null, isDualRewards: boolean }>`
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

const GREY_ICON_TOKENS = ['ETH', 'WETH', 'WBTC', 'WNEAR'];

type Props = {
    apr: number
    apr2: number
    chefVersion: ChefVersions
    isPeriodFinished: boolean
    stakedAmount: TokenAmount | null
    token0: Token
    token1: Token
    totalStakedInUSD: number
    version: number
    doubleRewards: boolean
    inStaging: boolean
}

export default function PoolCard({
    apr,
    apr2,
    chefVersion,
    isPeriodFinished,
    stakedAmount,
    token0,
    token1,
    totalStakedInUSD,
    version,
    doubleRewards,
    inStaging
}: Props) {
    const currency0 = unwrappedToken(token0)
    const currency1 = unwrappedToken(token1)

    const { t } = useTranslation()
    const isStaking = Boolean(stakedAmount?.greaterThan('0') ?? false)
    const history = useHistory();

    const token: Token =
        currency0 === CETH || currency1 === CETH
            ? currency0 === CETH
                ? token1
                : token0
            : token0.equals(PNG[token0.chainId])
                ? token1
                : token0

    // get the color of the token
    let backgroundColor1 = useColor(token)
    const secondaryToken = token === token1 ? token0 : token1;
    let backgroundColor2 = useColor(secondaryToken);

    const totalStakedInUSDFriendly = addCommasToNumber(totalStakedInUSD.toString())
    const isDualRewards = chefVersion == 1

    // Colors are dynamically chosen based on token logos
    // These tokens are mostly grey; Override color to blue

    if (GREY_ICON_TOKENS.includes(token?.symbol ?? '')) {
        backgroundColor1 = '#2172E5';
    }

    // Only override `backgroundColor2` if it's a dual rewards pool
    if (isDualRewards && GREY_ICON_TOKENS.includes(secondaryToken?.symbol ?? '')) {
        backgroundColor2 = '#2172E5';
    }

    return (
        <div style={{ position: 'relative' }}>
            <BackgroundColor bgColor1={backgroundColor1} bgColor2={backgroundColor2} isDualRewards={isDualRewards} />
            <Wrapper bgColor1={backgroundColor1} bgColor2={backgroundColor2} isDualRewards={isDualRewards}>
                <AutoRow justifyContent="space-between">
                    <div style={{ display: 'flex' }}>
                        <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={24} />
                        <TYPE.body marginLeft="0.5rem">
                            {currency0.symbol}-{currency1.symbol}
                        </TYPE.body>
                    </div>
                    <ButtonPrimary
                        disabled={(isStaking || !isPeriodFinished) === false}
                        padding="8px"
                        borderRadius="10px"
                        maxWidth="80px"
                        onClick={() => {
                            history.push(`/tri/${currencyId(currency0)}/${currencyId(currency1)}/${version}`)
                        }}
                    >
                        {isStaking ? t('earn.manage') : t('earn.deposit')}
                    </ButtonPrimary>
                </AutoRow>

                <AutoRow>
                    <Cell
                        align="left"
                        content={`$${totalStakedInUSD}`}
                        title={t('earn.totalStaked')}
                        width="30%"
                    />
                    <Cell
                        align="right"
                        content={
                            (isDualRewards && doubleRewards
                                ? `${apr}% TRI + ${`${apr2}%`} AUR`
                                : inStaging
                                    ? `Coming Soon`
                                    : `${apr}%`
                            )
                        }
                        title="APR"
                        width="70%"
                    />
                </AutoRow>

                {/* <AutoRow>
        <Cell align="left" content="1X" title="Pool Weight" />
        <AutoColumn style={{ width: '50%' }}>
          <TYPE.subHeader textAlign="end">Your Stake</TYPE.subHeader>
          <TYPE.body textAlign="end">$0</TYPE.body>
        </AutoColumn>
      </AutoRow> */}
            </Wrapper>
        </div>
    )
}

function Cell({ align, content, title, width }: { align: 'left' | 'right', content: string, title: string, width?: string }) {
    return (
        <AutoColumn style={{ width }}>
            <TYPE.subHeader textAlign={align === 'right' ? 'end' : undefined}>{title}</TYPE.subHeader>
            <TYPE.body textAlign={align === 'right' ? 'end' : undefined}>{content}</TYPE.body>
        </AutoColumn>
    )
}