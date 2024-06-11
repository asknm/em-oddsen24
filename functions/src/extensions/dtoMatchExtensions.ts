// import { QueryDocumentSnapshot } from "firebase-admin/firestore";
// import { fromApiTeam } from "./teamExtensions";
// import { ApiMatch, DtoMatch, FirebaseMatch } from "../domain/match";

// export function fromSnapshot(snapshot: QueryDocumentSnapshot<FirebaseMatch>): DtoMatch {
//     const dbMatch = snapshot.data();
//     return {
//         id: snapshot.id,
//         utcDate: dbMatch.utcDate.toMillis(),
//         homeTeam: dbMatch.homeTeam,
//         awayTeam: dbMatch.awayTeam,
//     };
// }

// export function fromApiMatch(apiMatch: ApiMatch): DtoMatch {
//     return {
//         id: apiMatch.id.toString(),
//         utcDate: Date.parse(apiMatch.utcDate),
//         homeTeam: fromApiTeam(apiMatch.homeTeam),
//         awayTeam: fromApiTeam(apiMatch.awayTeam),
//     };
// }
