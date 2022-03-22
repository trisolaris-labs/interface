import { ChainId, Pair } from '@trisolaris/sdk'
import { darken } from 'polished'
import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import { Text } from 'rebass'
import styled from 'styled-components'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { ButtonEmpty, ButtonPrimary } from '../Button'
import { TokenPairBackgroundColor } from '../earn/PoolCardTri.styles'

import { useColorWithDefault } from '../../hooks/useColor'

import Card, { LightCard } from '../Card'
import { AutoColumn } from '../Column'
import DoubleCurrencyLogo from '../DoubleLogo'
import { AutoRow, RowBetween, RowFixed } from '../Row'
import { useTranslation } from 'react-i18next'

import { StableSwapPoolName, STABLESWAP_POOLS } from '../../state/stableswap/constants'
import TripleCurrencyLogo from '../TripleCurrencyLogo'
import useStablePoolsData from '../../hooks/useStablePoolsData'
import { BIG_INT_ZERO } from '../../constants'
import { useHistory } from 'react-router-dom'
import _ from 'lodash'
import CurrencyLogo from '../CurrencyLogo'

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

export const HoverCard = styled(Card)`
  border: 1px solid transparent;
  :hover {
    border: 1px solid ${({ theme }) => darken(0.06, theme.bg2)};
  }
`
const StyledPositionCard = styled(LightCard)<{ bgColor: any }>`
  background-color: unset;
  border: none;
  position: relative;
  overflow: hidden;
`

const ButtonRow = styled(AutoRow)`
  gap: 8px;
  justify-content: space-evenly;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
  `};
`

interface PositionCardProps {
  pair: Pair
  showUnwrapped?: boolean
  border?: string
}

interface StablePositionCardProps {
  poolName: StableSwapPoolName
  showUnwrapped?: boolean
  border?: string
}

const ManageButton = styled(ButtonEmpty)`
  color: ${({ theme }) => theme.white};
`
// @TODO This hasn't been migrated yet
// export function MinimalPositionCard({ pair, showUnwrapped = false, border }: PositionCardProps) {
//   const { account } = useActiveWeb3React()

//   const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0)
//   const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1)

//   const { t } = useTranslation()
//   const [showMore, setShowMore] = useState(false)

//   const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
//   const totalPoolTokens = useTotalSupply(pair.liquidityToken)

//   const poolTokenPercentage =
//     !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
//       ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
//       : undefined

//   const [token0Deposited, token1Deposited] =
//     !!pair &&
//     !!totalPoolTokens &&
//     !!userPoolBalance &&
//     // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
//     JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
//       ? [
//           pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
//           pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false)
//         ]
//       : [undefined, undefined]

//   return (
//     <>
//       {userPoolBalance && JSBI.greaterThan(userPoolBalance.raw, BIG_INT_ZERO) ? (
//         <GreyCard border={border}>
//           <AutoColumn gap="12px">
//             <FixedHeightRow>
//               <RowFixed>
//                 <Text fontWeight={500} fontSize={16}>
//                   {t('positionCard.yourPosition')}
//                 </Text>
//               </RowFixed>
//             </FixedHeightRow>
//             <FixedHeightRow onClick={() => setShowMore(!showMore)}>
//               <RowFixed>
//                 <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin={true} size={20} />
//                 <Text fontWeight={500} fontSize={20}>
//                   {currency0.symbol}/{currency1.symbol}
//                 </Text>
//               </RowFixed>
//               <RowFixed>
//                 <Text fontWeight={500} fontSize={20}>
//                   {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
//                 </Text>
//               </RowFixed>
//             </FixedHeightRow>
//             <AutoColumn gap="4px">
//               <FixedHeightRow>
//                 <Text fontSize={16} fontWeight={500}>
//                   {t('positionCard.poolShare')}
//                 </Text>
//                 <Text fontSize={16} fontWeight={500}>
//                   {poolTokenPercentage ? poolTokenPercentage.toFixed(6) + '%' : '-'}
//                 </Text>
//               </FixedHeightRow>
//               <FixedHeightRow>
//                 <Text fontSize={16} fontWeight={500}>
//                   {currency0.symbol}:
//                 </Text>
//                 {token0Deposited ? (
//                   <RowFixed>
//                     <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
//                       {token0Deposited?.toSignificant(6)}
//                     </Text>
//                   </RowFixed>
//                 ) : (
//                   '-'
//                 )}
//               </FixedHeightRow>
//               <FixedHeightRow>
//                 <Text fontSize={16} fontWeight={500}>
//                   {currency1.symbol}:
//                 </Text>
//                 {token1Deposited ? (
//                   <RowFixed>
//                     <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
//                       {token1Deposited?.toSignificant(6)}
//                     </Text>
//                   </RowFixed>
//                 ) : (
//                   '-'
//                 )}
//               </FixedHeightRow>
//             </AutoColumn>
//           </AutoColumn>
//         </GreyCard>
//       ) : (
//         <LightCard>
//           <TYPE.subHeader style={{ textAlign: 'center' }}>
//             <span role="img" aria-label="wizard-icon">
//               ⭐️
//             </span>{' '}
//             {t('positionCard.byAddingLiquidityInfo')}
//           </TYPE.subHeader>
//         </LightCard>
//       )}
//     </>
//   )
// }

export default function FullStablePositionCard({ poolName, border }: StablePositionCardProps) {
  const { t } = useTranslation()
  const {
    location: { pathname },
    push
  } = useHistory()

  const { name, poolTokens } = STABLESWAP_POOLS[ChainId.AURORA][poolName]

  const [token0, token1, token2] = poolTokens
  const [currency0, currency1, currency2] = poolTokens.map(token => unwrappedToken(token))

  const backgroundColor1 = useColorWithDefault('#2172E5', token0)
  const backgroundColor2 = useColorWithDefault('#2172E5', token1)
  // @TODO Update styling so it can handle 3 color gradient
  const backgroundColor3 = useColorWithDefault('#2172E5', token2)

  const [stablePoolData, userData] = useStablePoolsData(poolName)
  const hasLPTokenBalance = userData?.lpTokenBalance?.greaterThan(BIG_INT_ZERO) ?? false

  function handleAddLiquidity() {
    push(`${pathname}/add/${name}`)
  }
  function handleRemoveLiquidity() {
    push(`${pathname}/remove/${name}`)
  }

  const formattedPoolTokenData = stablePoolData.tokens.map(({ token, percent, value }) => ({
    label: token.name,
    token,
    value: `${value.toString()} (${percent.toFixed(2)}%)`
  }))

  const formattedPoolData = [
    {
      label: 'Virtual Price',
      value: stablePoolData.virtualPrice == null ? '-' : `$${stablePoolData.virtualPrice?.toFixed(6)}`
    },
    {
      label: 'Amplification coefficient',
      value: stablePoolData.aParameter?.toString() ?? '-'
    },
    {
      label: 'Swap Fee',
      value: stablePoolData.swapFee == null ? '-' : `${stablePoolData.swapFee?.toString()}%`
    },
    {
      label: 'Admin Fee',
      value: stablePoolData.adminFee == null ? '-' : `${stablePoolData.adminFee?.toString()}%`
    }
  ]

  return (
    <StyledPositionCard border={border} bgColor={backgroundColor1}>
      <TokenPairBackgroundColor bgColor1={backgroundColor1} bgColor2={backgroundColor2} />
      <AutoColumn gap="12px">
        <FixedHeightRow>
          <RowFixed>
            {currency2 != null ? (
              <TripleCurrencyLogo
                currency0={currency0}
                currency1={currency1}
                currency2={currency2}
                margin={true}
                size={20}
              />
            ) : (
              <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin={true} size={20} />
            )}
            <Text fontWeight={500} fontSize={20}>
              {name}
            </Text>
          </RowFixed>

          {stablePoolData?.lpToken != null ? (
            <RowFixed gap="8px">
              <div>
                {`${userData?.lpTokenBalance.toFixed(6) ?? 0} ${stablePoolData.lpToken?.name}`}
                <CurrencyLogo
                  size="20px"
                  style={{ marginLeft: '8px' }}
                  currency={unwrappedToken(stablePoolData.lpToken)}
                />
              </div>
            </RowFixed>
          ) : null}
        </FixedHeightRow>

        {formattedPoolData.slice(0, 1).map(({ label, value }) => (
          <FixedHeightRow key={label}>
            <Text fontSize={16} fontWeight={500}>
              {label}:
            </Text>
            <Text fontSize={16} fontWeight={500}>
              {value}
            </Text>
          </FixedHeightRow>
        ))}

        <AutoColumn gap="8px">
          {formattedPoolTokenData.map(({ label, token, value }) => (
            <FixedHeightRow key={label}>
              <div>
                <CurrencyLogo size="20px" style={{ marginRight: '8px' }} currency={unwrappedToken(token)} />
                {label}
              </div>
              <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                {value}
              </Text>
            </FixedHeightRow>
          ))}

          {formattedPoolData.slice(1).map(({ label, value }) => (
            <FixedHeightRow key={label}>
              <Text fontSize={16} fontWeight={500}>
                {label}:
              </Text>
              <Text fontSize={16} fontWeight={500}>
                {value}
              </Text>
            </FixedHeightRow>
          ))}
        </AutoColumn>

        <AutoColumn gap="8px">
          <ButtonRow>
            <ButtonPrimary width="45%" onClick={handleAddLiquidity}>
              Add
            </ButtonPrimary>
            <ButtonPrimary disabled={!hasLPTokenBalance} width="45%" onClick={handleRemoveLiquidity}>
              Remove
            </ButtonPrimary>
          </ButtonRow>
        </AutoColumn>
      </AutoColumn>
    </StyledPositionCard>
  )
}
