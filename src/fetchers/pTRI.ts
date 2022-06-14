import useSWR from 'swr'

async function fetcher() {
  try {
    const response = await fetch('https://cdn.trisolaris.io/ptri.json')

    return response.json()
  } catch (e) {
    console.debug('Error loading datav2.json from cdn')
  }
}

async function getPTRIAPRData() {
  return (await fetcher()) ?? {}
}

type PTRI_APR = {
  apr: number
  triBalance: number
  convertedUsdcAmount: number
  tri_price: number
  timestamp: number
}

export function useFetchPTRIAPR(): PTRI_APR[] {
  const { data } = useSWR(['useFetchPTRIAPR'], getPTRIAPRData)

  return data ?? []
}
