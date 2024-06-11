import { doc, DocumentReference, getDoc, getFirestore, Timestamp } from "@firebase/firestore";

type BaseUser = {
    name: string,
}

export interface IUser<TTimestamp> extends BaseUser {
    timestamp: TTimestamp,
};

export interface UserWithBalance extends BaseUser {
    balance: number,
}

export interface UserWithId extends BaseUser {
    id: string,
}

export type User = IUser<Timestamp>;

export async function getUserFromId(uid: string): Promise<User | undefined> {
    const ref = doc(getFirestore(), "users", uid) as DocumentReference<User>;
    return getUserFromRef(ref);
}

export async function getUserFromRef(ref: DocumentReference<User>): Promise<User | undefined> {
    const userDoc = await getDoc(ref);
    return userDoc.data();
}
