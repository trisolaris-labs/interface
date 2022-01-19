import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { TYPE } from '../../theme'
import Card from '../Card'
import { AutoRow } from '../Row'
import spacemanOnPlanet from '../../assets/svg/spaceman_on_planet.svg'
import { AutoColumn } from '../Column'
import { useFarms } from '../../state/stake/apr'
import { useFarmsAPI } from '../../state/stake/useFarmsAPI'
import { addCommasToNumber } from '../../utils'
import { ChainId, Token, JSBI, TokenAmount, Fraction } from '@trisolaris/sdk'
import { StakingTri, ChefVersions } from '../../state/stake/stake-constants'
import CountUp from '../../components/CountUp'

import useTLP from '../../hooks/useTLP'
import useUserFarmStatistics from '../../state/stake/useUserFarmStatistics'
import { useSingleFarm } from '../../state/stake/user-farms'
import useGetUserPoolsData from '../../hooks/useGetUserPoolsData'

import { isTokenAmountPositive } from '../../utils/pools'
import { uniqueId } from 'lodash'
import { ConsoleView } from 'react-device-detect'

const ZERO = JSBI.BigInt(0)

const StyledCard = styled(Card)`
  background: ${({ theme }) => `radial-gradient(farthest-corner at 0% 0%, ${theme.primary1} 0%, transparent 70%)`};
  padding-right: 0;
  padding-top: 0;
  padding-bottom: 0;
`

const IconContainer = styled.div`
  max-height: 144px;
  max-width: 240px;
  overflow: hidden;
  & > * {
    object-position: 16px 16px;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
        max-height: 90px;
        & > * {
            height: 200px;
            width: 150px;
            object-position: 24px 16px;
        }
  `};
`

type LpTokenProps = {
  lpAddress: string
  token0: Token
  token1: Token
}

type Farm = {
  farmId: number
  userLPStakedAmount: TokenAmount | null
  totalStakedInPool: TokenAmount
  totalPoolAmountUSD: number
  chefVersion: ChefVersions
  lpToken: Token
}

type DummyCompProps = {
  farm: Farm
  updateAmounts: (id: number, stakedAmount: number, rewards: number) => void
}

type FarmAmount = {
  [id: number]: {
    totalStaked: number
    tokens: {
      TRI: number
    }
  }
}

type RewardsAmount = {
  [id: string]: number
}

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
  const {
    chefVersion,
    doubleRewards,
    doubleRewardAmount,
    earnedAmount,
    inStaging,
    lpAddress,
    stakedAmount,
    tokens,
    totalRewardRate,
    totalStakedInUSD,
    doubleRewardToken
  } = stakingInfo

  const newEarnedAmount = isTokenAmountPositive(earnedAmount) ? earnedAmount.toFixed(6) : null
  const parsedNewEarnedAmount = newEarnedAmount ? parseFloat(newEarnedAmount) : null

  const newAmount = userLPAmountUSD?.toFixed(2)
  const parsedStakedAmount = newAmount ? parseFloat(newAmount) : null
  if (parsedStakedAmount && parsedNewEarnedAmount) {
    updateAmounts(farmId, parsedStakedAmount, parsedNewEarnedAmount)
  }
  return null
}

export default function FarmBanner() {
  const [userFarmsAmount, setUserFarmsAmount] = useState<FarmAmount>({})
  // const [userRewardsAmount, setUserRewardsAmount] = useState<RewardsAmount>({})
  const [countEnabled, setCountEnabled] = useState(false)

  const allFarms = useFarms()

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

  const updateAmounts = (id: number, stakedAmount: number, rewards: number) => {
    if (userFarmsAmount[id]) {
      if (userFarmsAmount[id].totalStaked !== stakedAmount || userFarmsAmount[id].tokens.TRI !== rewards) {
        setUserFarmsAmount({
          ...userFarmsAmount,
          [id]: {
            ...userFarmsAmount[id],
            totalStaked: stakedAmount,
            tokens: { ...userFarmsAmount[id].tokens, TRI: rewards }
          }
        })
      }
      // if (userRewardsAmount[id] !== stakedAmount) {
      //   setUserRewardsAmount({ ...userFarmsAmount, [id]: stakedAmount })
      // }
    }
  }
  // "1": {
  //     "totalStaked": 2.42,
  //     "tokens": {
  //         "TRI": 0
  //     }
  // },

  useEffect(() => {
    const allFarmsHaveInfo = Object.values(userFarmsAmount).every(farm => farm.totalStaked > 0)
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
        return { [farm.ID]: { totalStaked: 0, tokens: { TRI: 0 } } }
      })

    if (newFarms.length) {
      const newFarmsObj: FarmAmount = Object.assign({}, ...newFarms)
      const updatedUserFarms = { ...userFarmsAmount, ...newFarmsObj }

      setUserFarmsAmount(updatedUserFarms)
      // setUserRewardsAmount(updatedUserFarms)
    }
  }, [userFarms])

  const TotalUserFarmsAmount = useMemo(
    () => Object.values(userFarmsAmount).reduce((a, { totalStaked }) => a + totalStaked, 0),
    [userFarmsAmount]
  )

  console.log(userFarmsAmount)
  const farmTVL = allFarms.reduce((acc, farm) => JSBI.add(acc, JSBI.BigInt(farm.totalStakedInUSD)), ZERO)
  const farmTVLFriendly = JSBI.GE(farmTVL, ZERO) ? `$${addCommasToNumber(farmTVL.toString())}` : '-'

  return (
    <>
      <StyledCard>
        <AutoRow justifyContent="space-between" style={{ alignItems: 'flex-start' }}>
          <AutoColumn style={{ paddingTop: '1rem' }}>
            <TYPE.largeHeader>Farm</TYPE.largeHeader>
            <TYPE.subHeader marginTop="1rem">TVL: {farmTVLFriendly}</TYPE.subHeader>
            <TYPE.subHeader marginTop="1rem">
              {countEnabled && `Your total staked Amount: $${Number(TotalUserFarmsAmount).toFixed(2)}`}
            </TYPE.subHeader>
          </AutoColumn>
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
