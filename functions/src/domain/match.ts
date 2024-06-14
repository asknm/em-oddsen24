import { Timestamp } from "firebase-admin/firestore";
import { Score } from "./score"
import { Team } from "./team"
import { StandingWithFinished } from "./standing";
import { OddsWithBookmakerName } from "./odds";

export interface BaseMatch<DateType> {
    utcDate: DateType,
    homeTeam: Team,
    awayTeam: Team,
    standing: StandingWithFinished | null
    odds: OddsWithBookmakerName | null,
}

export interface BaseMatchWithId<IdType, DateType> extends BaseMatch<DateType> {
    id: IdType
}

export interface ApiMatch extends BaseMatchWithId<number, string> {
    status: string,
    score: Score,
}

export interface FirebaseMatch extends BaseMatch<Timestamp> {
    standing: StandingWithFinished | null,
    lastUpdated: Timestamp | null,
};

export type GetAllMatchesApiResponse = {
    matches: ApiMatch[],
};

export interface DtoMatch extends BaseMatchWithId<string, number> {
    standing: StandingWithFinished | null,
};

export function HasStarted(match: DtoMatch): boolean {
    return Date.now() > match.utcDate;
}
