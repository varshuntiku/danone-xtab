import React from 'react';
import { Box, Grid, Typography, withStyles } from '@material-ui/core';
import connectedSystemGoalStyle from 'assets/jss/connectedSystemGoalStyle.jsx';
import clsx from 'clsx';

const Goals = (props) => {
    const { name, targets } = props.goals;
    const classes = props.classes;
    return (
        <Grid className={classes.goalContainer} style={{ position: 'relative' }}>
            {props?.heading && (
                <Typography className={clsx(classes.header)}>{props.heading}</Typography>
            )}
            <div className={classes.cardLayoutWrapper}>
                <div className={clsx(props?.fit ? classes.cardLayoutFit : classes.cardLayout)}>
                    <div className={clsx(classes.sideTag)}></div>
                    <div className={classes.cardContentWrapper}>
                        <Typography className={classes.cardTitle}>{name || 'Target'}</Typography>
                        <Grid className={classes.innerLayout}>
                            {targets
                                ? targets?.map((item) => (
                                      <Box
                                          style={{ marginRight: item?.marginRight || '2.5rem' }}
                                          key={item.title}
                                          className={classes.descriptiveBox}
                                      >
                                          <Typography
                                              className={classes.subTitle}
                                              style={{ width: item?.titleWidth || 'fit-content' }}
                                          >
                                              {item.title}
                                          </Typography>
                                          <Typography className={classes.value}>
                                              {item.value}
                                          </Typography>
                                      </Box>
                                  ))
                                : null}
                        </Grid>
                    </div>
                </div>
            </div>
        </Grid>
    );
};

export default withStyles(
    (theme) => ({
        ...connectedSystemGoalStyle(theme)
    }),
    { withTheme: true }
)(Goals);
