import { Button, IconButton, makeStyles } from '@material-ui/core';
import React from 'react';
import CancelIcon from '@material-ui/icons/Cancel';
import { triggerActionHandler } from '../../../services/screen';
import { red } from '@material-ui/core/colors';
import CustomSnackbar from '../../CustomSnackbar';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    icon: {
        fontSize: '2.5rem',
        color: theme.palette.primary.contrastText
    },
    errorVariantIcon: {
        fontSize: '2.5rem',
        color: red[400]
    },
    link: {
        color: theme.palette.text.titleText,
        fontSize: '1.6rem',
        textDecoration: 'underline',
        cursor: 'pointer'
    },
    color_contrast: {
        color: theme.palette.primary.contrastText
    },
    errorVariantButton: {
        '&.MuiButton-outlined': {
            border: '1px solid ' + red[400]
        },
        '&.MuiButton-contained': {
            backgroundColor: red[400],
            color: theme.palette.primary.dark,
            '&:hover': {
                color: theme.palette.primary.dark
            }
        },
        color: red[400],
        '&.MuiButton-root:hover': {
            color: red[400]
        }
    },
    errorVariantIconButton: {
        '& svg': {
            color: red[400]
        }
    }
}));

// const ActionBtnParams = {
// 	text: "",
// 	startIcon: "",
// 	 endIcon: "cancel",
//     iconName:"cancel",
// 	isIconButton: false,
// 	disabled: false,
// 	variant: "outlined",
// 	colorVariant: "",
//     text:"Cancel",
//     title:"Cancel"
// }

function ActionButton({ screen_id, app_id, params, action_type, ...props }) {
    const classes = useStyles(params);
    const [notification, setNotification] = React.useState();
    const [notificationOpen, setNotificationOpen] = React.useState();
    const handleClick = () => {
        triggerActionHandler({
            screen_id,
            app_id,
            payload: {
                action_type,
                action_params: null,
                filter_state: JSON.parse(
                    sessionStorage.getItem('app_screen_filter_info_' + app_id + '_' + screen_id)
                )
            },
            callback: (d) => {
                if (d?.message) {
                    if (typeof d.message === 'string') {
                        setNotification({ message: d.message });
                        setNotificationOpen(true);
                    } else {
                        setNotification(d.message);
                        setNotificationOpen(true);
                    }
                    if (params?.navigate?.to) {
                        const DEFAULT_DELAY = 2000;
                        const inputDelayInMs = params.navigate.delayInMs;
                        const delayInMs =
                            inputDelayInMs || inputDelayInMs === 0 ? inputDelayInMs : DEFAULT_DELAY;
                        if (params.navigate.inAppNavigation) {
                            setTimeout(
                                () => props.history.push(`/${params.navigate.to}`),
                                delayInMs
                            );
                        } else {
                            setTimeout(
                                () =>
                                    window.open(
                                        `${window.location.origin}/${params.navigate.to}`,
                                        '_blank'
                                    ),
                                delayInMs
                            );
                        }
                    }
                }
            }
        });
    };
    function renderIcon(name) {
        switch (name) {
            case 'cancel':
                return (
                    <CancelIcon
                        className={
                            params.colorVariant === 'error'
                                ? classes.errorVariantIcon
                                : classes.icon
                        }
                        fontSize="large"
                    />
                );
            default:
                if (name?.url) {
                    return (
                        <img
                            alt={name?.name || 'altimg'}
                            src={name.url}
                            style={{ objectFit: 'cover', width: '2rem', height: '2rem' }}
                        />
                    );
                } else {
                    return null;
                }
        }
    }

    return (
        <>
            {params.isIconButton ? (
                <IconButton
                    className={params.colorVariant === 'error' && classes.errorVariantIconButton}
                    disabled={params.disabled}
                    size="small"
                    onClick={handleClick}
                    title={params.title}
                    aria-label={params.title}
                >
                    {renderIcon(params.iconName)}
                </IconButton>
            ) : (
                <Button
                    size="small"
                    title={params.title}
                    className={params.colorVariant === 'error' ? classes.errorVariantButton : null}
                    disabled={params.disabled}
                    variant={params.variant}
                    onClick={handleClick}
                    startIcon={params.startIcon && renderIcon(params.startIcon)}
                    endIcon={params.endIcon && renderIcon(params.endIcon)}
                    style={{
                        borderRadius: params.shape === 'rounded' ? 50 : null,
                        paddingLeft: '12px',
                        paddingRight: '12px'
                    }}
                    aria-label={params.text}
                >
                    {params.text}
                </Button>
            )}

            <CustomSnackbar
                open={notificationOpen && notification?.message}
                autoHideDuration={params?.notifications?.time || 3000}
                onClose={setNotificationOpen.bind(null, false)}
                severity={notification?.severity || 'success'}
                message={notification?.message}
                link={notification?.link}
            />
        </>
    );
}

export default withRouter(ActionButton);
