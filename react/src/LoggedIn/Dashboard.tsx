import React from 'react';

import { useEffect, useState } from "react";
import MatchDay from './Components/MatchDay';
import { DtoMatchDictionary } from '../types/Match';
import { doc, DocumentReference, getDoc, getFirestore, collection, query, orderBy, getDocs } from "@firebase/firestore";
import { DtoMatchDay } from '../types/matchDay';

export default function Dashboard() {
    // const [matchDict, setMatchDict] = useState({} as DtoMatchDictionary)
    const [matchDays, setMatchDays] = useState([] as DtoMatchDay[])

    async function getMatchDays() {
        // const col = collection(getFirestore(), "matchDays");
        // const q = query(col, orderBy("date"));
        // const querySnapshot = await getDocs(q);
        // querySnapshot.forEach((doc) => {
        //     // doc.data() is never undefined for query doc snapshots
        //     console.log(doc.id, " => ", doc.data());
        // });

        const response = await fetch('/getMatchDays');
        const data = await response.json();
        setMatchDays(data);

        // const ref = doc(getFirestore(), "matches", mid) as DocumentReference<FirebaseMatch>;
        // const document = await getDoc(ref);
        // const dtoMatch = ToDtoMatch(document);
        // if (dtoMatch) {
        //     setMatch(dtoMatch);
        // }
    }

    // useEffect(() => {
    //     async function getMatchDays() {

    //     }


    //     async function getMatches() {
    //         const response = await fetch('/getMatches');
    //         const data = await response.json();
    //         setMatchDict(data);
    //     }

    //     getMatches()
    // }, []);

    return <div>
        {
            matchDays.map(matchDay => <MatchDay matchDayId={matchDay.id} date={matchDay.date} key={matchDay.id} />)

            // Object.entries(matchDict).map(([key, matches]) =>
            //     <MatchDay matches={matches} date={parseInt(key)} key={key} />
            // )
        }
    </div >
}
