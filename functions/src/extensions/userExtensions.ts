import { CollectionReference, Firestore } from "firebase-admin/firestore";

export function userDoc(db: Firestore, uid: string) {
    return userCollection(db).doc(uid);
}

export function userCollection(db: Firestore): CollectionReference {
    return db.collection("users");
}