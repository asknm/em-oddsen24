import { Firestore, Timestamp } from "firebase-admin/firestore";
import { matchDayDoc, matchDocFromMatchDayDoc } from "../extensions/matchExtensions";
import { getMatchesFromApi } from "../helpers/apiHelpers";
import { FirebaseMatch } from "../domain/match";
import { fromApiTeam } from "../extensions/teamExtensions";

export async function fetchAllMatchesFromApiHandler(db: Firestore, apiKey: string) {
    const matchesFromApi = await getMatchesFromApi(apiKey);

    for (const apiMatch of matchesFromApi) {
        const date = new Date(apiMatch.utcDate);
        const matchDayId = `${date.getUTCMonth().toString().padStart(2, '0')}${date.getUTCDate().toString().padStart(2, '0')}`;
        const matchDayRef = matchDayDoc(db, matchDayId);
        const matchDaySnapshot = await matchDayRef.get();
        const matchDayData = matchDaySnapshot.data();
        if (!matchDayData) {
            matchDayRef.set({
                date: Timestamp.fromMillis(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
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
            standing: undefined,
        };
        await matchRef.set(firebaseMatch);
    }
}
