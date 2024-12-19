import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { IconButton, Button } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { ArrowBackIos } from '@material-ui/icons';

import CustomizedTables from 'components/custom/table.jsx';
import reportsListStyle from 'assets/jss/reportsListStyle.jsx';
import PreviewStories from 'layouts/PreviewReports.jsx';
import CreateReportsDialog from 'components/CreateReportsDialog.jsx';

import { getStories } from 'services/reports.js';
import { DeleteStoryContext } from '../components/createStory/deleteStoryContext';
import StoryDownloadStatusTable from '../components/storyDownloadStatusTable/StoryDownloadStatusTable';
import { logMatomoEvent } from '../services/matomo';
import { getMatomoPvid } from 'store/index';
import { connect } from 'react-redux';
import CodxCircularLoader from '../components/CodxCircularLoader';
// import { Link } from 'react-router-dom';

// let _ = require("underscore");

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <div>{children}</div>}
        </div>
    );
}

class ReportsList extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            stories: props.stories,
            value: 0,
            previewStories: false,
            storyId: false,
            in_app: this.props.app_info,
            createStoriesDialog: false,
            loading: false
        };
    }
    componentDidMount() {
        // Generate random string for matomo pv_id only when stories component are accessed outside of application
        if (!this.props.location?.pathname?.includes('/app/')) {
            this.props.getMatomoPvid('stories');
        }
        this.getStoriesList();
    }

    componentDidUpdate(prevProps) {
        const actionName = this.props.location?.pathname?.includes('/app/')
            ? 'App Stories'
            : 'Stories';
        if (this.props.matomo?.pv_id !== prevProps.matomo?.pv_id) {
            logMatomoEvent({
                action_name: actionName,
                url: window.location.href,
                urlref: window.location.href,
                pv_id: this.props.matomo.pv_id
            });
        }
    }

    getStoriesList() {
        let email_id = this.props.logged_in_user_info;
        let app_id = null;
        app_id = this.props.location.state ? this.props.location.state.appId : null;
        if (app_id == null && this.state.in_app && this.state.in_app.id) {
            app_id = this.state.in_app.id;
        }
        this.setState({ loading: true });
        getStories({
            user_email_id: email_id,
            app_id: app_id,
            callback: this.onResponseGetStories
        });
    }

    onResponseGetStories = (response_data) => {
        this.setState({
            stories: response_data,
            loading: false
        });
    };

    navigateTo = (data) => {
        if (this.state.in_app && this.state.in_app.id) {
            this.props.history.push({
                pathname: '/app/' + this.state.in_app.id + '/stories/' + data.story_id + '/edit',
                state: { detail: data }
            });
        } else {
            this.props.history.push({
                pathname: '/stories/' + data.story_id + '/edit',
                state: { detail: data }
            });
        }
    };

    navigateBack = () => {
        this.props.history.goBack();
    };

    onTabsChange = (event, newValue) => {
        this.setState({
            value: newValue
        });
    };

    openPreviewStories = (data) => {
        window.open('/preview-published-story?id_token=' + data.id_token, '_blank');
    };

    closeRenderedPreviewStories = () => {
        this.setState({
            previewStories: false
        });
    };

    closeCreateStoriesDialog = () => {
        this.setState({
            createStoriesDialog: false
        });
    };

    openCreateStoriesDialog = () => {
        this.setState({
            createStoriesDialog: true
        });
    };

    onResponseAddORCreateStory = () => {
        this.setState({});
        this.getStoriesList();
    };

    onResponseScheduleStory = () => {
        this.setState({});
        this.getStoriesList();
    };

    refreshData = () => {
        this.setState({});
        this.getStoriesList();
    };

    render() {
        const { classes } = this.props;

        return (
            <DeleteStoryContext.Provider
                value={{ onDeleteStoryDone: this.refreshData, onDeleteStoryFail: this.refreshData }}
            >
                {this.state.loading ? (
                    <CodxCircularLoader size={60} center />
                ) : (
                    <div>
                        {this.state.stories ? (
                            <div className={classes.mainpage}>
                                <div className={classes.navbar}>
                                    {this.state.in_app ? (
                                        ''
                                    ) : (
                                        <IconButton
                                            data-testid="navigateback"
                                            aria-label="ArrowBackIos"
                                            onClick={() => this.navigateBack()}
                                        >
                                            <ArrowBackIos className={classes.backIcon} />
                                        </IconButton>
                                    )}

                                    {/* <Typography className={classes.pageTitle} variant="h3">
                                        Stories
                                    </Typography> */}
                                    {/* <Link to="/stories/create" className={classes.alignRight} style={{
                                textDecoration: 'none'
                            }}>
                            </Link> */}
                                    {!this.state.in_app ? (
                                        <Button
                                            variant="outlined"
                                            onClick={() => this.openCreateStoriesDialog()}
                                            className={classes.createStoryBtn}
                                            aria-label="Create new story"
                                        >
                                            Create new Story
                                        </Button>
                                    ) : null}
                                </div>
                                <div className={classes.main}>
                                    <Typography className={classes.subpageTitle} variant="h3">
                                        Stories Workspace
                                    </Typography>
                                    <Tabs
                                        value={this.state.value}
                                        onChange={this.onTabsChange}
                                        aria-label="stories workspace"
                                    >
                                        <Tab label="All Stories" />
                                        <Tab data-testid="Downloads" label="My Downloads" />
                                        <Tab label="Shared With Me" />
                                    </Tabs>
                                    <TabPanel value={this.state.value} index={0}>
                                        <Paper square className={classes.root}>
                                            {this.state.stories.my_stories.length ? (
                                                <CustomizedTables
                                                    previewStories={this.openPreviewStories}
                                                    navigate={this.navigateTo}
                                                    onResponseScheduleStory={
                                                        this.onResponseScheduleStory
                                                    }
                                                    tableData={this.state.stories.my_stories}
                                                    insideApp={this.state.in_app ? true : false}
                                                    logged_in_user_info={
                                                        this.props.logged_in_user_info
                                                    }
                                                />
                                            ) : (
                                                <div>
                                                    <Typography className={classes.pageText}>
                                                        {
                                                            'There are no Stories available. Please create some Stories!'
                                                        }
                                                    </Typography>
                                                </div>
                                            )}
                                        </Paper>
                                    </TabPanel>
                                    <TabPanel value={this.state.value} index={2}>
                                        <Paper square className={classes.root}>
                                            {this.state.stories.accessed_stories.length ? (
                                                <CustomizedTables
                                                    previewStories={this.openPreviewStories}
                                                    navigate={this.navigateTo}
                                                    onResponseScheduleStory={
                                                        this.onResponseScheduleStory
                                                    }
                                                    tableData={this.state.stories.accessed_stories}
                                                    insideApp={this.state.in_app ? true : false}
                                                    logged_in_user_info={
                                                        this.props.logged_in_user_info
                                                    }
                                                />
                                            ) : (
                                                <div>
                                                    <Typography className={classes.pageText}>
                                                        {
                                                            'There are no Stories available. Please create some Stories!'
                                                        }
                                                    </Typography>
                                                </div>
                                            )}
                                        </Paper>
                                    </TabPanel>
                                    <TabPanel value={this.state.value} index={1}>
                                        <Paper square className={classes.root}>
                                            <StoryDownloadStatusTable
                                                appId={this.state.in_app?.id}
                                            />
                                        </Paper>
                                    </TabPanel>
                                </div>
                            </div>
                        ) : null}
                        {this.state.previewStories ? (
                            <PreviewStories
                                onClose={this.closeRenderedPreviewStories}
                                storyId={this.state.storyId}
                            ></PreviewStories>
                        ) : null}
                        {this.state.createStoriesDialog ? (
                            <CreateReportsDialog
                                onResponseAddORCreateStory={this.onResponseAddORCreateStory}
                                onClose={this.closeCreateStoriesDialog}
                                stories_list_page={true}
                                app_info={this.props.app_info}
                            ></CreateReportsDialog>
                        ) : null}
                    </div>
                )}
            </DeleteStoryContext.Provider>
        );
    }
}

// export default withStyles(
//     theme => ({
//         ...reportsListStyle(theme),
//     }),
//     { withTheme: true }
// )(ReportsList);

const mapStateToProps = (state) => {
    return {
        matomo: state.matomo
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getMatomoPvid: (pageType) => dispatch(getMatomoPvid(pageType))
    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(
    withStyles(
        (theme) => ({
            ...reportsListStyle(theme)
        }),
        { withTheme: true }
    )(ReportsList)
);
