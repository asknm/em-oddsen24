import { FieldValue, Firestore, QueryDocumentSnapshot, Timestamp } from "firebase-admin/firestore";
import { matchCollection } from "../extensions/matchExtensions";
import { FirebaseMatch } from "../domain/match";
import { getMatchFromApi } from "../helpers/apiHelpers";

export async function updateMatchDay(db: Firestore, apiKey: string, matchDayId: string) {
    var snapshot = await matchCollection(db, matchDayId).where('utcDate', '<', Timestamp.now()).get();
    await Promise.all(snapshot.docs.map(UpdateIfNeeded));

    async function UpdateIfNeeded(firebaseMatch: QueryDocumentSnapshot<FirebaseMatch>) {
        var data = firebaseMatch.data();
        if (data.standing?.finished !== true && (!data.lastUpdated || data.lastUpdated.toMillis() < Date.now() - 60 * 1000)) {
            const apiMatch = await getMatchFromApi(firebaseMatch.id, apiKey);
            await firebaseMatch.ref.update({
                'standing.home': apiMatch.score.fullTime.home,
                'standing.away': apiMatch.score.fullTime.away,
                'standing.finished': apiMatch.status === "FINISHED",
                lastUpdated: FieldValue.serverTimestamp(),
            });
        }
    }
}