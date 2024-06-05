import { CollectionReference, DocumentReference, Firestore } from "firebase-admin/firestore";
import { FirebaseMatch } from "../domain/match";

export function matchDoc(db: Firestore, mid: string): DocumentReference<FirebaseMatch> {
    return matchCollection(db).doc(mid);
}

export function matchCollection(db: Firestore): CollectionReference<FirebaseMatch> {
    return db.collection("matches") as CollectionReference<FirebaseMatch>;
}