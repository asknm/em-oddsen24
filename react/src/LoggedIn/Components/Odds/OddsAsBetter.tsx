import React from 'react';
import { onSnapshot } from "@firebase/firestore"
import { useEffect, useState } from "react"
import { BaseBet, getBetsDoc } from "../../../types/Bet"
import OddsBetter from "./OddsBetter"
import OddsViewer from "./OddsViewer"
import { OddsArray } from '../../../types/Odds';
import { FirebaseMatchWithId, HasStarted } from '../../../types/Match';

type OddsAsBetterProps = {
    matchDayId: string,
    odds: OddsArray,
    match: FirebaseMatchWithId,
    uid: string,
}

export default function OddsAsBetter(props: OddsAsBetterProps) {
    const [bet, setBet] = useState<BaseBet | null | undefined>(undefined);

    useEffect(() => {
        onSnapshot(getBetsDoc(props.matchDayId, props.match.id, props.uid), doc => {
            if (!doc.exists()) {
                setBet(null);
                return;
            }
            setBet(doc.data());
        });
    }, [props.matchDayId, props.match.id, props.uid]);

    if (bet === null && !HasStarted(props.match)) {
        return <OddsBetter matchDayId={props.matchDayId} odds={props.odds} matchId={props.match.id} uid={props.uid} />
    }

    return <OddsViewer odds={props.odds} />

}