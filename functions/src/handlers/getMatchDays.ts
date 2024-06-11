import { Firestore, QueryDocumentSnapshot } from "firebase-admin/firestore";
import { matchDayCollection } from "../extensions/matchExtensions";
import { DtoMatchDay, FirebaseMatchDay } from "../domain/matchDay";

export async function getMatchDays(db: Firestore): Promise<DtoMatchDay[]> {
    var snapshot = await matchDayCollection(db).orderBy("date").get();
    return snapshot.docs.map<DtoMatchDay>(ToDto)

    function ToDto(firebaseMatchDay: QueryDocumentSnapshot<FirebaseMatchDay>): DtoMatchDay {
        return { id: firebaseMatchDay.id, date: firebaseMatchDay.data().date.toMillis() };
    }
}