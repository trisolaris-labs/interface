import useSWR from 'swr'

async function fetcher() {
  const response = await fetch('https://raw.githubusercontent.com/trisolaris-labs/apr/master/xtri.json')

  return response.json()
}

async function getTriBarAPR() {
  const { apr } = (await fetcher()) ?? {}

  return apr
}

export function useFetchTriBarAPR() {
  const { data } = useSWR(['useTriBarAPR'], getTriBarAPR)

  return data
}
