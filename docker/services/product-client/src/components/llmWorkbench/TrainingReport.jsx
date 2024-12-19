import React from 'react';
import { Box, Button, Typography, alpha, makeStyles, useTheme } from '@material-ui/core';
import createPlotlyComponent from 'react-plotly.js/factory';

const useStyles = makeStyles((theme) => ({
    wrapper: {
        background: theme.palette.background.default
    },
    graphPlot: {
        flex: 1,
        height: '100%',
        position: 'relative',
        color: `${theme.palette.text.default} !important`,
        '& .annotation-text': {
            color: `${theme.palette.text.default} !important`
        }
    },
    llmReport: {
        borderRight: `solid 1px ${alpha(theme.palette.border.dashboard, 0.4)}`
    },
    healthReportCard: {
        border: `solid ${theme.spacing(0.5)} rgba(84, 201, 251, 1)`,
        borderLeft: `solid ${theme.spacing(1.5)} rgba(84, 201, 251, 1)`,
        padding: theme.spacing(1, 2),
        borderRadius: theme.spacing(0.5)
    }
}));

const data = [
    { label: 'No. of Null Flags', value: '0' },
    { label: 'No. of Zero Train Set', value: '0' }
];

const _data = [
    {
        values: [100],
        hole: 0.75,
        type: 'pie'
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
    annotations: [
        {
            font: {
                size: 20
            },
            showarrow: false,
            text: 'LLM Status',
            x: 0.5,
            y: 0.5
        }
    ],
    showlegend: false,
    grid: { rows: 1, columns: 1 }
};

const Plot = createPlotlyComponent(window.Plotly);

const TrainingReport = ({ reconfigure }) => {
    const classes = useStyles();
    const theme = useTheme();
    layout.font = {
        color: theme.palette.text.default
    };
    return (
        <Box display="flex" flexDirection="column" width="100%" height="100%" flexWrap="wrap">
            <Box display="flex" flexDirection="column" gridGap="2rem" margin="2rem" flex="1">
                <Typography variant="h4">Report</Typography>
                <Box display="flex" padding="2rem" className={classes.wrapper} flex="1">
                    <Box
                        display="flex"
                        flexDirection="column"
                        flex="1"
                        className={classes.llmReport}
                    >
                        <Typography variant="h4">LLM Report</Typography>
                        <Box padding="4rem" className={classes.graphWrapper} flex="1">
                            <Plot
                                data={_data}
                                layout={layout}
                                config={{ displayModeBar: false, responsive: true }}
                                className={classes.graphPlot}
                            />
                        </Box>
                    </Box>
                    <Box display="flex" flexDirection="column" flex="1" paddingX="4rem">
                        <Typography variant="h4">Health Check Report</Typography>
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            flex="1"
                            gridGap="1rem"
                        >
                            {data.map((_data) => (
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    className={classes.healthReportCard}
                                    key={`${_data.label}_${_data.value}`}
                                >
                                    <Typography variant="h5">{_data.label}</Typography>
                                    <Typography variant="h5">{_data.value}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>
                <Box marginY="5rem" display="flex" flexDirection="column" gridGap="1.6rem">
                    <Typography variant="h5">Not satisfied with the report?</Typography>
                    <Box display="flex" flexDirection="row" gridGap="1rem">
                        {/* TODO: 'Fine tune the original model(model name) with new configuration ' */}
                        <Button
                            variant="outlined"
                            onClick={reconfigure}
                            title="Finetune the original model with new configuration"
                        >
                            Reconfigure & Finetune
                        </Button>
                        <Button
                            variant="contained"
                            onClick={reconfigure}
                            title="Finetune this model further"
                        >
                            Finetune
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default TrainingReport;
