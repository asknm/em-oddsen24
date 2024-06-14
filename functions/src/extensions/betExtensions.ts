import { CollectionReference, Firestore } from "firebase-admin/firestore";
import { matchDoc } from "./matchExtensions";
import { FirebaseBet } from "../domain/bet";

export function betCollection(db: Firestore, matchDayId: string, matchId: string): CollectionReference<FirebaseBet> {
    return matchDoc(db, matchDayId, matchId).collection("bets") as CollectionReference<FirebaseBet>;
}
