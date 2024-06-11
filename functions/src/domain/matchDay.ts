import { Timestamp } from "firebase-admin/firestore";

export type FirebaseMatchDay = {
    date: Timestamp,
}

export type DtoMatchDay = {
    id: string,
    date: number,
}