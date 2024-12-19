import React from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import impactCardStyle from 'assets/jss/impactCardStyle';

const ImpactCard = ({ classes, metrics }) => {
    return (
        <div className={classes.impactCardContainer}>
            <div className={classes.cardBanner}></div>
            <div>
                <div className={classes.impactHighlights}>
                    {metrics.map((card) => (
                        <div key={card.id} className={classes.impactHighlightCard}>
                            <Typography className={classes.impactHighlightCardTitle}>
                                {card.title}
                            </Typography>
                            <Typography className={classes.impactHighlightCardValue}>
                                {card.unit !== '%' && card.unit + ' '}
                                {Intl.NumberFormat('en', { notation: 'compact' }).format(
                                    card.value
                                )}
                                {card.unit === '%' && '%'}
                            </Typography>
                        </div>
                    ))}
                </div>
            </div>
            <div className={classes.impactCardItem}>
                <div className={classes.impactMiniCardContainer}>
                    <div className={`${classes.impactMiniCard} ${classes.impactMiniContactCard}`}>
                        <Typography className={classes.impactMiniCardTitle}>
                            <MailOutlineIcon className={classes.impactMiniCardTitleIcon} /> Contact
                        </Typography>
                        <Typography className={classes.impactMiniCardValue}>
                            rgm@company.com
                        </Typography>
                    </div>
                    <div className={`${classes.impactMiniCard} ${classes.impactMiniStatusCard}`}>
                        <Typography className={classes.impactMiniCardTitle}>
                            <CheckCircleOutlineIcon className={classes.impactMiniCardTitleIcon} />{' '}
                            Status
                        </Typography>
                        <Typography className={classes.impactMiniCardValue}>
                            Approved for next step
                        </Typography>
                    </div>
                    <div className={`${classes.impactMiniCard} ${classes.impactMiniStageCard}`}>
                        <Typography className={classes.impactMiniCardTitle}>
                            <PlayCircleOutlineIcon className={classes.impactMiniCardTitleIcon} />{' '}
                            Current Stage
                        </Typography>
                        <Typography className={classes.impactMiniCardValue}>
                            Set pricing Constraints
                        </Typography>
                    </div>
                    <div className={`${classes.impactMiniCard} ${classes.impactMiniStageCard}`}>
                        <Typography className={classes.impactMiniCardTitle}>
                            <SkipNextIcon className={classes.impactMiniCardTitleIcon} /> Next Stage
                        </Typography>
                        <Typography className={classes.impactMiniCardValue}>
                            Sales Overrides
                        </Typography>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withStyles(impactCardStyle, { withTheme: true })(ImpactCard);
