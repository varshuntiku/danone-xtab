import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import AppWidgetPlot from 'components/AppWidgetPlot.jsx';
import { withStyles, Typography, Box, Checkbox } from '@material-ui/core';
import appWidgetGraphStyle from 'assets/jss/appWidgetGraphStyle.jsx';
import { ExpandMore, ExpandLess, Edit } from '@material-ui/icons';
import { MenuItem, Popover } from '@material-ui/core';
import CardView from './cardView';
import DataTable from './tableView';

import AppConfigWrapper, { AppConfigOptions } from 'hoc/appConfigWrapper.js';

import * as _ from 'underscore';

class GraphView extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            graphData: null,
            loader: false,
            checked: false,
            graph_filter_menu_open: false,
            selectedChartType: this.props.graphData.selectedChart,
            chart_title: ''
        };
    }

    componentDidMount = () => {
        this.getChartObject();
    };

    componentDidUpdate(prevProps) {
        if (this.props.graphData !== prevProps.graphData) {
            this.setState(
                {
                    selectedChartType: this.props.graphData.selectedChart,
                    graphData: null,
                    checked: false
                },
                () => {
                    this.getChartObject();
                }
            );
        }
    }

    refresh = () => {
        this.setState(
            {
                selectedChartType: this.props.graphData.selectedChart,
                graphData: null,
                checked: false
            },
            () => {
                this.getChartObject();
            }
        );
    };

    getChartObject = () => {
        let chartObj = this.props.graphData.chartObject.find(
            (o) => o.name === this.state.selectedChartType
        );
        this.setState({
            graphData: chartObj?.fig_object,
            chart_title: chartObj?.chart_title,
            checked: false
        });
        var payloadMap = new Map(JSON.parse(localStorage.getItem('create-stories-payload')));

        if (payloadMap && payloadMap.size) {
            var payloadObject = payloadMap.get(this.props.app_info.id);

            if (payloadObject) {
                payloadObject.map(function (item) {
                    if (_.isEqual(item.graph_data, this.state.graphData)) {
                        this.setState({ checked: true });
                        return true;
                    }
                    return true;
                }, this);
            }
        }
    };

    onClickGraphFilter = (event) => {
        this.setState({
            graph_filter_menu_open: true,
            graph_filter_menu_anchorEl: event.currentTarget
        });
    };

    closeGraphFilterMenu = () => {
        this.setState({
            graph_filter_menu_open: false,
            graph_filter_menu_anchorEl: false
        });
    };

    onClickFilterOption = (selected_value) => {
        this.setState(
            {
                selectedChartType: selected_value,
                graph_filter_menu_open: false,
                graph_filter_menu_anchorEl: false
            },
            () => {
                this.getChartObject();
            }
        );
    };

    getCreateStoriesPayload = () => {
        return {
            name: this.state.chart_title,
            description: '',
            app_id: this.props.app_info.id,
            app_screen_id: '',
            app_screen_widget_id: '',
            app_screen_widget_value_id: '',
            graph_data: this.state.graphData,
            filter_data: ''
        };
    };

    getPayloadMap = () => {
        var payloadMap = new Map(JSON.parse(localStorage.getItem('create-stories-payload')));
        if (!payloadMap && !payloadMap.size) {
            payloadMap = new Map();
        }
        return payloadMap;
    };

    getPayloadArray = () => {
        var payloadMap = this.getPayloadMap();
        var payloadObject;
        if (payloadMap && payloadMap.size) {
            payloadObject = payloadMap.get(this.props.app_info.id);
        }
        if (!payloadObject) {
            payloadObject = [];
        }
        return payloadObject;
    };

    onCheckboxValueChange = (checked) => {
        this.setState({ checked: checked });

        var payloadMap = this.getPayloadMap();
        var payloadObject = this.getPayloadArray();

        if (checked) {
            if (payloadObject.length) {
                var widgetValueIds = _.pluck(payloadObject, 'app_screen_widget_value_id');
                if (!widgetValueIds.includes(this.state.widget_value_id)) {
                    var requestPayload = this.getCreateStoriesPayload();
                    payloadObject.push(requestPayload);
                }
            } else {
                requestPayload = this.getCreateStoriesPayload();
                payloadObject.push(requestPayload);
            }
        } else {
            var removeIndex = -1;
            payloadObject.map(function (item, index) {
                if (_.isEqual(item.graph_data, this.state.graphData)) {
                    removeIndex = index;
                    return true;
                }
                return true;
            }, this);
            if (removeIndex !== -1) {
                payloadObject.splice(removeIndex, 1);
            }
        }

        payloadMap.set(this.props.app_info.id.toString(), payloadObject);
        localStorage.setItem(
            'create-stories-payload',
            JSON.stringify(Array.from(payloadMap.entries()))
        );
        this.props.updateStoriesCount();
    };

    render() {
        const { classes } = this.props;
        const graphData = JSON.parse(JSON.stringify(this.state.graphData));

        return (
            <React.Fragment>
                <Grid container className={classes.graphBody}>
                    {this.state.graphData && (
                        <div style={{ width: '100%' }}>
                            <Box display="flex" justifyContent="space-between">
                                <div className={classes.graphLabel}>
                                    <AppConfigWrapper appConfig={AppConfigOptions.data_story}>
                                        {!(
                                            this.state.selectedChartType === 'card' ||
                                            this.state.selectedChartType === 'dataTable'
                                        ) && (
                                            <Checkbox
                                                checked={this.state.checked}
                                                className={classes.storyCheckbox}
                                                style={{
                                                    visibility: this.state.checked
                                                        ? 'visible'
                                                        : 'hidden'
                                                }}
                                                disableRipple={true}
                                                onChange={(event) => {
                                                    this.onCheckboxValueChange(
                                                        event.target.checked
                                                    );
                                                }}
                                            />
                                        )}
                                    </AppConfigWrapper>
                                    <Typography color="initial" variant="h5">
                                        {this.state.chart_title}
                                    </Typography>
                                </div>

                                <div className={classes.graphActionsBar}>
                                    {this.props.graphData.chartList &&
                                    this.props.graphData.chartList.length > 0 ? (
                                        <div className={classes.actionsBarItem}>
                                            <div
                                                key={'chart_type'}
                                                className={classes.graphOptionContainer}
                                            >
                                                <Typography
                                                    className={classes.graphOptionLabel}
                                                    variant="h5"
                                                >
                                                    {'Type'}
                                                </Typography>
                                                <div
                                                    aria-label="chart-type"
                                                    className={classes.graphOptionValue}
                                                    onClick={(event) =>
                                                        this.onClickGraphFilter(event)
                                                    }
                                                >
                                                    <Typography
                                                        variant="h5"
                                                        className={classes.graphOptionValueType}
                                                    >
                                                        {this.state.selectedChartType}
                                                    </Typography>
                                                    {this.state.graph_filter_menu_open ? (
                                                        <ExpandLess
                                                            fontSize="large"
                                                            className={classes.graphOptionIcon}
                                                        />
                                                    ) : (
                                                        <ExpandMore
                                                            fontSize="large"
                                                            className={classes.graphOptionIcon}
                                                        />
                                                    )}
                                                </div>
                                                <br />
                                                <Popover
                                                    key={'chart_type_options'}
                                                    keepMounted
                                                    anchorEl={this.state.graph_filter_menu_anchorEl}
                                                    open={this.state.graph_filter_menu_open}
                                                    onClose={this.closeGraphFilterMenu}
                                                >
                                                    <div className={classes.filterMenuContainer}>
                                                        {_.map(
                                                            this.props.graphData.chartList,
                                                            function (option, index) {
                                                                return (
                                                                    <MenuItem
                                                                        key={
                                                                            'chart_options_' + index
                                                                        }
                                                                        value={option}
                                                                        classes={{
                                                                            root: classes.graphFilterMenuItem,
                                                                            selected:
                                                                                classes.graphFilterMenuItemSelected
                                                                        }}
                                                                        onClick={() =>
                                                                            this.onClickFilterOption(
                                                                                option
                                                                            )
                                                                        }
                                                                    >
                                                                        {option}
                                                                    </MenuItem>
                                                                );
                                                            },
                                                            this
                                                        )}
                                                    </div>
                                                </Popover>
                                            </div>
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                    <Edit fontSize="large" />
                                </div>
                            </Box>
                        </div>
                    )}

                    {this.state.graphData &&
                        (this.state.selectedChartType === 'card' ? (
                            <CardView graphData={graphData} />
                        ) : this.state.selectedChartType === 'dataTable' &&
                          graphData.data.columns ? (
                            <div className={classes.dataTableSection}>
                                <Grid
                                    container
                                    justify="center"
                                    className={classes.dataTableGridContainer}
                                >
                                    <Grid
                                        item
                                        xs={2}
                                        container
                                        justify="center"
                                        alignItems="center"
                                    ></Grid>
                                    <Grid
                                        item
                                        xs={8}
                                        container
                                        justify="center"
                                        alignItems="center"
                                    >
                                        <DataTable
                                            tableHead={graphData.data.columns}
                                            tableData={graphData.data.values}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={2}
                                        container
                                        justify="center"
                                        alignItems="center"
                                    ></Grid>
                                </Grid>
                            </div>
                        ) : (
                            <AppWidgetPlot
                                params={graphData}
                                graph_height={'full'}
                                size_nooverride={false}
                                color_nooverride={false}
                            />
                        ))}
                </Grid>
            </React.Fragment>
        );
    }
}

const styles = (theme) => ({
    graphBody: {
        height: 'calc(100% - 11.7rem)',
        backgroundColor: theme.palette.primary.dark,
        padding: theme.spacing(2),
        '& :hover': {
            '& $storyCheckbox': {
                visibility: 'visible !important'
            }
        }
    },
    storyCheckbox: {
        padding: 0,
        '& svg': {
            width: '3rem',
            height: '3rem'
        }
    },
    dataTableSection: {
        height: '100%',
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingTop: '10rem',
        paddingBottom: '10rem'
    },
    dataTableGridContainer: {
        height: '100%',
        width: '100%'
    }
});

export default withStyles(
    (theme) => ({
        ...appWidgetGraphStyle(theme),
        ...styles(theme)
    }),
    { withTheme: true }
)(GraphView);
