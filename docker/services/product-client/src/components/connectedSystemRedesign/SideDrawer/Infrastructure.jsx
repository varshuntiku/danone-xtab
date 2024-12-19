import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core';
import connectedSystemSideDrawerStyle from 'assets/jss/connectedSystemSideDrawerStyle.jsx';
import clsx from 'clsx';

const Infrastructure = ({ classes, data, activeProblemDef, activeFunction, handleRedirection }) => {
    return (
        <div>
            <Typography className={classes.connSystemCardMainHeader}>INFRASTRUCTURE</Typography>
            <Grid container spacing={0} className={classes.connSystemCardGridContainer}>
                {data.infrastructure.map((card, index) => (
                    <Grid
                        item
                        xs
                        className={clsx(
                            classes.connSystemCardItemContainer,
                            classes.intelligenceCard
                        )}
                        key={index}
                        onClick={() =>
                            handleRedirection({
                                toTab: 'foundation',
                                toTabID: 2,
                                fromTab: 'business process',
                                fromTabID: 0,
                                parentID: activeFunction.ref_id,
                                parentTitle: activeFunction.name,
                                childID: activeProblemDef.ref_id,
                                childTitle: activeProblemDef.name
                            })
                        }
                    >
                        <div className={`${classes.connSystemCardItemBanner} green`} />
                        <div className={classes.connSystemCardItem}>
                            <Typography className={classes.connSystemCardItemHeader}>
                                {card.label}
                            </Typography>
                            <Typography className={classes.connSystemCardItemNumberSmall}>
                                {card.value}
                            </Typography>
                        </div>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default withStyles(connectedSystemSideDrawerStyle, { withTheme: true })(Infrastructure);
