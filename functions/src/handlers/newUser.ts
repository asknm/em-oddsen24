import { UserRecord } from "firebase-admin/auth";
import { FieldValue, Firestore } from "firebase-admin/firestore";
import { InsertUser } from "../domain/user";

export async function newUserHandler(userRecord: UserRecord, db: Firestore) {
	const docRef = db.collection("users").doc(userRecord.uid);
	const user: InsertUser = {
		name: userRecord.displayName ?? "No name",
		email: userRecord.email,
		timestamp: FieldValue.serverTimestamp(),
	};
	await docRef.set(user);
};
