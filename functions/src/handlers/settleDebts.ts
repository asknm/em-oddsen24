import { DocumentReference, FieldValue, Firestore } from "firebase-admin/firestore";
import { FirebaseMatch } from "../domain/match";
import { correctOddsOption, oddsValue } from "../extensions/oddsExtensions";
import { betCollection } from "../extensions/betExtensions";
import { userDoc } from "../extensions/userExtensions";
import { FirebaseUser } from "../domain/user";

export async function settleDebts(db: Firestore, matchDayId: string, matchId: string, match: FirebaseMatch) {
    if (!match.standing) {
        throw new Error('Standing not set');
    }
    const correctOption = correctOddsOption(match.standing);
    const odds = match.odds;
    if (!odds) {
        throw new Error("Missing odds");
    }
    const oddsV = oddsValue(odds, correctOption);
    const betCollectionRef = betCollection(db, matchDayId, matchId);

    const snapshot = await betCollectionRef.get();
    for (const betDoc of snapshot.docs) {
        const bet = betDoc.data();
        if (bet.selection === correctOption) {
            const winAmount = bet.amount * (oddsV - 1);
            await transfer(odds.bookmaker.id, betDoc.id, winAmount);
        }
        else {
            await transfer(betDoc.id, odds.bookmaker.id, bet.amount);
        }
    }

    async function transfer(from: string, to: string, amount: number) {
        const fromRef = userDoc(db, from);
        const ToRef = userDoc(db, to);
        await incrementBalance(fromRef, -amount);
        await incrementBalance(ToRef, amount);

        async function incrementBalance(userDoc: DocumentReference<FirebaseUser>, amount: number) {
            return userDoc.update({
                "balance": FieldValue.increment(amount),
            });
        }
    }
}