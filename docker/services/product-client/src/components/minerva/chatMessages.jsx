import { Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import NavigateNextIcon from '@material-ui/icons/ChevronRight';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { ReactComponent as MinervaLogo } from 'assets/img/minerva_logo.svg';
import PersonIcon from '@material-ui/icons/Person';
const useStyles = makeStyles((theme) => ({
    container: {
        background: theme.palette.background.paper,
        width: '100%',
        height: '100%',
        padding: '0 1em'
    },
    chatRight: {
        justifyContent: 'left',
        backgroundColor: theme.palette.background.message,
        color: '#FFFFFF',
        paddingLeft: '3.7rem !important',
        paddingRight: '3rem !important',
        borderRadius: '5rem 0 5rem 5rem'
    },
    userImg: {
        backgroundColor: theme.palette.icons.backgroundColorWithOpacity,
        border: '1px solid transparent',
        borderRadius: '50%',
        transform: 'scale(1.8)'
    },
    minervaImg: {
        color: theme.palette.primary.contrastText,
        transform: 'scale(1.8)'
    },
    chatLeft: {
        justifyContent: 'left',
        color: theme.palette.text.titleText,
        paddingLeft: '3.8rem !important',
        paddingRight: '2.5rem !important',
        backgroundColor: theme.palette.primary.main,
        borderRadius: '0 3rem 3rem 3rem',
        opacity: '80%'
    },
    chatMessage: {
        width: '100%',
        minHeight: '7rem',
        overflow: 'hidden',
        whiteSpace: 'normal',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        fontSize: '2rem',
        marginTop: '0.5rem',
        marginBottom: '0.5rem'
    },
    recommendation: {
        color: theme.palette.text.titleText,
        padding: '1.5rem 2.5rem',
        borderRadius: '6rem 6rem 6rem 6rem',
        border: 'dashed 1px',
        borderColor: theme.palette.border.dashed,
        width: '100%',
        fontSize: '1.8rem',
        fontWeight: '500',
        cursor: 'pointer',
        opacity: '80%'
    },
    viewLink: {
        fontSize: '1.6rem',
        color: theme.palette.primary.contrastText,
        textAlign: 'center'
    },
    viewButton: {
        display: 'block'
    },
    navIcon: {
        color: theme.palette.primary.contrastText,
        paddingTop: '0.2rem',
        paddingLeft: '0.3rem',
        transform: 'scale(1.5)'
    },
    minervaLogoSection: {
        display: 'flex',
        width: '5.5rem',
        height: '5.5rem',
        border: '1px solid',
        borderColor: theme.palette.icons.border,
        backgroundColor: theme.palette.icons.background,
        borderRadius: '50%'
    },
    userMessageGridContainer: {
        padding: '0.3rem 1rem',
        height: 'min-content'
    },
    userIcon: {
        color: theme.palette.background.icon
    },
    userIconSection: {
        display: 'flex',
        alignItems: 'center'
    },
    minervaLogoGridContainer: {
        padding: '0.3rem 0.7rem',
        height: 'min-content'
    },
    minervaLogoGridItem: {
        display: 'flex',
        alignItems: 'center',
        margin: '0.6rem'
    },
    minervaLogo: {
        margin: 'auto',
        fill: theme.palette.primary.contrastText
    },
    recommendationGridContainer: {
        padding: '0.8rem 0'
    },
    recommendationGridItem: {
        display: 'flex',
        justifyContent: 'center'
    },
    recommendationSpan: {
        color: '#686A6B'
    }
}));

export function UserMessage({ text, icon }) {
    const classNames = useStyles();
    return (
        <Grid container spacing={1} className={classNames.userMessageGridContainer}>
            <Grid item xs={2}></Grid>
            <Grid item xs={9}>
                <div className={`${classNames.chatMessage} ${classNames.chatRight}`}>
                    <span>
                        {text} <br></br>
                    </span>
                </div>
            </Grid>
            <Grid item xs={1} className={classNames.userIconSection}>
                <div className={classNames.userImg}>
                    {icon === true ? (
                        <PersonIcon className={classNames.userIcon} fontSize="large" />
                    ) : (
                        <div></div>
                    )}
                </div>
            </Grid>
        </Grid>
    );
}

export function MinervaMessage({ text, icon, ...props }) {
    const classNames = useStyles();
    return (
        <Grid container spacing={1} className={classNames.minervaLogoGridContainer}>
            <Grid item className={classNames.minervaLogoGridItem}>
                <div className={classNames.minervaLogoSection}>
                    {icon === true ? (
                        <MinervaLogo className={classNames.minervaLogo} />
                    ) : (
                        <div style={{ paddingLeft: '20px' }}></div>
                    )}
                </div>
            </Grid>
            <Grid item xs={9}>
                <div className={`${classNames.chatMessage} ${classNames.chatLeft}`}>
                    <span>
                        {text} <br></br>
                        {props.parent === 'chatBot' ? (
                            <Button
                                className={classNames.viewButton}
                                onClick={props.viewDetails}
                                aria-label="View details"
                            >
                                <Typography className={classNames.viewLink}>
                                    View details
                                    <NavigateNextIcon className={classNames.navIcon} />
                                </Typography>
                            </Button>
                        ) : (
                            <span></span>
                        )}
                    </span>
                </div>
            </Grid>
            <Grid item xs={2}></Grid>
        </Grid>
    );
}

export function RecommendationCards({ recommendations, onClickFn }) {
    const classNames = useStyles();
    let temp = recommendations ? (
        recommendations.map((item, index) => (
            <Grid
                key={index}
                container
                justify="center"
                spacing={2}
                className={classNames.recommendationGridContainer}
            >
                <Grid item xs={10} className={classNames.recommendationGridItem}>
                    <div
                        onClick={() => onClickFn(item)}
                        className={classNames.recommendation}
                        key={index}
                    >
                        <span>
                            {item} <br></br> <span className={classNames.recommendationSpan}></span>
                        </span>
                    </div>
                </Grid>
            </Grid>
        ))
    ) : (
        <div></div>
    );
    return temp;
}
