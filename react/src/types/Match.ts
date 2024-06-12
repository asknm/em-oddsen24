import { DocumentSnapshot, Timestamp } from "@firebase/firestore";
import { Team } from "./Team";
import { StandingWithFinished } from "./Standing";

export interface BaseMatch<DateType> {
    utcDate: DateType,
    homeTeam: Team,
    awayTeam: Team,
}

export interface FirebaseMatch extends BaseMatch<Timestamp>{
    standing: StandingWithFinished | undefined,
};


export interface BaseMatchWithId<IdType, DateType> extends BaseMatch<DateType> {
    id: IdType
}

export interface DtoMatch extends BaseMatchWithId<string, number> {
    standing: StandingWithFinished | undefined,
};

export type DtoMatchDictionary = { [date: number]: DtoMatch[] };

export function ToDtoMatch(snapshot: DocumentSnapshot<FirebaseMatch>): DtoMatch | undefined {
    const dbMatch = snapshot.data();
    if (!dbMatch) {
        return undefined;
    }
    return {
        id: snapshot.id,
        utcDate: dbMatch.utcDate.toMillis(),
        homeTeam: dbMatch.homeTeam,
        awayTeam: dbMatch.awayTeam,
        standing: dbMatch.standing,
    };
}

export function HasStarted(match: DtoMatch): boolean {
    return Date.now() > match.utcDate;
}