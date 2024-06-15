import { FieldValue } from "firebase-admin/firestore";

type BaseUser = {
    name: string,
}

export interface InsertUser extends BaseUser {
    email: string | null,
    timestamp: FieldValue,
};

export interface FirebaseUser extends BaseUser {
    balance: number | undefined,
    totalBettedAmount: number | undefined,
    matchesAsOdds: number | undefined,
}

export interface UserWithId extends BaseUser {
    id: string,
}
