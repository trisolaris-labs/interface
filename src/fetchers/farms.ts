import useSWR from 'swr';
import { ExternalInfo } from '../state/stake/stake-constants';

async function fetcher() {
    const response = await fetch('https://storage.googleapis.com/trisolaris_public/datav2.json')

    return response.json();
}

async function getStakingInfoData() {

    return await fetcher() ?? {};
}

export function useFetchStakingInfoData(): ExternalInfo[] | undefined {
    const { data } = useSWR(
        ['useFetchStakingInfoData'],
        getStakingInfoData,
    );

    return data;
}