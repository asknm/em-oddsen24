import React from 'react';
import { createTheme, responsiveFontSizes, ThemeProvider, Typography } from '@mui/material';
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import RGL, { WidthProvider } from "react-grid-layout";
const ReactGridLayout = WidthProvider(RGL);

type HUBColumnsProps = {
    H: any,
    U: any,
    B: any,
}

export default function HUBColumns(props: HUBColumnsProps) {
    const theme = responsiveFontSizes(createTheme())

    const layout = [
        { i: 'h', x: 0, y: 0, w: 1, h: 1, static: true },
        { i: 'u', x: 1, y: 0, w: 1, h: 1, static: true },
        { i: 'b', x: 2, y: 0, w: 1, h: 1, static: true },
    ];

    return <ThemeProvider theme={theme}>
        <ReactGridLayout layout={layout} cols={3} rowHeight={32}>

            <Typography variant="body1" key="h" component={'span'}> {props.H} </Typography>
            <Typography variant="body1" key="u" component={'span'}> {props.U} </Typography>
            <Typography variant="body1" key="b" component={'span'}> {props.B} </Typography>

        </ReactGridLayout>
    </ThemeProvider>
}