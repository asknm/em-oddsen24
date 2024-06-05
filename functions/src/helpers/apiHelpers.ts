import axios, { AxiosResponse } from 'axios';
import { ApiMatch, GetAllMatchesApiResponse } from '../domain/match';

export async function getMatchFromApi(mid: string, apiKey: string): Promise<ApiMatch> {
    const response = await axios.get(`https://api.football-data.org/v4/matches/${mid}`, {
        headers: {
            "X-Auth-Token": apiKey,
        },
    });
    return response.data;
}

export async function getMatchesFromApiFromDate(apiKey: string, date: Date): Promise<ApiMatch[]> {
    const dateString = date.toISOString().split('T')[0];
    return await getMatchesInner(apiKey, `https://api.football-data.org/v4/competitions/2018/matches?dateFrom${dateString}`);
}

export async function getMatchesFromApi(apiKey: string): Promise<ApiMatch[]> {
    return await getMatchesInner(apiKey, 'https://api.football-data.org/v4/competitions/2018/matches');
}

async function getMatchesInner(apiKey: string, url: string): Promise<ApiMatch[]> {
    return (await getMatchesInner2<GetAllMatchesApiResponse>(apiKey, url)).matches;
}

async function getMatchesInner2<TResponse>(apiKey: string, url: string): Promise<TResponse> {
    const response = await axios.get<any, AxiosResponse<TResponse, any>>(url, {
        headers: {
            "X-Auth-Token": apiKey,
        },
    });
    return response.data;
}
