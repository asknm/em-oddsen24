import { Firestore, Timestamp } from "firebase-admin/firestore";
import { userCollection } from "../extensions/userExtensions";
import { UserWithId } from "../domain/user";
import { matchCollection, matchCollectionFromMatchDayDoc, matchDayCollection } from "../extensions/matchExtensions";

export async function setNextBookmaker(db: Firestore, currentMatchDayId: string) {
    const countSnapshot = await matchCollection(db, currentMatchDayId).where('standing.finished', '==', false).count().get()
    if (countSnapshot.data().count !== 0) {
        return;
    }

    const nextBookmaker = await findNextBookmaker();

    const snapshot = await matchDayCollection(db).where('date', '>', Timestamp.now()).orderBy('date').limit(1).get();

    const nextMatchDay = snapshot.docs[0];
    const nextMatchDayMatchesSnapshot = await matchCollectionFromMatchDayDoc(nextMatchDay.ref).get();
    nextMatchDayMatchesSnapshot.forEach((match) => {
        match.ref.update({
            'odds.bookmaker': nextBookmaker
        });
    });

    async function findNextBookmaker(): Promise<UserWithId> {
        const usersSnapshot = await userCollection(db).get();
        const nextBookmaker = usersSnapshot.docs.reduce<[user: UserWithId | undefined, value: number]>((previous, current) => {
            const user = current.data();
            const value = (user.totalBettedAmount ?? 0) / (user.matchesAsOdds ?? 0.1);
            if (value > previous[1]) {
                return [{
                    id: current.id,
                    name: user.name,
                }, value];
            }
            return previous;
        }, [undefined, 0]);
        if (!nextBookmaker[0]) {
            throw new Error('Found no user to set as next bookmaker');
        }
        return nextBookmaker[0];
    }
}