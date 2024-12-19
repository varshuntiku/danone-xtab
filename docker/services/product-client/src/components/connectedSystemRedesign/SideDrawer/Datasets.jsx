import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import ScatterGraph from './ScatterGraph';
import { withStyles } from '@material-ui/core';
import connectedSystemSideDrawerStyle from 'assets/jss/connectedSystemSideDrawerStyle.jsx';
import clsx from 'clsx';

const Datasets = ({ classes, data, ...props }) => {
    return (
        <div>
            <Typography className={classes.connSystemCardMainHeader}>DATA SETS</Typography>
            <Grid container spacing={0} className={classes.connSystemCardGridContainer}>
                {data.datasets.map((card, index) => (
                    <Grid
                        item
                        xs
                        className={clsx(
                            classes.connSystemCardItemContainer,
                            classes.intelligenceCard
                        )}
                        key={index}
                        onClick={() =>
                            props.handleRedirection({
                                toTab: 'foundation',
                                toTabID: 2,
                                fromTab: 'business process',
                                fromTabID: 0,
                                parentID: props.activeFunction.ref_id,
                                parentTitle: props.activeFunction.name,
                                childID: props.activeProblemDef.ref_id,
                                childTitle: props.activeProblemDef.name
                            })
                        }
                    >
                        <div className={`${classes.connSystemCardItemBanner} blue`} />
                        <div
                            className={classes.connSystemCardItem}
                            style={{ justifyContent: 'space-between' }}
                        >
                            <div style={{ width: '100%' }}>
                                <Typography className={classes.connSystemCardItemHeader}>
                                    {card.label}
                                </Typography>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '4rem'
                                }}
                            >
                                <div className={classes.connSystemCardItemMetricContainer}>
                                    <Typography className={classes.connSystemCardItemMetricLabel}>
                                        #
                                    </Typography>
                                    <Typography className={classes.connSystemCardItemMetricValue}>
                                        {card.serial}
                                    </Typography>
                                </div>
                                <div className={classes.connSystemCardItemMetricContainer}>
                                    <Typography className={classes.connSystemCardItemMetricLabel}>
                                        Freshness
                                    </Typography>
                                    <Typography className={classes.connSystemCardItemMetricValue}>
                                        {card.freshness}
                                    </Typography>
                                </div>
                                <div className={classes.connSystemCardItemMetricContainer}>
                                    <Typography className={classes.connSystemCardItemMetricLabel}>
                                        Drift
                                    </Typography>
                                    <Typography className={classes.connSystemCardItemMetricValue}>
                                        {card.drift}
                                    </Typography>
                                </div>
                            </div>
                            <div className={classes.connSystemCardItemGraph}>
                                <ScatterGraph
                                    graphLabel={card.graphLabel}
                                    graphData={card.graphData}
                                />
                            </div>
                        </div>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default withStyles(connectedSystemSideDrawerStyle, { withTheme: true })(Datasets);
