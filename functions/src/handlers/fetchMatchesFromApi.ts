import { Firestore, Timestamp } from "firebase-admin/firestore";
import { matchDayDoc, matchDocFromMatchDayDoc } from "../extensions/matchExtensions";
import { getMatchesFromApi } from "../helpers/apiHelpers";
import { ApiMatch, FirebaseMatch } from "../domain/match";
import { fromApiTeam } from "../extensions/teamExtensions";

export async function fetchAllMatchesFromApiHandler(db: Firestore, apiKey: string) {
    const matchesFromApi = await getMatchesFromApi(apiKey);

    for (const apiMatch of matchesFromApi) {
        const date = new Date(apiMatch.utcDate);
        const matchDayId = `${date.getMonth()}${date.getDate()}`
        const matchDayRef = matchDayDoc(db, matchDayId);
        const matchDaySnapshot = await matchDayRef.get();
        const matchDayData = matchDaySnapshot.data();
        if (!matchDayData) {
            matchDayRef.set({
            });
        }
        const matchRef = matchDocFromMatchDayDoc(matchDayRef, apiMatch.id.toString())
        const snapshot = await matchRef.get();
        const matchData = snapshot.data();
        if (matchData) {
            return;
        }
        const firebaseMatch: FirebaseMatch = {
            utcDate: Timestamp.fromDate(date),
            homeTeam: fromApiTeam(apiMatch.homeTeam),
            awayTeam: fromApiTeam(apiMatch.awayTeam),
        };
        await matchRef.set(firebaseMatch);
    }

    await Promise.all(matchesFromApi.map(apiMatch => storeMatchInDb(apiMatch)));

    async function storeMatchInDb(apiMatch: ApiMatch) {

    }
}
