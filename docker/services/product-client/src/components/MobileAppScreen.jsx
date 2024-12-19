import React, { useEffect, useState } from 'react';
import { Grid, withStyles } from '@material-ui/core';
import { getWidgets } from 'services/screen';
import MobileAppWidgetComponent from './MobileAppWidgetComponent';
import mobileAppScreenStyle from 'assets/jss/mobileAppScreenStyle';
import AppUserMessage from './AppUserMessage';
import CodxCircularLoader from './CodxCircularLoader';
import { withThemeContext } from '../themes/customThemeContext';

const MobileAppScreen = (props) => {
    const classes = props.classes;
    const [appId] = useState(props.app_info?.id ? props.app_info.id : false);
    const [screenId, setScreenId] = useState(null);
    const [widgets, setWidgets] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const activeRoute = props.routes?.find((item) => item.href === props.location.pathname);
        setScreenId(activeRoute.screen_item.id);
        if (appId && screenId) {
            getScreenData();
        }
    }, [props.routes, screenId, appId]);

    const getScreenData = () => {
        setLoading(true);
        getWidgets({
            app_id: appId,
            screen_id: screenId,
            callback: onResponseGetScreenWidgets
        });
    };

    const onResponseGetScreenWidgets = (response_data) => {
        setLoading(false);
        setWidgets(response_data);
    };

    const getWidgetsElement = () => {
        let widgetsEl = [];
        widgets.forEach((widget_item) => {
            const widget_title = widget_item.config?.title
                ? widget_item.config.title
                : widget_item.widget_key.replaceAll('_', ' ').toUpperCase();

            let widget = (
                <Grid key={widget_item.id} item xs={12} className={classes.mGridGraphBody}>
                    <MobileAppWidgetComponent
                        key={'screen_widget_' + widget_item.id}
                        app_id={appId}
                        screen_id={screenId}
                        title={widget_title}
                        details={widget_item}
                        app_info={props.app_info}
                        logged_in_user_info={props.logged_in_user_info}
                    />
                </Grid>
            );

            widgetsEl.push(widget);
        });

        return widgetsEl;
    };

    return (
        <React.Fragment>
            {loading || widgets.length === 0 ? (
                <div className={classes.mGridContainer}>
                    <Grid
                        container
                        justifyContent="center"
                        spacing={0}
                        className={classes.mGridBody}
                    >
                        <Grid key={'empty_mwidget'} item xs={12}>
                            <div justify="center" className={classes.mWidgetContent}>
                                {loading ? <CodxCircularLoader size={60} center /> : null}
                                {!loading ? <AppUserMessage app_info={props.app_info} /> : null}
                            </div>
                        </Grid>
                    </Grid>
                </div>
            ) : (
                <div className={classes.mGridGraphContainer}>{getWidgetsElement()}</div>
            )}
        </React.Fragment>
    );
};

export default withStyles(
    (theme) => ({
        ...mobileAppScreenStyle(theme)
    }),
    { withTheme: true }
)(withThemeContext(MobileAppScreen));
