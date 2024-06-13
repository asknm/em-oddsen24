import React, { useEffect } from 'react';

import { useState } from "react";
import MatchDay from './Components/MatchDay';
import { DtoMatchDay } from '../types/DtoMatchDay';

export default function Dashboard() {
    const [matchDays, setMatchDays] = useState([] as DtoMatchDay[])

    useEffect(() => {
        async function getMatchDays() {
            const response = await fetch('/getMatchDays');
            // const response = await fetch('https://europe-central2-em-oddsen24-test.cloudfunctions.net/getMatchDays');
            const data = await response.json();
            setMatchDays(data);
        }

        getMatchDays();
    }, []);

    return <div>
        {
            matchDays.map(matchDay => <MatchDay matchDayId={matchDay.id} date={matchDay.date} key={matchDay.id} />)
        }
    </div >
}
