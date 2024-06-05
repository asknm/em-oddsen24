import { newUserHandler } from "./handlers/newUser";

import { firestore, credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { region, FunctionBuilder } from "firebase-functions";
import { myRegion } from "./constants";
import { defineSecret } from "firebase-functions/params";
import { fetchAllMatchesFromApiHandler } from "./handlers/fetchMatchesFromApi";

initializeApp({
    credential: credential.applicationDefault(),
});

const db = firestore();
const functionBuilder: FunctionBuilder = region(myRegion);

const footballDataKey = defineSecret('football_data_key');


exports.newUser =
    functionBuilder
        .auth.user().onCreate(async (user) => await newUserHandler(user, db));

exports.fetchAllMatchesFromApi = functionBuilder
    .runWith({
        secrets: [footballDataKey],
        memory: "8GB",
        maxInstances: 1,
        timeoutSeconds: 540,
    })
    .https
    .onRequest(async _ => await fetchAllMatchesFromApiHandler(db, footballDataKey.value()));
