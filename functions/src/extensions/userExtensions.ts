import { CollectionReference, Firestore } from "firebase-admin/firestore";
import { UserWithBalance } from "../domain/user";

export function userDoc(db: Firestore, uid: string) {
    return userCollection(db).doc(uid);
}

export function userCollection(db: Firestore): CollectionReference<UserWithBalance> {
    return db.collection("users") as CollectionReference<UserWithBalance>;
}