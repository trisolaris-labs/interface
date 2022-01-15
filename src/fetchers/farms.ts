import useSWR from 'swr'
import { ExternalInfo } from '../state/stake/stake-constants'

async function fetcher() {
  const response = await fetch('https://raw.githubusercontent.com/trisolaris-labs/apr/master/datav2.json')

  return response.json()
}

async function getStakingInfoData() {
  return (await fetcher()) ?? {}
}

export function useFetchStakingInfoData(): ExternalInfo[] | undefined {
  const { data } = useSWR(['useFetchStakingInfoData'], getStakingInfoData)

  return data
}
