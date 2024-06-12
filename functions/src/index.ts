import { newUserHandler } from "./handlers/newUser";

import { firestore, credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { region, FunctionBuilder } from "firebase-functions";
import { myRegion } from "./constants";
import { defineSecret } from "firebase-functions/params";
import { fetchAllMatchesFromApiHandler } from "./handlers/fetchMatchesFromApi";
import { getMatchDays } from "./handlers/getMatchDays";
import { getMatchDayMatches } from "./handlers/getMatchDayMatches";

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
    })
    .https
    .onRequest(async (_, res) => {
        try {
            await fetchAllMatchesFromApiHandler(db, footballDataKey.value());
            res.status(200).send();
        } catch (error) {
            res.status(500).send(error);
        }
    });

exports.getMatchDays = functionBuilder
    .https
    .onRequest(async (_, res) => {
        try {
            res.set('Access-Control-Allow-Origin', '*');
            const matchDays = await getMatchDays(db);
            res.set('Cache-Control', 'public, max-age=3600');
            res.status(200).send(matchDays);
        } catch (error) {
            res.status(500).send(error);
        }
    });

exports.getMatchDayMatches = functionBuilder
    .https
    .onRequest(async (req, res) => {
        try {
            res.set('Access-Control-Allow-Origin', '*');
            res.set('Access-Control-Allow-Headers', 'Match-Day-Id');
            const matchDayId = req.get('Match-Day-Id');
            if (!matchDayId) {
                res.status(400).send('MatchDayId header is required');
            }
            const matches = await getMatchDayMatches(db, matchDayId!);
            res.set('Cache-Control', 'public, max-age=60');
            res.status(200).send(matches);
        } catch (error) {
            res.status(500).send(error);
        }
    });