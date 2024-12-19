import { Box, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

const useStyles = makeStyles((theme) => ({
    kpiContainer: {},
    kpiUp: {
        '& $kpiValue': {
            color: theme.palette.success.main
        }
    },
    kpiDown: {
        '& $kpiValue': {
            color: theme.palette.error.main
        }
    },
    kpiValue: {
        color: theme.palette.primary.contrastText
    }
}));
/**
 * Renders the Key Performance Indicators
 * @summary Gives the measure of performance over time for specific objectives using the given data with labels to show if it has improved or gone down with relevant data and margin.
 * Used where we want to provide targets, milestones to gauge progress or insights to give an overview of data analysis
 * JSON structure-
 * {
 *    value: {<list of parameter and values>}
 *    extra_dir: <can be up or down depending on data>
 *    extra_value: <YoY margin>
 *    value: <value>
 *    widget_value_id: <widget id>
 *  }
 * @param {object} params - data
 */
export default function AppWidgetKpi({ params }) {
    const classes = useStyles();
    let kpiClasses = classes.kpiContainer;
    const data = params;

    if (data?.extra_dir) {
        if (data.extra_dir === 'down') {
            kpiClasses = classes.kpiDown;
        } else if (data.extra_dir === 'up') {
            kpiClasses = classes.kpiUp;
        }
    }

    if (!data) {
        return null;
    }

    return (
        <Box
            paddin="0 1rem"
            height="100%"
            width="100%"
            display="flex"
            flexDirection="column"
            position="relative"
            justifyContent="flex-start"
            className={kpiClasses}
            overflow="hidden"
        >
            <Typography style={{ fontWeight: 500 }} variant="h5" align="center">
                {data.name}
            </Typography>
            <Box
                position="absolute"
                height="100%"
                flex={1}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignSelf="center"
            >
                <Typography
                    style={{ fontWeight: 700 }}
                    variant="h3"
                    align="right"
                    className={classes.kpiValue}
                >
                    {data.extra_dir === 'down' && !data.suppress_arrow ? (
                        <ArrowDownwardIcon
                            fontSize="inherit"
                            style={{ color: 'inherit', verticalAlign: 'bottom' }}
                        />
                    ) : null}
                    {data.extra_dir === 'up' && !data.suppress_arrow ? (
                        <ArrowUpwardIcon
                            fontSize="inherit"
                            style={{ color: 'inherit', verticalAlign: 'bottom' }}
                        />
                    ) : null}
                    {data instanceof Object ? data.value : data}
                </Typography>
                {data.extra_value && (
                    <Typography variant="h5" align="right" className={classes.kpiValue}>
                        {data.extra_value}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}
