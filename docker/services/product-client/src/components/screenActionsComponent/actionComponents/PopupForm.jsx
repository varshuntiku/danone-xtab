import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '../../../assets/Icons/CloseBtn';
import IconButton from '@material-ui/core/IconButton';
import DynamicForm, { mapValue } from '../../dynamic-form/dynamic-form';
import { triggerActionHandler } from '../../../services/screen';
import CustomSnackbar from '../../CustomSnackbar';
import { TextList } from './TextList';
import { Box } from '@material-ui/core';
import clsx from 'clsx';
import CodxCircularLoader from '../../CodxCircularLoader';
import DialogContentText from '@material-ui/core/DialogContentText';
import { matchPath, withRouter } from 'react-router-dom';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import RemoveIcon from '@material-ui/icons/Remove';
import { Slide } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    form: {
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        width: 'fit-content'
    },
    formControl: {
        marginTop: theme.spacing(2),
        minWidth: 120
    },
    formControlLabel: {
        marginTop: theme.spacing(1)
    },
    dialogWrapper: {
        '& .MuiDialogContent-root': {
            // background: theme.palette.primary.main,
        }
    },
    root: {
        margin: 0,
        padding: theme.spacing(2),
        '& .MuiTypography-caption': {
            fontSize: '1.75rem'
        }
    },
    title: {
        fontFamily: theme.title.h1.fontFamily,
        fontWeight: '500',
        fontSize: theme.layoutSpacing(22),
        letterSpacing: theme.layoutSpacing(1.2),
        color: theme.palette.text.titleText,
        borderBottom: `1px solid ${theme.palette.border.loginGrid}`,
        padding: `${theme.layoutSpacing(20)} ${theme.layoutSpacing(4)}`,
        height: '5.3rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        '& .MuiGrid-container': {
            margin: 0
        },
        '& .MuiGrid-item': {
            padding: 0,
            alignItems: 'center'
        }
    },
    dialogTitle: {
        fontFamily: theme.title.h1.fontFamily,
        fontWeight: '500',
        paddingLeft: theme.layoutSpacing(5),
        fontSize: theme.layoutSpacing(22),
        letterSpacing: '1px !important',
        color: theme.palette.text.titleText
    },
    titleWrapper: {
        background: theme.palette.background.pureWhite,
        padding: `0 ${theme.layoutSpacing(16)}`
    },
    closeButton: {
        marginRight: 0,
        padding: 0,
        '& svg': {
            fill: `${theme.palette.icons.closeIcon}!important`
        }
    },
    triggerButton: {},
    drawerIcon: {
        color: theme.palette.primary.contrastText,
        position: 'absolute',
        transform: 'translate(0x)',
        padding: theme.spacing(1),
        zIndex: '4',
        borderRadius: 0,
        borderBottomLeftRadius: '50%',
        borderTopLeftRadius: '50%',
        backgroundColor: `${theme.palette.icons.closeIcon} !important`,
        boxShadow: '-2px 2px 4px 0px #01010333',
        '& svg': {
            fill: theme.palette.text.btnTextColor + ' !important',
            position: 'relative',
            right: theme.layoutSpacing(2.3)
        }
    },
    drawerIconInView: {
        transform: `translate(${theme.layoutSpacing(-16)})`,
        backgroundColor: `${theme.palette.background.modelBackground} !important`,
        '& svg': {
            fill: theme.palette.text.default + ' !important',
            right: `${theme.layoutSpacing(-4)}`
        }
    },
    dialogContentWrapper: {
        padding: `${theme.layoutSpacing(40)} ${theme.layoutSpacing(44)} ${theme.layoutSpacing(28)}`,
        '& .MuiGrid-item': {
            padding: 0,
            '&:first-child h4': {
                paddingTop: 0
            }
        }
    },
    dialogPaper: {
        background: theme.palette.background.pureWhite,
        backdropFilter: 'blur(2rem)',
        paddingRight: theme.layoutSpacing(12),
        maxWidth: theme.layoutSpacing(854),
        borderRadius: 0,
        '& ::-webkit-scrollbar-thumb': {
            borderRadius: `${6 / 10.368}rem`,
            backdropFilter: `blur(${5 / 10.368}rem)`,
            border: '0.5px solid ' + `${theme.palette.border.dynamicFormScrollBar} !important`
        }
    },
    rightDrawerVariant: {
        justifyContent: 'flex-end',
        '& .MuiDialog-paper': {
            marginRight: 0,
            overflow: 'visible',
            border: 'none'
        },
        '& .MuiDialog-paperScrollPaper': {
            maxHeight: 'unset',
            height: 'calc(100% - 0.3rem)',
            borderRadius: 0
        },
        dialogContent: {
            marginBottom: 0
        },
        closeIcon: {
            '&.MuiSvgIcon-root': {
                color: theme.palette.text.titleText
            }
        },
        dialogActionSection: {
            paddingTop: theme.layoutSpacing(20),
            paddingBottom: theme.layoutSpacing(28),
            '& .MuiButton-outlined': {
                color: theme.palette.border.buttonOutline + '!important',
                borderColor: theme.palette.border.buttonOutline + '!important'
            },
            '& .MuiButton-contained': {
                backgroundColor: theme.palette.border.buttonOutline
            }
        }
    },
    customDialogTitle: {
        background: theme.palette.background.pureWhite,
        marginBottom: '1rem',
        padding: `${theme.layoutSpacing(0)} ${theme.layoutSpacing(10)}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        '& .MuiGrid-container': {
            margin: 0
        },
        '& .MuiGrid-item': {
            padding: 0,
            alignItems: 'center'
        }
    },
    iconGroup: {
        position: 'relative',
        '&:hover': {
            '& $removeIcon': {
                visibility: 'visible'
            }
        }
    },
    removeIcon: {
        position: 'absolute',
        left: -15,
        zIndex: 10,
        top: -6,
        cursor: 'pointer',
        visibility: 'hidden',
        backgroundColor: theme.palette.background.drawerRemoveIcon,
        borderRadius: '50%',
        '& svg': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }
    },
    removeIconSvg: {
        fill: theme.palette.text.default
    }
}));

const deepClone = (d) => d && JSON.parse(JSON.stringify(d));

function getAppId() {
    const match = matchPath(window.location.pathname, {
        path: '/app/:app_id'
    });
    return match?.params?.app_id;
}

export function PopupForm({
    screen_id,
    app_id,
    params,
    action_type,
    isOutSideTrigger,
    handleIsOpen,
    ...props
}) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [data, setData] = React.useState(deepClone(params.form_config));
    const [initialParams, setInitialParams] = React.useState(params);
    const [notification, setNotification] = React.useState();
    const [notificationOpen, setNotificationOpen] = React.useState();
    const [processing, setProcessing] = React.useState(false);
    const [response, setResponse] = React.useState();
    const [loading, setLoading] = React.useState(false);
    const [key, setKey] = React.useState(0);
    const [drawerIconInView, setDrawerIconinView] = React.useState(false);
    // eslint-disable-next-line no-unused-vars
    const [fetchedOnLoad, setFetchedOnLoad] = React.useState(false);
    const history = props.history;

    const handleClickOpen = () => {
        setDrawerIconinView(true);
    };
    const openDrawer = () => {
        setOpen(true);
        if (handleIsOpen) handleIsOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        if (handleIsOpen) handleIsOpen(false);
    };

    const updateFormState = React.useCallback(
        (d, suppressInitialParamsUpdate) => {
            if (typeof d.error === 'string') {
                setResponse({
                    extraParamsMapping: d.extraParamsMapping,
                    error: true,
                    info: {
                        ...d?.info,
                        list: [{ text: d.error, color: 'error' }, ...(d?.info?.list || [])]
                    }
                });
            } else {
                setResponse({
                    extraParamsMapping: d.extraParamsMapping,
                    error: d.error,
                    info: d.info
                });
            }
            if (d?.form_config) {
                setData(deepClone(d?.form_config));
                setKey((s) => s + 1);
            }
            if (d?.message) {
                if (typeof d.message === 'string') {
                    setNotification({ message: d.message });
                    setNotificationOpen(true);
                } else {
                    setNotification(d.message);
                    setNotificationOpen(true);
                }
            }
            if (!suppressInitialParamsUpdate) {
                setInitialParams((s) => ({ ...s, ...d }));
            }
            if (d?.navigate?.to) {
                const appId = getAppId();
                history.push('/app/' + appId + '/' + d.navigate.to, {
                    filterState: d?.navigate?.filterState,
                    hideFilter: d?.navigate?.hideFilter
                });
            }
        },
        [history]
    );

    useEffect(() => {
        if (isOutSideTrigger !== undefined) {
            handleClickOpen();
        }
    }, []);

    useEffect(() => {
        setData(deepClone(params.form_config));
        setInitialParams(params);
    }, [params]);

    useEffect(() => {
        if (!open && !initialParams.suppress_data_reset_on_close) {
            updateFormState(initialParams, true);
        }
    }, [open, initialParams, updateFormState]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await triggerActionHandler({
                    screen_id,
                    app_id,
                    payload: {
                        action_type,
                        action_param: null,
                        filter_state: JSON.parse(
                            sessionStorage.getItem(
                                'app_screen_filter_info_' + app_id + '_' + screen_id
                            )
                        )
                    }
                });
                updateFormState(result);
            } catch (err) {
                // console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (initialParams.fetch_on_open && open) {
            fetchData();
        }

        setFetchedOnLoad((s) => {
            if (initialParams.fetch_on_load && !s) {
                fetchData();
                return true;
            } else {
                return s;
            }
        });
    }, [
        action_type,
        app_id,
        initialParams.fetch_on_open,
        initialParams.fetch_on_load,
        screen_id,
        open,
        updateFormState
    ]);

    const triggerAction = async (action_type, actionButton, data, callback) => {
        try {
            await triggerActionHandler({
                screen_id,
                app_id,
                payload: {
                    action_type,
                    action_param: {
                        action: actionButton.name,
                        data
                    },
                    filter_state: JSON.parse(
                        sessionStorage.getItem('app_screen_filter_info_' + app_id + '_' + screen_id)
                    )
                },
                callback
            });
        } catch (error) {
            throw error;
        }
    };

    const handleValidateValueChangeInGridTable = async (params) => {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                await triggerActionHandler({
                    screen_id,
                    app_id,
                    payload: {
                        action_type: params.validator,
                        action_param: params,
                        filters: JSON.parse(
                            sessionStorage.getItem(
                                'app_screen_filter_info_' + app_id + '_' + screen_id
                            )
                        )
                    },
                    callback: (d) => {
                        resolve(d);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    };

    const mandatoryFieldsValidation = async (validationData) => {
        let emptyRequiredFields = validationData.filter((field) => {
            if (field.required) {
                if ('value' in field) {
                    let val = field.value;
                    if (val.length == 0) return true;
                    else if (typeof val === 'string') {
                        return val.trim().length == 0;
                    }
                } else return true;
            }
        });
        return emptyRequiredFields;
    };

    const handleAction = async (el, opened) => {
        setResponse(null);
        if (el.is_cancel) {
            setOpen(false);
            if (handleIsOpen) handleIsOpen(false);
        } else if (el.is_reset) {
            updateFormState(initialParams, true);
        } else if (el.is_submit) {
            const validationData = data['fields'];
            await mandatoryFieldsValidation(validationData).then((result) => {
                if (result.length == 0) {
                    setOpen(false);
                    if (handleIsOpen) handleIsOpen(false);
                    setNotification({ message: 'Form submitted successfully' });
                    setNotificationOpen(true);
                } else {
                    validationData.forEach((element) => {
                        if (result.includes(element)) {
                            element.error = true;
                            element.helperText = 'Mandatory Field missing';
                        } else {
                            element.error = false;
                            element.helperText = '';
                        }
                    });
                }

                updateFormState(validationData);
            });
        } else {
            const d = mapValue(data?.fields);
            setProcessing(true);
            try {
                if (el.callback && el.parent_obj) {
                    el.parent_obj[el.callback]({
                        payload: {
                            data: d
                        },
                        callback: (d) => {
                            setNotification(d);
                            setOpen(false);
                            if (handleIsOpen) handleIsOpen(false);
                            setNotificationOpen(true);
                        }
                    });
                } else {
                    await triggerAction(action_type, el, d, (d) => {
                        updateFormState(d);
                        if (!d?.error) {
                            setOpen(false || opened);
                            if (handleIsOpen) handleIsOpen(false || opened);
                            setProcessing(false);
                        }
                    });
                }
            } catch (error) {
                // console.error(error);
            } finally {
                setProcessing(false);
            }
        }
    };

    return (
        <React.Fragment>
            {!isOutSideTrigger && (
                <React.Fragment>
                    {initialParams?.trigger_button?.float ? (
                        <div className={drawerIconInView ? classes.iconGroup : ''}>
                            <div
                                className={classes.removeIcon}
                                onClick={() => setDrawerIconinView(false)}
                            >
                                <RemoveIcon size="large" className={classes.removeIconSvg} />
                            </div>
                            <IconButton
                                className={`${classes.drawerIcon} ${
                                    drawerIconInView ? classes.drawerIconInView : ''
                                }`}
                                onClick={!drawerIconInView ? openDrawer : handleClickOpen}
                                aria-label="Open drawer"
                            >
                                <ArrowBackIosIcon fontSize="large" />
                            </IconButton>
                        </div>
                    ) : (
                        <Button
                            variant={initialParams?.trigger_button?.variant || 'outlined'}
                            size="small"
                            className={clsx(
                                initialParams?.trigger_button?.class_name,
                                classes.triggerButton
                            )}
                            onClick={!drawerIconInView ? openDrawer : handleClickOpen}
                            startIcon={initialParams?.trigger_button?.start_icon}
                        >
                            {initialParams?.trigger_button?.text || 'Click'}
                        </Button>
                    )}
                </React.Fragment>
            )}
            <Dialog
                classes={{
                    container: clsx(
                        params.variant === 'right-drawer' ? classes.rightDrawerVariant : null
                    ),
                    paper: classes.dialogPaper
                }}
                fullWidth={true}
                maxWidth={initialParams?.dialogMaxWidth || 'md'}
                open={open}
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                TransitionComponent={params.variant === 'right-drawer' ? Slide : undefined}
                TransitionProps={
                    params.variant === 'right-drawer'
                        ? {
                              direction: 'left'
                          }
                        : undefined
                }
                aria-describedby="customized-dialog-content "
            >
                <DialogTitle
                    id="customized-dialog-title"
                    onClose={handleClose}
                    variant={params.variant}
                    className={classes.customDialogTitle}
                >
                    {initialParams?.dialog?.title || 'Form'}
                </DialogTitle>
                <DialogContent
                    id="customized-dialog-content"
                    className={classes.dialogContentWrapper}
                >
                    <DialogContentText
                        id="customized-dialog-description"
                        className={classes.dialogContent}
                    >
                        {loading ? (
                            <CodxCircularLoader size={60} center />
                        ) : (
                            <DynamicForm
                                key={key}
                                onChange={setData}
                                params={data}
                                screen_id={screen_id}
                                app_id={app_id}
                                extraParamsMapping={response?.extraParamsMapping}
                                onValidateValueChangeInGridTable={
                                    handleValidateValueChangeInGridTable
                                }
                                onClickActionButton={(el) => handleAction(el)}
                                onValidation={(actionName) =>
                                    handleAction({ name: actionName }, true)
                                }
                            />
                        )}
                    </DialogContentText>
                </DialogContent>
                {response?.info ||
                (initialParams?.dialog_actions && initialParams?.dialog_actions.length) ? (
                    <DialogActions className={classes.dialogActionSection}>
                        {response?.info ? (
                            <Box marginRight="5rem">
                                <TextList params={response?.info} />
                            </Box>
                        ) : null}
                        {initialParams?.dialog_actions?.map((el) => (
                            <Button
                                key={el.text || el.name || 'Click'}
                                disabled={processing || loading}
                                onClick={handleAction.bind(null, el)}
                                variant={el.variant || 'outlined'}
                                size={el.size}
                                aria-label={el.text || el.name || 'Click'}
                            >
                                {el.text || el.name || 'Click'}
                            </Button>
                        ))}
                    </DialogActions>
                ) : null}
            </Dialog>
            <CustomSnackbar
                open={notificationOpen && notification?.message}
                autoHideDuration={initialParams?.notifications?.time || 3000}
                onClose={setNotificationOpen.bind(null, false)}
                severity={notification?.severity || 'success'}
                message={notification?.message}
                link={notification?.link}
            />
        </React.Fragment>
    );
}

const DialogTitle = (props) => {
    const classes = useStyles();
    const { children, onClose, ...other } = props;
    return (
        <MuiDialogTitle
            disableTypography
            className={`${classes.root} ${classes.titleWrapper}`}
            {...other}
        >
            <div className={classes.title}>
                <Typography variant="h6" className={classes.dialogTitle}>
                    {children}
                </Typography>
                {onClose ? (
                    <IconButton
                        aria-label="close"
                        className={classes.closeButton}
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </IconButton>
                ) : null}
            </div>
        </MuiDialogTitle>
    );
};

export default withRouter(PopupForm);
