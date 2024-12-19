import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'underscore';
import { Typography } from '@material-ui/core';
import { ChevronLeft, Close } from '@material-ui/icons';
import BorderContainer from './BorderContainer';
import Logo from 'components/Nuclios/assets/logoIcon.svg';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@material-ui/icons/ThumbDownOutlined';
import HorizontalScrollNew from '../HorizontalScrollNew';
import PowerBiLogo from 'assets/img/conn-system-soln-powerbi.svg';
import SalesforceLogo from 'assets/img/salesforce.svg';
import TableauLogo from 'assets/img/tableau.svg';
import PalantirLogo from 'assets/img/palantir.svg';
import { FiberManualRecord } from '@material-ui/icons';

function ValueSolutions({
    actions,
    setActions,
    close = true,
    solutionsHeading = 'Solutions',
    solutionsLeft = true,
    solutionsRight = true,
    insights = false,
    insightsData,
    styles = {},
    bottomBorder = true,
    selectedTab = '',
    valueTab = true
}) {
    const useStyles = makeStyles((theme) => ({
        container: {
            height: 'fit-content',
            width: '100%',
            left: 0,
            bottom: theme.layoutSpacing(15),
            transition: '1s'
        },
        header: {
            height: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: theme.palette.primary.dark,
            paddingTop: '1rem',
            paddingBottom: '1rem',
            paddingLeft: theme.layoutSpacing(32),
            cursor: selectedTab === 'value' ? 'pointer' : 'normal'
        },
        heading: {
            fontWeight: theme.title.h6.fontWeight,
            fontSize: theme.layoutSpacing(22),
            fontFamily: theme.typography.fonts.secondaryFont
        },
        icon: {
            fontSize: theme.layoutSpacing(25),
            rotate: '-90deg',
            cursor: 'pointer'
        },
        body: {
            height: 'fit-content',
            display: 'flex',
            gap: theme.layoutSpacing(15),
            transition: '1s',
            backgroundColor: theme.palette.primary.dark,
            borderLeft: `1px solid ${theme.palette.separator.grey}`,
            borderRight:
                solutionsHeading === 'Tools' ? `1px solid ${theme.palette.separator.grey}` : 'none',
            width: '100%'
        },
        bodyOpen: {
            height: 'fit-content',
            position: !close ? '' : 'absolute',
            transition: '2s smooth',
            overflow: 'hidden'
        },
        card: {
            minWidth: valueTab ? '40rem' : styles ? styles.width : '16vw',
            height: valueTab ? '21rem' : styles ? theme.layoutSpacing(styles.height) : '100%',
            padding: theme.layoutSpacing(15),
            background: theme.palette.primary.dark
        },
        contentLeft: {
            width: '2.5rem !important'
        },
        contentCenter: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(3)
            // maxWidth: '30rem',
        },
        cardIcon: {
            width: '100%',
            aspectRatio: 1
        },
        cardHeading: {
            fontSize: theme.layoutSpacing(15),
            color: theme.palette.text.default,
            fontFamily: theme.typography.fonts.secondaryFont,
            width: '100%',
            fontWeight: '500',
            paddingRight: theme.layoutSpacing(20)
        },
        solutionList: {
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(0.5),
            color: theme.palette.text.default,
            fontSize: theme.layoutSpacing(15),
            justifyContent: 'center'
        },
        solutionItem: {
            display: 'flex',
            gap: theme.spacing(1),
            fontWeight: 300,
            alignItems: 'center',
            '& svg': {
                color: theme.palette.text.default,
                fontSize: theme.spacing(1)
            }
        },
        leftContainer: {
            display: 'flex',
            gap: '1rem'
        },
        progressText: {
            fontSize: theme.layoutSpacing(10),
            fontFamily: theme.title.h1.fontFamily,
            fontWeight: 400,
            lineHeight: theme.layoutSpacing(14),
            letterSpacing: theme.layoutSpacing(1),
            color: theme.palette.text.default
        },
        progressNeg: {
            backgroundColor: theme.ConnectedSystemDashboard.connectedSystemNegative,
            width: theme.layoutSpacing(56),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        progressPos: {
            backgroundColor: theme.ConnectedSystemDashboard.connectedSystemPositive,
            width: theme.layoutSpacing(56),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        insightsContent: {
            width: '90%',
            height: theme.layoutSpacing(72),
            color: theme.palette.text.default,
            fontSize: theme.layoutSpacing(15),
            fontFamily: theme.body.B3.fontFamily,
            fontWeight: 400
        },
        likesSection: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '90%'
        },
        likeIcon: {
            color: theme.palette.text.indicatorGreenText,
            fontSize: theme.layoutSpacing(22)
        },
        disLikeIcon: {
            color: theme.palette.separator.grey,
            fontSize: theme.layoutSpacing(22)
        },
        notifyText: {
            color: theme.palette.text.default,
            fontFamily: theme.title.h1.fontFamily,
            fontWeight: 500,
            fontSize: theme.layoutSpacing(14),
            textDecoration: 'underline'
        },
        track: {
            display: 'flex',
            alignItems: 'center',
            gap: theme.layoutSpacing(3)
        },
        trackSection: {
            display: 'flex',
            gap: theme.layoutSpacing(5)
        },
        count: {
            color: theme.palette.text.default,
            fontSize: theme.layoutSpacing(15),
            fontFamily: theme.body.B3.fontFamily,
            fontWeight: 400
        },
        solutionCard: {
            width: styles ? styles.width : '16vw',
            height: styles ? theme.layoutSpacing(styles.height) : theme.layoutSpacing(192),
            padding: theme.layoutSpacing(15),
            background: theme.palette.primary.dark,
            paddingLeft: theme.layoutSpacing(40)
        },
        itemText: {
            fontSize: theme.layoutSpacing(15),
            fontFamily: theme.body.B3.fontFamily,
            fontWeight: 400,
            lineHeight: theme.layoutSpacing(20),
            letterSpacing: theme.layoutSpacing(0.5)
        },
        linkApp: {
            textDecoration: 'none',
            cursor: 'pointer',
            width: '90%'
        }
    }));
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    useEffect(() => {
        if (actions?.solutions) {
            setOpen(true);
        }
    }, [actions]);

    const borderTop = () => {
        if (close) {
            return open ? true : false;
        } else {
            return false;
        }
    };
    const handleSolutions = () => {
        setOpen(!open);
        setActions((prevstate) => ({ ...prevstate, solutions: false }));
    };
    return (
        <div className={`${classes.container} ${open && classes.bodyOpen}`}>
            <BorderContainer
                left={solutionsLeft}
                right={solutionsRight}
                top={borderTop()}
                bottom={!open ? true : false}
            >
                <div
                    className={classes.header}
                    onClick={selectedTab === 'value' ? handleSolutions : null}
                >
                    <Typography className={classes.heading} variant="h3">
                        {solutionsHeading}
                    </Typography>
                    {close && (
                        <>
                            {open ? (
                                <Close className={classes.icon} />
                            ) : (
                                <ChevronLeft className={classes.icon} />
                            )}
                        </>
                    )}
                </div>
            </BorderContainer>
            {open && (
                <div className={classes.body}>
                    {!insights && (
                        <HorizontalScrollNew>
                            {_.map(insightsData, function (card, index) {
                                return (
                                    <BorderContainer
                                        right={index + 1 === insightsData.length ? false : true}
                                        top
                                        bottom={bottomBorder}
                                        classesProp={classes.card}
                                        key={card.id}
                                        hideRightTop={true}
                                    >
                                        <div className={classes.leftContainer}>
                                            <div className={classes.contentLeft}>
                                                <img
                                                    src={
                                                        card?.powerBi || card?.type === 'powerbi'
                                                            ? PowerBiLogo
                                                            : card?.salesForce ||
                                                              card?.type === 'salesforce'
                                                            ? SalesforceLogo
                                                            : card?.type === 'tableau'
                                                            ? TableauLogo
                                                            : card?.type === 'palantir'
                                                            ? PalantirLogo
                                                            : Logo
                                                    }
                                                    className={classes.cardIcon}
                                                    alt="logo"
                                                />
                                            </div>
                                            <a
                                                className={classes.linkApp}
                                                href={card.link}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <div className={classes.contentCenter}>
                                                    <div className={classes.cardHeading}>
                                                        {card.name}
                                                    </div>
                                                    <div className={classes.solutionList}>
                                                        {card?.data.map((item, itemIndex) => (
                                                            <div
                                                                className={classes.solutionItem}
                                                                key={`listItem${index}${itemIndex}`}
                                                            >
                                                                {!valueTab && <FiberManualRecord />}
                                                                <Typography
                                                                    className={classes.itemText}
                                                                >
                                                                    {item.name}
                                                                </Typography>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    </BorderContainer>
                                );
                            })}
                        </HorizontalScrollNew>
                    )}
                    {insights && (
                        <HorizontalScrollNew>
                            {insightsData.map((item, index) => (
                                <BorderContainer
                                    right={index + 1 === insightsData.length ? false : true}
                                    top
                                    classesProp={classes.solutionCard}
                                    key={'valueSolutionCard' + index}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            height: '100%',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <div
                                            className={
                                                item.progress === 'Positive'
                                                    ? classes.progressPos
                                                    : classes.progressNeg
                                            }
                                        >
                                            <Typography className={classes.progressText}>
                                                {item.progress}
                                            </Typography>
                                        </div>

                                        <Typography className={classes.insightsContent}>
                                            {item.content}
                                        </Typography>
                                        <div className={classes.likesSection}>
                                            <div className={classes.trackSection}>
                                                <div className={classes.track}>
                                                    <ThumbUpOutlinedIcon
                                                        className={classes.likeIcon}
                                                    />
                                                    <Typography className={classes.count}>
                                                        {item.likes}
                                                    </Typography>
                                                </div>
                                                <div className={classes.track}>
                                                    <ThumbDownOutlinedIcon
                                                        className={classes.disLikeIcon}
                                                    />
                                                    <Typography className={classes.count}>
                                                        {item.dislikes}
                                                    </Typography>
                                                </div>
                                            </div>
                                            <Typography className={classes.notifyText}>
                                                Notify
                                            </Typography>
                                        </div>
                                    </div>
                                </BorderContainer>
                            ))}
                        </HorizontalScrollNew>
                    )}
                </div>
            )}
        </div>
    );
}

export default ValueSolutions;
