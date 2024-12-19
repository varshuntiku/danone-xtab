import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import InputRenderer from './InputRenderer';

const useStyles = makeStyles((theme) => ({
    simulatorRow: {
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
        justifyContent: 'space-inbetween',
        color: theme.palette.text.default,
        alignItems: 'center',
        textAlign: 'center',
        padding: '1rem',
        marginBottom: '2rem',
        background: theme.palette.background.default
    },
    simulatorColumn: {
        width: '50%',
        color: 'white'
    },
    simulatorSwitchB: {
        display: 'flex'
    },
    rootSectionSummary: {
        flexDirection: 'row-reverse',
        alignItems: 'baseline',
        minWidth: '100vw',
        paddingTop: '2rem',
        marginLeft: 0,
        paddingLeft: 0
    },
    rootSection: {
        marginLeft: 0,
        paddingLeft: 0,
        '&:before': {
            height: 0
        }
    },
    renderContainer: {
        textAlign: 'left',
        paddingLeft: '3.25rem',
        width: 'auto'
    },
    containerStyle: {
        justifyContent: 'center'
    }
}));

export default function AlternateSimulatorCustomType({ sectionInps }) {
    const classes = useStyles();
    const [simulatorState, setSimulatorState] = useState(sectionInps);
    const rowRenderer = (section, level, key) => {
        let type = [];
        for (let input in section) {
            type.push(input);
        }
        return (
            <React.Fragment>
                {type.map((val) =>
                    InputRenderer(val, section[val], simulatorState, setSimulatorState, level, key)
                )}
            </React.Fragment>
        );
    };
    const HierarchyRenderer = ({ children, value, expanded, setExpanded, removeIcon }) => {
        const expandAccordion = (event) => {
            event.stopPropagation();
            setExpanded(!expanded);
        };
        return (
            <Accordion
                className={classes.rootSection}
                expanded={expanded}
                onClick={(e) => expandAccordion(e)}
                onFocus={(e) => e.stopPropagation()}
            >
                <AccordionSummary
                    className={classes.rootSectionSummary}
                    expandIcon={removeIcon ? null : <ExpandMore />}
                    IconButtonProps={{ edge: 'start' }}
                    style={{ margin: '1rem' }}
                    onClick={(e) => expandAccordion(e)}
                    aria-label={`accordionsummary${value?.level}`}
                    onFocus={(e) => e.stopPropagation()}
                >
                    {children}
                </AccordionSummary>
                {expanded ? (
                    <AccordionDetails
                        aria-label={`accordiondetails${value?.level}`}
                        onFocus={(e) => e.stopPropagation()}
                        style={{ marginLeft: '2rem' }}
                    >
                        {multiLevelRenderer(value?.child_indicators)}
                    </AccordionDetails>
                ) : null}
            </Accordion>
        );
    };

    const multiLevelRenderer = (value) => {
        const [expanded, setExpanded] = useState(false);
        switch (value?.multi_level) {
            case true:
                return (
                    <HierarchyRenderer
                        value={value}
                        expanded={expanded}
                        setExpanded={setExpanded}
                        removeIcon={value?.removeIcon || false}
                    >
                        <Grid item xs={1}>
                            {value?.label && (
                                <Typography style={{ textAlign: 'left' }} variant="h4">
                                    {value.label}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={8}>
                            <Grid container direction="column">
                                <Grid item>
                                    <Grid container direction="row" justifyContent="space-between">
                                        {rowRenderer(value?.indicators[0], value?.level, 0)}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        {value?.total && (
                            <Grid item xs={1}>
                                <Typography
                                    style={{ textAlign: 'center', paddingBottom: '1rem' }}
                                    variant="h5"
                                >
                                    {value?.total?.label || 'Total'}
                                </Typography>
                                <Typography style={{ textAlign: 'center' }} variant="h4">{`$ ${(
                                    value?.total?.value || 0
                                ).toLocaleString(undefined, {
                                    maximumFractionDigits: 2
                                })}`}</Typography>
                            </Grid>
                        )}
                    </HierarchyRenderer>
                );
            case false:
                return (
                    <React.Fragment>
                        <Grid item xs={value?.labelLength || 2}>
                            {value?.label && (
                                <Typography className={classes.renderContainer} variant="h4">
                                    {value.label}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={8}>
                            <Grid container direction="column">
                                {value?.indicators?.map((val, key) => (
                                    <Grid item key={`row_${key}`}>
                                        <Grid
                                            container
                                            direction="row"
                                            justifyContent="space-between"
                                        >
                                            {rowRenderer(val, value?.level, key)}
                                        </Grid>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                        {value?.total && (
                            <Grid item xs={1}>
                                <Typography
                                    style={{ textAlign: 'center', paddingBottom: '1rem' }}
                                    variant="h5"
                                >
                                    {value?.total?.label || 'Total'}
                                </Typography>
                                <Typography style={{ textAlign: 'center' }} variant="h4">{`$ ${(
                                    value?.total?.value || 0
                                ).toLocaleString(undefined, {
                                    maximumFractionDigits: 2
                                })}`}</Typography>
                            </Grid>
                        )}
                    </React.Fragment>
                );
        }
    };

    return (
        <Grid container xs={12} direction="row" spacing={2} className={classes.simulatorRow}>
            {multiLevelRenderer(simulatorState)}
        </Grid>
    );
}
