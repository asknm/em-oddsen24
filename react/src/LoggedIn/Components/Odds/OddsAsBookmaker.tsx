import React from 'react';
import OddsSetter from "./OddsSetter"
import OddsViewer from "./OddsViewer"
import { ToOddsArray } from '../../../types/Odds';
import { FirebaseMatchWithId } from '../../../types/Match';

type OddsAsBookmakerProps = {
    matchDayId: string,
    match: FirebaseMatchWithId,
}

export default function OddsAsBookmaker(props: OddsAsBookmakerProps) {

    if (props.match.odds?.H) {
        return <OddsViewer odds={ToOddsArray(props.match.odds)} />
    }
    else {
        return <OddsSetter matchDayId={props.matchDayId} match={props.match} />
    } 

}