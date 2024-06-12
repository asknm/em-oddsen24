import React from 'react';
import OddsAsBookmaker from "./OddsAsBookmaker"
import OddsAsBetter from "./OddsAsBetter"
import { ToOddsArray } from "../../../types/Odds"
import { Typography } from '@mui/material';
import { DtoMatch } from '../../../types/Match';

type OddsProps = {
    match: DtoMatch,
    uid: string,
}

export default function Odds(props: OddsProps) {

    let oddsComponent: JSX.Element | null = null;
    if (props.match.odds) {
        if (props.uid === props.match.odds.bookmaker.id) {
            oddsComponent = <OddsAsBookmaker odds={props.match.odds} mid={props.match.id} />
        }
        else if (props.match.odds.H) {
            oddsComponent = <OddsAsBetter odds={ToOddsArray(props.match.odds)} match={props.match} uid={props.uid} />
        }
    }

    return <div>
        <Typography variant="body1" > {props.match.odds?.bookmaker.name} </Typography>
        {oddsComponent}
    </div>

}