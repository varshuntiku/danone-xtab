import { Button, Typography, alpha, makeStyles, IconButton, useTheme } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import TuneIcon from '@material-ui/icons/Tune';
import AppWidgetPlot from '../../components/AppWidgetPlot';
import { green, grey, red } from '@material-ui/core/colors';
import WidgetData from '../../assets/data/themePreviewWidgetData.json';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { AccountCircle } from '@material-ui/icons';
import { ReactComponent as MarkerUpIcon } from 'assets/img/marker-up.svg';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import Nuclios from '../Nuclios/assets/Nuclios';
import AdminIcon from '../Nuclios/assets/AdminIcon';
import HelpIcon from '../Nuclios/assets/HelpIcon';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '20rem auto',
        gridTemplateRows: `5rem auto`,
        flexDirection: 'column',
        zoom: '0.7',
        background: theme.palette.primary.dark,
        position: 'relative',
        overflow: 'hidden',
        '&::after': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            zIndex: 9999
        },
        '& $fullScreenIcon': {
            visibility: 'hidden'
        },
        '&:hover': {
            '& $fullScreenIcon': {
                visibility: 'visible',
                animation: `$dropIn 0.5s ease-out forwards`
            }
        }
    },
    fullScreenIcon: {
        position: 'absolute',
        top: '3rem',
        left: '50%',
        transform: 'translate(-50%, 0)',
        zIndex: 99999,
        background: grey[500],
        boxShadow: '0 4px 10px 6px rgb(0, 0, 0, 0.2)',
        '& svg': {
            fontSize: '4rem',
            color: 'white'
        },
        '&:hover': {
            background: grey[600]
        }
    },
    '@keyframes dropIn': {
        '0%': {
            top: '-1rem',
            opacity: 0
        },
        '75%': {
            top: '3.4rem',
            opacity: 0.8
        },
        '100%': {
            top: '3rem',
            opacity: 1
        }
    },
    fullScreen: {
        zoom: '1'
    },
    header: {
        background: theme.palette.primary.dark,
        gridColumn: '1/3',
        gridRow: '1/2',
        borderBottom: `1px solid ${theme.palette.separator.grey}`,
        display: 'flex',
        alignItems: 'center',
        paddingRight: '2rem'
    },
    sideNavBar: {
        gridColumn: '1/2',
        gridRow: '2/3',
        background: theme.palette.primary.dark,
        padding: '1rem 0.5rem',
        borderRight: `1px solid ${theme.palette.separator.grey}`
    },
    appScreen: {
        gridColumn: '2/3',
        gridRow: '2/3',
        display: 'flex',
        flexDirection: 'column'
    },
    codxIcon: {
        width: '20rem',
        borderRight: `1px solid ${theme.palette.separator.grey}`,
        paddingLeft: '1rem'
    },
    codxLogo: {
        height: theme.spacing(2.5),
        margin: theme.spacing(1.5),
        fill: theme.palette.primary.contrastText
    },
    appName: {
        fontSize: '2rem',
        color: alpha(theme.palette.text.default, 0.6),
        letterSpacing: '1px'
    },
    screenTabContainer: {
        display: 'flex',
        background: theme.palette.primary.dark,
        marginLeft: '1rem'
    },
    screenTab: {
        padding: '0.8rem 2.5rem',
        color: theme.palette.text.default,
        fontSize: '1.4rem',
        textTransform: 'uppercase',
        fontWeight: '500',
        borderBottom: `1px solid ${theme.palette.separator.grey}`
    },
    screenTabSelected: {
        color: theme.palette.text.default,
        position: 'relative',
        '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            border: `1px solid ${theme.palette.separator.grey}`
        }
    },
    screenFilter: {
        display: 'flex',
        gap: '2rem',
        background: theme.palette.primary.dark,
        position: 'relative',
        width: '100%',
        padding: '0.5rem 2rem',
        borderRadius: '2px',
        '& button': {
            border: `1px solid ${theme.palette.text.contrastText}`
        },
        '& button svg': {
            color: theme.palette.primary.contrastText
        },
        '&:after': {
            content: '""',
            position: 'absolute',
            width: '99%',
            height: '2px',
            background: theme.palette.separator.grey,
            left: '0.5%',
            bottom: 0
        }
    },
    filterChip: {
        padding: '0rem 1rem',
        fontSize: '1.5rem',
        color: theme.palette.text.default,
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        background: alpha(theme.palette.primary.dark, 0.7),
        borderRadius: '10rem',
        fontFamily: theme.title.h1.fontFamily,
        '& svg': {
            background: alpha(theme.palette.primary.light, 0.7),
            borderRadius: '50%',
            padding: '2px',
            color: alpha(theme.palette.text.default, 0.7)
        },
        '& span span': {
            color: theme.palette.background.infoBgDark,
            fontFamily: theme.title.h1.fontFamily,
            fontSize: '1.5rem',
            paddingRight: '0.5rem',
            borderRight: `1px solid ${theme.palette.separator.grey}`
        }
    },
    screenLayout: {
        flex: 1,
        display: 'grid',
        gridTemplateAreas: `
'k1 k2 k3 k4'
'w1 w1 w3 w3'
'w1 w1 w3 w3'
'w2 w2 w3 w3'
'w2 w2 w3 w3'
`,
        gridTemplateRows: '1fr 1fr 1fr 1fr 1fr'
    },
    screenWidget: {
        background: theme.palette.primary.dark,
        padding: '1rem',
        paddingBottom: '0.5rem',
        borderRadius: '2px',
        position: 'relative',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        borderRight: `1px solid ${theme.palette.separator.grey}`,
        '&:nth-child(1)': {
            borderBottom: `1px solid ${theme.palette.separator.grey}`
        },
        '&:nth-child(2)': {
            borderBottom: `1px solid ${theme.palette.separator.grey}`
        },
        '&:nth-child(3)': {
            borderBottom: `1px solid ${theme.palette.separator.grey}`
        },
        '&:nth-child(4)': {
            borderBottom: `1px solid ${theme.palette.separator.grey}`,
            borderRight: 'none'
        },
        '&:nth-child(5)': {
            borderRight: `1px solid ${theme.palette.separator.grey}`,
            borderBottom: `1px solid ${theme.palette.separator.grey}`
        },
        '&:after': {
            position: 'absolute',
            content: '""',
            zIndex: '1',
            width: 'calc(100% + 3px)',
            bottom: 0,
            left: 0,
            height: '1rem',
            background: theme.palette.primary.dark
        },
        '&:before': {
            position: 'absolute',
            content: '""',
            zIndex: '1',
            width: 'calc(100% + 3px)',
            top: 0,
            left: 0,
            height: '1rem',
            background: theme.palette.primary.dark
        }
    },
    widgetTitle: {
        fontSize: '1.5rem',
        textTransform: 'uppercase',
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily
    },
    widgetTitleFullScreen: {
        fontSize: '1.8rem',
        textTransform: 'uppercase',
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily
    },
    kpiRoot: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
    },
    upwardKpi: {
        '& $kpiStyle, $kpiSubValue, $kpiArrow': {
            '& svg': {
                '& path': {
                    fill: green[500]
                },
                marginLeft: '0.5rem'
            }
        },
        '& $kpiSubValue': {
            background: alpha(green[500], 0.15),
            padding: '0 0.5rem',
            borderRadius: '2px'
        }
    },
    downwardKpi: {
        '& $kpiStyle, $kpiSubValue, $kpiArrow': {
            '& svg': {
                '& path': {
                    fill: red[500]
                },
                marginLeft: '0.5rem',
                transform: 'rotate(180deg)'
            }
        },
        '& $kpiSubValue': {
            background: alpha(red[500], 0.15),
            padding: '0 0.5rem',
            borderRadius: '2px'
        }
    },
    kpiArrow: {
        fontSize: '2rem'
    },
    kpiValueFullScreen: {
        fontSize: '2.3rem',
        color: theme.palette.text.default
    },
    kpiValue: {
        fontSize: '1.5rem',
        color: theme.palette.text.default
    },
    kpiSubValue: {
        fontSize: '1.4rem'
    },
    graphRoot: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
    },
    navItem1: {
        fontSize: '1.4rem',
        color: theme.palette.text.default,
        padding: '1rem',
        background: theme.palette.background.navLinkBackground,
        borderRadius: '2px',
        fontWeight: '700',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: theme.title.h1.fontFamily,
        '& svg': {
            color: alpha(theme.palette.text.default, 0.7),
            fontSize: '2rem'
        }
    },
    navItem2: {
        fontSize: '1.4rem',
        color: alpha(theme.palette.primary.contrastText, 0.7),
        padding: '1rem',
        borderRadius: '2px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        borderLeft: `3px solid ${alpha(theme.palette.primary.contrastText, 0.7)}`
    },
    navItem3: {
        fontSize: '1.4rem',
        color: theme.palette.text.default,
        padding: '1rem',
        borderRadius: '2px',
        borderLeft: `2px solid ${alpha(theme.palette.primary.contrastText, 0.7)}`
    },
    navItem4: {
        fontSize: '1.4rem',
        color: alpha(theme.palette.text.default, 0.4),
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        '& svg': {
            color: alpha(theme.palette.text.default, 0.7),
            fontSize: '2rem'
        }
    },
    divider: {
        borderBottom: `1px solid ${alpha(theme.palette.primary.light, 0.4)}`,
        margin: '2rem -0.5rem 1rem -0.5rem'
    },
    navItemTitle1: {
        fontSize: '1.4rem',
        color: alpha(theme.palette.text.categoryText, 0.7),
        padding: '1rem'
    },
    navItem6: {
        fontSize: '1.4rem',
        color: alpha(theme.palette.text.default, 0.6),
        padding: '0.5rem 1rem',
        display: 'flex',
        gap: '1rem'
    },
    advancedFeatureLogo: {
        width: '2.7rem',
        height: '2.7rem',
        fill: alpha(theme.palette.primary.contrastText, 0.7),
        stroke: alpha(theme.palette.primary.contrastText, 0.7)
    },
    kpiStyle: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.3rem'
    },
    navIconsSection: {
        display: 'flex',
        justifyContent: 'end',
        flex: 1
    },
    navIcon: {
        marginRight: '1rem'
    },
    graphDataExtraLabelUp: {
        position: 'relative',
        color: theme.palette.text.indicatorGreenText,
        textAlign: 'right',
        '& .MuiSvgIcon-root': {
            color: theme.palette.success.main
        }
    },
    graphDataExtraLabelDown: {
        position: 'relative',
        color: theme.palette.error.main,
        textAlign: 'left',
        fontWeight: '500 !important',
        '& .MuiSvgIcon-root': {
            color: theme.palette.error.main
        }
    }
}));
function ThemePreviewScreen() {
    const classes = useStyles();
    const rootRef = useRef();
    const [fullScreen, setFullScreen] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        document.addEventListener('fullscreenchange', () => {
            setFullScreen(document.fullscreenElement?.id === 'codx-sceen-prevew');
        });
    }, []);

    const handleFullScreen = () => {
        rootRef.current.requestFullscreen();
    };

    return (
        <main
            role="main"
            aria-label="root"
            id="codx-sceen-prevew"
            className={clsx(classes.root, fullScreen, fullScreen && classes.fullScreen)}
            ref={rootRef}
        >
            {fullScreen ? null : (
                <IconButton
                    title="full screen"
                    size="medium"
                    className={classes.fullScreenIcon}
                    onClick={handleFullScreen}
                    aria-label="Full screen"
                >
                    <FullscreenIcon fontSize="large" />
                </IconButton>
            )}
            <header role="banner" aria-label="header" className={classes.header}>
                <div role="img" aria-label="codx icon" className={classes.codxIcon}>
                    <Nuclios
                        color={theme.palette.text.contrastText}
                        alt="codex-logo"
                        className={classes.codxLogo}
                    />
                </div>
                <div className={classes.navIconsSection}>
                    <div className={classes.navIcon}>
                        <HelpIcon
                            color={theme.palette.text.default}
                            className={classes.advancedFeatureLogo}
                        />
                    </div>
                    <div className={classes.navIcon}>
                        <AdminIcon
                            color={theme.palette.text.default}
                            className={classes.advancedFeatureLogo}
                        />
                    </div>
                    <div className={classes.navIcon}>
                        <AccountCircle className={classes.advancedFeatureLogo} />
                    </div>
                </div>
            </header>
            <div aria-label="side nav bar" className={classes.sideNavBar}>
                <div className={classes.navItem1}>
                    Screen 1 <KeyboardArrowUpIcon />
                </div>
                <div className={classes.navItem2}>
                    <div />
                    Sub-Screen 1
                </div>
                <div className={classes.navItem3}>Sub-Screen 2</div>
                <div className={classes.navItem4}>
                    Screen 2 <KeyboardArrowDownIcon />
                </div>
                <div className={classes.navItem4}>Screen 3</div>
                <div className={classes.navItem4}>Screen 4</div>
            </div>
            <div aria-label="app screen" className={classes.appScreen}>
                <div aria-label="screen tab" className={classes.screenTabContainer}>
                    <div
                        className={clsx(
                            classes.screenTab,
                            fullScreen ? classes.screenTabSelected : ''
                        )}
                    >
                        Tab 1
                    </div>
                    <div className={clsx(classes.screenTab)}>Tab 2</div>
                </div>
                <div role="button" aria-label="screen filter" className={classes.screenFilter}>
                    <Button
                        size="small"
                        startIcon={<TuneIcon />}
                        variant="text"
                        aria-label="Filters"
                    >
                        Filters
                    </Button>
                    <div className={classes.filterChip}>
                        <span>
                            Options <span> All</span>
                        </span>
                    </div>
                </div>
                <div aria-label="screen layout" className={classes.screenLayout}>
                    <div elevation={1} style={{ gridArea: 'k1' }} className={classes.screenWidget}>
                        <KpiWidget classes={classes} data={WidgetData.k1} fullScreen={fullScreen} />
                    </div>
                    <div elevation={1} style={{ gridArea: 'k2' }} className={classes.screenWidget}>
                        <KpiWidget classes={classes} data={WidgetData.k2} fullScreen={fullScreen} />
                    </div>
                    <div elevation={1} style={{ gridArea: 'k3' }} className={classes.screenWidget}>
                        <KpiWidget classes={classes} data={WidgetData.k3} fullScreen={fullScreen} />
                    </div>
                    <div elevation={1} style={{ gridArea: 'k4' }} className={classes.screenWidget}>
                        <KpiWidget classes={classes} data={WidgetData.k4} fullScreen={fullScreen} />
                    </div>
                    <div
                        elevation={1}
                        role="img"
                        aria-label="widget 1"
                        style={{ gridArea: 'w1' }}
                        className={classes.screenWidget}
                    >
                        <GraphWidget data={WidgetData.w1} classes={classes} />
                    </div>
                    <div
                        elevation={1}
                        role="img"
                        aria-label="widget 2"
                        style={{ gridArea: 'w2' }}
                        className={classes.screenWidget}
                    >
                        <GraphWidget data={WidgetData.w2} classes={classes} />
                    </div>
                    <div
                        elevation={1}
                        role="img"
                        aria-label="widget 3"
                        style={{ gridArea: 'w3' }}
                        className={classes.screenWidget}
                    >
                        <GraphWidget data={WidgetData.w3} classes={classes} />
                    </div>
                </div>
            </div>
        </main>
    );
}

function KpiWidget({ classes, data, fullScreen }) {
    return (
        <div
            className={clsx(
                {
                    [classes.upwardKpi]: data.widgetData.direction === 'up',
                    [classes.downwardKpi]: data.widgetData.direction === 'down'
                },
                classes.kpiRoot
            )}
        >
            <Typography
                className={fullScreen ? classes.widgetTitleFullScreen : classes.widgetTitle}
                gutterBottom
            >
                {data.title}
            </Typography>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flex: 1
                }}
            >
                <div className={classes.kpiStyle}>
                    <Typography
                        variant="h4"
                        className={fullScreen ? classes.kpiValueFullScreen : classes.kpiValue}
                    >
                        {data.widgetData.value}
                    </Typography>
                    <Typography variant="body1" className={classes.kpiSubValue}>
                        {data.widgetData.sub} <MarkerUpIcon className={classes.kpiArrow} />
                    </Typography>
                </div>
            </div>
        </div>
    );
}

function GraphWidget({ classes, data }) {
    return (
        <div className={classes.graphRoot}>
            <Typography className={classes.widgetTitle} gutterBottom>
                {data.title}
            </Typography>
            <div style={{ flex: 1 }}>
                <AppWidgetPlot params={data.widgetData.params} />
            </div>
        </div>
    );
}

export default ThemePreviewScreen;
