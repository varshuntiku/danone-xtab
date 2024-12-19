import { makeStyles, useTheme, Button, Typography } from '@material-ui/core';
import { useEffect, useRef, useState } from 'react';
import CodxCircularLoader from '../../CodxCircularLoader';
import CustomSnackbar from '../../CustomSnackbar';
import { getJpHubToken, getStreamData } from '../../../services/project';
import { matchPath } from 'react-router-dom';
import LinearProgressBar from 'components/LinearProgressBar';
import clsx from 'clsx';
// import ErrorIcon from '@material-ui/icons/Error';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '100%',
        padding: theme.layoutSpacing(4, 8)
    },
    jupyterlab: {
        width: '100%',
        height: '100%',
        border: '0',
        '& .jp-SidePanel': {
            background: 'blue'
        }
    },
    instructionsParent: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: '100%',
        '& button': {
            marginTop: theme.layoutSpacing(20)
        }
    },
    instructionsHeader: {
        fontSize: theme.layoutSpacing(25),
        fontWeight: theme.title.h1.fontWeight,
        fontFamily: theme.title.h1.fontFamily,
        marginBottom: theme.layoutSpacing(2),
        color: theme.palette.text.default
    },
    instructions: {
        lineHeight: '1.2',
        width: '50%',
        '& span': {
            display: 'block',
            fontSize: theme.layoutSpacing(16),
            letterSpacing: theme.layoutSpacing(0.5),
            fontFamily: theme.body.B1.fontFamily,
            marginBottom: theme.layoutSpacing(1),
            color: theme.palette.text.default
        }
    },
    progressBarContainer: {
        width: '60rem',
        marginLeft: 'auto',
        marginRight: 'auto',
        height: '10vh',
        position: 'absolute',
        top: '40%',
        left: '35%'
    },
    progressBar: {
        borderRadius: '4px',
        '& .MuiLinearProgress-bar': {
            boxShadow: '0px 0px 1px 0px black inset',
            backgroundColor: theme.props?.mode === 'dark' ? '#FFB547' : '#6883F7'
        }
    },
    fontSize1: {
        fontSize: '2rem',
        marginBottom: '1%',
        color: theme.palette.text.default
    },
    currentStatusTxt: {
        position: 'relative'
    },
    failedContainer: {
        width: '30rem',
        marginLeft: 'auto',
        marginRight: 'auto',
        height: '10vh',
        position: 'absolute',
        top: '40%',
        left: '10%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    errorTxt: {
        fontSize: '2rem'
    },
    errorIcon: {
        fontSize: '7rem'
    }
}));

const instructions = [
    'Please use Google Chrome or Microsoft Edge for the best experience. Brave browser is not recommended.',
    'At any given time, only one project can be opened and managed.',
    'If activity on the notebook is idle for 30 minutes, the server will automatically shut down. Please ensure you save your notebooks before any period of inactivity.'
];

export default function ConfigureDevelop({
    projectId,
    location,
    setShowHardReloadBtn,
    showHardReloadBtn
}) {
    const classes = useStyles();
    const iframeRef = useRef();
    const theme = useTheme();
    const mode = theme.props.mode;
    const [loading, setLoading] = useState(true);
    const [progressNumber, setProgressNumber] = useState(0);
    const [showInstructions, setShowInstructions] = useState(true);
    const [notification, setNotification] = useState({});
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [jphubToken, setJpHubToken] = useState('');
    const [src, setSrc] = useState('');
    const [jupyterlabLoaded, setJupyterlabLoaded] = useState(false);
    const pathName = location.pathname;
    const isNotebooksScreen = matchPath(pathName, {
        path: '/ds-workbench/project/:projectId/configure-develop/notebooks'
    });
    const [callStreamGetStreamData, setCallStreamGetStreamData] = useState(false);
    const [isTimeOut, setIsTimeOut] = useState(false);

    const openTab = (url) => {
        const newTab = window.open(url, '_blank', 'popup,left=0,top=0,width=100,height=100');
        newTab.window.onload = () => {
            alert('newtab');
        };

        let checkWindowLoaded = setInterval(function () {
            try {
                if (newTab.window.location.href !== 'about:blank') {
                    clearInterval(checkWindowLoaded);
                    setSrc(import.meta.env['REACT_APP_JPHUB_URL'] + `/hub/login`);
                }
            } catch {
                newTab.close();
                clearInterval(checkWindowLoaded);
                setSrc(import.meta.env['REACT_APP_JPHUB_URL'] + `/hub/login`);
            }
        }, 2000);
    };

    const emitTheme = () => {
        if (iframeRef.current) {
            const colorThemeData = {
                mode: mode
            };
            iframeRef.current.contentWindow.postMessage(colorThemeData, '*');
        }
    };

    useEffect(() => {
        emitTheme();
    }, [mode]);

    const handleLoad = () => {
        emitTheme();
    };

    const jphubTokenRef = useRef();
    jphubTokenRef.current = jphubToken;

    useEffect(() => {
        if (
            isNotebooksScreen &&
            isNotebooksScreen.isExact &&
            !showHardReloadBtn &&
            !callStreamGetStreamData
        ) {
            getStreamData({
                projectId: projectId,
                callback: onResponseGetStreamData
            });
            setCallStreamGetStreamData(true);
        } else {
            setShowHardReloadBtn(false);
        }
    }, [isNotebooksScreen]);

    useEffect(() => {
        const themeExtensionActivated = (event) => {
            if (event.data.type === 'jupyter-extension-activated') {
                emitTheme();
                setJupyterlabLoaded(true);
                setShowHardReloadBtn(true);
            }
        };
        const authInfoRequest = (event) => {
            if (event.data.type === 'jupyterhub-progress') {
                setProgressNumber(event.data?.data?.progress);
                if (event.data?.data?.failed === true) {
                    setIsTimeOut(true);
                    setShowHardReloadBtn(true);
                    setSrc('');
                    setTimeout(() => {
                        setLoading(true);
                        setJupyterlabLoaded(true);
                        setSrc(import.meta.env['REACT_APP_JPHUB_URL'] + `/hub/login`);
                    }, 3000);
                } else {
                    setIsTimeOut(false);
                }
            }
            if (event.data.type === 'jupyterhub-login-info-request') {
                iframeRef.current.contentWindow.postMessage(
                    {
                        type: 'login-info',
                        data: {
                            projectId: projectId,
                            token: jphubTokenRef.current
                        }
                    },
                    '*'
                );
            }
        };
        window.addEventListener('message', themeExtensionActivated);
        window.addEventListener('message', authInfoRequest);
        return () => {
            window.removeEventListener('message', themeExtensionActivated);
            window.removeEventListener('message', authInfoRequest);
        };
    }, []);

    const onResponseGetStreamData = (response_data, status = 'success') => {
        if (status !== 'error') {
            const parsedData = response_data.data;
            const status = parsedData?.status?.toLowerCase();
            if (status === 'completed' || status === 'running') {
                if (isNotebooksScreen && isNotebooksScreen.isExact && !showHardReloadBtn) {
                    setShowHardReloadBtn(true);
                }
            }
            // const lines = response_data.split('\n');
            // lines.forEach((line) => {
            //     if (line.startsWith('data:')) {
            //         const jsonString = line.substring(5).trim();
            //         try {
            //             const parsedData = JSON.parse(jsonString);
            //             const status = parsedData.status.toLowerCase();
            //             if (status === 'completed' || status === 'running') {
            //                 if (
            //                     isNotebooksScreen &&
            //                     isNotebooksScreen.isExact &&
            //                     !showHardReloadBtn
            //                 ) {
            //                     setShowHardReloadBtn(true);
            //                 }
            //             }
            //         } catch (error) {
            //             throw error;
            //         }
            //     }
            // });
        }
    };

    const loadJpHubToken = async () => {
        setLoading(true);
        setShowInstructions(false);
        try {
            const data = await getJpHubToken(projectId);
            setJpHubToken(data.token);
            const url = import.meta.env['REACT_APP_JPHUB_URL'] + '/hub/logout';
            openTab(url);
        } catch {
            setNotification({
                message: 'Failed to load. Try again.',
                severity: 'error'
            });
            setNotificationOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const getProgressMessage = (progressCount) => {
        if (progressCount <= 50) {
            return 'Preparing your notebook environment...';
        } else if (progressCount <= 63) {
            return 'Setting up the necessary resources...';
        } else if (progressCount <= 72) {
            return 'Finalizing environment setup...';
        } else if (progressCount <= 78) {
            return 'Retrieving necessary components...';
        } else if (progressCount <= 82) {
            return 'Components successfully retrieved...';
        } else if (progressCount <= 84) {
            return 'Initializing your notebook...';
        } else if (progressCount <= 86) {
            return 'Starting your notebook...';
        } else if (progressCount <= 100) {
            return 'Your notebook is ready!';
        } else {
            return 'Almost there...';
        }
    };

    const progressLoader = (count) => {
        let loaderCount = count == 0 ? 5 : count;
        let msg = getProgressMessage(loaderCount);
        return (
            <div className={classes.progressBarContainer}>
                {!isTimeOut ? (
                    <>
                        <Typography
                            variant="subtitle1"
                            className={clsx(classes.fontSize1, classes.currentStatusTxt)}
                        >
                            Current Status : <b>{msg}</b>
                        </Typography>
                        <CodxCircularLoader style={{ top: '-5rem' }} size={40} center />
                        <Typography
                            style={{ marginBottom: '2rem' }}
                            variant="subtitle1"
                            className={classes.fontSize1}
                        >
                            {'JupyterLab is loading...'}
                        </Typography>
                        <LinearProgressBar
                            variant="determinate"
                            value={loaderCount}
                            className={classes.progressBar}
                        />
                    </>
                ) : (
                    <>
                        {loading && jupyterlabLoaded ? (
                            <iframe
                                ref={iframeRef}
                                onLoad={handleLoad}
                                src={src}
                                className={`${
                                    !loading ? clsx(classes.jupyterlab) : classes.jupyterlab
                                }`}
                            ></iframe>
                        ) : (
                            <div className={classes.failedContainer}>
                                {/* <ErrorIcon
                                    className={classes.errorIcon}
                                    role="img"
                                    fontSize="large"
                                    color="secondary"
                                    titleAccess={'Time Out Please try again...'}
                                /> */}
                                <Typography
                                    variant="subtitle1"
                                    className={clsx(
                                        classes.fontSize1,
                                        classes.currentStatusTxt,
                                        classes.errorTxt
                                    )}
                                >
                                    <b>
                                        {'We are quickly spinning your custom ENV, please wait...'}
                                    </b>{' '}
                                </Typography>
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    };

    return (
        <div className={classes.root}>
            {showInstructions && (
                <div className={classes.instructionsParent}>
                    <label className={classes.instructionsHeader}>Instructions</label>
                    <div className={classes.instructions}>
                        {instructions.map((instruction, index) => (
                            <span key={index}>
                                {index + 1}
                                {'. '}
                                {instruction}
                            </span>
                        ))}
                    </div>
                    <Button onClick={loadJpHubToken} size="small" variant="contained">
                        Load JupyterLab
                    </Button>
                </div>
            )}
            {!showInstructions && !loading && !jupyterlabLoaded ? (
                <>{progressLoader(progressNumber)}</>
            ) : null}

            {!showInstructions &&
                (loading ? (
                    <>{progressLoader(progressNumber)}</>
                ) : (
                    <iframe
                        ref={iframeRef}
                        onLoad={handleLoad}
                        src={src}
                        className={`${!loading ? clsx(classes.jupyterlab) : classes.jupyterlab}`}
                    ></iframe>
                ))}
            <CustomSnackbar
                open={notificationOpen && notification?.message}
                autoHideDuration={3000}
                onClose={setNotificationOpen.bind(null, false)}
                severity={notification?.severity || 'success'}
                message={notification?.message}
            />
        </div>
    );
}
