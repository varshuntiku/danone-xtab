import { makeStyles } from '@material-ui/core';
import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetch_socket_connection } from 'util/initiate_socket.js';
import { UserInfoContext } from 'context/userInfoContent';
import { CircularProgress } from '@material-ui/core';
import { setAppScreens, setProgressBarDetails, setHightlightScreenId } from 'store/index';
import LinearProgress from '@material-ui/core/LinearProgress';
import { create_slug } from 'services/app.js';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    '@keyframes pulsate': {
        '0%': {
            opacity: 1
        },
        '50%': {
            opacity: 0.7
        },
        '100%': {
            opacity: 1
        }
    },
    wrapper: {
        width: theme.layoutSpacing(800)
    },
    topWrapper: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.layoutSpacing(10),
        alignItems: 'center'
    },
    messageWrapper: {
        margin: 'auto',
        marginTop: theme.layoutSpacing(2),
        fontFamily: theme.body.B5.fontFamily,
        fontSize: theme.layoutSpacing(14),
        lineHeight: theme.layoutSpacing(16.8),
        fontWeight: '400',
        color: '#220047',
        letterSpacing: theme.layoutSpacing(0.5)
    },
    closeWrapper: {
        display: 'flex',
        alignItems: 'center'
    },
    linerProgressBar: {
        borderRadius: theme.layoutSpacing(10),
        height: theme.layoutSpacing(12),
        backgroundColor: '#220047D9',
        border: `${theme.layoutSpacing(4)} solid #220047D9`
    },
    circularProgress: {
        color: theme.palette.text.default
    },
    linerProgressBarWrapper: {
        width: '50%',
        position: 'relative',
        '& .MuiLinearProgress-barColorPrimary': {
            background: 'linear-gradient(to left, #FFA497, #220047D9)',
            borderRadius: theme.layoutSpacing(8),
            animation: '$pulsate 2s ease-in-out infinite',
            transition: '0.5s'
        }
    },
    overlayWrapper: {
        width: '100%',
        height: '100%',
        background: '#ffffffE6',
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 101
    }
}));

const StepperProgressBar = ({ app_id, screen_id, ...props }) => {
    const [socket, setSockets] = useState(null);
    const userContext = useContext(UserInfoContext);
    const dispatch = useDispatch();
    const progressBarDetails = useSelector((state) => state.appScreen.progressBarDetails);
    const [data, setData] = useState(progressBarDetails[screen_id]);
    const classes = useStyles();

    useEffect(() => {
        setData(progressBarDetails[screen_id]);
    }, [progressBarDetails]);

    useEffect(() => {
        if (!socket) {
            setSockets(fetch_socket_connection);
        } else {
            socket['socket_product']?.emit('init_stepper_progress_loader_component', {
                app_id: app_id,
                screen_id: screen_id,
                user_id: userContext.user_id
            });
            socket['socket_product']?.on(
                `progress_loader_${app_id}#${screen_id}#${userContext.user_id}`,
                (data) => {
                    setData(data);
                    dispatch(
                        setProgressBarDetails({
                            ...progressBarDetails,
                            [screen_id]: { ...data, loading: !!data?.loading }
                        })
                    );
                    dispatch(setAppScreens(data?.screens[0]));
                    if (data?.type !== 'modify' && data?.completed) {
                        dispatch(setHightlightScreenId(screen_id));
                    }
                    if (data?.completed) {
                        props.history.push(`/app/${app_id}/${create_slug(data.screen_name)}`);
                    }
                }
            );
        }

        return () => {
            if (
                socket &&
                socket['socket_product']?.hasListeners(
                    `progress_loader_${app_id}#${screen_id}#${userContext.user_id}`
                )
            ) {
                socket['socket_product']?.removeListener(
                    `progress_loader_${app_id}#${screen_id}#${userContext.user_id}`
                );
            }
        };
    }, [socket, app_id, screen_id, userContext.user_id]);

    if (data?.loading) {
        return <CircularProgress className={classes.circularProgress} />;
    }

    const ProgressBar = () => {
        return (
            <div className={classes.wrapper}>
                <div className={classes.topWrapper}>
                    <div className={classes.linerProgressBarWrapper}>
                        <LinearProgress
                            variant="determinate"
                            value={data?.stage_percentage || 0}
                            className={classes.linerProgressBar}
                        />
                    </div>
                    <div className={classes.messageWrapper}>{data?.message}</div>
                </div>
            </div>
        );
    };

    if (data?.type === 'modify') {
        return <div className={classes.overlayWrapper}>{<ProgressBar />}</div>;
    }

    return <ProgressBar />;
};

export default withRouter(StepperProgressBar);
