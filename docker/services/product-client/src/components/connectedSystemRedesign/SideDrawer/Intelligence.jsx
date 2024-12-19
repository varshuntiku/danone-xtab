import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import ScatterGraph from './ScatterGraph';
import { withStyles } from '@material-ui/core';
import connectedSystemSideDrawerStyle from 'assets/jss/connectedSystemSideDrawerStyle.jsx';
import clsx from 'clsx';

const Intelligence = ({ data, classes, ...props }) => {
    return (
        <div>
            <Typography className={classes.connSystemCardMainHeader}>INTELLIGENCE</Typography>
            <Grid container spacing={0} className={classes.connSystemCardGridContainer}>
                {data.intelligence.map((card, index) => (
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
                                toTab: 'intelligence',
                                toTabID: 1,
                                fromTab: 'business process',
                                fromTabID: 0,
                                parentID: props.activeFunction.ref_id,
                                parentTitle: props.activeFunction.name,
                                childID: props.activeProblemDef.ref_id,
                                childTitle: props.activeProblemDef.name
                            })
                        }
                    >
                        <div className={`${classes.connSystemCardItemBanner} yellow`} />
                        <div className={classes.connSystemCardItem}>
                            <div className={classes.connSystemCardItemWrapper}>
                                <Typography className={classes.connSystemCardItemHeader}>
                                    {card.label}
                                </Typography>
                                <Typography className={classes.connSystemCardItemNumber}>
                                    {card.value < 10 ? '0' + card.value : card.value}
                                </Typography>
                            </div>
                            {card.showGraph && (
                                <div className={classes.connSystemCardItemGraph}>
                                    <ScatterGraph
                                        graphLabel={card.graphLabel}
                                        graphData={card.graphData}
                                    />
                                </div>
                            )}
                        </div>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default withStyles(connectedSystemSideDrawerStyle, { withTheme: true })(Intelligence);
