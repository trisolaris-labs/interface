import useSWR from 'swr'
import { ExternalInfo } from '../state/stake/stake-constants'

async function fetcher() {
  try {
    const response = await fetch('https://cdn.trisolaris.io/datav2.json')

    return response.json()
  } catch (e) {
    console.debug('Error loading datav2.json from cdn')
  }
}

async function getStakingInfoData() {
  return (await fetcher()) ?? {}
}

export function useFetchStakingInfoData(): ExternalInfo[] | undefined {
  const { data } = useSWR(['useFetchStakingInfoData'], getStakingInfoData)

  return data
}
