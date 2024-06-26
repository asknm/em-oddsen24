import axios, { AxiosResponse } from 'axios';
import { ApiMatch, GetAllMatchesApiResponse } from '../domain/match';

export async function getMatchFromApi(mid: string, apiKey: string): Promise<ApiMatch> {
    return getMatchesInner2<ApiMatch>(apiKey, `https://api.football-data.org/v4/matches/${mid}`);
}

export async function getMatchesFromApi(apiKey: string): Promise<ApiMatch[]> {
    return (await getMatchesInner2<GetAllMatchesApiResponse>(apiKey, 'https://api.football-data.org/v4/competitions/2018/matches'))
        .matches;
}

async function getMatchesInner2<TResponse>(apiKey: string, url: string): Promise<TResponse> {
    const response = await axios.get<any, AxiosResponse<TResponse, any>>(url, {
        headers: {
            "X-Auth-Token": apiKey,
        },
    });
    return response.data;
}
