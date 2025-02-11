import { IconButton, makeStyles, Paper, Typography } from '@material-ui/core';
import React, { Fragment, useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AppWidgetGraph from './AppWidgetGraph';
import CustomFlipComponent from './customFlipComponent/CustomFlipComponent';
import { getWidget, getMultiWidget } from 'services/widget.js';
import Skeleton from '@material-ui/lab/Skeleton';
import RepeatRoundedIcon from '@material-ui/icons/RepeatRounded';
import AppWidgetSwitchView from './AppWidgetSwitchView';
import { SelectedIndexProvider } from '../context/SelectedIndexContext.jsx';
import CustomSnackbar from './CustomSnackbar';
import CodxCircularLoader from './CodxCircularLoader';
import EditIcon from '@material-ui/icons/Edit';
import AppWidgetDropdownView from './AppWidgetDropdownView';
import PlanogramShelf from './Planogram/PlanogramShelf';
import DigitalTwin from './DigitalTwin/DigitalTwin';
import ErrorIcon from '@material-ui/icons/Error';
import { setActiveScreenWidgetsDetails, setUpdatedWidgetsIds } from 'store/index';
import AppWidgetGraphOld from './AppWidgetGraphOld';

const useStyles = makeStyles((theme) => ({
    comp: {
        width: '100%',
        height: '100%',
        background: theme.palette.primary.dark
    },
    widgetContent: {
        width: '100%',
        height: '100%',
        borderRadius: theme.spacing(1),
        position: 'relative',
        zIndex: 1
    },
    skeletonWave: {
        background: '#C4C4C4 ',
        opacity: '10%',
        borderRadius: theme.spacing(1),
        '&:after': {
            animation: 'MuiSkeleton-keyframes-wave 0.6s linear 0s infinite'
        }
    },
    skeletonContainer: {
        display: 'flex',
        height: '100%',
        width: '100%',
        background: '#c4c4c421',
        borderRadius: theme.spacing(1),
        '&:after': {
            animation: 'MuiSkeleton-keyframes-wave 0.6s linear 0s infinite'
        }
    },
    skeletonErrorTxt: {
        fontSize: '12px',
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'center',
        color: '#c73841',
        alignItems: 'center',
        display: 'flex',
        fontWeight: '300'
    },
    skeletonErrorIcon: {
        marginRight: '0.5rem',
        marginTop: '0.2rem',
        color: '#c73841'
    },
    wiggle: {
        animation: `$wiggle 2s ease 1.5s`
    },
    '@keyframes wiggle': {
        '0%': { transform: 'translate(1px, 1px) rotate(0deg)' },
        '10%': { transform: 'translate(-1px, -2px) rotate(-5deg) scale(1.1)' },
        '20%': { transform: 'translate(-3px, 0px) rotate(5deg) scale(1.2)' },
        '30%': { transform: 'translate(3px, 2px) rotate(0deg) scale(1.3)' },
        '40%': { transform: 'translate(1px, -1px) rotate(5deg) scale(1.4)' },
        '50%': { transform: 'translate(-1px, 2px) rotate(-5deg) scale(1.5)' },
        '60%': { transform: 'translate(-3px, 1px) rotate(0deg) scale(1.4)' },
        '70%': { transform: 'translate(3px, 1px) rotate(-5deg) scale(1.3)' },
        '80%': { transform: 'translate(-1px, -1px) rotate(5deg) scale(1.2)' },
        '90%': { transform: 'translate(1px, 2px) rotate(0deg) scale(1.1)' },
        '100%': { transform: 'translate(1px, -2px) rotate(-5deg)' }
    }
}));
/**
 * Renders different types of widget graphs or tables on screen depending on the widget data
 * @summary It takes widget data and depending on the params it renders either flip component or switch component
 * @param {object} props - key, parent_obj, app_id, title, selected_filters, simulator_apply, graph_height, screen_filter_settings, alert_enable, source
 */
const AppWidgetComponent = React.memo((props) => {
    const classes = useStyles();
    const ref = React.useRef();
    const dispatch = useDispatch();
    const [widgetDetails, setWidgetDetails] = React.useState(props.details);
    const [widgetData, setWidgetData] = React.useState(null);
    const [loading, setloading] = React.useState(false);
    const {
        app_id,
        screen_id,
        details,
        selected_filters,
        screen_filter_settings,
        screen_filters_values,
        isEditing,
        selectedScenario,
        scenerioname,
        setIsEditingParent,
        widgetComment,
        updateWidgetComment,
        shouldOpenLibrary
    } = props;
    const [notification, setNotification] = React.useState();
    const [notificationOpen, setNotificationOpen] = React.useState();
    const [widgetWithNoAction, setWidgetWithNoAction] = React.useState();
    const [widgetMsg, setWidgetMsg] = useState('');
    const dataStateKeyRef = React.useRef();
    const widgetState = useSelector((state) => state.appScreen);
    const activeScreenWidgetsDetails = useSelector((state) => state.appScreen);
    const updatedWidgetsIds = useSelector((state) => state.appScreen.updatedWidgetsIds);

    const setSimulatorTrigger = useCallback(
        (val) => {
            props.simulatorInvoke(val);
        },
        [props]
    );

    React.useEffect(() => {
        const screen_shared_data = widgetData?.data?.value?.screen_navigation_data;
        const widget_With_no_action = widgetData?.data.value?.current_action === null;
        setWidgetWithNoAction(widget_With_no_action);
        if (screen_shared_data) props.setScreenProgressData(screen_shared_data);
        if (widget_With_no_action) props.onProgressActionComplete({ completed_action: null });
        if(widgetData?.data?.value?.compare_scenario)props.parent_obj.setCompareScenario(widgetData?.data?.value?.compare_scenario)

        dataStateKeyRef.current = widgetData?.data?.value?.data_state_key;
    }, [widgetData]);

    React.useLayoutEffect(() => {
        const progress_bar_config_details = widgetData?.data?.value?.progress_configuration;
        if (progress_bar_config_details)
            props.setProgressBarConfDetails(progress_bar_config_details);
    }, [widgetData]);

    const refreshWidget = React.useCallback(() => {
        setloading(true);
        const onResponseGetWidget = (data) => {
            if (data?.status && data?.status === 'error') {
                setWidgetMsg(data.message);
                setNotification({ message: data.message, severity: 'error' });
                // setNotificationOpen(true);
            } else {
                setWidgetData(data);
                if (props.parent_obj && props.parent_obj.updateScreenDataItems) {
                    props.parent_obj.updateScreenDataItems(data);
                }
                dispatch(
                    setActiveScreenWidgetsDetails({ widget_id: widgetDetails?.id, data: data })
                );
                setTimeout(() => {
                    dispatch(setUpdatedWidgetsIds(null));
                }, 10000);
                // var data_items = localStorage.getItem('screen_data_items');
                // if (data_items) {
                //     data_items = JSON.parse(data_items);
                //     data_items.push(data);
                // } else {
                //     data_items = [
                //         data
                //     ];
                // }
                // localStorage.setItem('screen_data_items', JSON.stringify(data_items));
            }
            setloading(false);
        };
        if (screen_filter_settings) {
            if (!activeScreenWidgetsDetails[widgetDetails?.id]) {
                getMultiWidget({
                    app_id: app_id,
                    screen_id: screen_id,
                    details: widgetDetails,
                    filters: selected_filters,
                    prev_screen_data: props?.props?.location?.screenNavigationData,
                    callback: onResponseGetWidget,
                    data_state_key: dataStateKeyRef.current
                });
            } else {
                setWidgetData(activeScreenWidgetsDetails[widgetDetails?.id]);
                if (props.parent_obj && props.parent_obj.updateScreenDataItems) {
                    props.parent_obj.updateScreenDataItems(
                        activeScreenWidgetsDetails[widgetDetails?.id]
                    );
                }
                setloading(false);
            }
        } else {
            getWidget({
                app_id: app_id,
                screen_id: screen_id,
                details: details,
                filters: selected_filters,
                callback: onResponseGetWidget,
                data_state_key: dataStateKeyRef.current
            });
        }
    }, [app_id, screen_id, details, selected_filters, screen_filter_settings, widgetDetails]);

    React.useEffect(() => {
        refreshWidget();
    }, [refreshWidget]);

    React.useEffect(() => {
        const onResponseGetWidget = (data) => {
            if (data?.status && data?.status === 'error') {
                setWidgetMsg(data.message);
                setNotification({ message: data.message, severity: 'error' });
            } else {
                setWidgetData(data);
                if (props.parent_obj && props.parent_obj.updateScreenDataItems) {
                    props.parent_obj.updateScreenDataItems(data);
                }
                dispatch(
                    setActiveScreenWidgetsDetails({ widget_id: widgetDetails?.id, data: data })
                );
            }
            setloading(false);
            props.updatedFiltersHandler();
        };
        if (props.filtersUpdated) {
            setloading(true);
            getMultiWidget({
                app_id: app_id,
                screen_id: screen_id,
                details: widgetDetails,
                filters: selected_filters,
                callback: onResponseGetWidget,
                data_state_key: dataStateKeyRef.current
            });
        }
    }, [selected_filters]);

    React.useEffect(() => {
        // widget  api call
        let affectedWidget = widgetData?.data?.value?.affected_by;
        if (
            details.id === widgetState.widget_action.action_origin ||
            !(affectedWidget && affectedWidget?.includes(widgetState.widget_action.action_origin))
        ) {
            return;
        }
        setloading(true);
        const onResponseGetWidget = (data) => {
            if (data?.status && data?.status === 'error') {
                setWidgetMsg(data.message);
                setNotification({ message: data.message, severity: 'error' });
                // setNotificationOpen(true); --commenting it out as it is already displayed in the widget
            } else {
                setWidgetData(data);
            }
            setloading(false);
        };

        if (!activeScreenWidgetsDetails[widgetDetails?.id]) {
            getMultiWidget({
                app_id: app_id,
                screen_id: screen_id,
                details: details,
                filters: selected_filters,
                widget_event: widgetState.widget_action,
                crossWidgetFilterData: `${app_id}_${screen_id}_${details.id}`,
                callback: onResponseGetWidget,
                data_state_key: dataStateKeyRef.current
            });
        } else {
            setWidgetData(activeScreenWidgetsDetails[widgetDetails?.id]);
            setloading(false);
        }
    }, [widgetState.widget_action]);

    const handleProgessActionComplete = () => {
        const completed_action = widgetData?.data.value?.current_action;
        if (completed_action) {
            props.onProgressActionComplete({ completed_action });
        }
    };

    const handleStateUpdateRequest = React.useCallback(
        (params) => {
            if (params.notification?.message) {
                setNotificationOpen(true);
                setNotification(params.notification);
            }
            if (params.config) {
                var widget_details = widgetDetails;
                widget_details['config'] = {
                    title: params.config.title,
                    sub_title: params.config.sub_title,
                    metric_factor: params.config.metric_factor,
                    prefix: params.config.prefix,
                    color_nooverride: params.config.color_nooverride,
                    code: params.config.code,
                    ...(params.config?.icon ? { icon: params.config?.icon } : {}),
                    ...(params.config?.iconPosition ? { icon: params.config?.iconPosition } : {})
                };
                setWidgetDetails(widget_details);
            }
            if (params.refreshWidget) {
                refreshWidget();
            }
        },
        [refreshWidget]
    );

    const updateDataStateKey = React.useCallback((key) => {
        dataStateKeyRef.current = key ?? dataStateKeyRef.current;
    }, []);

    const render = useMemo(() => {
        if (loading || !widgetData) {
            return (
                <Paper onClick={() => ref.current.flip()} className={classes.widgetContent}>
                    {loading && (
                        <Fragment>
                            <Skeleton
                                variant="rect"
                                animation="wave"
                                component="div"
                                width="100%"
                                height="100%"
                                className={classes.skeletonWave}
                            />
                            <CodxCircularLoader size={60} center />
                        </Fragment>
                    )}
                    {!loading && !widgetData && !activeScreenWidgetsDetails[widgetDetails?.id] && (
                        <Fragment>
                            <div className={classes.skeletonContainer}>
                                {/* <Skeleton
                                variant="rect"
                                animation="wave"
                                component="div"
                                width="100%"
                                height="100%"
                                className={classes.skeletonWave}
                            /> */}
                                <Typography className={classes.skeletonErrorTxt} variant="h3">
                                    <ErrorIcon
                                        className={classes.skeletonErrorIcon}
                                        role="img"
                                        fontSize="large"
                                        color="secondary"
                                        titleAccess={widgetMsg}
                                    />
                                    {widgetMsg}
                                </Typography>
                            </div>
                            <EditIcon size={60} />
                        </Fragment>
                    )}
                </Paper>
            );
        }
        if (widgetData?.data?.value?.is_flip) {
            return (
                <CustomFlipComponent
                    ref={ref}
                    widgetData={widgetData.data.value}
                    frontComp={
                        <Paper
                            onClick={() => {}}
                            className={classes.widgetContent}
                            data-testid="custom-flip-front"
                        >
                            <SelectedIndexProvider>
                                <AppWidgetGraph
                                    {...props}
                                    updateDataStateKey={updateDataStateKey}
                                    data={widgetData.data.value.front}
                                    widget_value_id={widgetData.data?.widget_value_id}
                                    dataProvided={true}
                                    actionItem={
                                        <IconButton
                                            size="small"
                                            title="Flip"
                                            onClick={() => ref.current.flip()}
                                            className={classes.wiggle}
                                            data-testid="flip-icon-button"
                                        >
                                            <RepeatRoundedIcon style={{ fontSize: '2rem' }} />
                                        </IconButton>
                                    }
                                    selected_filters={selected_filters}
                                    isEditing={isEditing}
                                    scenerioname={scenerioname}
                                    setIsEditingParent={setIsEditingParent}
                                    selectedScenario={selectedScenario}
                                    screen_filters_values={screen_filters_values}
                                    details={widgetDetails}
                                    showHighlighter={updatedWidgetsIds?.includes(widgetDetails?.id)}
                                    data-testid="app-widget-graph-front"
                                    onProgressCompleteAction={handleProgessActionComplete}
                                    widgetWithNoAction={widgetWithNoAction}
                                    shouldOpenLibrary={shouldOpenLibrary}
                                    widgetComment={widgetComment}
                                    updateWidgetComment={updateWidgetComment}
                                />
                            </SelectedIndexProvider>
                        </Paper>
                    }
                    backComp={
                        <Paper
                            onClick={() => {}}
                            className={classes.widgetContent}
                            data-testid="custom-flip-back"
                        >
                            <SelectedIndexProvider>
                                <AppWidgetGraph
                                    {...props}
                                    updateDataStateKey={updateDataStateKey}
                                    data={widgetData.data.value.back}
                                    widget_value_id={widgetData.data?.widget_value_id}
                                    dataProvided={true}
                                    actionItem={
                                        <IconButton
                                            size="small"
                                            title="Flip"
                                            onClick={() => ref.current.flip()}
                                            className={classes.wiggle}
                                            data-testid="flip-icon-button"
                                        >
                                            <RepeatRoundedIcon style={{ fontSize: '2rem' }} />
                                        </IconButton>
                                    }
                                    selected_filters={selected_filters}
                                    isEditing={isEditing}
                                    scenerioname={scenerioname}
                                    setIsEditingParent={setIsEditingParent}
                                    selectedScenario={selectedScenario}
                                    screen_filters_values={screen_filters_values}
                                    details={widgetDetails}
                                    showHighlighter={updatedWidgetsIds?.includes(widgetDetails?.id)}
                                    data-testid="app-widget-graph-back"
                                    onProgressCompleteAction={handleProgessActionComplete}
                                    widgetWithNoAction={widgetWithNoAction}
                                    shouldOpenLibrary={shouldOpenLibrary}
                                    widgetComment={widgetComment}
                                    updateWidgetComment={updateWidgetComment}
                                />
                            </SelectedIndexProvider>
                        </Paper>
                    }
                    data-testid="custom-flip-component"
                />
            );
        } else if (widgetData?.data?.value?.switch_view) {
            return (
                <AppWidgetSwitchView
                    {...props}
                    widget_value_id={widgetData.data?.widget_value_id}
                    updateDataStateKey={updateDataStateKey}
                    widgetData={widgetData}
                    onStateUpdateRequest={handleStateUpdateRequest}
                    details={widgetDetails}
                    refreshWidget={refreshWidget}
                    data-testid="app-widget-switch-view"
                    onProgressCompleteAction={handleProgessActionComplete}
                    widgetWithNoAction={widgetWithNoAction}
                />
            );
        } else if (widgetData?.data?.value?.dropdown_view) {
            return (
                <AppWidgetDropdownView
                    {...props}
                    widget_value_id={widgetData.data?.widget_value_id}
                    updateDataStateKey={updateDataStateKey}
                    widgetData={widgetData}
                    onStateUpdateRequest={handleStateUpdateRequest}
                    details={widgetDetails}
                    data-testid="app-widget-dropdown-view"
                />
            );
        } else if (widgetData?.data?.value?.digital_twin) {
            return <DigitalTwin {...props} widgetData={widgetData} data-testid="digital-twin" />;
        } else if (widgetData?.data?.value?.planogram && widgetData?.data?.value?.skus) {
            return (
                <PlanogramShelf {...props} widgetData={widgetData} data-testid="planogram-shelf" />
            );
        } else {
            return (
                <Paper className={classes.widgetContent} data-testid="app-widget-graph-container">
                    <SelectedIndexProvider>
                        {widgetData?.data?.value?.tableProps?.enableToggleButton ? (
                            <AppWidgetGraphOld
                                {...props}
                                widget_value_id={widgetData.data.widget_value_id}
                                updateDataStateKey={updateDataStateKey}
                                data={widgetData}
                                dataProvided={true}
                            />
                        ) : (
                            <AppWidgetGraph
                                {...props}
                                widget_value_id={widgetData.data?.widget_value_id}
                                updateDataStateKey={updateDataStateKey}
                                data={widgetData}
                                dataProvided={true}
                                details={widgetDetails}
                                toggleCheck={props.toggleCheck}
                                showHighlighter={updatedWidgetsIds?.includes(widgetDetails?.id)}
                                setSimulatorTrigger={setSimulatorTrigger}
                                simulatorTrigger={props.simulatorTrigger}
                                data-testid="app-widget-graph"
                                onProgressCompleteAction={handleProgessActionComplete}
                                widgetWithNoAction={widgetWithNoAction}
                                widgetComment={widgetComment}
                                updateWidgetComment={updateWidgetComment}
                                selected_filters={selected_filters}
                                shouldOpenLibrary={shouldOpenLibrary}
                            />
                        )}
                    </SelectedIndexProvider>
                </Paper>
            );
        }
    }, [
        loading,
        widgetData,
        widgetDetails,
        updateDataStateKey,
        handleStateUpdateRequest,
        props,
        setSimulatorTrigger
    ]);

    return (
        <Fragment>
            <CustomSnackbar
                open={notificationOpen && notification?.message}
                autoHideDuration={3000}
                onClose={() => setNotificationOpen(false)}
                severity={notification?.severity || 'success'}
                message={notification?.message}
            />
            {render}
        </Fragment>
    );
});

AppWidgetComponent.displayName = 'AppWidgetComponent';
export default AppWidgetComponent;
