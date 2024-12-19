import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core';
import { getMultiWidget } from 'services/widget';
import { Skeleton } from '@material-ui/lab';
import { withThemeContext } from '../themes/customThemeContext';
import mobileAppScreenWidgetStyle from '../assets/jss/mobileAppScreenWidgetStyle';
import MobileAppWidgets from './MobileAppWidgets';

const MobileAppWidgetComponent = (props) => {
    const classes = props.classes;
    const [appId] = useState(props.app_id ? props.app_id : false);
    const [screenId] = useState(props.screen_id ? props.screen_id : false);
    const [widgetDetails] = useState(props.details ? props.details : false);
    const [loading, setLoading] = useState(false);
    const [widgetData, setWidgetData] = useState(null);

    useEffect(() => {
        setLoading(true);
        getMultiWidget({
            app_id: appId,
            screen_id: screenId,
            details: widgetDetails,
            filters: false,
            callback: onResponseGetWidgetData
        });
    }, []);

    const onResponseGetWidgetData = (response_data) => {
        setLoading(false);
        setWidgetData(response_data.data);
    };

    const widgetLoaderContent = () => {
        return (
            <React.Fragment>
                {loading && (
                    <React.Fragment>
                        <Skeleton
                            variant="rect"
                            animation="wave"
                            component="div"
                            width="100%"
                            // height="100%"
                            className={classes.skeletonWave}
                        />
                    </React.Fragment>
                )}
                {!loading && !widgetData && (
                    <React.Fragment>
                        <Skeleton
                            variant="rect"
                            animation="wave"
                            component="div"
                            width="100%"
                            // height="100%"
                            className={classes.skeletonWave}
                        />
                    </React.Fragment>
                )}
            </React.Fragment>
        );
    };

    return (
        <div className={classes.mWidgetContent}>
            {(loading || !widgetData) && widgetLoaderContent()}
            {!loading && widgetData && (
                <MobileAppWidgets
                    widgetValueId={widgetData?.widget_value_id}
                    data={widgetData}
                    dataProvided={true}
                    details={widgetDetails}
                    {...props}
                />
            )}
        </div>
    );
};

export default withStyles(
    (theme) => ({
        ...mobileAppScreenWidgetStyle(theme)
    }),
    { withTheme: true }
)(withThemeContext(MobileAppWidgetComponent));
