import { FieldValue, QueryDocumentSnapshot, Timestamp } from "@firebase/firestore";
import { getUserFromId } from "./User";
import { OddsOptions } from "./Odds";

export type BaseBet = IBaseBet<Timestamp>;
export type BetWithBetter = IBetWithBetter<Timestamp>;
export type InsertBet = IBaseBet<FieldValue>;

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
