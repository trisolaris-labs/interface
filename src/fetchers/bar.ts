import useSWR from 'swr'

async function fetcher() {
  try {
    const response = await fetch('https://cdn.trisolaris.io/xtri.json')

    return response.json()
  } catch (e) {
    console.debug('Error loading datav2.json from cdn.  Falling back to github')

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return await backupFetcher()
  }
}

async function backupFetcher() {
  try {
    const response = await fetch('https://raw.githubusercontent.com/trisolaris-labs/apr/master/xtri.json')

    return response.json()
  } catch (e) {
    console.debug('Error loading datav2.json from github')
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
