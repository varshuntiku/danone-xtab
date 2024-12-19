import React from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Typography,
    makeStyles,
    useTheme
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import createPlotlyComponent from 'react-plotly.js/factory';

const useStyles = makeStyles((theme) => ({
    graphWrapper: {
        width: '31%',
        display: 'flex'
    },
    graphPlot: {
        flex: 1,
        height: '25rem',
        position: 'relative',
        color: `${theme.palette.text.default} !important`,
        '& .annotation-text': {
            color: `${theme.palette.text.default} !important`
        }
    },
    wrapper: {
        background: theme.palette.primary.altDark,
        borderTop: `2px solid ${theme.palette.background.default}`
    },
    heading: {
        padding: theme.spacing(2),
        '& .MuiAccordionSummary-expandIcon': {
            display: 'none'
        }
    },
    body: {
        padding: theme.spacing(2),
        display: 'flex',
        flexWrap: 'wrap'
    },
    inactive: {
        background: theme.palette.shadow.dark
    }
}));

const data = [
    {
        name: 'Quality',
        data: [
            {
                values: [38, 62],
                hole: 0.75,
                type: 'pie'
            }
        ]
    },
    {
        name: '',
        data: [
            {
                x: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                y: [0, 3, 6, 4, 5, 2, 3, 5, 4],
                type: 'scatter'
            },
            {
                x: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                y: [0, 4, 7, 8, 3, 6, 3, 3, 4],
                type: 'scatter'
            }
        ]
    },
    {
        name: '',
        data: [
            {
                x: [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec'
                ],
                y: [20, 14, 25, 16, 18, 22, 19, 15, 12, 16, 14, 17],
                type: 'bar',
                name: 'Primary Product'
            },
            {
                x: [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec'
                ],
                y: [19, 14, 22, 14, 16, 19, 15, 14, 10, 12, 12, 16],
                type: 'bar',
                name: 'Secondary Product'
            }
        ]
    }
];

const layout = {
    paper_bgcolor: 'rgb(0,0,0,0)',
    plot_bgcolor: 'rgb(0,0,0,0)',
    autosize: true,
    margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0
    },
    showlegend: false,
    grid: { rows: 1, columns: 1 }
};

const Plot = createPlotlyComponent(window.Plotly);

const QualityReportDrawer = ({
    expanded = false,
    visibility = 'hidden',
    actions: { next, previous }
}) => {
    const theme = useTheme();
    const classes = useStyles();

    layout.font = {
        color: theme.palette.text.default
    };

    return (
        <Box
            position="absolute"
            bottom="0"
            left="0"
            width="100%"
            height="100%"
            // display={display}
            visibility={visibility}
            className={classes.inactive}
        >
            <Box position="absolute" bottom="0" left="0" width="100%" className={classes.wrapper}>
                <Accordion expanded={expanded}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon fontSize="large" />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        className={classes.heading}
                    >
                        <Typography variant="h4">Data Quality Report</Typography>
                    </AccordionSummary>
                    <AccordionDetails className={classes.body}>
                        {data.map((_data, index) => {
                            const _layout = { ...layout };
                            _layout.annotations = [
                                {
                                    font: {
                                        size: 20
                                    },
                                    showarrow: false,
                                    text: _data.name,
                                    x: 0.5,
                                    y: 0.5
                                }
                            ];
                            return (
                                <Box padding="2rem" className={classes.graphWrapper} key={index}>
                                    <Plot
                                        data={_data.data}
                                        layout={_layout}
                                        config={{ displayModeBar: false, responsive: true }}
                                        className={classes.graphPlot}
                                    />
                                </Box>
                            );
                        })}
                        <Box
                            width="100%"
                            padding="1.6rem"
                            display="flex"
                            justifyContent="end"
                            gridGap="2rem"
                        >
                            <Button variant="outlined" onClick={previous}>
                                Reupload
                            </Button>
                            <Button variant="contained" onClick={next}>
                                Next
                            </Button>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </Box>
    );
};

export default QualityReportDrawer;
