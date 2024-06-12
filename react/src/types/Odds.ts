import { doc, DocumentReference, getFirestore, getDoc } from "@firebase/firestore";
import { getUserFromRef, User, UserWithId } from "./User";

export type OddsWithBookmakerRef = OddsWithBookmaker<DocumentReference<User>>;
export type OddsWithBookmakerName = OddsWithBookmaker<UserWithId>;

// export function getOddsRef(matchDayId: string, matchId: string): DocumentReference<OddsWithBookmakerRef> {
//     return doc(getFirestore(), "matches", mid, "odds", "odds") as DocumentReference<OddsWithBookmakerRef>;
// }

// export async function getOdds(mid: string): Promise<OddsWithBookmakerRef | undefined> {
//     const ref = getOddsRef(mid);
//     const snap = await getDoc(ref);
//     return snap.data();
// }

export async function ToOddsWithBookmakerName(oddsWithBookmakerRef: OddsWithBookmakerRef): Promise<OddsWithBookmakerName> {
    const user = await getUserFromRef(oddsWithBookmakerRef.bookmaker);
    return {
        H: oddsWithBookmakerRef.H,
        U: oddsWithBookmakerRef.U,
        B: oddsWithBookmakerRef.B,
        bookmaker: {
            id: oddsWithBookmakerRef.bookmaker.id,
            name: user?.name ?? oddsWithBookmakerRef.bookmaker.id,
        },
    };
}


export interface Odds {
    H: number,
    U: number,
    B: number,
};

export interface OddsWithBookmaker<T> extends Odds {
    bookmaker: T;
}

export type OddsArray = [
    H: number,
    U: number,
    B: number,
];

export enum OddsOptions {
    H,
    U,
    B,
};

export function OddsFromArray(array: OddsArray): Odds {
    return {
        H: array[OddsOptions.H],
        U: array[OddsOptions.U],
        B: array[OddsOptions.B],
    };
};

export function ToOddsArray(odds: Odds): OddsArray {
    return [odds.H, odds.U, odds.B];
}
