import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { StableSwapPoolName } from '../../state/stableswap/constants'
import StableSwapPoolRemoveLiquidityImpl from './StableSwapPoolRemoveLiquidityImpl'

type Props = RouteComponentProps<{ stableSwapPoolName?: StableSwapPoolName }>

export default function StableSwapPoolRemoveLiquidity(props: Props) {
  const { stableSwapPoolName } = props?.match?.params ?? {}

  // If invalid StableSwapPoolName is passed in, redirect to the stableswap pools page
  if (stableSwapPoolName == null || !StableSwapPoolName.hasOwnProperty(stableSwapPoolName)) {
    return <Redirect to="/pool/stable" />
  }

  return <StableSwapPoolRemoveLiquidityImpl stableSwapPoolName={stableSwapPoolName} />
}
