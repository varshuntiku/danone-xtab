import React, { Component } from 'react';
import { Tabs, Tab, Grid } from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import GraphView from './graphView';
import { withStyles } from '@material-ui/core';
import CreateStoriesActionPanel from 'components/CreateStoriesActionPanel.jsx';

class TabView extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            value: this.props.vizMetaData?.length ? this.props.vizMetaData?.length - 1 : 0,
            graphData: this.props.vizMetaData?.length ? this.props.vizMetaData[0] : false,
            refresh: false
        };
    }

    componentDidUpdate = (prevProps) => {
        const length = this.props.vizMetaData?.length;
        if (this.props.vizMetaData !== prevProps.vizMetaData) {
            this.setState({
                value: length - 1,
                graphData: length ? this.props.vizMetaData[length - 1] : false
            });
        }
    };

    onTabsChange = (event, newValue) => {
        this.setState({
            value: newValue,
            graphData: this.props.vizMetaData[newValue]
        });
    };

    getPayload = () => {
        var payloadMap = new Map(JSON.parse(localStorage.getItem('create-stories-payload')));
        var payloadObject = null;
        if (payloadMap && payloadMap.size) {
            payloadObject = payloadMap.get(this.props.app_info.id);
        }
        return payloadObject;
    };

    renderStoriesActionPanel = () => {
        var payload = this.getPayload();
        if (payload && payload.length) {
            return true;
        }
        return false;
    };

    updateStoriesCount = () => {
        if (this.createStoriesRef?.current?.updateChartsCount) {
            this.createStoriesRef.current.updateChartsCount();
        }
    };

    onResponseAddORCreateStory = () => {
        if (this.graphViewRef?.current?.refresh) {
            this.graphViewRef.current.refresh();
        }
    };

    deleteTab = (index) => {
        this.props.deleteViz(index);
    };

    render() {
        const { classes, vizMetaData, ...other } = this.props;
        this.createStoriesRef = React.createRef();
        this.graphViewRef = React.createRef();

        return (
            <React.Fragment>
                {vizMetaData.length > 0 ? (
                    <Grid container className={classes.fullHeight}>
                        {this.state.value !== null ? (
                            <Grid
                                item
                                container
                                direction={'column'}
                                xl={12}
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                                className={classes.fullHeight}
                            >
                                <Tabs
                                    className={classes.tabs}
                                    value={this.state.value}
                                    onChange={this.onTabsChange}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    aria-label="tab list"
                                >
                                    {vizMetaData.map((tab, index) => (
                                        <Tab
                                            key={index.toString()}
                                            value={index}
                                            label={
                                                <Grid
                                                    container
                                                    alignItems="center"
                                                    justify="center"
                                                >
                                                    <Grid item xs={10}>
                                                        <span className={classes.title}>
                                                            {tab.chartObject[0].title}
                                                        </span>
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        <Close
                                                            aria-label="close"
                                                            onClick={() => this.deleteTab(index)}
                                                            className={classes.closeIcon}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            }
                                        />
                                    ))}
                                </Tabs>
                                <CreateStoriesActionPanel
                                    {...this.props}
                                    fromMinervaDashboard={true}
                                    ref={this.createStoriesRef}
                                    onResponseAddORCreateStory={this.onResponseAddORCreateStory}
                                ></CreateStoriesActionPanel>

                                {this.state.graphData && (
                                    <GraphView
                                        {...other}
                                        tabId={this.state.value}
                                        updateStoriesCount={this.updateStoriesCount}
                                        graphData={this.state.graphData}
                                        ref={this.graphViewRef}
                                    />
                                )}
                            </Grid>
                        ) : null}
                    </Grid>
                ) : null}
            </React.Fragment>
        );
    }
}

const styles = (theme) => ({
    tabs: {
        '& .MuiTabs-indicator': {
            display: 'none'
        },
        '& .Mui-selected': {
            backgroundColor: theme.palette.primary.contrastText + '!important',
            borderColor: theme.palette.primary.contrastText + '!important',
            '& $title': {
                color: theme.palette.background.default
            },
            '& $closeIcon': {
                color: theme.palette.background.default
            }
        },
        '& .MuiTab-root': {
            border: '1px solid',
            borderColor: theme.palette.border.tab,
            backgroundColor: theme.palette.background.tab,
            minHeight: '4.5rem',
            borderRadius: '0.5rem'
        }
    },
    title: {
        fontSize: '1.4rem',
        color: theme.palette.text.titleText
    },
    closeIcon: {
        transform: 'scale(1.5)'
    },
    // storiesActionPanel: {
    //     position: 'relative',
    //     margin: theme.spacing(1.25),
    //     display: 'flex',
    //     alignItems: 'center',
    //     float: 'right',
    // },
    fullHeight: {
        height: '100%'
    }
});

export default withStyles(styles)(TabView);
