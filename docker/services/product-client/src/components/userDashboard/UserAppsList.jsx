import React, { useEffect, useRef, useState } from 'react';
import { Box, Breadcrumbs, makeStyles, Typography, Link, Grid } from '@material-ui/core';
import CodxCarousel from '../custom/CodxCarousel';
import HomeIcon from '@material-ui/icons/Home';
import clsx from 'clsx';
import { IndustrySpecs } from '../../assets/data/indusrySpecs';
import FunctionSpecs from '../../assets/data/functionSpecs.jsx';
import ApplicationList from '../card/ApplicationList';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const useStyles = makeStyles((theme) => ({
    defaultColor: {
        color: theme.palette.text.default
    },
    disabled: {
        opacity: 0.7,
        cursor: 'not-allowed'
    },
    industryCard: {
        minWidth: '250px',
        height: '70px',
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        border: '1px solid ' + theme.palette.primary.contrastText,
        background: theme.palette.primary.dark,
        cursor: 'pointer',
        borderRadius: '4px',
        '&:hover': {
            transform: 'scale(1.02)',
            background: theme.palette.background.hover,
            boxShadow: '4px 6px 12px 6px ' + theme.palette.shadow.dark
        }
    },
    functionCard: {
        minWidth: '250px',
        height: '250px',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        border: '1px solid ' + theme.palette.primary.contrastText,
        background: theme.palette.primary.dark,
        cursor: 'pointer',
        borderRadius: '4px',
        '&:hover': {
            transform: 'scale(1.02)',
            background: theme.palette.background.hover,
            boxShadow: '4px 6px 12px 6px ' + theme.palette.shadow.dark,
            '& $functionLogoWrapper': {
                background: 'var(--bgColor)'
            }
        }
    },
    functionLogoWrapper: {
        width: theme.spacing(11),
        height: theme.spacing(11),
        margin: '0 auto',
        border: '2px solid',
        borderColor: theme.palette.border.color,
        borderRadius: theme.spacing(5.5),
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        '& svg': {
            width: '50%',
            fill: theme.palette.text.titleText + ' !important'
        }
    },
    industryLogoWrapper: {
        '& svg': {
            width: '8rem',
            fill: theme.palette.text.titleText + ' !important'
        }
    },
    breadCrubmContainer: {
        padding: '1rem'
    },
    breadCrubmItem: {
        // cursor: "pointer"
    },
    sectionHeader: {
        color: theme.palette.text.default,
        margin: theme.spacing(2, 0),
        textTransform: 'capitalize'
    },
    fullWidth: {
        width: '100%'
    }
}));

export default function UserAppsList({
    data,
    user_permissions,
    dashboardsData,
    is_restricted_user
}) {
    const classes = useStyles();
    const [navState, setNavState] = useState([]);
    const carousalRef = useRef();

    useEffect(() => {
        if (carousalRef.current) {
            carousalRef.current.setCurrent(navState.length);
        }
    }, [navState.length]);

    const handleNavChange = (index) => {
        navState.splice(index);
        setNavState([...navState]);
    };

    if (!data?.apps?.length && !dashboardsData?.length) {
        return (
            <Typography variant="h3" className={classes.sectionHeader} align="center">
                No apps available.
            </Typography>
        );
    } else {
        return (
            <Box display="flex" flexDirection="column" flex={1}>
                <BreadCrumb navState={navState} classes={classes} onChange={handleNavChange} />
                <CodxCarousel index={navState.length} ref={carousalRef} transitionDuration={500}>
                    {[
                        <IndustryView
                            key="industry"
                            industries={data.industries}
                            dashboards={dashboardsData}
                            classes={classes}
                            apps={data.apps}
                            onSelect={(i) => setNavState([i])}
                            user_permissions={user_permissions}
                            is_restricted_user={is_restricted_user}
                        />,
                        <FunctionView
                            key="function"
                            functions={data.functions}
                            navState={navState}
                            classes={classes}
                            apps={data.apps}
                            user_permissions={user_permissions}
                            onSelect={(i) => setNavState((s) => [...s, i])}
                            is_restricted_user={is_restricted_user}
                        />,
                        <AppView
                            key="app"
                            apps={data.apps}
                            navState={navState}
                            classes={classes}
                            user_permissions={user_permissions}
                            is_restricted_user={is_restricted_user}
                        />
                    ]}
                </CodxCarousel>
            </Box>
        );
    }
}

function BreadCrumb({ navState, classes, onChange }) {
    const navLen = navState.length;
    if (!navLen) {
        return null;
    }
    return (
        <Breadcrumbs
            key={navState.length}
            aria-label="breadcrumb"
            separator={<ArrowForwardIosIcon size="large" />}
            className={classes.breadCrubmContainer}
        >
            <Link
                aria-label="home"
                color="inherit"
                onClick={onChange.bind(null, 0)}
                component="button"
            >
                <HomeIcon fontSize="large" />
            </Link>

            {navState[0] ? (
                navLen === 1 ? (
                    <Typography
                        className={clsx(classes.defaultColor, classes.disabled)}
                        variant="h5"
                    >
                        {navState[0].industry_name}
                    </Typography>
                ) : (
                    <Link color="inherit" onClick={onChange.bind(null, 1)} component="button">
                        <Typography className={classes.defaultColor} variant="h3">
                            {navState[0].industry_name}
                        </Typography>
                    </Link>
                )
            ) : null}

            {navState[1] ? (
                navLen === 2 ? (
                    <Typography
                        className={clsx(classes.defaultColor, classes.disabled)}
                        variant="h3"
                    >
                        {navState[1].function_name}
                    </Typography>
                ) : (
                    <Link
                        color="inherit"
                        onClick={onChange.bind(null, 2)}
                        component="button"
                        disabled={navState.length === 2}
                    >
                        <Typography className={classes.defaultColor} variant="h3">
                            {navState[1].function_name}
                        </Typography>
                    </Link>
                )
            ) : null}
        </Breadcrumbs>
    );
}

// function DashBoardsView({ dashboards, classes }) {
//     return (
//         <div className={classes.fullWidth}>
//             <Typography className={classes.sectionHeader} align="left" variant="h4">
//                 Dashboards
//             </Typography>
//             <Grid container spacing={2}>
//                 {dashboards.map((dashboard) => (
//                     <Grid key={dashboard.id} item sm={6} md={3}>
//                         <Link
//                             href={dashboard.url ? dashboard.url : `/dashboards/${dashboard.id}`}
//                             target="_blank"
//                             rel="noopener"
//                         >
//                             <div
//                                 aria-label="dashboard"
//                                 className={classes.industryCard}
//                                 title={dashboard.name}
//                             >
//                                 <div className={classes.industryLogoWrapper}>
//                                     {IndustrySpecs[dashboard.icon]}
//                                 </div>
//                                 <Typography
//                                     className={clsx(classes.defaultColor)}
//                                     noWrap
//                                     variant="h4"
//                                 >
//                                     {dashboard.name}
//                                 </Typography>
//                             </div>
//                         </Link>
//                     </Grid>
//                 ))}
//             </Grid>
//         </div>
//     );
// }

function IndustryView({
    industries,
    classes,
    apps,
    onSelect,
    user_permissions,
    is_restricted_user
}) {
    const [horizons] = useState(() => {
        const res = industries
            .filter((el) => el.horizon !== 'NA')
            .reduce((acc, b) => {
                const arr = acc[b.horizon] || [];
                arr.push(b);
                acc[b.horizon] = arr;
                return acc;
            }, {});
        return Object.values(res);
    });
    const [individualApps] = useState(() => {
        return apps.filter(
            (a) => !a.industry || !industries.some((i) => i.industry_name === a.industry)
        );
    });

    return (
        <Box display="flex" padding="2rem" flexDirection="column" gridGap="4rem">
            {horizons.map((industries, i) => (
                <div key={'fullWidth' + i} className={classes.fullWidth}>
                    <Typography className={classes.sectionHeader} align="left" variant="h4">
                        {industries[0].horizon}
                    </Typography>
                    <Grid container spacing={2}>
                        {industries.map((industry) => (
                            <Grid key={industry.id} item sm={6} md={3}>
                                <div
                                    aria-label="industry"
                                    className={classes.industryCard}
                                    onClick={() => onSelect(industry)}
                                    title={industry.industry_name}
                                >
                                    <div className={classes.industryLogoWrapper}>
                                        {IndustrySpecs[industry.logo_name]}
                                    </div>
                                    <Typography
                                        className={clsx(classes.defaultColor)}
                                        noWrap
                                        variant="h4"
                                    >
                                        {industry.industry_name}
                                    </Typography>
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            ))}
            {/* TODO when revamping design change the navigation and move dashboard outside industries  */}
            {/* { user_permissions.all_projects  && dashboards && dashboards.length > 0 && (
                <DashBoardsView dashboards={dashboards} classes={classes} onSelect={onSelect} />
            )} */}
            {individualApps?.length ? (
                <div className={classes.fullWidth}>
                    <Typography className={classes.defaultColor} variant="h4">
                        {horizons?.length ? 'Other Apps' : 'Apps'}
                    </Typography>
                    <Box display="flex" gridGap="2rem" flexWrap="wrap" padding="4rem 8rem">
                        <ApplicationList
                            user_permissions={user_permissions}
                            apps={individualApps}
                            view={
                                user_permissions?.app_publish
                                    ? localStorage.getItem('dashboard_view_type') || 'admin'
                                    : 'user'
                            }
                            searchValue={''}
                            is_restricted_user={is_restricted_user}
                        />
                    </Box>
                </div>
            ) : null}
        </Box>
    );
}
// Marketing
function FunctionView({
    functions,
    navState,
    classes,
    apps,
    onSelect,
    user_permissions,
    is_restricted_user
}) {
    const industryName = navState[0]?.industry_name;
    const [funcs, setFuncs] = useState([]);
    const [individualApps, setIndividualApps] = useState();
    useEffect(() => {
        if (industryName) {
            const funcs = functions.filter((fun) => fun.industry_name === industryName);
            setFuncs(funcs);
        }
    }, [industryName, functions]);

    useEffect(() => {
        if (industryName) {
            const individualApps = apps.filter(
                (a) =>
                    a.industry === industryName &&
                    (!a.function || !functions.some((f) => f.function_name === a.function))
            );
            setIndividualApps(individualApps);
        }
    }, [industryName, apps, functions]);

    if (!industryName) {
        return null;
    }

    return (
        <Box display="flex" padding="2rem" flexDirection="column" gridGap="4rem">
            <Grid container spacing={2}>
                {funcs.map((func) => (
                    <Grid key={func.id} item sm={6} md={3}>
                        <div
                            aria-label="function"
                            className={classes.functionCard}
                            onClick={() => onSelect(func)}
                            title={func.function_name}
                        >
                            <div
                                className={classes.functionLogoWrapper}
                                style={{
                                    borderColor: FunctionSpecs[func.logo_name]?.color,
                                    '--bgColor': FunctionSpecs[func.logo_name]?.color
                                }}
                            >
                                {FunctionSpecs[func.logo_name]?.icon}
                            </div>
                            <Typography className={clsx(classes.defaultColor)} noWrap variant="h4">
                                {func.function_name}
                            </Typography>
                        </div>
                    </Grid>
                ))}
            </Grid>
            {individualApps?.length ? (
                <div className={classes.fullWidth}>
                    <Typography className={classes.defaultColor} variant="h4">
                        {funcs?.length ? 'Other Apps' : 'Apps'}
                    </Typography>
                    <Box display="flex" gridGap="2rem" flexWrap="wrap" padding="4rem 8rem">
                        <ApplicationList
                            apps={individualApps}
                            user_permissions={user_permissions}
                            view={
                                user_permissions?.app_publish
                                    ? localStorage.getItem('dashboard_view_type') || 'admin'
                                    : 'user'
                            }
                            searchValue={''}
                            is_restricted_user={is_restricted_user}
                        />
                    </Box>
                </div>
            ) : null}
        </Box>
    );
}

function AppView({ apps, navState, user_permissions, is_restricted_user }) {
    const industryName = navState[0]?.industry_name;
    const functionName = navState[1]?.function_name;
    const [applications, setApplications] = useState([]);
    useEffect(() => {
        if (functionName) {
            const applications = apps.filter(
                (app) => app.industry === industryName && app.function === functionName
            );
            setApplications(applications);
        }
    }, [industryName, functionName, apps]);

    if (!functionName) {
        return null;
    }

    return (
        <Box display="flex" gridGap="2rem" flexWrap="wrap" padding="4rem 6rem">
            <ApplicationList
                apps={applications}
                user_permissions={user_permissions}
                view={
                    user_permissions?.app_publish
                        ? localStorage.getItem('dashboard_view_type') || 'admin'
                        : 'user'
                }
                searchValue={''}
                is_restricted_user={is_restricted_user}
            />
        </Box>
    );
}
