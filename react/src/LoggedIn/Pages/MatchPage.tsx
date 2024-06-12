import React, { useEffect } from 'react';
import { doc, DocumentReference, getDoc, getFirestore } from "@firebase/firestore";
import { useState } from "react";
import { useLocation, useParams } from "react-router-dom"
import { DtoMatch, FirebaseMatch, ToDtoMatch } from "../../types/Match";
import Match from "../Components/Match"
import Odds from "../Components/Odds/Odds";
import { getAuth } from "@firebase/auth";
import BetList from "../Components/BetList";

export default function MatchPage() {
    const { state } = useLocation();
    const stateMatch: DtoMatch | undefined = state?.match;

    const [match, setMatch] = useState<DtoMatch | undefined>(stateMatch);

    const { matchDayId, matchId } = useParams();

    useEffect(() => {
        if (!match) {
            getMatch(matchDayId!, matchId!);
        }

        async function getMatch(matchDayId: string, matchId: string) {
            const ref = doc(getFirestore(), "matchDays", matchDayId, "matches", matchId) as DocumentReference<FirebaseMatch>;
            const document = await getDoc(ref);
            const dtoMatch = ToDtoMatch(document);
            if (dtoMatch) {
                console.log(dtoMatch);
                setMatch(dtoMatch);
            }
        }
    }, [match, matchId, matchDayId]);

    const uid = getAuth().currentUser?.uid;

    return <div>
        {match && uid &&
            <div>
                <Match match={match} />
                <Odds match={match} uid={uid} />
                <BetList matchDayId={matchDayId!} matchId={matchId!} />
            </div>
        }
    </div>

}