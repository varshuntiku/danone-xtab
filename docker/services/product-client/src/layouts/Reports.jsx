import React, { useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import LinearProgressBar from 'components/LinearProgressBar.jsx';
import ActionBar from 'components/ActionBar.jsx';
import Footer from 'components/Footer.jsx';
import ReportsList from 'layouts/ReportsList.jsx';
import ReportDetails from 'layouts/ReportDetails.jsx';
import { CreateStory } from '../components/createStory/CreateStory';
import PreviewPublishedStory from '../components/previewPublishedStory/PreviewPublishedStory';

import { useDispatch, useSelector } from 'react-redux';
import { getStories } from 'store/index';

function Reports(props) {
    const dispatch = useDispatch();

    const stories = useSelector((state) => state.dataStories.stories);

    const { classes } = props;

    useEffect(() => {
        const payload = {
            user_email_id: props.logged_in_user_info,
            app_id: props.location.state ? props.location.state.appId : null
        };

        dispatch(getStories(payload));
    }, []);

    return [
        <div key={'body_container'} className={classes.bodyContainer}>
            <CssBaseline />
            {stories ? (
                <ActionBar {...props} reports={stories}>
                    {' '}
                </ActionBar>
            ) : (
                ''
            )}
            <div className={classes.body}>
                <Switch>
                    <Route exact path="/stories" render={() => <Redirect to="/stories/list" />} />
                    <Route
                        exact
                        path="/stories/:story_id/details"
                        render={(props) => <ReportDetails {...props} stories={stories} />}
                    />
                    <Route
                        exact
                        path="/stories/:story_id/published-preview"
                        render={(props) => <PreviewPublishedStory {...props} />}
                    />
                    <Route
                        exact
                        path="/stories/:story_id/edit"
                        render={(props) => (
                            <CreateStory
                                {...props}
                                stories={stories}
                                logged_in_user_info={props.logged_in_user_info}
                            />
                        )}
                    />
                    <React.Fragment>
                        {!stories ? (
                            <LinearProgressBar />
                        ) : (
                            <Route
                                path="/stories/list"
                                component={(props) => (
                                    <ReportsList
                                        {...props}
                                        stories={stories}
                                        logged_in_user_info={props.logged_in_user_info}
                                    />
                                )}
                            />
                        )}
                    </React.Fragment>
                </Switch>
            </div>
        </div>,
        <Footer key={'footer'} />
    ];
}

const styles = (theme) => ({
    bodyContainer: {
        height: '100%',
        position: 'relative'
    },
    body: {
        height: 'calc(100% - ' + theme.spacing(14) + ')',
        marginBottom: theme.spacing(5),
        overflowY: 'auto'
    }
});

export default withStyles(styles)(Reports);
