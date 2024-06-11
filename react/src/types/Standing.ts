import { doc, DocumentReference, getDoc, getFirestore } from "@firebase/firestore";

export type Standing = {
    home: number,
    away: number;
}

export interface StandingWithFinished extends Standing {
    finished: boolean,
}


export function getStandingRef(mid: string): DocumentReference<StandingWithFinished> {
    return doc(getFirestore(), "matches", mid, "score", "score") as DocumentReference<StandingWithFinished>;
}

export async function getStanding(mid: string): Promise<StandingWithFinished | undefined> {
    const ref = getStandingRef(mid);
    const snap = await getDoc(ref);
    return snap.data();
}
