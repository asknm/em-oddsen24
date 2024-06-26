import { FieldValue, Firestore, QueryDocumentSnapshot, Timestamp } from "firebase-admin/firestore";
import { userCollection } from "../extensions/userExtensions";
import { FirebaseUser } from "../domain/user";
import { matchCollection, matchCollectionFromMatchDayDoc, matchDayCollection } from "../extensions/matchExtensions";
import { logger } from "firebase-functions/v1";

export async function setNextBookmaker(db: Firestore, currentMatchDayId: string) {
    const matchesSnapshot = await matchCollection(db, currentMatchDayId).get()
    for (const doc of matchesSnapshot.docs) {
        const data = doc.data();
        if (data.standing?.finished !== true) {
            logger.info('Unfinished match remaining');
            return;
        }
    }

    const nextBookmakerSnapshot = await findNextBookmaker();
    const nextBookmaker = nextBookmakerSnapshot.data();

    logger.info('Setting next bookmaker: ', nextBookmaker.name);

    const snapshot = await matchDayCollection(db).where('date', '>', Timestamp.now()).orderBy('date').limit(1).get();

    const nextMatchDay = snapshot.docs[0];
    const nextMatchDayMatchesSnapshot = await matchCollectionFromMatchDayDoc(nextMatchDay.ref).get();
    nextMatchDayMatchesSnapshot.forEach((match) => {
        match.ref.update({
            'odds.bookmaker': {
                id: nextBookmakerSnapshot.id,
                name: nextBookmaker.name,
            }
        });
    });

    nextBookmakerSnapshot.ref.update({
        matchesAsOdds: FieldValue.increment(nextMatchDayMatchesSnapshot.size),
    });

    async function findNextBookmaker(): Promise<QueryDocumentSnapshot<FirebaseUser>> {
        const usersSnapshot = await userCollection(db).get();
        const nextBookmaker = usersSnapshot.docs.reduce<[user: QueryDocumentSnapshot<FirebaseUser> | undefined, value: number]>((previous, current) => {
            const user = current.data();
            const value = (user.totalBettedAmount ?? 0) / (user.matchesAsOdds ?? 0.1);
            if (value > previous[1]) {
                return [current, value];
            }
            return previous;
        }, [undefined, 0]);
        if (!nextBookmaker[0]) {
            throw new Error('Found no user to set as next bookmaker');
        }
        return nextBookmaker[0];
    }
}