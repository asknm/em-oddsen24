import { newUserHandler } from "./handlers/newUser";
import { firestore, credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { region, FunctionBuilder, logger } from "firebase-functions";
import { myRegion } from "./constants";
import { defineSecret } from "firebase-functions/params";
import { fetchAllMatchesFromApiHandler } from "./handlers/fetchAllMatchesFromApi";
import { getMatchDays } from "./handlers/getMatchDays";
import { updateMatch } from "./handlers/updateMatch";
import { FirebaseMatch } from "./domain/match";
import { settleDebts } from "./handlers/settleDebts";
import { setNextBookmaker } from "./handlers/setNextBookmaker";

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
            logger.error(error);
            res.status(500).send(error);
        }
    });

exports.getMatchDays = functionBuilder
    .https
    .onRequest(async (_, res) => {
        try {
            res.set('Access-Control-Allow-Origin', '*');
            const matchDays = await getMatchDays(db);
            res.set('Cache-Control', 'public, max-age=31536000');
            res.status(200).send(matchDays);
        } catch (error) {
            logger.error(error);
            res.status(500).send(error);
        }
    });

exports.updateMatch = functionBuilder
    .runWith({
        secrets: [footballDataKey],
        maxInstances: 1,
    })
    .https
    .onRequest(async (req, res) => {
        try {
            res.set('Access-Control-Allow-Origin', '*');
            const matchDayId = req.query.matchDayId as string | undefined;
            const matchId = req.query.matchId as string | undefined;
            if (!matchDayId) {
                res.status(400).send('matchDayId query parameter is required');
            }
            if (!matchId) {
                res.status(400).send('matchId query parameter is required');
            }
            await updateMatch(db, footballDataKey.value(), matchDayId!, matchId!);
            res.status(204).end();
        } catch (error) {
            logger.error(error);
            res.status(500).send(error);
        }
    });

exports.matchUpdated = functionBuilder
    .firestore
    .document('matchDays/{matchDayId}/matches/{matchId}')
    .onUpdate(async (change, context) => {
        const beforeData = change.before.data() as FirebaseMatch;
        if (beforeData.standing?.finished === true) {
            return;
        }
        const afterData = change.after.data() as FirebaseMatch;
        if (afterData.standing?.finished === true) {
            await settleDebts(db, context.params.matchDayId, context.params.matchId, afterData);
            await setNextBookmaker(db, context.params.matchDayId);
        }
    });