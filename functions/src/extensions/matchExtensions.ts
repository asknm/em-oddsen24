import { CollectionReference, DocumentReference, Firestore } from "firebase-admin/firestore";
import { FirebaseMatch } from "../domain/match";
import { FirebaseMatchDay } from "../domain/matchDay";

export function matchDoc(db: Firestore, matchDayId: string, matchId: string): DocumentReference<FirebaseMatch> {
    return matchCollection(db, matchDayId).doc(matchId);
}

export function matchCollection(db: Firestore, matchDayId: string): CollectionReference<FirebaseMatch> {
    return matchDayDoc(db, matchDayId).collection("matches") as CollectionReference<FirebaseMatch>;
}

export function matchDayDoc(db: Firestore, id: string): DocumentReference<FirebaseMatchDay> {
    return matchDayCollection(db).doc(id);
}

export function matchDayCollection(db: Firestore): CollectionReference<FirebaseMatchDay> {
    return db.collection("matchDays") as CollectionReference<FirebaseMatchDay>;
}
