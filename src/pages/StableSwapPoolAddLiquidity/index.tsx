import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { StableSwapPoolName } from '../../state/stableswap/constants'
import StableSwapPoolAddLiquidityImpl from './StableSwapPoolAddLiquidityImpl'

type Props = RouteComponentProps<{ stableSwapPoolName?: StableSwapPoolName }>

export default function StableSwapPoolAddLiquidity(props: Props) {
  const { stableSwapPoolName } = props?.match?.params ?? {}

  // If invalid StableSwapPoolName is passed in, redirect to the stableswap pools page
  if (stableSwapPoolName == null || !StableSwapPoolName.hasOwnProperty(stableSwapPoolName)) {
    return <Redirect to="/stableswap-pool" />
  }

  return <StableSwapPoolAddLiquidityImpl stableSwapPoolName={stableSwapPoolName} />
}
