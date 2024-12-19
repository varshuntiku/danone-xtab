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
import CustomSnackbar from '../../CustomSnackbar';
import { Box, Grid } from '@material-ui/core';
import clsx from 'clsx';
import CodxCircularLoader from '../../CodxCircularLoader';
import { TextList } from '../../screenActionsComponent/actionComponents/TextList';
import { matchPath, withRouter } from 'react-router-dom';
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
        padding: theme.layoutSpacing(20),
        '& .MuiTypography-caption': {
            fontSize: '1.75rem'
        }
    },
    title: {
        fontFamily: theme.title.h1.fontFamily,
        fontWeight: 'normal',
        fontSize: theme.layoutSpacing(22),
        letterSpacing: theme.layoutSpacing(1),
        color: theme.palette.text.revamp,
        padding: `${theme.layoutSpacing(20)} ${theme.layoutSpacing(10)}`,
        height: '5.2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    innerTitle: {
        borderBottom: `1px solid ${theme.palette.border.loginGrid}`,
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
    titleWrapper: {
        background: theme.palette.background.pureWhite,
        padding: `0 ${theme.layoutSpacing(16)}`
    },
    closeButton: {
        // marginRight: 0,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        marginRight: '0 !important',
        '& svg': {
            fill: `${theme.palette.icons.closeIcon}!important`
        },
        '&:hover': {
            padding: '8px'
        }
    },
    closeIconWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 !important',
        '& .MuiIconButton-root': {
            marginRight: '0 !important'
        }
    },
    triggerButton: {},
    dialogPaper: {
        background: theme.palette.background.modelBackground,
        paddingRight: theme.layoutSpacing(12),
        backdropFilter: 'blur(2rem)',
        maxWidth: '90rem',
        borderRadius: 0,
        border: 'none',
        '& ::-webkit-scrollbar-thumb': {
            borderRadius: `${6 / 10.368}rem`,
            backdropFilter: `blur(${5 / 10.368}rem)`,
            border: '0.5px solid ' + `${theme.palette.border.dynamicFormScrollBar} !important`
        }
    },
    dialogContent: {
        paddingLeft: theme.layoutSpacing(44),
        paddingRight: theme.layoutSpacing(44),
        paddingTop: theme.layoutSpacing(40),
        '& .MuiGrid-item': {
            paddingTop: 0,
            paddingBottom: 0,
            '&:first-child h4': {
                paddingTop: 0
            }
        },
        '& .MuiGrid-container': {
            rowGap: theme.layoutSpacing(16)
        }
    },
    dialogAction: {
        paddingBottom: theme.layoutSpacing(28),
        paddingTop: theme.layoutSpacing(48),
        paddingRight: theme.layoutSpacing(44)
    },
    rightDrawerVariant: {
        justifyContent: 'flex-end',
        '& .MuiDialog-paper': {
            marginRight: 0,
            overflow: 'visible'
        },
        '& .MuiDialog-paperScrollPaper': {
            maxHeight: 'unset',
            height: 'calc(100% - 0.3rem)',
            borderRadius: 0
        }
    },
    dialogTitle: {
        background: theme.palette.background.modelBackground,
        padding: `${theme.layoutSpacing(0)} ${theme.layoutSpacing(12)}`,
        fontWeight: '500',
        fontSize: theme.layoutSpacing(22),
        letterSpacing: theme.layoutSpacing(1.2),
        minHeight: '5.2rem',
        display: 'flex',
        alignItems: 'center',
        '& .MuiGrid-container': {
            marginTop: '1rem',
            marginBottom: '1rem'
        },
        '& .MuiGrid-item': {
            padding: 0,
            alignItems: 'center'
        }
    }
}));

const deepClone = (d) => d && JSON.parse(JSON.stringify(d));

function getAppId() {
    const match = matchPath(window.location.pathname, {
        path: '/app/:app_id'
    });
    return match?.params?.app_id;
}

function DynamicFormModal({
    params,
    triggerButton,
    onAction,
    onValidateValueChangeInGridTable,
    onFetchFormData,
    preventDeepCloneOnStateUpdate,
    overrideClasses,
    ...props
}) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(params?.isDefaultOpen && true);
    const [data, setData] = React.useState(deepClone(params.form_config));
    const [initialParams, setInitialParams] = React.useState(params);
    const [notification, setNotification] = React.useState();
    const [notificationOpen, setNotificationOpen] = React.useState();
    const [processing, setProcessing] = React.useState(false);
    const [response, setResponse] = React.useState();
    const [loading, setLoading] = React.useState(false);
    const [key, setKey] = React.useState(0);
    const history = props.history;

    const handleClickOpen = async () => {
        setOpen(true);
        if (props.setDialogOpen) props.setDialogOpen(true);
        try {
            if (initialParams?.fetch_on_open) {
                setLoading(true);
                const response = await onFetchFormData(initialParams?.fetch_on_open);
                updateFormState(response);
            }
        } catch (err) {
            // console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (props.setDialogOpen) props.setDialogOpen(false);
        setOpen(false);
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
                if (preventDeepCloneOnStateUpdate) {
                    setData(d?.form_config);
                } else {
                    setData(deepClone(d?.form_config));
                }
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
        [history, preventDeepCloneOnStateUpdate]
    );

    useEffect(() => {
        if (!open && !initialParams.suppress_data_reset_on_close) {
            updateFormState(initialParams, true);
        }
    }, [open, initialParams, updateFormState]);

    useEffect(() => {
        updateFormState(params);
    }, [params, updateFormState]);
    // function to validate input fields and to show errors
    function validateInputFields(fields, d) {
        const values = fields.fields.filter(
            (el) => el.type === 'text' || el.type === 'select' || el.type === 'nav_types'
        );
        function ValidateEmail(email) {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
        }
        values.forEach((el) => {
            if (el.name === 'app_name' && d.app_name.trim() === '') {
                el['error'] = true;
                el['helperText'] = "We can't proceed without a valid Application Name";
            } else if (d.app_name) {
                delete el.error;
                delete el.helperText;
            }
            if (el.name === 'industry' && d.industry.length === 0) {
                el['error'] = true;
                el['helperText'] = "We can't proceed without a valid Industry";
            }
            if (el.name === 'function' && d.function.length === 0) {
                el['error'] = true;
                el['helperText'] = "We can't proceed without a valid Function";
            }
            if (el.name === 'contact_email') {
                if (!ValidateEmail(d.contact_email)) {
                    el['error'] = true;
                    el['helperText'] = "We can't proceed without a valid Email";
                }
            }
            if (el.name === 'nav_placement' && el?.value === null) {
                el['error'] = true;
                el['helperText'] = 'Kindly select a navigation placement type';
            }
        });
        setData({ ...data });
    }
    const handleAction = async (el) => {
        setResponse(null);
        if (el.is_cancel) {
            setOpen(false);
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
                            setNotificationOpen(true);
                        }
                    });
                } else {
                    if (el.text === 'Save & Edit Application') {
                        validateInputFields(data, d);
                    }
                    const resp = await onAction(el.name, d);
                    updateFormState(resp);
                    if (!resp?.error) {
                        setProcessing(false);
                        setOpen(false);
                    }
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
            {triggerButton ? (
                triggerButton(handleClickOpen)
            ) : (
                <Button
                    variant={initialParams?.trigger_button?.variant || 'outlined'}
                    size="small"
                    className={clsx(
                        initialParams?.trigger_button?.class_name,
                        classes.triggerButton,
                        overrideClasses?.triggerButton
                    )}
                    onClick={handleClickOpen}
                    startIcon={initialParams?.trigger_button?.start_icon}
                    aria-label="Open dialog"
                >
                    {initialParams?.trigger_button?.text || 'Click'}
                </Button>
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
                aria-labelledby="dynamic-form-dialog-title"
                TransitionComponent={params.variant === 'right-drawer' ? Slide : undefined}
                TransitionProps={
                    params.variant === 'right-drawer'
                        ? {
                              direction: 'left'
                          }
                        : undefined
                }
                aria-describedby="dynamic-form-dialog-content"
            >
                {open && (
                    <React.Fragment>
                        <DialogTitle
                            id="dynamic-form-dialog-title"
                            onClose={handleClose}
                            variant={params.variant}
                            className={classes.dialogTitle}
                        >
                            {initialParams?.dialog?.title || 'Form'}
                        </DialogTitle>
                        <DialogContent
                            id="dynamic-form-dialog-content"
                            className={classes.dialogContent}
                        >
                            {loading ? (
                                <CodxCircularLoader size={60} center />
                            ) : (
                                <DynamicForm
                                    key={key}
                                    onChange={setData}
                                    params={data}
                                    extraParamsMapping={response?.extraParamsMapping}
                                    onValidateValueChangeInGridTable={
                                        onValidateValueChangeInGridTable
                                    }
                                    onClickActionButton={(el) => handleAction(el)}
                                    onValidation={(actionName) =>
                                        handleAction({ name: actionName })
                                    }
                                />
                            )}
                        </DialogContent>
                        <DialogActions className={classes.dialogAction}>
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
                                    style={el?.style}
                                    aria-label={el.text || el.name || 'Click'}
                                >
                                    {el.text || el.name || 'Click'}
                                </Button>
                            ))}
                        </DialogActions>
                    </React.Fragment>
                )}
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
            <div className={classes.innerTitle}>
                <Grid container spacing={2}>
                    <Grid item xs={true} style={{ display: 'flex' }}>
                        <Typography className={classes.title}>{children}</Typography>
                    </Grid>
                    <Grid item xs="auto" className={classes.closeIconWrapper}>
                        {onClose ? (
                            <IconButton
                                aria-label="close"
                                // className={classes.closeButton}
                                onClick={onClose}
                                title="close"
                            >
                                <CloseIcon className={classes.closeButton} />
                            </IconButton>
                        ) : null}
                    </Grid>
                </Grid>
            </div>
        </MuiDialogTitle>
    );
};

export default withRouter(DynamicFormModal);
