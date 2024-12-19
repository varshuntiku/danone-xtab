import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Box,
    CircularProgress,
    alpha,
    Grid,
    makeStyles,
    Typography,
    Paper,
    Tooltip
} from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import CodxCarousel from '../custom/CodxCarousel';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { getKpis } from 'services/app.js';
import { getParsedKPIValue } from '../AppWidgetLabel';
import LogoIcon from '../Nuclios/assets/LogoIcon.jsx';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import CodxCircularLoader from 'components/CodxCircularLoader.jsx';
import NucliosBox from '../NucliosBox';

import * as _ from 'underscore';
import { useSelector } from 'react-redux';
import { decodeHtmlEntities } from 'util/decodeHtmlEntities';
import { getApps } from 'services/dashboard';

const useStyle = makeStyles((theme) => ({
    gridItem: {
        height: theme.layoutSpacing(210),
        maxWidth: '100%',
        '&:last-child': {
            marginBottom: 0
        },
        '&:nth-last-child(2)': {
            marginBottom: 0
        }
    },
    gridItemFive: {
        height: theme.layoutSpacing(250),
        maxWidth: '100%',
        '&:last-child': {
            marginBottom: 0
        },
        '&:nth-last-child(2)': {
            marginBottom: 0
        }
    },
    groupCardRoot: {
        display: 'flex',
        height: '100%',
        width: '100%',
        boxShadow: 'none',
        borderRadius: 0,
        background: theme.ApplicationDashboard.background.bgColor,
        '&:hover': {
            border: 'none',
            background: theme.ApplicationDashboard.background.cardHover,
            boxShadow: '0px 4px 20px 0px rgba(0, 0, 0, 0.20)'
        }
    },
    groupCardRootAnimation: {
        background: `linear-gradient(130deg, ${theme.ApplicationDashboard.background.bgColor}, transparent)`,
        animation: '$backgroundAnimate 2500ms ease infinite',
        backgroundSize: '200% 200%',
        backgroundPosition: '0% 0%',
        '&:hover': {
            border: `none`,
            background: `linear-gradient(130deg, ${theme.ApplicationDashboard.background.bgColor}, transparent)`,
            boxShadow: 'none'
        }
    },
    '@keyframes backgroundAnimate': {
        '0%': {
            backgroundPosition: '0% 0%'
        },
        '50%': {
            backgroundPosition: '91% 100%'
        },
        '100%': {
            backgroundPosition: '0% 0%'
        }
    },
    cardRoot: {
        height: '100%'
    },
    kpi: {
        height: '100%',
        paddingLeft: theme.layoutSpacing(24),
        paddingRight: theme.layoutSpacing(24)
    },
    nav: {
        visibility: 'hidden',
        display: 'flex',
        '& button': {
            color: theme.palette.text.default,
            backgroundColor: theme.palette.primary.main
        }
    },
    starIcon: {
        fontSize: '3rem',
        color: grey[400]
    },
    header: {
        fontWeight: `${theme.title.h1.fontWeight} !Important`,
        alignItems: 'center',
        fontFamily: theme.title.h1.fontFamily,
        fontSize: theme.layoutSpacing(22),
        color: theme.palette.text.default,
        marginBottom: theme.layoutSpacing(18),
        display: '-webkit-box',
        '-webkit-line-clamp': '2',
        '-webkit-box-orient': 'vertical',
        overflow: 'hidden',
        paddingRight: theme.layoutSpacing(16)
    },
    headerTooltip: {
        fontFamily: theme.body.B1.fontFamily,
        fontSize: theme.layoutSpacing(15),
        textTransform: 'capitalize',
        padding: theme.layoutSpacing(12),
        backgroundColor: theme.palette.primary.tooltip,
        height: 'fit-content',
        textAlign: 'start',
        borderRadius: '0.5rem',
        color: theme.palette.text.default,
        boxShadow:
            localStorage.getItem('codx-products-theme') === 'light'
                ? '0px 0px 0px rgba(0,0,0,0.18),-5px 3px 9px rgba(0,0,0,0.18), 5px 3px 9px rgba(0,0,0,0.18)'
                : '0px 0px 0px rgba(0,20,45,0.20),-4px 5px 3px rgba(0,24,54,0.20), 4px 5px 3px rgba(0,24,54,0.20)',
        fontWeight: '300'
    },
    subtitle: {
        fontSize: '1.3rem',
        fontWeight: 300,
        color: theme.palette.primary.contrastText,
        marginBottom: '1.7rem'
    },
    desc: {
        fontSize: theme.layoutSpacing(15),
        fontFamily: theme.body.B5.fontFamily,
        fontWeight: 300,
        color: theme.palette.text.default,
        letterSpacing: '0.15px',
        paddingLeft: theme.layoutSpacing(36),
        paddingRight: theme.layoutSpacing(48),
        overflowY: 'hidden',
        scrollbarGutter: 'stable',
        '&:hover': {
            overflowY: 'scroll'
        }
    },
    carouselBtn: {
        paddingTop: theme.layoutSpacing(6),
        paddingBottom: theme.layoutSpacing(6),
        '& svg': {
            color: theme.palette.text.default,
            cursor: 'pointer',
            width: theme.layoutSpacing(26),
            height: theme.layoutSpacing(26)
        }
    },
    kpiValue: {
        color: theme.palette.background.successDark,
        fontFamily: theme.body.B5.fontFamily,
        fontSize: theme.layoutSpacing(14),
        fontWeight: '500',
        letterSpacing: '0.14px',
        marginTop: theme.layoutSpacing(10)
    },
    kpiValueMain: {
        fontFamily: theme.body.B5.fontFamily,
        fontSize: theme.layoutSpacing(32),
        color: theme.palette.text.default,
        fontWeight: theme.body.B4.fontWeight
    },
    KpiPlaceHolder: {
        fontSize: '10rem',
        color: theme.palette.primary.contrastText
    },
    loader: {
        color: theme.palette.primary.contrastText
    },
    loaderContainer: {
        position: 'absolute',
        top: '50%',
        right: 0,
        translate: '-50% -50%'
    },
    kpiNameStyle: {
        color: theme.palette.text.default,
        fontFamily: theme.body.B5.fontFamily,
        fontSize: theme.layoutSpacing(16),
        fontWeight: theme.body.B4.fontWeight,
        display: '-webkit-box',
        '-webkit-line-clamp': '2',
        '-webkit-box-orient': 'vertical',
        overflow: 'hidden'
    },
    tabsRoot: {
        background: alpha(theme.palette.primary.dark, 0.4),
        minHeight: 0,
        padding: '0.5rem 2rem 0'
    },
    tab: {
        minHeight: 0,
        minWidth: '5rem',
        borderRadius: '4px 4px 0 0',
        '&.Mui-selected': {
            color: `${theme.palette.primary.contrastText} !important`,
            background: alpha(theme.palette.primary.contrastText, 0.1),
            position: 'relative',
            '&:after': {
                content: '""',
                position: 'absolute',
                height: '4px',
                borderRadius: '4px',
                background: theme.palette.primary.contrastText,
                bottom: 0,
                left: 0,
                width: '100%'
            }
        }
    },
    tabIndicator: {
        display: 'none'
    },
    noApps: {
        color: theme.palette.primary.contrastText,
        fontFamily: theme.title.h1.fontFamily,
        fontSize: '2rem',
        marginLeft: theme.layoutSpacing(20)
    },
    logoIcon: {
        marginRight: theme.layoutSpacing(20),
        '& svg': {
            '& path': {
                fill: `${theme.palette.text.revamp} !important`
            }
        }
    },
    appDetails: {
        paddingTop: theme.layoutSpacing(32),
        paddingLeft: theme.layoutSpacing(28),
        paddingBottom: theme.layoutSpacing(28),
        position: 'relative',
        '&:after': {
            content: '""',
            position: 'absolute',
            height: '80%',
            width: '1px',
            backgroundColor: theme.palette.border.industryLight,
            top: 15,
            right: 0
        }
    },
    appDetailsTwo: {
        height: '100%',
        paddingTop: theme.layoutSpacing(32),
        paddingLeft: theme.layoutSpacing(60),
        paddingBottom: theme.layoutSpacing(32),
        position: 'relative',
        '&:after': {
            content: '""',
            position: 'absolute',
            height: '80%',
            width: '1px',
            backgroundColor: theme.palette.border.industryLight,
            top: 20,
            right: 0
        },
        '& > div': {
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        }
    },
    withNoKpi: {
        '&:after': {
            width: 0
        }
    },
    applicationContainer: {
        height: '70vh',
        overflowY: 'scroll',
        '@media (max-height: 600px)': {
            height: '68vh'
        },
        '@media (max-height: 560px)': {
            height: '65vh'
        }
    },
    applicationCardContianer: {
        paddingTop: theme.layoutSpacing(40),
        padding: `${theme.layoutSpacing(0)} ${theme.layoutSpacing(32)}`,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: theme.layoutSpacing(30)
    },
    container: {
        paddingBottom: `${theme.layoutSpacing(10)}`
    },
    menuItem: {
        width: '100%',
        minHeight: theme.layoutSpacing(80),
        marginBottom: theme.layoutSpacing(24),
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'left',
        paddingLeft: theme.layoutSpacing(24),
        fontSize: theme.layoutSpacing(21),
        fontFamily: theme.title.h1.fontFamily,
        borderRadius: '2px',
        color: theme.palette.text.revamp,
        paddingTop: theme.layoutSpacing(16),
        paddingBottom: theme.layoutSpacing(16),
        fontWeight: theme.body.B4.fontWeight
    },
    menuItemTwo: {
        width: '100%',
        minHeight: theme.layoutSpacing(150),
        marginBottom: theme.layoutSpacing(40),
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'left',
        paddingLeft: theme.layoutSpacing(24),
        fontSize: theme.layoutSpacing(24),
        fontFamily: theme.title.h1.fontFamily,
        borderRadius: '2px',
        color: theme.palette.text.revamp,
        paddingTop: theme.layoutSpacing(16),
        paddingBottom: theme.layoutSpacing(16),
        fontWeight: theme.body.B4.fontWeight,
        paddingRight: theme.layoutSpacing(24),
        '@media (min-height:1100px)': {
            paddingLeft: '1rem',
            paddingRight: '1rem'
        }
    },
    selectedItem: {
        color: theme.palette.background.white,
        background: theme.ApplicationDashboard.background.selectedItemBg,
        fontWeight: theme.title.h1.fontWeight
    },
    menuContianer: {
        paddingTop: theme.layoutSpacing(30),
        paddingRight: theme.layoutSpacing(30),
        paddingLeft: theme.layoutSpacing(30),
        height: '70vh',
        overflow: 'hidden',
        scrollbarGutter: 'stable',
        '&:hover': {
            overflowY: 'scroll'
        },
        '@media (max-height: 600px)': {
            height: '68vh'
        },
        '@media (max-height: 560px)': {
            height: '65vh'
        }
    },
    text: {
        fontSize: theme.layoutSpacing(32),
        fontFamily: theme.title.h1.fontFamily,
        paddingLeft: theme.layoutSpacing(16)
    },
    loaderContianer: {
        height: theme.layoutSpacing(780)
    },
    kpiBoxWrapper: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    kpiValuesWrapper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: theme.layoutSpacing(12)
    }
}));

export default function ApplicationList(props) {
    const { user_permissions, view, searchValue } = props;
    const [functions, setFunctions] = useState([]);
    const [apps, setApps] = useState([]);
    const [selectedFunctionApps, setSelectedFunctionApps] = useState([]);
    const [selectedFunction, setSelectedFunction] = useState(0);
    const [loading, setLoading] = useState(true);
    const menuContainerRef = useRef(null);
    const selectedFunctionRef = useRef(null);
    const functionData = useSelector((st) => st.functionData.list);
    const industryData = useSelector((st) => st.industryData.list);

    useEffect(() => {
        if (industryData) getFunctions();
    }, [industryData, functionData]);

    useEffect(() => {
        if (selectedFunctionRef.current && menuContainerRef.current) {
            const { bottom: selectedBottom } = selectedFunctionRef.current.getBoundingClientRect();
            const { bottom: containerBottom } = menuContainerRef.current.getBoundingClientRect();
            if (selectedBottom > containerBottom) {
                menuContainerRef.current.scrollTop =
                    selectedFunctionRef.current.offsetTop - menuContainerRef.current.offsetTop;
            }
        }
    }, [selectedFunctionRef.current, menuContainerRef.current]);

    useEffect(() => {
        if (props?.is_restricted_user) return;
        const getAppDetails = async () => {
            await getApps({
                industry: decodeURIComponent(props.match?.params.industry),
                callback: (response_data) => {
                    const appDetails = decodeHtmlEntities(response_data);
                    setApps(appDetails);
                    setSelectedFunctionApps(
                        appDetails?.filter((app) => {
                            return app.function === selectedFunction.function_name;
                        })
                    );
                }
            });
            setLoading(false);
        };
        getAppDetails();
    }, []);

    useEffect(() => {
        setSelectedFunctionApps(
            apps.filter((app) => {
                return app.function === selectedFunction.function_name;
            })
        );
    }, [selectedFunction, apps]);

    let adminView;

    if (view) {
        adminView = user_permissions?.app_publish && view === 'admin';
    } else {
        adminView = user_permissions?.app_publish && user_permissions?.admin;
    }

    const groupedApps = (props?.apps?.length ? props.apps : selectedFunctionApps).reduce(
        (acc, b) => {
            if (!adminView && b.environment !== 'prod') {
                return acc;
            }
            const comparator = (a, b) => {
                const envs = ['prod', 'preview'];
                return envs.indexOf[a.environment] - envs.indexOf[b.environment];
            };
            const groupFound = acc.find((el) => {
                return el.apps.some((el2) => el2.container_id === b.container_id);
            });
            if (groupFound) {
                groupFound.apps.push(b);
                groupFound.apps.sort(comparator);
            } else {
                acc.push({
                    apps: [b]
                });
            }
            return acc;
        },
        []
    );

    const appsCount = groupedApps.length;
    const FilteredApps = groupedApps.filter((el) =>
        el?.apps[0]?.name?.toLowerCase().includes(searchValue.toLowerCase())
    );
    const classes = useStyle();

    const getSelectedIndustryDetails = () => {
        let selectedIndustryData = {};
        if (props.match?.params?.industry) {
            const currentIndustry = industryData.filter((industry) => {
                if (industry.industry_name === props.match.params.industry) return industry;
            });
            selectedIndustryData = { ...currentIndustry[0] };
        }
        return selectedIndustryData?.id;
    };

    const getFunctions = async () => {
        const filteredFunctions = functionData.filter((el) => {
            if (
                decodeHtmlEntities(el.function_name) === props.match.params.function &&
                el.industry_id === getSelectedIndustryDetails()
            ) {
                setSelectedFunction(decodeHtmlEntities(el));
            }
            return el.industry_id === getSelectedIndustryDetails();
        });
        setFunctions(decodeHtmlEntities(filteredFunctions));
    };

    return (
        <React.Fragment>
            <Grid container xs={12} className={classes.container}>
                {!props?.is_restricted_user ? (
                    <Grid contianer item xs={2}>
                        <NucliosBox>
                            <Grid
                                item
                                xs={12}
                                className={classes.menuContianer}
                                alignItems="baseline"
                                ref={menuContainerRef}
                            >
                                {functions?.map((el, i) => (
                                    <div
                                        item
                                        ref={
                                            el.function_name === props.match?.params?.function
                                                ? selectedFunctionRef
                                                : null
                                        }
                                        className={clsx(
                                            functions.length > 4
                                                ? classes.menuItem
                                                : classes.menuItemTwo,
                                            selectedFunction.function_name === el.function_name
                                                ? `${classes.selectedItem} selectedFunction`
                                                : ''
                                        )}
                                        key={`${el.function_name}-${i}`}
                                        onClick={() => {
                                            setSelectedFunction(el);
                                            window.history.replaceState(
                                                null,
                                                'test',
                                                '/dashboard/' +
                                                    props.match.params.industry +
                                                    '/' +
                                                    el.function_name
                                            );
                                        }}
                                    >
                                        {el.function_name}
                                    </div>
                                ))}
                            </Grid>
                        </NucliosBox>
                    </Grid>
                ) : null}
                <Grid contianer item xs={!props?.is_restricted_user ? 10 : 12}>
                    <NucliosBox hideBorder={!props?.is_restricted_user ? ['left'] : []}>
                        <div className={classes.applicationContainer}>
                            <Grid
                                container
                                item
                                xs={12}
                                className={classes.applicationCardContianer}
                                alignItems="baseline"
                                // spacing={2}
                            >
                                {FilteredApps.length ? (
                                    FilteredApps.map((el) => (
                                        <Grid
                                            item
                                            key={el.apps[0].id}
                                            xs={6}
                                            className={clsx(
                                                FilteredApps.length >= 5
                                                    ? classes.gridItem
                                                    : classes.gridItemFive
                                            )}
                                        >
                                            <GroupedApplicationCard
                                                classes={classes}
                                                appsCount={appsCount}
                                                appGroup={el}
                                                adminView={adminView}
                                            />
                                        </Grid>
                                    ))
                                ) : !loading ? (
                                    <Typography className={classes.text}>No Apps Found</Typography>
                                ) : (
                                    [1, 2, 3, 4].map((el) => (
                                        <Grid
                                            item
                                            key={'appLoaderCard' + el}
                                            xs={6}
                                            className={classes.gridItem}
                                        >
                                            <GroupedApplicationCard
                                                classes={classes}
                                                appsCount={appsCount}
                                                appGroup={el}
                                                adminView={adminView}
                                                loader={true}
                                            />
                                        </Grid>
                                    ))
                                )}
                            </Grid>
                        </div>
                    </NucliosBox>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

function GroupedApplicationCard({ appGroup, classes, appsCount, adminView, loader = false }) {
    const [selectedTab, setSelectedTab] = useState(0);
    const [slide, setSlide] = useState(false);

    useEffect(() => {
        setSelectedTab(0);
    }, [adminView]);

    return (
        <Paper
            className={`${classes.groupCardRoot} ${loader && classes.groupCardRootAnimation}`}
            onMouseEnter={setSlide.bind(null, true)}
            onMouseLeave={setSlide.bind(null, false)}
        >
            {!loader &&
                appGroup.apps.map((app, i) =>
                    selectedTab === i ? (
                        <div key={i} value={selectedTab} style={{ flex: 1, display: 'flex' }}>
                            <ApplicationCard
                                slide={slide}
                                classes={classes}
                                appsCount={appsCount}
                                app={app}
                                adminView={adminView}
                            />
                        </div>
                    ) : null
                )}
        </Paper>
    );
}

function ApplicationCard({ app, appsCount, classes, slide }) {
    const carouselRef = useRef();
    const [kpis, setKpis] = useState(null);
    const [loadingKpis, setLoadingKpis] = useState(false);
    const moveLeft = useCallback(() => {
        carouselRef.current.moveLeft();
    }, []);
    const moveRight = useCallback(() => {
        carouselRef.current.moveRight();
    }, []);

    const observer = useRef();
    const handleRef = useCallback(
        (node) => {
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    observer.current.disconnect();
                    setLoadingKpis(true);
                    getKpis({
                        app_id: app.id,
                        callback: (data) => {
                            if (data.status === 'error') {
                                setKpis([]);
                            } else {
                                setKpis(data);
                            }
                            setLoadingKpis(false);
                        }
                    });
                }
            });

            if (node) observer.current.observe(node);
        },
        [app.id]
    );

    const RenderedKpis = () => {
        if (kpis) {
            if (kpis.length) {
                return (
                    <Box
                        height="100%"
                        width="100%"
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyItems="space-around"
                    >
                        <div
                            onClick={moveLeft}
                            className={classes.carouselBtn}
                            aria-label="Move Up"
                        >
                            <KeyboardArrowUpIcon />
                        </div>
                        <CodxCarousel
                            slide={slide}
                            ref={carouselRef}
                            interval={2000}
                            transitionDuration={1000}
                            carouselDir="top"
                            pauseOnMouseEnter
                        >
                            {_.unique(kpis).map((el, i) => (
                                <KpiBox key={i} kpi={el} classes={classes} />
                            ))}
                        </CodxCarousel>
                        <div
                            onClick={moveRight}
                            className={classes.carouselBtn}
                            aria-label="Move Down"
                        >
                            <KeyboardArrowDownIcon />
                        </div>
                    </Box>
                );
            } else {
                // return <TimelineIcon className={classes.KpiPlaceHolder} style={{backgroundColor:'orange'}} />;
            }
        } else {
            return (
                <CircularProgress
                    title="loading kpis..."
                    className={classes.loader}
                    size={40}
                    color="primary"
                />
            );
        }
    };

    return (
        <Grid style={{ position: 'relative' }} container className={clsx()} ref={handleRef} xs={12}>
            <Grid
                item
                xs={kpis?.length ? 8 : 12}
                className={clsx(
                    appsCount > 5 ? classes.appDetails : classes.appDetailsTwo,
                    !kpis?.length ? classes.withNoKpi : ''
                )}
                style={{ maxWidth: loadingKpis ? '66.66%' : '100%' }}
            >
                <Box flex="1">
                    <Link to={'/app/' + app.id} style={{ textDecoration: 'none' }}>
                        <Tooltip
                            title={app?.name}
                            placement="top"
                            classes={{ tooltip: classes.headerTooltip }}
                            disableHoverListener={app?.name?.length <= 65}
                        >
                            <Typography variant="h4" className={classes.header}>
                                <span className={classes.logoIcon}>
                                    <LogoIcon />
                                </span>
                                {app?.name}
                            </Typography>
                        </Tooltip>
                    </Link>
                    <Typography variant="subtitle1" className={classes.desc}>
                        {app.description}
                    </Typography>
                </Box>
            </Grid>
            {loadingKpis && (
                <div className={classes.loaderContainer}>
                    <CodxCircularLoader size={60} />
                </div>
            )}
            {kpis?.length ? (
                <Grid
                    className={classes.kpi}
                    minWidth={0}
                    display="flex"
                    alignItems="center"
                    flexDirection="column"
                    justifyContent="center"
                    position="relative"
                    xs={4}
                    item
                >
                    <RenderedKpis />
                </Grid>
            ) : null}
        </Grid>
    );
}

function KpiBox({ kpi, classes }) {
    const kpiName = kpi?.name || kpi?.data?.extra_title;
    return (
        <Box
            height="100%"
            width="100%"
            display="flex"
            flexDirection="column"
            overflow="hidden"
            className={classes.kpiBoxWrapper}
        >
            <Tooltip
                title={kpiName}
                placement="top"
                classes={{ tooltip: classes.headerTooltip }}
                disableHoverListener={kpiName?.length <= 45}
            >
                <Typography variant="h5" align="center" className={classes.kpiNameStyle}>
                    {kpiName}
                </Typography>
            </Tooltip>
            <div className={classes.kpiValuesWrapper}>
                <Typography variant="h2" align="right" className={classes.kpiValueMain}>
                    {getParsedKPIValue(
                        kpi?.config,
                        kpi?.data instanceof Object ? kpi?.data?.value : kpi.data
                    )}
                </Typography>
                {kpi?.data?.extra_value && (
                    <Typography variant="h5" align="center" className={classes.kpiValue}>
                        {kpi?.data?.extra_label} {kpi?.data?.extra_value}
                    </Typography>
                )}
            </div>
        </Box>
    );
}
