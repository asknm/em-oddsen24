import { Firestore } from "firebase-admin/firestore";
import { matchDoc } from "../extensions/matchExtensions";
import { getMatchesFromApi } from "../helpers/apiHelpers";
import { ApiMatch, FirebaseMatch } from "../domain/match";
import { fromApiMatch } from "../extensions/firebaseMatchExtensions";

export async function fetchAllMatchesFromApiHandler(db: Firestore, apiKey: string) {
    const matchesFromApi = await getMatchesFromApi(apiKey);

    await Promise.all(matchesFromApi.map(apiMatch => storeMatchInDb(apiMatch)));

    async function storeMatchInDb(apiMatch: ApiMatch) {
        const date = new Date(apiMatch.utcDate);
        const matchDayId = `${date.getMonth()}${date.getDate()}`
        const matchRef = matchDoc(db, matchDayId, apiMatch.id.toString());
        const snapshot = await matchRef.get();
        const matchData = snapshot.data();
        if (matchData) {
            return;
        }
        const firebaseMatch: FirebaseMatch = fromApiMatch(apiMatch);
        await matchRef.set(firebaseMatch);
    }
}
