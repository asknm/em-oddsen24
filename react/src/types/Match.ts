import { DocumentSnapshot, Timestamp } from "@firebase/firestore";
import { Team } from "./Team";

export interface BaseMatch<DateType> {
    utcDate: DateType,
    homeTeam: Team,
    awayTeam: Team,
}

export type FirebaseMatch = BaseMatch<Timestamp>;


export interface BaseMatchWithId<IdType, DateType> extends BaseMatch<DateType> {
    id: IdType
}

export type DtoMatch = BaseMatchWithId<string, number>;

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
    };
}

export function HasStarted(match: DtoMatch): boolean {
    return Date.now() > match.utcDate;
}