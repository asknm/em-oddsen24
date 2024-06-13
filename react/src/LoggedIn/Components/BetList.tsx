import React from 'react';
import { useEffect, useState } from "react"
import { onSnapshot } from "@firebase/firestore"
import { BetWithBetter, ToBetWithBetter, getBetsCol } from "../../types/Bet"
import { Typography } from "@mui/material"

type BetListProps = {
    matchDayId: string,
    matchId: string,
}

export default function BetList(props: BetListProps) {
    const [bets, setBets] = useState<BetWithBetter[]>([])

    useEffect(() => {
        onSnapshot(getBetsCol(props.matchDayId, props.matchId), async snapshot => {
            const betsWithBetterName = await Promise.all<BetWithBetter>(snapshot.docs.map(async doc => await ToBetWithBetter(doc)));
            setBets(betsWithBetterName);
        });
    }, [props.matchDayId, props.matchId]);

    const selectionSymbols = ["H", "U", "B"];

    return <div>
        {bets.map((value, index) => {
            return <Typography variant="body1" key={index}> {value.amount}kr på {selectionSymbols[value.selection]} : {value.better} : {value.timestamp && value.timestamp.toDate().toLocaleString('nb-NO')} </Typography>
        })}
    </div>

}
