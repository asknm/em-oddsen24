import { CollectionReference, DocumentReference, Firestore } from "firebase-admin/firestore";
import { FirebaseMatch } from "../domain/match";
import { FirebaseMatchDay } from "../domain/matchDay";

export function matchDoc(db: Firestore, matchDayId: string, matchId: string): DocumentReference<FirebaseMatch> {
    return matchDocFromMatchDayDoc(matchDayDoc(db, matchDayId), matchId);
}

export function matchCollection(db: Firestore, matchDayId: string): CollectionReference<FirebaseMatch> {
    return matchCollectionFromMatchDayDoc(matchDayDoc(db, matchDayId));
}

export function matchDocFromMatchDayDoc(matchDayDoc: DocumentReference<FirebaseMatchDay>, matchId: string): DocumentReference<FirebaseMatch> {
    return matchCollectionFromMatchDayDoc(matchDayDoc).doc(matchId);
}

export function matchCollectionFromMatchDayDoc(matchDayDoc: DocumentReference<FirebaseMatchDay>): CollectionReference<FirebaseMatch> {
    return matchDayDoc.collection("matches") as CollectionReference<FirebaseMatch>;
}

export function matchDayDoc(db: Firestore, id: string): DocumentReference<FirebaseMatchDay> {
    return matchDayCollection(db).doc(id);
}

export function matchDayCollection(db: Firestore): CollectionReference<FirebaseMatchDay> {
    return db.collection("matchDays") as CollectionReference<FirebaseMatchDay>;
}
