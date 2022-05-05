import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useSingleStableFarm } from '../../state/stake/user-stable-farms'
import { StableSwapPoolName } from '../../state/stableswap/constants'
import ManageImpl from './ManageImpl'

export default function ManageStable({
  match: {
    params: { stableSwapPoolName, version }
  }
}: RouteComponentProps<{ stableSwapPoolName: StableSwapPoolName; version: string }>) {
  const stakingInfo = useSingleStableFarm(Number(version), stableSwapPoolName)

  return <ManageImpl stableSwapPoolName={stableSwapPoolName} stakingInfo={stakingInfo} />
}
