import useSWR from 'swr'

async function fetcher() {
  try {
    const response = await fetch('https://cdn.trisolaris.io/xtri.json')

    return response.json()
  } catch (e) {
    console.debug('Error loading xtri.json from cdn')
  }
}

async function getTriBarAPR() {
  const { apr } = (await fetcher()) ?? {}

  return apr
}

export function useFetchTriBarAPR() {
  const { data } = useSWR(['useTriBarAPR'], getTriBarAPR)

  return data
}
