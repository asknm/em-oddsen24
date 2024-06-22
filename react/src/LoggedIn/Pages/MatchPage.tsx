import React, { useEffect } from 'react';
import { onSnapshot } from "@firebase/firestore";
import { useState } from "react";
import { useParams } from "react-router-dom"
import { FirebaseMatchWithId, getMatchDoc } from "../../types/Match";
import Match from "../Components/Match"
import Odds from "../Components/Odds/Odds";
import { getAuth } from "@firebase/auth";
import BetList from "../Components/BetList";

export default function MatchPage() {
    const { matchDayId, matchId } = useParams();

    const [match, setMatch] = useState<FirebaseMatchWithId | undefined>();

    useEffect(() => {
        if (!match) {
            getMatch(matchDayId!, matchId!);
        }

        async function getMatch(matchDayId: string, matchId: string) {
            const ref = getMatchDoc(matchDayId, matchId);
            onSnapshot(ref, snapshot => {
                var match = snapshot.data() as FirebaseMatchWithId;
                match.id = snapshot.id;
                setMatch(match);
            });
        }
    }, [match, matchId, matchDayId]);

    const uid = getAuth().currentUser?.uid;

    return <div>
        {match && uid &&
            <div>
                <Match matchDayId={matchDayId!} match={match} />
                <Odds matchDayId={matchDayId!} match={match} uid={uid} />
                <BetList matchDayId={matchDayId!} match={match} />
            </div>
        }
    </div>

}