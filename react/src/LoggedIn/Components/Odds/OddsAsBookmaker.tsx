import React from 'react';
import OddsSetter from "./OddsSetter"
import OddsViewer from "./OddsViewer"
import { Odds, ToOddsArray } from '../../../types/Odds';

type OddsAsBookmakerProps = {
    odds: Odds,
    mid: string
}

export default function OddsAsBookmaker(props: OddsAsBookmakerProps) {

    if (props.odds.H) {
        return <OddsViewer odds={ToOddsArray(props.odds)} />
    }
    else {
        return <OddsSetter mid={props.mid} />
    } 

}