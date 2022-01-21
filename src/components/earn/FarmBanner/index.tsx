import React, { useState, useEffect, useMemo } from 'react'
import { uniqueId, isEmpty } from 'lodash'
import { ChainId, Token, JSBI } from '@trisolaris/sdk'

import CountUp from '../../../components/CountUp'
import { AutoRow } from '../../Row'

import { TYPE } from '../../../theme'
import spacemanOnPlanet from '../../../assets/svg/spaceman_on_planet.svg'

import useUserFarmStatistics from '../../../state/stake/useUserFarmStatistics'
import { useSingleFarm } from '../../../state/stake/user-farms'
import { useActiveWeb3React } from '../../../hooks'
import { useFarms } from '../../../state/stake/apr'
import { addCommasToNumber } from '../../../utils'
import { isTokenAmountPositive } from '../../../utils/pools'

import { LpTokenProps, DummyCompProps, FarmAmount } from './FarmBanner.types'

import {
  StyledCard,
  IconContainer,
  StyledSummaryHeader,
  StyledTokensContainer,
  StyledTokenHeader,
  StyledAutoColumn,
  StyledToken
} from './FarmBanner.styles'

const ZERO = JSBI.BigInt(0)

const DummyComp = ({ farm, updateAmounts }: DummyCompProps) => {
  const { farmId } = farm
  const { userLPAmountUSD } =
    useUserFarmStatistics({
      lpToken: farm.lpToken,
      userLPStakedAmount: farm.userLPStakedAmount,
      totalPoolAmountUSD: farm.totalPoolAmountUSD,
      chefVersion: farm.chefVersion
    }) ?? {}

  const stakingInfo = useSingleFarm(Number(farmId))
  const { chefVersion, doubleRewardAmount, earnedAmount, doubleRewardToken } = stakingInfo

  const isDualRewards = chefVersion === 1

  const newDoubleRewardsAmount =
    isDualRewards && isTokenAmountPositive(doubleRewardAmount) ? doubleRewardAmount.toFixed(6) : 0
  const parsedNewDoubleRewardsAmount = newDoubleRewardsAmount ? parseFloat(newDoubleRewardsAmount) : 0
  const token = isDualRewards && doubleRewardToken.symbol !== 'ZERO' ? doubleRewardToken?.symbol : null
  const parsedToken = token ? token : 'ZERO'

  const newEarnedAmount = isTokenAmountPositive(earnedAmount) ? earnedAmount.toFixed(6) : null
  const parsedNewEarnedAmount = newEarnedAmount ? parseFloat(newEarnedAmount) : null

  const newAmount = userLPAmountUSD?.toFixed(2)
  const parsedStakedAmount = newAmount ? parseFloat(newAmount) : null
  if (parsedStakedAmount && parsedNewEarnedAmount) {
    updateAmounts(farmId, parsedStakedAmount, parsedNewEarnedAmount, parsedNewDoubleRewardsAmount, parsedToken)
  }
  return null
}

export default function FarmBanner() {
  const { account } = useActiveWeb3React()
  const allFarms = useFarms()

  const [userFarmsAmount, setUserFarmsAmount] = useState<FarmAmount>({})
  const [countEnabled, setCountEnabled] = useState(false)

  const farmTVL = allFarms.reduce((acc, farm) => JSBI.add(acc, JSBI.BigInt(farm.totalStakedInUSD)), ZERO)
  const farmTVLFriendly = JSBI.GE(farmTVL, ZERO) ? `$${addCommasToNumber(farmTVL.toString())}` : '-'

  const userFarms = allFarms.filter(farm => isTokenAmountPositive(farm.stakedAmount))

  const getToken = ({ lpAddress, token0, token1 }: LpTokenProps) => {
    return new Token(ChainId.AURORA, lpAddress, 18, 'TLP', `TLP ${token0?.symbol}-${token1?.symbol}`)
  }

  const parsedFarms = userFarms.map(farm => {
    const lpToken = getToken({ lpAddress: farm.lpAddress, token0: farm.tokens[0], token1: farm.tokens[1] })

    return {
      farmId: farm.ID,
      userLPStakedAmount: farm.stakedAmount,
      totalStakedInPool: farm.totalStakedAmount,
      totalPoolAmountUSD: farm.totalStakedInUSD,
      chefVersion: farm.chefVersion,
      lpToken
    }
  })

  const updateAmounts = (
    id: number,
    stakedAmount: number,
    rewards: number,
    parsedNewDoubleRewardsAmount: number,
    doubleRewardsToken: string
  ) => {
    if (userFarmsAmount[id]) {
      if (userFarmsAmount[id].totalStaked !== stakedAmount || userFarmsAmount[id].tokens.TRI !== rewards) {
        const newUserFarmAmount = {
          ...userFarmsAmount,
          [id]: {
            ...userFarmsAmount[id],
            totalStaked: stakedAmount,
            tokens: {
              ...userFarmsAmount[id].tokens,
              TRI: rewards,
              [doubleRewardsToken]: parsedNewDoubleRewardsAmount
            }
          }
        }

        setUserFarmsAmount(newUserFarmAmount)
      }
    }
  }

  useEffect(() => {
    const userFarmsArr = Object.values(userFarmsAmount)
    const allFarmsHaveInfo = !isEmpty(userFarmsArr) && userFarmsArr.every(farm => farm.totalStaked > 0)

    if (!countEnabled) {
      if (allFarmsHaveInfo) setCountEnabled(true)
    } else {
      if (!allFarmsHaveInfo) setCountEnabled(false)
    }
  }, [userFarmsAmount])

  useEffect(() => {
    const newFarms = userFarms
      .filter(farm => !Object.prototype.hasOwnProperty.call(userFarmsAmount, farm.ID))
      .map(farm => {
        return { [farm.ID]: { totalStaked: 0, tokens: {} } }
      })

    if (newFarms.length) {
      const newFarmsObj: FarmAmount = Object.assign({}, ...newFarms)
      const updatedUserFarms = { ...userFarmsAmount, ...newFarmsObj }

      setUserFarmsAmount(updatedUserFarms)
    }
  }, [userFarms])

  const TotalUserFarmsAmount = useMemo(
    () => Object.values(userFarmsAmount).reduce((a, { totalStaked }) => a + totalStaked, 0),
    [userFarmsAmount]
  )

  const totalUserTokensAmount = useMemo(() => {
    if (countEnabled) {
      const farmsArr = Object.values(userFarmsAmount)
      const tokensArr = farmsArr.map(({ tokens }) => tokens)

      const result = tokensArr.reduce((acc, n) => {
        for (var prop in n) {
          if (prop !== 'ZERO') {
            if (acc.hasOwnProperty(prop)) acc[prop] += n[prop]
            else acc[prop] = n[prop]
          }
        }
        return acc
      }, {})

      return Object.entries(result)
    }
    return null
  }, [userFarmsAmount])

  return (
    <>
      <StyledCard>
        <AutoRow justifyContent="space-between" style={{ alignItems: 'flex-start' }} display="flex">
          <StyledAutoColumn>
            <TYPE.largeHeader>Farm</TYPE.largeHeader>
            <TYPE.subHeader marginTop="1rem">
              <StyledSummaryHeader>TVL:</StyledSummaryHeader> {farmTVLFriendly}
            </TYPE.subHeader>
            {account && !isEmpty(allFarms) && (
              <>
                <TYPE.subHeader marginTop="1rem">
                  {countEnabled && (
                    <>
                      <StyledSummaryHeader>Your total staked Amount: $</StyledSummaryHeader>
                      {Number(TotalUserFarmsAmount).toFixed(2)}
                    </>
                  )}
                </TYPE.subHeader>
                {countEnabled && !isEmpty(totalUserTokensAmount) && (
                  <>
                    <TYPE.subHeader marginTop="0.7rem" marginBottom="0.7rem">
                      <StyledSummaryHeader> Your total unreclaimed tokens:</StyledSummaryHeader>
                    </TYPE.subHeader>
                    <StyledTokensContainer>
                      {totalUserTokensAmount?.map(([token, value]) => (
                        <StyledToken key={token}>
                          <StyledTokenHeader>{token}</StyledTokenHeader>
                          : <CountUp enabled={value > 0} value={value} decimalPlaces={2} />
                        </StyledToken>
                      ))}
                    </StyledTokensContainer>
                  </>
                )}
              </>
            )}
          </StyledAutoColumn>
          <IconContainer>
            <img height="360px" src={spacemanOnPlanet} />
          </IconContainer>
        </AutoRow>
      </StyledCard>
      {parsedFarms.map(farm => (
        <DummyComp farm={farm} key={uniqueId()} updateAmounts={updateAmounts} />
      ))}
    </>
  )
}
