import { FieldValue, Firestore } from "firebase-admin/firestore";
import { matchDoc } from "../extensions/matchExtensions";
import { fromApiTeam } from "../extensions/teamExtensions";
import { getMatchesFromApi } from "../helpers/apiHelpers";
import { ApiMatch } from "../domain/match";

export async function fetchAllMatchesFromApiHandler(db: Firestore, apiKey: string) {
    const matchesFromApi = await getMatchesFromApi(apiKey);
    await Promise.all(matchesFromApi.map(apiMatch => storeMatchInDb(apiMatch)));

    async function storeMatchInDb(apiMatch: ApiMatch) {
        const matchRef = matchDoc(db, apiMatch.id.toString());
        const snapshot = await matchRef.get();
        const matchData = snapshot.data();
        if (matchData) {
            return;
        }
        await matchRef.set({
            utcDate: FieldValue.serverTimestamp(),
            homeTeam: fromApiTeam(apiMatch.homeTeam),
            awayTeam: fromApiTeam(apiMatch.awayTeam),
        });
    }
}
