import { Firestore } from "firebase-admin/firestore";
import { matchDoc } from "../extensions/matchExtensions";
import { getMatchesFromApi } from "../helpers/apiHelpers";
import { ApiMatch, FirebaseMatch } from "../domain/match";
import { fromApiMatch } from "../extensions/firebaseMatchExtensions";

export async function fetchAllMatchesFromApiHandler(db: Firestore, apiKey: string) {
    const matchesFromApi = await getMatchesFromApi(apiKey);
    await Promise.all(matchesFromApi.map(async apiMatch => await storeMatchInDb(apiMatch)));

    async function storeMatchInDb(apiMatch: ApiMatch) {
        const matchRef = matchDoc(db, apiMatch.id.toString());
        // const snapshot = await matchRef.get();
        // const matchData = snapshot.data();
        // if (matchData) {
        //     return;
        // }
        const firebaseMatch: FirebaseMatch = fromApiMatch(apiMatch);
        await matchRef.set(firebaseMatch);
    }
}
