import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useSingleFarm } from '../../state/stake/user-farms'
import ManageImpl from './ManageImpl'

export default function Manage({
  match: {
    params: { currencyIdA, currencyIdB, version }
  }
}: RouteComponentProps<{ currencyIdA: string; currencyIdB: string; version: string }>) {
  const stakingInfo = useSingleFarm(Number(version))

  return <ManageImpl stakingInfo={stakingInfo} />
}
