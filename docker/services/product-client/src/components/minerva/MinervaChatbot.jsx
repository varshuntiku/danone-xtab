import React, { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import { IconButton, Typography, alpha } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import QueryInput from './QueryInput';
import QueryOutput from './QueryOutput';
import LaunchIcon from '@material-ui/icons/Launch';
import { grey } from '@material-ui/core/colors';
import RemoveIcon from '@material-ui/icons/Remove';
import { CustomThemeContext } from 'themes/customThemeContext';
import { AuthContext } from 'auth/AuthContext';
import backImg from 'assets/img/Nuclios_Background.svg';
import darkBackground from 'assets/img/minerva-dark-bg.png';
import { useSelector, useDispatch } from 'react-redux';
import {
    setAppScreens,
    setInProgressScreenId,
    setProgressBarDetails,
    setActiveScreenWidgetsDetails,
    setUpdatedWidgetsIds,
    setFiltersUpdateStatus
} from 'store/index';
import { create_slug } from 'services/app.js';
import { setHightlightScreenId } from 'store/slices/appScreenSlice';


// const emails = ['username@gmail.com', 'user02@gmail.com'];
const useStyles = makeStyles((theme) => ({
    dialogSize: {
        width: '45rem',
        height: '65rem',
        position: 'absolute',
        bottom: '2px',
        left: '2px',
        margin: '0',
        overflow: 'visible'
    },
    root: {
        zIndex: '999999 !important'
    },
    button: {
        width: '85%',
        padding: '0.4rem 2rem',
        color: theme.palette.text.default + ' !important',
        margin: 'auto',
        display: 'flex',
        justifyContent: 'flex-start',
        textTransform: 'none'
    },
    minervaLogo: {
        width: '2.4rem',
        height: '2.4rem',
        fill: theme.palette.text.default
    },
    chatBoxContainer: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    chatHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '1rem',
        borderBottom: `1px solid ${alpha(grey[500], 0.2)}`,
        '& svg': {
            color: theme.palette.text.default
        }
    },
    title: {
        fontSize: '2rem',
        color: theme.palette.text.default,
        marginLeft: theme.spacing(2),
        textTransform: 'uppercase',
        letterSpacing: '0.2rem'
    },
    chatBody: {
        flex: '1',
        maxHeight: '100%',
        overflow: 'hidden'
    },
    chatInput: {
        padding: '0 1rem'
    },
    windowName: {
        fontSize: '1.4rem',
        color: alpha(theme.palette.text.default, 0.5),
        marginLeft: '1.6rem'
    },
    minerva_text: {
        color: theme.palette.text.default,
        textTransform: 'capitalize',
        fontFamily: theme.body.B1.fontFamily,
        fontSize: theme.layoutSpacing(16),
        fontWeight: 500,
        letterSpacing: theme.layoutSpacing(0.5),
        lineHeight: '2.1rem'
    },
    minerva: {
        display: 'flex',
        padding: '8px 12px',
        border: `1px solid ${theme.props.mode === 'light'
            ? `${theme.palette.text.default}30`
            : theme.palette.text.default
            }`,
        borderRadius: '44px',
        gap: '1rem',
        alignItems: 'center',
        width: 'fit-content',
        cursor: 'pointer'
    },
    minervaHidden: {
        cursor: 'pointer',
        padding: '8px',
        border: `1px solid ${theme.props.mode === 'light'
            ? `${theme.palette.text.default}30`
            : theme.palette.text.default
            }`,
        borderRadius: '44px',
        width: 'fit-content',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    drawerCollapseHidden: {
        display: 'none'
    },
    minervaWrapper: {
        '& minerva-wc': {
            fontSize: theme.layoutSpacing(16)
        },
        '& .MinervaFont-2': {
            fontFamily: 'Graphik Compact'
        },
        '& .MinervaButton': {
            fontFamily: 'Graphik Compact'
        },
        '& .MinervaWC .MinervaPopperDialog': {
            top: '100% !important',
            transform: 'translateY(-100%) !important'
        },
        '& .MinervaWC dialog[open].MinervaPopperDialog:not(.MinervaPopperDialog-expanded)': {
            marginLeft: theme.layoutSpacing(-12),
            marginTop: theme.layoutSpacing(-4)
        },
        '& .MinervaFullScreen-chat-section': {
            backgroundImage: `url(${theme.props.mode === 'light' ? backImg : darkBackground
                }) !important`,
            backgroundSize: 'cover !important',
            backgroundPosition: 'center !important',
            backgroundRepeat: 'no-repeat !important'
        },
        '& .MinervaFullHeight': {
            backgroundImage: `url(${theme.props.mode === 'light' ? backImg : darkBackground
                }) !important`,
            backgroundSize: 'cover !important',
            backgroundPosition: 'center !important',
            backgroundRepeat: 'no-repeat !important'
        },
        '& .MinervaPopper-floater-btn': {
            position: 'static !important',
            background: theme.palette.primary.dark + ' !important',
            boxShadow: 'none !important',
            transitionDuration: '500ms !important',
            '& svg': {
                fill: theme.palette.primary.contrastText + ' !important'
            }
        },
        '& .MinervaPopper-trigger-btn': {
            width: 'max-content'
        },
        '& .MinervaWC .MinervaChartView': {
            height: theme.layoutSpacing(203),
            width: '85%'
        }
    },
    topnav_minerva_inView: {
        '& .MinervaPopper-floater-btn': {
            position: 'static !important',
            background: theme.palette.icons.darkTheme + ' !important',
            boxShadow: 'none !important',
            fontSize: theme.layoutSpacing(11),
            '& svg': {
                fill: theme.palette.text.peachText + ' !important',
                opacity: 0
            }
        }
    },
    topnav_MinervaWrapper: {
        '& .MinervaPopper-trigger-btn': {
            width: 'max-content',
            padding: `${theme.layoutSpacing(8.7)} !important`
        }
    },
    fullHeight: {
        height: '100%'
    }
}));

function ChatPopup(props) {
    const classNames = useStyles();
    const { onClose, selectedValue, open } = props;
    const handleClose = () => {
        onClose(selectedValue);
    };

    const navigateToMinervaDashboard = () => {
        props.history.push({
            pathname: '/app/' + props.app_info.id + '/ask-nuclios'
        });
    };

    return (
        <Dialog
            classes={{
                paper: classNames.dialogSize,
                root: classNames.root
            }}
            onClose={handleClose}
            aria-labelledby="minerva-dialog-title"
            open={open}
        >
            <div className={classNames.chatBoxContainer}>
                <div className={classNames.chatHeader}>
                    <div>
                        <Typography variant="h4" className={classNames.title}>
                            Ask NucliOS
                        </Typography>
                        <Typography variant="subtitle1" className={classNames.windowName}>
                            {window ? window?.title : 'New chat'}
                        </Typography>
                    </div>
                    <div style={{ flex: 1 }}></div>
                    <IconButton
                        size="medium"
                        onClick={navigateToMinervaDashboard}
                        title="Open ask nuclios on full screen"
                        aria-label="full-screen"
                    >
                        <LaunchIcon fontSize="large" />
                    </IconButton>
                    <IconButton size="medium" onClick={handleClose} title="minimize">
                        <RemoveIcon fontSize="large" />
                    </IconButton>
                </div>
                <div className={classNames.chatBody}>
                    <QueryOutput
                        appId={props.app_info?.id}
                        minervaAppId={props.app_info?.modules?.minerva?.tenant_id}
                        chatPopperView
                    />
                </div>
                <div className={classNames.chatInput}>
                    <QueryInput minervaAppId={props.app_info?.modules?.minerva?.tenant_id} />
                </div>
            </div>
        </Dialog>
    );
}

ChatPopup.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired
};

function MinervaChatbot({
    hideSideBar,
    top_navbar,
    minervaBtnInView,
    minervaBtnFloat,
    closePopup,
    openPopup,
    fullHeight,
    toggleFullScreen,
    ...props
}) {
    const classNames = useStyles();
    const [open, setOpen] = React.useState(false);
    const { theme, plotTheme } = useContext(CustomThemeContext);
    const { getToken } = useContext(AuthContext);
    const userName = sessionStorage.getItem('user_name');
    const message = `Hey ${userName}`;
    const minervaRef = useRef();
    let server_url = false;
    const copilot_id =
        import.meta.env['REACT_APP_ENABLE_COPILOT'] && props.app_info?.modules?.copilot?.enabled
            ? props.app_info?.modules?.copilot?.app_id
            : '';
    if (props.app_info?.modules?.copilot?.enabled && props.app_info?.modules?.copilot?.server_url) {
        server_url = props.app_info?.modules?.copilot?.server_url;
    }
    let minerva_app_id = '';
    if (!copilot_id) {
        minerva_app_id =
            import.meta.env['REACT_APP_ENABLE_MINERVA'] && props.app_info?.modules?.minerva?.enabled
                ? props.app_info?.modules?.minerva?.tenant_id
                : '';
    }
    if (props.app_info?.modules?.minerva?.enabled && props.app_info?.modules?.minerva?.server_url) {
        server_url = props.app_info?.modules?.minerva?.server_url;
    }

    const activeScreenDetails = useSelector((state) => state.appScreen.activeScreenDetails);


    // properties for auto dashboarding
    const { progressBarDetails, activeScreenId, activeScreenWidgets } = useSelector((state) => state.appScreen);
    const dispatch = useDispatch();

    const screenDataRef = useRef()

    screenDataRef.current = {
        progressBarDetails,
        activeScreenId,
        activeScreenWidgets
    }

    useEffect(() => {
        if (props?.actions?.ask) {
            setOpen(true);
        }
    }, [props?.actions]);

    const handleClose = () => {
        closePopup();
        if (props.setActions) {
            props?.setActions((prevsate) => ({ ...prevsate, ask: !prevsate.ask }));
        }
    };
    const closeDialog = () => {
        closePopup();
    };

    const openDialog = () => {
        openPopup();
    };
    const theme_values = JSON.stringify({
        bgMain: theme.palette.primary.dark,
        bgSecondaryBlue: theme.palette.background.menuItemFocus,
        bgSecondaryLightBlue: theme.palette.background.navLinkBackground,
        borderBlue: theme.palette.border.inputOnFoucs,
        textColor: theme.palette.text.default,
        contrastColor: theme.palette.primary?.contrastText,
        fontFamily: theme.typography?.fontFamily,
        chartColors: plotTheme?.chartDefaultColors?.['range-10'],
        mode: theme.props?.mode
    });

    const auth_token_getter = async () => {
        let token = localStorage.getItem('local.access.token.key');
        if (token) {
            return token;
        } else {
            return await getToken();
        }
    };

    const key = copilot_id + '-' + minerva_app_id;

    const handleClientEmitListener = (e) => {
        const { progressBarDetails, activeScreenId, activeScreenWidgets } = screenDataRef.current

        if (e.detail?.event == "app_screen_update") {
            if (Array.isArray(e.detail?.screens[0])) {
                dispatch(setAppScreens(e.detail?.screens[0]));
            } else {
                dispatch(setAppScreens(e.detail?.screens));
            }
            dispatch(setInProgressScreenId(e.detail?.screen_id));
            dispatch(
                setProgressBarDetails({ ...progressBarDetails, [e.detail?.screen_id]: e.detail })
            );
        } else if (e.detail?.event == "progress_loader") {
            dispatch(
                setProgressBarDetails({
                    ...progressBarDetails,
                    [activeScreenId]: { ...e.detail, loading: !!e.detail?.loading }
                })
            );
            if (Array.isArray(e.detail?.screens[0])) {
                dispatch(setAppScreens(e.detail?.screens[0]));
            } else {
                dispatch(setAppScreens(e.detail?.screens));
            }
            if (e.detail?.type !== 'modify' && e.detail?.completed) {
                dispatch(setHightlightScreenId(e.detail?.screen_id));
            }
            if (e.detail?.completed) {
                const url = `/app/${e.detail?.app_id}/${create_slug(e.detail?.screen_name)}`;
                if (window.location.pathname === url) {
                    const widgetIds = activeScreenWidgets
                        ? activeScreenWidgets.map((widget) => widget.id)
                        : [];
                    widgetIds.forEach((id) => {
                        dispatch(
                            setActiveScreenWidgetsDetails({ widget_id: id, data: null })
                        );
                    });
                }
                props.history.push(url);
            }

        } else if (e.detail?.event == "widgets_update") {
            dispatch(setFiltersUpdateStatus(e.detail?.is_filters_updated));
            dispatch(setUpdatedWidgetsIds(e.detail?.updated_widgets_ids));
        }
    }
    useEffect(() => {
        if (minervaRef.current) {
            minervaRef.current.auth_token_getter = auth_token_getter;
            minervaRef.current.addEventListener('popper:close', handleClose);
            minervaRef.current.addEventListener('popper:open', openDialog);
            minervaRef.current.addEventListener('popper:expanded', toggleFullScreen);
            minervaRef.current.addEventListener('popper:minimize', toggleFullScreen);
            minervaRef.current.addEventListener('popper:exit', closeDialog);

            minervaRef.current.addEventListener("external:emit-to-client", handleClientEmitListener)
        }
        return () => {
            if (minervaRef.current) {
                minervaRef.current.removeEventListener('popper:close', handleClose);
                minervaRef.current.auth_token_getter = '';
                minervaRef.current.removeEventListener('popper:exit', closeDialog);

                minervaRef.current.removeEventListener("external:emit-to-client", handleClientEmitListener)

            }
        };
    }, [key]);

    if (!copilot_id && !minerva_app_id) {
        return null;
    }

    return (
        <div className={`${fullHeight && classNames.fullHeight}`}>
            <div
                className={`${top_navbar
                    ? minervaBtnInView
                        ? classNames.topnav_MinervaWrapper
                        : classNames.topnav_minerva_inView
                    : ''
                    } ${classNames.minervaWrapper}
                ${fullHeight && classNames.fullHeight}`}
            >
                <minerva-wc
                    variant={`${fullHeight && 'fullscreen-mini'}`}
                    key={key}
                    data-testid="minerva-wc"
                    app_id={minerva_app_id}
                    copilot_app_id={copilot_id}
                    skip_loading_plotly={true}
                    theme_values={theme_values}
                    open_popper={open ? 'open' : ''}
                    load_from_cache={true}
                    ref={minervaRef}
                    empty_state_message_greet={message}
                    extra_query_param={JSON.stringify({
                        selected_screen_id: activeScreenDetails?.id,
                        selected_screen_name: activeScreenDetails?.screen_name,
                        selected_screen_url: window.location.href
                    })}
                    server_url={server_url || import.meta.env['REACT_APP_MINERVA_BACKEND_URL']}
                    trigger_button_variant={
                        top_navbar
                            ? minervaBtnInView
                                ? minervaBtnFloat
                                    ? 'float'
                                    : ''
                                : minervaBtnInView
                                    ? ''
                                    : 'float'
                            : hideSideBar
                                ? 'float'
                                : ''
                    }
                ></minerva-wc>
            </div>
        </div>
    );
}
export default withRouter(MinervaChatbot);
