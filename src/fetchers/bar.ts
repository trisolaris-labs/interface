import useSWR from 'swr';

type APRResponse = {
    "apr": number,
    "mintedTri": number,
    "timestamp": number,
    "triBarTri": number,
}

async function fetcher(): Promise<APRResponse> {
    // @TODO Use this after https://github.com/trisolaris-labs/apr/pull/5 is merged
    // const response = fetch('https://raw.githubusercontent.com/trisolaris-labs/apr/master/xtri.json')

    const response = await fetch('https://raw.githubusercontent.com/trisolaris-labs/apr/e7d38425b6a602c0d822645169108df0077d2c04/xtri.json')

    return response.json();
}

async function getTriBarAPR() {
    const { apr } = await fetcher();

    return apr;
}

export function useFetchTriBarAPR() {
    const { data } = useSWR(
        ['useTriBarAPR'],
        getTriBarAPR,
    );

    return data;
}