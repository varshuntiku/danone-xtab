import { Typography, withStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { withThemeContext } from '../themes/customThemeContext';
import mobileAppScreenWidgetStyle from '../assets/jss/mobileAppScreenWidgetStyle';
import { Skeleton } from '@material-ui/lab';
import FileGallery from './Planogram/FileGallery';
import AppWidgetDynamicForm from './AppWidgetDynamicForm.jsx';
import { triggerWidgetActionHandler } from 'services/widget';
import FileExplorer from './Planogram/FileExplorer';

const MobileAppWidgets = (props) => {
    const classes = props.classes;
    const [loading, setLoading] = useState(true);
    const [widgetData] = useState(props.data);
    const [widgetDetails] = useState(props.details);
    const [data, setData] = useState(null);
    const [widgetValueId] = useState(props.widgetValueId);

    useEffect(() => {
        setLoading(false);
        setData(widgetData?.value);
    }, [widgetData]);

    const isFileGallery = (val) => {
        return val?.is_file_grid;
    };

    const isDynamicForm = (val) => {
        return val?.form_config;
    };

    const isFileExplorer = (val) => {
        return val?.directory;
    };

    const handleDynamicFormAction = async (
        action_type,
        payloadData,
        formData,
        showLoader = false
    ) => {
        showLoader && setLoading(true);
        try {
            const result = await triggerWidgetActionHandler({
                screen_id: props.screen_id,
                app_id: props.app_id,
                payload: {
                    widget_value_id: widgetValueId,
                    action_type: action_type,
                    data: { ...payloadData },
                    filters: JSON.parse(
                        sessionStorage.getItem(
                            'app_screen_filter_info_' + props.app_id + '_' + props.screen_id
                        )
                    )
                },
                callback: (d) => {
                    setLoading(false);
                    setData({
                        ...data,
                        ...formData,
                        ...d
                    });
                }
            });
            return result;
        } catch (err) {
            setLoading(false);
            setData({
                ...data,
                ...formData
            });
        }
    };

    const handleFetchFormData = async (action_type, payloadData) => {
        return await triggerWidgetActionHandler({
            screen_id: props.screen_id,
            app_id: props.app_id,
            payload: {
                widget_value_id: widgetValueId,
                action_type: action_type,
                data: { ...payloadData },
                filters: JSON.parse(
                    sessionStorage.getItem(
                        'app_screen_filter_info_' + props.app_id + '_' + props.screen_id
                    )
                )
            }
        });
    };

    const handleWidgetUpdate = async (action_type, payloadData) => {
        try {
            const result = await triggerWidgetActionHandler({
                screen_id: props.screen_id,
                app_id: props.app_id,
                payload: {
                    widget_value_id: widgetValueId,
                    action_type: action_type || null,
                    data: { ...payloadData },
                    filters: JSON.parse(
                        sessionStorage.getItem(
                            'app_screen_filter_info_' + props.app_id + '_' + props.screen_id
                        )
                    )
                }
            });
            return result;
        } catch (err) {
            // TODO: Add error handling logic
            // console.error(err);
        }
    };

    const renderVisualContent = () => {
        if (isFileGallery(data)) {
            return <FileGallery params={data} />;
        } else if (isDynamicForm(data)) {
            return (
                <AppWidgetDynamicForm
                    params={data}
                    onAction={handleDynamicFormAction}
                    onFetchFormData={handleFetchFormData}
                    app_id={props.app_id}
                />
            );
        } else if (isFileExplorer(data)) {
            return (
                <FileExplorer
                    params={data}
                    fetchDirectory={handleFetchFormData}
                    onDirectoryUpdate={handleWidgetUpdate}
                />
            );
        }
    };

    return (
        <div className={classes.mGraphBody}>
            <div className={classes.mGraphWrapper}>
                <div className={classes.mGraphLabel}>
                    <div>
                        <Typography color="initial" variant="h4" className={classes.mWidgetTitle}>
                            {widgetData?.title?.toUpperCase() || widgetDetails.config?.title}
                        </Typography>
                        {widgetDetails['config']['subtitle'] && (
                            <Typography color="initial" variant="h4">
                                {widgetDetails['config']['subtitle']}
                            </Typography>
                        )}
                    </div>
                </div>
                <br />
                {loading ? (
                    <div className={classes.mGraphLoader}>
                        <Skeleton
                            variant="rect"
                            animation="wave"
                            component="div"
                            width="100%"
                            height="100%"
                            className={classes.skeletonWave}
                        />
                    </div>
                ) : (
                    widgetData && (
                        <React.Fragment>
                            <div
                                className={classes.mGraphContainer}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    overflowY: 'auto'
                                }}
                            >
                                <div className={classes.mGraphContainer}>
                                    {widgetData ? renderVisualContent() : ''}
                                </div>
                            </div>
                        </React.Fragment>
                    )
                )}
            </div>
        </div>
    );
};

export default withStyles(
    (theme) => ({
        ...mobileAppScreenWidgetStyle(theme)
    }),
    { withTheme: true }
)(withThemeContext(MobileAppWidgets));
