import { Firestore, QueryDocumentSnapshot } from "firebase-admin/firestore";
import { matchCollection } from "../extensions/matchExtensions";
import { DtoMatch, FirebaseMatch } from "../domain/match";

export async function getMatchDayMatches(db: Firestore, matchDayId: string): Promise<DtoMatch[]> {
    var snapshot = await matchCollection(db, matchDayId).orderBy("utcDate").get();
    return snapshot.docs.map<DtoMatch>(ToDto)

    function ToDto(firebaseMatch: QueryDocumentSnapshot<FirebaseMatch>): DtoMatch {
        return { id: firebaseMatch.id, utcDate: firebaseMatch.data().utcDate.toMillis(), homeTeam: firebaseMatch.data().homeTeam, awayTeam: firebaseMatch.data().awayTeam, standing: firebaseMatch.data().standing };
    }
}