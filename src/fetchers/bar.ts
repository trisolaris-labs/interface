import useSWR from 'swr';

type APRResponse = {
    "apr": number,
    "mintedTri": number,
    "timestamp": number,
    "triBarTri": number,
}

async function fetcher(): Promise<APRResponse | null> {
    // @TODO Use this after https://github.com/trisolaris-labs/apr/pull/5 is merged
    // const response = fetch('https://raw.githubusercontent.com/trisolaris-labs/apr/master/xtri.json')

    // return response.json();
    return null;
}

async function getTriBarAPR() {
    const { apr } = await fetcher() ?? {};

    return apr;
}

export function useFetchTriBarAPR() {
    const { data } = useSWR(
        ['useTriBarAPR'],
        getTriBarAPR,
    );

    return data;
}