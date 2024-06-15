import { CollectionReference, Firestore } from "firebase-admin/firestore";
import { FirebaseUser } from "../domain/user";

export function userDoc(db: Firestore, uid: string) {
    return userCollection(db).doc(uid);
}

export function userCollection(db: Firestore): CollectionReference<FirebaseUser> {
    return db.collection("users") as CollectionReference<FirebaseUser>;
}