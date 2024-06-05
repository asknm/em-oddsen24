import { Timestamp } from "firebase-admin/firestore";
import { Score } from "./score"
import { Team } from "./team"

export interface BaseMatch<DateType> {
    utcDate: DateType,
    homeTeam: Team,
    awayTeam: Team,
}

export interface BaseMatchWithId<IdType, DateType> extends BaseMatch<DateType> {
    id: IdType
}

export interface ApiMatch extends BaseMatchWithId<number, string> {
    status: string,
    score: Score,
}

export type FirebaseMatch = BaseMatch<Timestamp>;

export type GetAllMatchesApiResponse = {
    matches: ApiMatch[],
};