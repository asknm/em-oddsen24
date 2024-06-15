import { FieldValue } from "firebase-admin/firestore";

type BaseUser = {
    name: string,
}

export interface InsertUser extends BaseUser {
    email: string | undefined,
    timestamp: FieldValue,
};

export interface UserWithBalance extends BaseUser {
    balance: number | undefined,
}

export interface UserWithId extends BaseUser {
    id: string,
}
