import { Timestamp } from "@firebase/firestore";
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

export function HasStarted(match: FirebaseMatchWithId): boolean {
    return Date.now() > match.utcDate.seconds * 1000;
}

export function getMatchDoc(matchDayId: string, matchId: string): DocumentReference<FirebaseMatch> {
    return doc(getMatchColl(matchDayId), matchId);
}

export function getMatchColl(matchDayId: string): CollectionReference<FirebaseMatch> {
    return collection(getFirestore(), "matchDays", matchDayId, "matches") as CollectionReference<FirebaseMatch>;
}
