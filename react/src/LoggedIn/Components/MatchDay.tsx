import React, { useEffect, useState } from 'react';
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import Typography from "@mui/material/Typography/Typography";

import { Collapse, createTheme, responsiveFontSizes } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Match from './Match';
import { DtoMatch } from '../../types/Match';

type MatchDayProps = {
    matchDayId: string,
    date: number,
}

export default function MatchDay(props: MatchDayProps) {
    const [expanded, setExpanded] = useState(false);
    // const matches = 

    useEffect(() => {
        const date = new Date(Date.now());
        if (Date.UTC(date.getFullYear(), date.getUTCMonth(), date.getUTCDate()) === props.date) {
            getMatchesAndExpand();
        }

        async function getMatchesAndExpand() {
            // await fetch()

            setExpanded(true);
        }
    }, []);

    let theme = createTheme();
    theme = responsiveFontSizes(theme);

    const navigate = useNavigate();
    function navigateToMatchPage(match: DtoMatch) {
        navigate(`/m/${match.id}`, {
            state: {
                match: match,
            }
        });
    }

    function toggleExpanded() {
        // if (!expanded && !matches) {

        // }
        setExpanded(!expanded);
    }

    return <ThemeProvider theme={theme} key={props.date}>
        <div style={{ border: "1px solid black" }} onClick={() => toggleExpanded()} >
            <Typography variant="h5"> {new Date(props.date).toLocaleDateString('no-NO')} </Typography>
            <Collapse in={expanded}>
                {/* {props.matches.map((value, index) => {
                    return <div className={"row"} key={index} onClick={() => navigateToMatchPage(value)}>
                        <Match match={value} />
                    </div>
                })} */}
            </Collapse>
        </div>
        <p></p>
    </ThemeProvider>
}