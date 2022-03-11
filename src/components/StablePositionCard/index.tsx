import { ChainId, Pair } from '@trisolaris/sdk'
import { darken } from 'polished'
import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import { Text } from 'rebass'
import styled from 'styled-components'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { ButtonEmpty } from '../Button'
import { TokenPairBackgroundColor } from '../earn/PoolCardTri.styles'

import { useColorWithDefault } from '../../hooks/useColor'

import Card, { LightCard } from '../Card'
import { AutoColumn } from '../Column'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowBetween, RowFixed } from '../Row'
import { useTranslation } from 'react-i18next'

import { StableSwapPoolName, STABLESWAP_POOLS } from '../../state/stableswap/constants'
import TripleCurrencyLogo from '../TripleCurrencyLogo'
import useStablePoolsData from '../../hooks/useStablePoolsData'

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
  const [showMore, setShowMore] = useState(false)

  const { name, poolTokens } = STABLESWAP_POOLS[ChainId.AURORA][poolName]

  const [token0, token1, token2] = poolTokens
  const [currency0, currency1, currency2] = poolTokens.map(token => unwrappedToken(token))

  const backgroundColor1 = useColorWithDefault('#2172E5', token0)
  const backgroundColor2 = useColorWithDefault('#2172E5', token1)
  // @TODO Update styling so it can handle 3 color gradient
  const backgroundColor3 = useColorWithDefault('#2172E5', token2)

  const [stablePoolData, userData] = useStablePoolsData(poolName)

  if (process.env.NODE_ENV !== 'production') {
    console.log('src/components/StablePositionCard/index.tsx: ', { stablePoolData, userData })
  }

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

          <RowFixed gap="8px">
            <ManageButton
              padding="6px 8px"
              borderRadius="12px"
              width="fit-content"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? (
                <>
                  {' '}
                  {t('positionCard.manage')}
                  <ChevronUp size="20" style={{ marginLeft: '10px' }} />
                </>
              ) : (
                <>
                  {t('positionCard.manage')}
                  <ChevronDown size="20" style={{ marginLeft: '10px' }} />
                </>
              )}
            </ManageButton>
          </RowFixed>
        </FixedHeightRow>
        {/* {showMore && ( */}
        {
          <ul>
            {stablePoolData.tokens.map(tokenData => (
              <li key={tokenData.token.name}>
                {tokenData.token.name}: {tokenData.value.toString()} ({tokenData.percent.toFixed(18)}%)
              </li>
            ))}
            <li>Virtual Price: ${stablePoolData.virtualPrice}</li>
            <li>Amplification coefficient: {stablePoolData.aParameter?.toString()}</li>
            <li>Swap Fee: {stablePoolData.swapFee?.toString()}%</li>
            <li>Admin Fee: {stablePoolData.adminFee?.toString()}%</li>
          </ul>
        }

        {/* @TODO Leaving this for reference, may not be needed */}
        {/* {showMore && (
          <AutoColumn gap="8px">
            <FixedHeightRow>
              <Text fontSize={16} fontWeight={500}>
                {t('positionCard.poolTokens')}
              </Text>
              <Text fontSize={16} fontWeight={500}>
                {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
              </Text>
            </FixedHeightRow>
            <FixedHeightRow>
              <RowFixed>
                <Text fontSize={16} fontWeight={500}>
                  {t('positionCard.pooled')} {currency0.symbol}:
                </Text>
              </RowFixed>
              {token0Deposited ? (
                <RowFixed>
                  <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                    {token0Deposited?.toSignificant(6)}
                  </Text>
                  <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={currency0} />
                </RowFixed>
              ) : (
                '-'
              )}
            </FixedHeightRow>

            <FixedHeightRow>
              <RowFixed>
                <Text fontSize={16} fontWeight={500}>
                  {t('positionCard.pooled')} {currency1.symbol}:
                </Text>
              </RowFixed>
              {token1Deposited ? (
                <RowFixed>
                  <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                    {token1Deposited?.toSignificant(6)}
                  </Text>
                  <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={currency1} />
                </RowFixed>
              ) : (
                '-'
              )}
            </FixedHeightRow>

            <FixedHeightRow>
              <Text fontSize={16} fontWeight={500}>
                {t('positionCard.poolShare')}
              </Text>
              <Text fontSize={16} fontWeight={500}>
                {poolTokenPercentage ? poolTokenPercentage.toFixed(2) + '%' : '-'}
              </Text>
            </FixedHeightRow>

            <RowBetween marginTop="10px">
              <ButtonPrimary
                padding="8px"
                as={Link}
                to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                width="48%"
              >
                {t('positionCard.add')}
              </ButtonPrimary>
              <ButtonPrimary
                padding="8px"
                as={Link}
                width="48%"
                to={`/remove/${currencyId(currency0)}/${currencyId(currency1)}`}
              >
                {t('positionCard.remove')}
              </ButtonPrimary>
            </RowBetween>
          </AutoColumn>
        )} */}
      </AutoColumn>
    </StyledPositionCard>
  )
}
