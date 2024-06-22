import React from 'react';
import { useEffect, useState } from "react"
import { onSnapshot, query, orderBy } from "@firebase/firestore"
import { BetWithBetter, ToBetWithBetter, getBetsCol } from "../../types/Bet"
import { Typography } from "@mui/material"
import { FirebaseMatchWithId } from '../../types/Match';
import { HUB, ToOddsArray } from '../../types/Odds';
import HUBColumns from './HUBColumns';

type BetListProps = {
    matchDayId: string,
    match: FirebaseMatchWithId,
}

export default function BetList(props: BetListProps) {
    const [bets, setBets] = useState<BetWithBetter[]>([]);
    const [potentialGain, setPotentialGain] = useState<HUB | undefined>();

    useEffect(() => {
        const betsCol = getBetsCol(props.matchDayId, props.match.id);
        const q = query(betsCol, orderBy("timestamp"));
        onSnapshot(q, async snapshot => {
            const betsWithBetterName = await Promise.all<BetWithBetter>(snapshot.docs.map(async doc => await ToBetWithBetter(doc)));
            setBets(betsWithBetterName);
        });
    }, [props]);

    useEffect(() => {
        if (!props.match.odds) {
            return;
        }
        const oddsArray = ToOddsArray(props.match.odds);
        setPotentialGain({
            H: calculateGain(oddsArray[0], 0),
            U: calculateGain(oddsArray[1], 1),
            B: calculateGain(oddsArray[2], 2),
        });

        function calculateGain(odds: number, oddsSelection: number): number {
            return bets.reduce<number>((prev, current) => {
                if (current.selection === oddsSelection) {
                    return prev - current.amount * (odds - 1);
                }
                else {
                    return prev + current.amount;
                }
            }, 0);
        }
    }, [props, bets]);

    const selectionSymbols = ["H", "U", "B"];

    return <div>
        <HUBColumns H={potentialGain?.H} U={potentialGain?.U} B={potentialGain?.B} />
        {bets.map((value, index) => {
            return <Typography variant="body1" key={index}> {value.amount}kr på {selectionSymbols[value.selection]} : {value.better} : {value.timestamp && value.timestamp.toDate().toLocaleString('nb-NO')} </Typography>
        })}
    </div>

}
