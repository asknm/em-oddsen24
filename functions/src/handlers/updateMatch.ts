import { FieldValue, Firestore } from "firebase-admin/firestore";
import { matchDoc } from "../extensions/matchExtensions";
import { getMatchFromApi } from "../helpers/apiHelpers";
import { fromApiTeam } from "../extensions/teamExtensions";

export async function updateMatch(db: Firestore, apiKey: string, matchDayId: string, matchId: string) {
    var snapshot = await matchDoc(db, matchDayId, matchId).get();
    var data = snapshot.data()!;
    if (data.standing?.finished !== true && (!data.lastUpdated || data.lastUpdated.toMillis() < Date.now() - 60 * 1000)) {
        const apiMatch = await getMatchFromApi(snapshot.id, apiKey);
        await snapshot.ref.update({
            'standing.home': apiMatch.score.fullTime.home,
            'standing.away': apiMatch.score.fullTime.away,
            'standing.finished': apiMatch.status === "FINISHED",
            lastUpdated: FieldValue.serverTimestamp(),
            homeTeam: fromApiTeam(apiMatch.homeTeam),
            awayTeam: fromApiTeam(apiMatch.awayTeam),
        });
    }
}