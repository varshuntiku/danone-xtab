import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Button, Avatar, Box } from '@material-ui/core';
import { ReactComponent as ReviewImage } from 'assets/img/Review.svg';
import { ReactComponent as AnalyzeImage } from 'assets/img/Analyse.svg';
import { ReactComponent as SimulateImage } from 'assets/img/Simulate.svg';
import { ReactComponent as DefaultImage } from 'assets/img/Default.svg';
import { ReactComponent as WikiImage } from 'assets/img/wiki.svg';
import AppScreenSocket from './AppScreenSocket';
import StepperProgressBar from 'components/StepperProgressBar';
import union from 'assets/img/Union.png';
import NucliosBox from './NucliosBox';
import clsx from 'clsx';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    gridItemRoot: {
        position: 'relative'
    },
    cardRoot: {
        background: theme.palette.background.pureWhite,
        padding: `${theme.layoutSpacing(0)} ${theme.layoutSpacing(13.1)}`,
        backfaceVisibility: 'hidden',
        transformOrigin: 'center top',
        height: theme.layoutSpacing(344),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        justifyContent: 'space-around'
    },
    cardRootWIthNoDesc: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        '& $avatar': {
            marginBottom: '5rem'
        }
    },
    avtarForEmptyCard: {
        visibility: 'hidden'
    },
    '@keyframes detailContainer': {
        '99.99%': {
            overflowY: 'hidden'
        },
        '100%': {
            transform: 'scaleY(1)',
            maxHeight: '250px',
            overflowY: 'auto'
        }
    },
    avatar: {
        width: theme.layoutSpacing(60),
        height: theme.layoutSpacing(60),
        background: theme.FunctionDashboard.background.logoWrapperColor,
        backfaceVisibility: 'hidden',
        '& svg': {
            fill: `${theme.palette.icons.iconHoverColor}!important`,
            width: theme.layoutSpacing(36),
            height: theme.layoutSpacing(36)
        }
    },
    screenImage: {
        fill: theme.palette.primary.contrastText,
        width: '50%'
    },
    colorContrast: {
        color: theme.palette.text.revamp,
        '&svg': {
            color: theme.palette.primary.contrastText
        }
    },
    menu: {
        '& span': {
            display: 'inline-block',
            // textAlign: 'center'
            fontSize: theme.layoutSpacing(21),
            fontFamily: theme.title.h1.fontFamily,
            fontWight: 400
        }
    },
    subMenu: {
        padding: theme.spacing(1, 0),
        textDecoration: 'underline'
    },
    detailContainer: {
        transition: 'all 0.5s ease',
        maxHeight: 0,
        opacity: 0,
        transform: 'scaleY(0)',
        backfaceVisibility: 'hidden',
        overflowY: 'hidden'
    },
    button: {
        background: theme.palette.primary.dark,
        backfaceVisibility: 'hidden'
    },
    divider: {
        opacity: 0,
        transition: 'all 0.25s ease'
    },
    description: {
        color: theme.palette.text.default,
        fontFamily: theme.body.B5.fontFamily,
        opacity: 1,
        fontSize: theme.layoutSpacing(14),
        maxHeight: 0,
        height: 0
    },
    appDashboardContianer: {
        padding: `${theme.layoutSpacing(0)} ${theme.layoutSpacing(21)}`,
        paddingRight: theme.layoutSpacing(24.5),
        // paddingBottom:theme.layoutSpacing(35)
        height: '99%'
    },
    appDashboardContianerWithDrawerCollapse: {
        paddingRight: theme.layoutSpacing(27.8)
    },
    userContainer: {
        display: 'flex',
        backgroundColor: theme.palette.background.appHomeBanner,
        justifyContent: 'space-between',
        padding: `${theme.layoutSpacing(0)} ${theme.layoutSpacing(21)}`,
        marginTop: theme.layoutSpacing(6.1),
        maxHeight: theme.layoutSpacing(90)
    },
    userMessage: {
        width: '100%',
        fontSize: theme.layoutSpacing(14),
        fontFamily: theme.body.B5.fontFamily,
        color: theme.palette.text.revamp,
        fontWight: 400,
        letterSpacing: '0.5px',
        padding: `${theme.layoutSpacing(18)} ${theme.layoutSpacing(0)}`,
        display: 'flex',
        flexDirection: 'column'
    },
    user: {
        fontSize: theme.layoutSpacing(18),
        fontFamily: theme.title.h1.fontFamily,
        color: theme.palette.text.revamp,
        fontWight: 400,
        letterSpacing: '0.5px'
    },
    imgContainer: {
        display: 'flex',
        justifyContent: 'end'
    },
    img: {
        height: '100%',
        paddingTop: theme.layoutSpacing(10)
    },
    appDashboard: {
        // height: `calc(100% - ${theme.layoutSpacing(110.5)})`,
        paddingTop: theme.layoutSpacing(24.1),
        paddingBottom: theme.layoutSpacing(28.2),
        '@media (max-width: 1400px)': {
            paddingBottom: theme.layoutSpacing(28.2)
        }
    },
    appDashboardTwo: {
        height: `calc(100% - ${theme.layoutSpacing(110.5)})`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    wrapperClasses: {
        '&:hover': {
            backgroundColor: theme.IndustryDashboard.background.cardHover,
            cursor: 'pointer',
            '& $cardRoot': {
                backgroundColor: theme.IndustryDashboard.background.cardHover
            },
            border: '1px solid' + theme.IndustryDashboard.border.light,
            position: 'relative',
            left: `-${theme.layoutSpacing(1.4)}`,
            top: `-${theme.layoutSpacing(1)}`,
            '& div': {
                border: 'none'
            }
        },
        '& a': {
            textDecoration: 'none'
        }
    }
}));

export default function AppDashboard({ app_info, routes, drawerCon, history }) {
    const classes = useStyles();
    const { progressBarDetails, activeScreenId, activeScreenWidgets } = useSelector(
        (state) => state.appScreen
    );
    const [screens] = React.useState(() => {
        const screens = routes.reduce(
            (acc, routeItem, routeIndex) => {
                if (routeItem.href && !routeItem?.screen_item?.hidden) {
                    if (!routeItem.level) {
                        acc.menus.push({ route: routeItem, subMenus: [], tabs: [] });
                    } else if (routeItem.level === 1 && acc.menus.length) {
                        if (
                            (routeIndex < routes.length - 1 &&
                                routes[routeIndex + 1]['level'] !== 2) ||
                            routeIndex === routes.length - 1
                        ) {
                            acc.menus[acc.menus.length - 1].tabs.push({ route: routeItem });
                        } else {
                            acc.menus[acc.menus.length - 1].subMenus.push({
                                route: routeItem,
                                tabs: []
                            });
                        }
                    } else if (routeItem.level === 2 && acc.menus.length) {
                        const subMenuLen = acc.menus[acc.menus.length - 1].subMenus.length;
                        if (subMenuLen > 0) {
                            acc.menus[acc.menus.length - 1].subMenus[subMenuLen - 1].tabs.push({
                                route: routeItem
                            });
                        } else {
                            acc.menus[acc.menus.length - 1].tabs.push({ route: routeItem });
                        }
                    }
                }
                return acc;
            },
            { menus: [] }
        );
        if (app_info.approach_url) {
            screens.menus.push({
                route: {
                    href:
                        'https://view.officeapps.live.com/op/view.aspx?src=' +
                        encodeURIComponent(app_info.approach_url),
                    external: true,
                    target: '_blank',
                    screen_item: {
                        screen_description:
                            'Understand assumptions and process decisions supporting the outputs in the tool.',
                        screen_name: 'Wiki',
                        screen_image: 'wiki'
                    }
                },
                subMenus: [],
                tabs: [
                    {
                        route: {
                            href:
                                'https://view.officeapps.live.com/op/view.aspx?src=' +
                                encodeURIComponent(app_info.approach_url),
                            external: true,
                            target: '_blank',
                            screen_item: {
                                screen_name: 'BEGIN'
                            }
                        }
                    }
                ]
            });
        }
        return screens;
    });
    const isUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    };
    const getScreenImage = (screen_image, screen_id) => {
        if (isUrl(screen_image)) {
            return <img src={screen_image} className={classes.screenImage} alt="screen-image" />;
        } else {
            if (screen_image) {
                if (screen_image === 'Review') {
                    return (
                        <ReviewImage
                            className={classes.screenImage}
                            alt={'Review Image ' + screen_id}
                        />
                    );
                } else if (screen_image === 'Analyze') {
                    return (
                        <AnalyzeImage
                            className={classes.screenImage}
                            alt={'Analyze Image ' + screen_id}
                        />
                    );
                } else if (screen_image === 'Simulate') {
                    return (
                        <SimulateImage
                            className={classes.screenImage}
                            alt={'Simulate Image ' + screen_id}
                        />
                    );
                } else if (screen_image === 'Wiki') {
                    return (
                        <WikiImage
                            className={classes.screenImage}
                            alt={'Wiki Image ' + screen_id}
                        />
                    );
                } else {
                    return (
                        <DefaultImage
                            className={classes.screenImage}
                            alt={'Default Image ' + screen_id}
                        />
                    );
                }
            } else {
                return (
                    <DefaultImage
                        className={classes.screenImage}
                        alt={'Default Image ' + screen_id}
                    />
                );
            }
        }
    };
    const hideBorders = (index) => {
        let borders_to_hide = [];
        if (index > 4) borders_to_hide.push('top');
        if (index % 4 !== 1) borders_to_hide.push('left');
        return borders_to_hide;
    };
    const generateConsistenAppCard = (arr) => {
        let numberOfEmptyBox = arr.length % 4 != 0 ? 4 - (arr.length % 4) : 0;
        return arr.length < 4 ? [...arr] : [...arr, ...Array(numberOfEmptyBox).fill({})];
    };
    const userName = sessionStorage.getItem('user_name');

    if (
        progressBarDetails &&
        progressBarDetails[activeScreenId] &&
        progressBarDetails[activeScreenId].type !== 'modify' &&
        !progressBarDetails[activeScreenId]?.completed
    ) {
        return (
            <div className={classes.progressBarWrapper}>
                <StepperProgressBar
                    app_id={app_info.id}
                    screen_id={activeScreenId}
                    history={history}
                />
            </div>
        );
    }

    return (
        <div
            className={`${classes.appDashboardContianer} ${
                drawerCon ? classes.appDashboardContianerWithDrawerCollapse : ''
            }`}
        >
            <div className={classes.userContainer}>
                <div className={classes.userMessage}>
                    <span className={classes.user}>Welcome {userName},</span>
                    <br />
                    Explore more by clicking on any menu item
                </div>
                <div className={classes.imgContainer}>
                    <img src={union} className={classes.img} />
                </div>
            </div>
            <Grid
                container
                className={
                    screens.menus.length > 4 ? classes.appDashboard : classes.appDashboardTwo
                }
            >
                {generateConsistenAppCard(screens.menus)?.map((menu, i) => (
                    <Grid key={i} item xs={3} className={classes.gridItemRoot}>
                        <NucliosBox
                            wrapperClasses={classes.wrapperClasses}
                            hideBorder={hideBorders(i + 1)}
                        >
                            <CustomLink
                                to={menu?.route?.href || '#'}
                                href={menu?.route?.href || '#'}
                                external={menu?.route?.external}
                                target={menu?.route?.target}
                                title={menu?.route?.screen_item?.screen_name}
                            >
                                <div
                                    className={`${classes.cardRoot} ${
                                        !menu?.route?.screen_item?.screen_description
                                            ? classes.cardRootWIthNoDesc
                                            : ''
                                    }`}
                                >
                                    <Avatar
                                        className={`${classes.avatar} ${
                                            !menu?.route?.screen_item?.screen_name
                                                ? classes.avtarForEmptyCard
                                                : ''
                                        }`}
                                    >
                                        {getScreenImage(
                                            menu?.route?.screen_item?.screen_image,
                                            menu?.route?.screen_item?.id,
                                            menu?.route?.screen_item?.screen_name
                                        )}
                                    </Avatar>
                                    <Typography
                                        variant="h4"
                                        className={clsx(classes.colorContrast, classes.menu)}
                                    >
                                        <span>{menu?.route?.screen_item?.screen_name}</span>
                                    </Typography>
                                    <Typography variant="body1" className={classes.description}>
                                        {menu?.route?.screen_item?.screen_description}
                                    </Typography>
                                    <hr className={classes.divider} />
                                    <div className={classes.detailContainer}>
                                        <Box
                                            display="flex"
                                            flexWrap="wrap"
                                            gridGap="1rem"
                                            width="100%"
                                            padding="1rem 0"
                                        >
                                            {menu?.tabs?.map((tab, i) => (
                                                <Button
                                                    key={i}
                                                    component={(p) => (
                                                        <CustomLink
                                                            {...p}
                                                            href={tab?.route?.href || '#'}
                                                            to={tab?.route?.href || '#'}
                                                            target={tab?.route?.target}
                                                            external={tab?.route?.external}
                                                        />
                                                    )}
                                                    variant="outlined"
                                                    className={classes.button}
                                                    size="small"
                                                    title={
                                                        tab?.route?.screen_item
                                                            ?.screen_description ||
                                                        tab?.route?.screen_item?.screen_name
                                                    }
                                                    aria-label={
                                                        tab?.route?.screen_item?.screen_name ||
                                                        'Screen name'
                                                    }
                                                >
                                                    {tab?.route?.screen_item?.screen_name}
                                                </Button>
                                            ))}
                                        </Box>

                                        {menu?.subMenus?.map((subMenu, i) => (
                                            <div key={i} style={{ paddingBottom: '1rem' }}>
                                                <CustomLink
                                                    external={menu?.route?.external}
                                                    to={subMenu?.route?.href || '#'}
                                                    href={subMenu?.route?.href || '#'}
                                                    title={
                                                        subMenu?.route?.screen_item
                                                            ?.screen_description ||
                                                        subMenu?.route?.screen_item?.screen_name
                                                    }
                                                >
                                                    <Typography
                                                        variant="h5"
                                                        className={clsx(
                                                            classes.colorContrast,
                                                            classes.subMenu
                                                        )}
                                                    >
                                                        <span>
                                                            {
                                                                subMenu?.route?.screen_item
                                                                    ?.screen_name
                                                            }
                                                        </span>
                                                        <ChevronRightIcon
                                                            color="inherit"
                                                            style={{ verticalAlign: 'middle' }}
                                                            fontSize="large"
                                                        />
                                                    </Typography>
                                                </CustomLink>
                                                <Box
                                                    display="flex"
                                                    flexWrap="wrap"
                                                    gridGap="1rem"
                                                    width="100%"
                                                >
                                                    {subMenu.tabs.map((tab, i) => (
                                                        <Button
                                                            key={i}
                                                            component={(p) => (
                                                                <CustomLink
                                                                    {...p}
                                                                    href={tab?.route?.href || '#'}
                                                                    to={tab?.route?.href || '#'}
                                                                    target={tab?.route?.target}
                                                                    external={tab?.route?.external}
                                                                />
                                                            )}
                                                            variant="outlined"
                                                            className={classes.button}
                                                            size="small"
                                                            title={
                                                                tab?.route?.screen_item
                                                                    ?.screen_description ||
                                                                tab?.route?.screen_item?.screen_name
                                                            }
                                                            aria-label={
                                                                tab?.route?.screen_item
                                                                    ?.screen_name || 'Screen name'
                                                            }
                                                        >
                                                            {tab?.route?.screen_item?.screen_name}
                                                        </Button>
                                                    ))}
                                                </Box>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CustomLink>
                        </NucliosBox>
                    </Grid>
                ))}
            </Grid>
            <AppScreenSocket
                app_id={app_info.id}
                activeScreenWidgets={activeScreenWidgets}
                history={history}
            />
            {progressBarDetails &&
            progressBarDetails[activeScreenId] &&
            progressBarDetails[activeScreenId]?.type === 'modify' &&
            !progressBarDetails[activeScreenId]?.completed ? (
                <div className={classes.modifyProgressBarWrapper}>
                    <StepperProgressBar
                        app_id={app_info.id}
                        screen_id={activeScreenId}
                        history={history}
                    />
                </div>
            ) : null}
        </div>
    );
}

function CustomLink({ external, children, ...props }) {
    if (external) {
        return <a {...props}>{children}</a>;
    } else {
        return <Link {...props}>{children}</Link>;
    }
}
