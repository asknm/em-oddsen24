import { FieldValue, QueryDocumentSnapshot, Timestamp } from "@firebase/firestore";
import { getUserFromId } from "./User";
import { OddsOptions } from "./Odds";
import { doc, CollectionReference, DocumentReference, collection } from "@firebase/firestore";
import { getMatchDoc } from "./Match";

export type BaseBet = IBaseBet<Timestamp>;
export type BetWithBetter = IBetWithBetter<Timestamp>;
export type InsertBet = IBaseBet<FieldValue>;

export function getBetsDoc(matchDayId: string, matchId: string, uid: string): DocumentReference<BaseBet> {
    return doc(getBetsCol(matchDayId, matchId), uid) as DocumentReference<BaseBet>;
}

export function getBetsCol(matchDayId: string, matchId: string): CollectionReference<BaseBet> {
    return collection(getMatchDoc(matchDayId, matchId), "bets") as CollectionReference<BaseBet>;
}

export async function ToBetWithBetter(snapshot: QueryDocumentSnapshot<BaseBet>): Promise<BetWithBetter> {
    const user = await getUserFromId(snapshot.id);
    const baseBet = snapshot.data();
    return {
        better: user?.name ?? snapshot.id, 
        selection: baseBet.selection,
        amount: baseBet.amount,
        timestamp: baseBet.timestamp,
    };
}


export type IBaseBet<TTimestamp> = {
    amount: number,
    selection: OddsOptions,
    timestamp: TTimestamp,
}

export interface IBetWithBetter<TTimestamp> extends IBaseBet<TTimestamp> {
    better: string,
}
