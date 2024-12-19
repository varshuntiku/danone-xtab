import React, { Fragment, useState } from 'react';
import { makeStyles, Grid, Button /*, withStyles, Slide*/ } from '@material-ui/core';
import CreateAlertForm from './CreateAlertForm';
import Alerts from './Alerts';
import { createAlert, getAlertsByWidget, deleteAlert, updateAlert } from '../../services/alerts';
import CodxPopupDialog from '../custom/CodxPoupDialog';
import CustomSnackbar from '../CustomSnackbar';
import { ReactComponent as AlertButtonIcon } from 'assets/img/alert-btn.svg';
import { logMatomoEvent } from '../../services/matomo';
import { connect } from 'react-redux';
/* styles for alert dialog */
const styles = makeStyles((theme) => ({
    alertBtn: {
        cursor: 'pointer',
        '& #alertSVGPath': {
            stroke: theme.palette.primary.contrastText
        },
        '& #alertSVGCircle': {
            stroke: theme.palette.primary.contrastText
        }
    },
    snack: {
        color: '#FFFFFF',
        width: '30vw',
        '& .MuiSnackbarContent-root': {
            backgroundColor: theme.palette.background.table,
            width: '80%',
            fontSize: '1.5rem'
        },
        '& .MuiSnackbarContent-message': {
            color: theme.palette.text.breadcrumbText
        }
    },
    snackbarCloseButton: {
        '& .MuiIconButton-label svg': {
            color: theme.palette.text.breadcrumbText
        }
    }
}));

const dialogStyles = makeStyles((theme) => ({
    dialogPaper: {
        background: theme.palette.background.modelBackground,
        backdropFilter: 'blur(2rem)',
        border: 'none !important',
        borderRadius: `0 !important`,
        width: '70%'
    },
    dialogRoot: {
        margin: 0,
        padding: '1rem 1rem 1rem 3.1rem',
        '& .MuiTypography-caption': {
            fontSize: '1.75rem'
        },
        // background: theme.palette.background.paper,
        background: theme.palette.background.modelBackground,
        display: 'flex',
        justifyContent: 'space-between'
    },
    dialogTitle: {
        fontSize: `${theme.layoutSpacing(22)} !important`,
        letterSpacing: '0.2rem',
        fontWeight: '400',
        fontFamily: theme.title.h1.fontFamily,
        color: `${theme.palette.text.revamp} !important`,
        opacity: '1',
        alignSelf: 'center'
    },
    dialogContentSection: {
        background: theme.palette.background.modelBackground,
        '&.MuiDialogContent-dividers': {
            borderBottomColor: theme.palette.border.loginGrid,
            borderTopColor: theme.palette.border.loginGrid
        },

        padding: 0,
        overflow: 'hidden'
    },
    dialogContent: {
        color: theme.palette.text.titleText,
        fontSize: '1.75rem',
        marginBottom: 0
    },
    closeIcon: {
        '& svg': {
            fill: `${theme.palette.icons.closeIcon}!important`
        }
    },
    closeButton: {
        '& svg': {
            fill: `${theme.palette.icons.closeIcon}!important`
        }
    }
    // dialogActionSection: {
    //     '& .MuiButton-outlined': {
    //         color: theme.palette.border.buttonOutline + '!important',
    //         borderColor: theme.palette.border.loginGrid + '!important'
    //     },
    //     '& .MuiButton-contained': {
    //         // backgroundColor: theme.palette.border.buttonOutline
    //     }
    // }
}));

function AlertDialog(props) {
    const [open, setOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [createAlerts, setCreateAlerts] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [message, setMessage] = useState('');
    const classes = styles();
    const dialogClasses = dialogStyles();
    const [alertSelected, setAlertSelected] = useState(false);
    const [alertData, setAlertData] = useState({
        title: '',
        category: ' ',
        condition: ' ',
        threshold: '',
        users: [],
        receive_notification: true
    });
    const [isError, setIsError] = useState({
        title: false,
        category: false,
        condition: false,
        threshold: false
    });
    const [updateDisabled, setUpdateDisabled] = useState(false);
    // const { trackEvent } = useMatomo()

    const getCategoryData = (alert_categories) => {
        const alert_category = [];
        if (alert_categories)
            // eslint-disable-next-line no-unused-vars
            Object.entries(alert_categories).forEach(([key, value]) => {
                alert_category.push(value);
            });
        return alert_category;
    };

    /* get created alert for widget on alert dialog pop-up */
    const clickOpenHandler = () => {
        getAlertsByWidgetId();
        setOpen(true);
    };

    const getAlertsByWidgetId = () => {
        const filterData = {
            filter_data: JSON.parse(
                sessionStorage.getItem(
                    'app_screen_filter_info_' + props.app_id + '_' + props.app_screen_id
                )
            )
        };
        getAlertsByWidget({
            widgetId: props.app_screen_widget_id,
            payload: filterData,
            callback: onResponseGetWidgetAlert
        });
    };

    const onResponseGetWidgetAlert = (data) => {
        setCreateAlerts([...data]);
        setTimeout(() => {
            setUpdateDisabled(false);
        }, 6000);
    };
    /* alert dialog close handler */
    const clickCloseHandler = (reason = '') => {
        if (reason === 'backdropClick') return;
        setOpen(false);
        resetData();
    };

    /* alert creation handler */
    const pushAlertHandler = () => {
        if (
            alertData.title === '' ||
            alertData.category === ' ' ||
            alertData.condition === ' ' ||
            alertData.threshold === '' /* || alertData.users.length === 0 */
        ) {
            inputCheck();
            return;
        }
        const alert = {
            title: alertData.title,
            message: null,
            filter_data: sessionStorage.getItem(
                'app_screen_filter_info_' + props.app_id + '_' + props.app_screen_id
            ),
            category: alertData.category,
            condition: alertData.condition,
            threshold: Number(alertData.threshold),
            app_id: props.app_id,
            app_screen_id: props.app_screen_id,
            app_screen_widget_id: props.app_screen_widget_id,
            receive_notification: alertData.receive_notification,
            active: true,
            alert_source_type: props.source,
            alert_widget_type: props.alert_widget_type,
            widget_value: props.widget_value,
            users: alertData.users,
            widget_url: window.location.href
        };
        createAlert({
            payload: alert,
            callback: onResponseCreateAlert
        });
    };

    const onResponseCreateAlert = () => {
        getAlertsByWidgetId();
        logMatomoEvent({
            e_c: 'AlertModule',
            e_a: 'success-create-alert-action',
            action_name: 'App',
            ca: 1,
            url: window.location.href,
            // urlref: window.location.href,
            pv_id: props.matomo.pv_id
        });
        showSnackbar('Successfully created an Alert');
        resetData();
    };
    /* alert updation handler */
    const modifyAlertHandler = () => {
        if (
            alertData.title === '' ||
            alertData.category === ' ' ||
            alertData.condition === ' ' ||
            alertData.threshold === '' /* || alertData.users.length === 0 */
        ) {
            inputCheck();
            return;
        }
        const updatedAlert = {
            title: alertData.title,
            message: null,
            category: alertData.category,
            condition: alertData.condition,
            threshold: Number(alertData.threshold),
            receive_notification: alertData.receive_notification,
            active: true,
            widget_value: props.widget_value,
            users: alertData.users
        };
        updateAlert({
            alertId: selectedId,
            payload: updatedAlert,
            callback: onResponseUpdateAlert
        });
    };

    const onResponseUpdateAlert = () => {
        setUpdateDisabled(true);
        getAlertsByWidgetId();
        logMatomoEvent({
            e_c: 'AlertModule',
            e_a: 'success-event-edit-alert',
            e_n: 'Alert',
            action_name: 'AlertDialog',
            ca: 1,
            url: window.location.href,
            pv_id: props.matomo.pv_id
        });
        showSnackbar('Successfully updated the Alert');
    };
    /* alert deletion handler */
    const removeAlertHandler = (alertId) => {
        deleteAlert({
            alertId: alertId,
            callback: onResponseDeleteAlert
        });
    };

    const onResponseDeleteAlert = () => {
        getAlertsByWidgetId();
        showSnackbar('Successfully deleted the Alert');
        resetData();
    };
    /* set selected alert details on clicking the alert */
    const alertClickedHandler = (alert) => {
        setAlertData(alert);
        setAlertSelected(true);
        setIsError({
            title: false,
            category: false,
            condition: false,
            threshold: false
        });
    };
    /* snackbar close handler */
    // const handleClose = () => {
    //     setSnackbarOpen(false);
    // };
    /* resetting the selected Alert value */
    const resetData = () => {
        setSelectedId(null);
        setAlertSelected(false);
        setAlertData({
            title: '',
            category: ' ',
            condition: ' ',
            threshold: '',
            users: [],
            receive_notification: true
        });
        setIsError({
            title: false,
            category: false,
            condition: false,
            threshold: false
        });
    };
    /* show snackbar */
    const showSnackbar = (message) => {
        setMessage(message);
        setSnackbarOpen(true);
    };
    const inputCheck = () => {
        setIsError({
            ...isError,
            title: alertData.title === '',
            category: alertData.category === ' ',
            condition: alertData.condition === ' ',
            threshold: alertData.threshold === ''
        });
    };

    const alertDialogContent = (
        <Fragment>
            <Grid container spacing={0} maxWidth="xl" className="grids">
                <CreateAlertForm
                    categories={getCategoryData(props.category)}
                    widget_name={props.widget_name}
                    createAlert={alertData}
                    setCreateAlert={setAlertData}
                    isError={isError}
                    setIsError={setIsError}
                    alertSelected={alertSelected}
                    resetForm={resetData}
                    user_admin={props.alert_admin_user}
                    logged_in_user_info={props.logged_in_user_info}
                />
                <Alerts
                    alerts={createAlerts}
                    selectedAlertId={selectedId}
                    selectAlert={setSelectedId}
                    alertClicked={alertClickedHandler}
                    deleteAlert={removeAlertHandler}
                />
            </Grid>
        </Fragment>
    );

    const alertDialogActions = (
        <Fragment>
            <Button variant="outlined" onClick={clickCloseHandler} aria-label="Cancel">
                Cancel
            </Button>
            <Button
                aria-label="Create Alert"
                variant="contained"
                onClick={alertSelected ? modifyAlertHandler : pushAlertHandler}
                disabled={alertSelected ? updateDisabled : false}
            >
                {alertSelected ? 'Update Alert' : 'Create Alert'}
            </Button>
        </Fragment>
    );

    // const TransitionComponent = (props) => {
    //   return <Slide {...props} direction="down" />;
    // }

    // const snackbarContent = (
    //     <Snackbar
    //         open={snackbarOpen}
    //         autoHideDuration={3000}
    //         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    //         message={message}
    //         onClose={() => setSnackbarOpen(false)}
    //         className={classes.snack}
    //         action={
    //             <IconButton
    //                 size="large"
    //                 aria-label="close-snackbar"
    //                 className={classes.snackbarCloseButton}
    //                 onClick={handleClose}
    //             >
    //                 <CloseIcon fontSize="large" />
    //             </IconButton>
    //         }
    //     />
    // );

    const snackbarContent = (
        <CustomSnackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            onClose={() => setSnackbarOpen(false)}
            message={message}
            severity="success"
        />
    );

    return (
        <Fragment>
            <AlertButtonIcon
                aria-label="alert"
                className={classes.alertBtn}
                title="alert"
                onClick={clickOpenHandler}
            />
            <CodxPopupDialog
                open={open}
                setOpen={setOpen}
                onClose={clickCloseHandler}
                dialogTitle="Alert"
                dialogContent={alertDialogContent}
                dialogActions={alertDialogActions}
                maxWidth="md"
                sectionDivider={true}
                dialogClasses={dialogClasses}
                reason="backdropClick"
                snackbar={snackbarContent}
            />
        </Fragment>
    );
}

const mapStateToProps = (state) => {
    return {
        matomo: state.matomo
    };
};

export default connect(mapStateToProps, null, null, { forwardRef: true })(AlertDialog);
