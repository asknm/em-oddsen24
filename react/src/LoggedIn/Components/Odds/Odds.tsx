import React from 'react';
import OddsAsBookmaker from "./OddsAsBookmaker"
import OddsAsBetter from "./OddsAsBetter"
import { ToOddsArray } from "../../../types/Odds"
import { Typography } from '@mui/material';
import { FirebaseMatchWithId } from '../../../types/Match';

type OddsProps = {
    matchDayId: string,
    match: FirebaseMatchWithId,
    uid: string,
}

export default function Odds(props: OddsProps) {

    let oddsComponent: JSX.Element | null = null;
    if (props.match.odds) {
        if (props.uid === props.match.odds.bookmaker.id) {
            oddsComponent = <OddsAsBookmaker matchDayId={props.matchDayId} match={props.match} />
        }
        else if (props.match.odds.H) {
            oddsComponent = <OddsAsBetter matchDayId={props.matchDayId} odds={ToOddsArray(props.match.odds)} match={props.match} uid={props.uid} />
        }
    }

    return <div>
        <Typography variant="body1" > {props.match.odds?.bookmaker.name} </Typography>
        {oddsComponent}
    </div>

}