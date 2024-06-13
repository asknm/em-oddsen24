import { DocumentSnapshot, Timestamp } from "@firebase/firestore";
import { Team } from "./Team";
import { StandingWithFinished } from "./Standing";
import { doc, DocumentReference, getFirestore, CollectionReference, collection } from "@firebase/firestore";
import { OddsWithBookmakerName } from "./Odds";

export interface BaseMatch<DateType> {
    utcDate: DateType,
    homeTeam: Team,
    awayTeam: Team,
    standing: StandingWithFinished | null
    odds: OddsWithBookmakerName | null,
}

export type FirebaseMatch = BaseMatch<Timestamp>;

export interface FirebaseMatchWithId extends BaseMatch<Timestamp> {
    id: string,
};

export interface DtoMatch extends BaseMatch<number> {
    id: string,
};

export type DtoMatchDictionary = { [date: number]: DtoMatch[] };

export function ToDtoMatch(snapshot: DocumentSnapshot<FirebaseMatch>): DtoMatch | undefined {
    const dbMatch = snapshot.data();
    console.log(dbMatch);
    if (!dbMatch) {
        return undefined;
    }
    return {
        id: snapshot.id,
        utcDate: dbMatch.utcDate.toMillis(),
        homeTeam: dbMatch.homeTeam,
        awayTeam: dbMatch.awayTeam,
        standing: dbMatch.standing,
        odds: dbMatch.odds,
    };
}

export function HasStarted(match: FirebaseMatchWithId): boolean {
    return Date.now() > match.utcDate.toMillis();
}

export function getMatchDoc(matchDayId: string, matchId: string): DocumentReference<FirebaseMatch> {
    return doc(getMatchColl(matchDayId), matchId);
}

export function getMatchColl(matchDayId: string): CollectionReference<FirebaseMatch> {
    return collection(getFirestore(), "matchDays", matchDayId, "matches") as CollectionReference<FirebaseMatch>;
}
