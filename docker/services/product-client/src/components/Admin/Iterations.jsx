import React from 'react';
import PropTypes from 'prop-types';

import createPlotlyComponent from 'react-plotly.js/factory';

import { withStyles } from '@material-ui/core/styles';

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Typography,
    Button
} from '@material-ui/core';
import {
    LinearProgress,
    Tabs,
    Tab,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Switch,
    FormControlLabel
} from '@material-ui/core';
import { Assessment, Delete, FlashOn, ArrowBack, Error } from '@material-ui/icons';

import tableStyle from 'assets/jss/tableStyle.jsx';
import breadcrumbStyle from 'assets/jss/breadcrumbStyle.jsx';

import { getIterations, getIterationTags, getIterationResults } from 'services/admin.js';

import * as _ from 'underscore';

// const Plotly = window.Plotly;
// const Plot = createPlotlyComponent(Plotly);

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`iteration-results-tabpanel-${index}`}
            aria-labelledby={`iteration-results-tab-${index}`}
            {...other}
        >
            {value === index && <Typography>{children}</Typography>}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
};

class AppAdminIterations extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;

        var project_id = false;
        var notebook_id = false;

        if (props.app_info && props.app_info.config_link) {
            var config_items = props.app_info.config_link.split('/');
            if (config_items.indexOf('case-studies') === -1) {
                project_id = config_items[2];
                notebook_id = config_items[4];
            } else {
                project_id = config_items[4];
                notebook_id = config_items[6];
            }
        }

        this.state = {
            project_id: project_id,
            notebook_id: notebook_id,
            tags: [],
            iterations: [],
            selected_iteration_id: false,
            selected_iteration_result_tab: false,
            iteration_results: false,
            loading: true,
            error: false,
            result_groups: false,
            results_data: false,
            graph_types_checked: false,
            details: {}
        };
    }

    componentDidMount() {
        this.refreshData();
    }

    refreshData = () => {
        if (this.state.notebook_id) {
            this.setState({
                loading: true
            });

            getIterationTags({
                notebook_id: this.state.notebook_id,
                callback: this.onGetIterationTags
            });
        }
    };

    onGetIterationTags = (response_data) => {
        this.setState({
            tags: response_data['data']
        });

        getIterations({
            notebook_id: this.state.notebook_id,
            callback: this.onGetIterations
        });
    };

    onGetIterations = (response_data) => {
        if (!response_data || !response_data.status || response_data.status === 'error') {
            this.setState({
                loading: false,
                iterations: false,
                error: true
            });
        } else {
            this.setState({
                loading: false,
                iterations: response_data['data']['data'],
                error: false
            });
        }
    };

    showIterationResults = (iteration_item) => {
        this.setState({
            selected_iteration_id: iteration_item.id,
            selected_iteration_result_tab: 0,
            loading: true
        });

        getIterationResults({
            iteration_id: iteration_item.id,
            callback: this.onGetIterationResults
        });
    };

    onGetIterationResults = (response_data) => {
        var results_data = response_data['data'];

        if (results_data) {
            var filtered_results = _.map(
                _.filter(results_data, function (result_item) {
                    return result_item['visual_results'];
                }),
                function (filtered_result_item) {
                    if (
                        'data' in filtered_result_item['visual_results'] &&
                        'layout' in filtered_result_item['visual_results']
                    ) {
                        return filtered_result_item;
                    } else if (filtered_result_item['visual_results'].constructor === Object) {
                        filtered_result_item['result_keys'] = _.keys(
                            filtered_result_item['visual_results']
                        );
                    } else {
                        return filtered_result_item;
                    }

                    return filtered_result_item;
                }
            );
            var result_groups = _.unique(
                _.map(filtered_results, function (result_item) {
                    return result_item['type'];
                })
            );

            var graph_types_checked = [];
            _.each(
                _.filter(results_data, function (result_group_item) {
                    if (
                        result_group_item['visual_results'] &&
                        'data' in result_group_item['visual_results'] &&
                        'layout' in result_group_item['visual_results']
                    ) {
                        return false;
                    } else if (
                        result_group_item['visual_results'] &&
                        _.keys(result_group_item['visual_results']).length > 0 &&
                        result_group_item['visual_results'].constructor === Object
                    ) {
                        return true;
                    }

                    return false;
                }),
                function (filtered_result_item) {
                    var graph_type_checked = {};

                    var graph_type_counter = 0;
                    _.each(
                        filtered_result_item['visual_results'],
                        function (graph_data, graph_type_index) {
                            if (graph_type_counter === 0) {
                                graph_type_checked[graph_type_index] = true;
                            }

                            graph_type_counter++;
                        }
                    );
                    graph_types_checked.push(graph_type_checked);
                }
            );

            this.setState({
                result_groups: result_groups,
                results_data: results_data,
                loading: false,
                graph_types_checked: graph_types_checked
            });
        } else {
            this.setState({
                result_groups: false,
                results_data: false,
                loading: false,
                graph_types_checked: false
            });
        }
    };

    onGraphTypeChange = (graph_type, event) => {
        var graph_types = this.state.graph_types_checked;

        graph_types[event.target.id.replace('iterations_results_switch_', '')][graph_type] =
            event.target.checked;

        this.setState({
            graph_types_checked: graph_types
        });
    };

    onTabChange = (event, newValue) => {
        this.setState({
            selected_iteration_result_tab: newValue
        });
    };

    getTabs = () => {
        const { classes } = this.props;

        var type_counter = -1;
        var item_counter = 0;
        var nested_item_counter = 0;
        var plot_counter = 0;
        return _.map(
            this.state.result_groups,
            function (result_group_item) {
                type_counter++;

                var filtered_results = _.filter(
                    this.state.results_data,
                    function (results_data_item) {
                        if (
                            results_data_item['type'] === result_group_item &&
                            results_data_item['visual_results']
                        ) {
                            if (
                                'data' in results_data_item['visual_results'] &&
                                'layout' in results_data_item['visual_results']
                            ) {
                                return true;
                            } else if (_.keys(results_data_item['visual_results']).length > 0) {
                                return true;
                            } else if (results_data_item['visual_results'].length > 0) {
                                return true;
                            }
                        }

                        return false;
                    }
                );

                // var graph_types = _.unique(_.flatten(_.map(filtered_results, function(filtered_result_item) {
                //   return filtered_result_item['result_keys'];
                // })));

                // if (graph_types.length === 1 && !graph_types[0]) {
                //   graph_types = []
                // }

                return (
                    <TabPanel value={this.state.selected_iteration_result_tab} index={type_counter}>
                        <Grid
                            container
                            justify="center"
                            spacing={2}
                            key={'grid_container_' + type_counter}
                        >
                            {_.map(
                                filtered_results,
                                function (filtered_result_item) {
                                    if (
                                        'data' in filtered_result_item['visual_results'] &&
                                        'layout' in filtered_result_item['visual_results']
                                    ) {
                                        item_counter++;
                                        plot_counter++;
                                        const Plot = createPlotlyComponent(window.Plotly);
                                        return (
                                            <Grid item key={'grid_item_' + item_counter} xs={6}>
                                                <Card>
                                                    <CardHeader>
                                                        <Typography variant="h4">
                                                            {filtered_result_item['name']}
                                                        </Typography>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div style={{ overflow: 'auto' }}>
                                                            {filtered_result_item['visual_results']
                                                                .constructor === Object ? (
                                                                <Plot
                                                                    divId={
                                                                        'plot_' +
                                                                        item_counter +
                                                                        '_' +
                                                                        plot_counter
                                                                    }
                                                                    data={
                                                                        filtered_result_item[
                                                                            'visual_results'
                                                                        ]['data']
                                                                    }
                                                                    layout={
                                                                        filtered_result_item[
                                                                            'visual_results'
                                                                        ]['layout']
                                                                    }
                                                                    frames={
                                                                        filtered_result_item[
                                                                            'visual_results'
                                                                        ]['frames']
                                                                    }
                                                                />
                                                            ) : (
                                                                <object
                                                                    aria-label={
                                                                        'plot_' +
                                                                        item_counter +
                                                                        '_' +
                                                                        plot_counter
                                                                    }
                                                                    key={
                                                                        'plot_' +
                                                                        item_counter +
                                                                        '_' +
                                                                        plot_counter
                                                                    }
                                                                    style={{
                                                                        minHeight: '500px',
                                                                        width: '100%'
                                                                    }}
                                                                    data={
                                                                        'data:text/html,' +
                                                                        encodeURIComponent(
                                                                            filtered_result_item[
                                                                                'visual_results'
                                                                            ]
                                                                        )
                                                                    }
                                                                ></object>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        );
                                    } else {
                                        if (
                                            filtered_result_item['visual_results'].constructor ===
                                            Object
                                        ) {
                                            item_counter++;
                                            nested_item_counter++;
                                            return (
                                                <Grid item key={'grid_item_' + item_counter} xs={6}>
                                                    <Card>
                                                        <CardHeader>
                                                            <Typography variant="h4">
                                                                {filtered_result_item['name']}
                                                            </Typography>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <div style={{ overflow: 'auto' }}>
                                                                <div>
                                                                    {_.map(
                                                                        filtered_result_item[
                                                                            'visual_results'
                                                                        ],
                                                                        function (
                                                                            graph_data,
                                                                            graph_type_index
                                                                        ) {
                                                                            return (
                                                                                <FormControlLabel
                                                                                    key={
                                                                                        'form_control_label_' +
                                                                                        graph_type_index
                                                                                    }
                                                                                    control={
                                                                                        <Switch
                                                                                            checked={
                                                                                                this
                                                                                                    .state
                                                                                                    .graph_types_checked[
                                                                                                    nested_item_counter -
                                                                                                        1
                                                                                                ][
                                                                                                    graph_type_index
                                                                                                ]
                                                                                            }
                                                                                            onChange={(
                                                                                                event
                                                                                            ) =>
                                                                                                this.onGraphTypeChange(
                                                                                                    graph_type_index,
                                                                                                    event
                                                                                                )
                                                                                            }
                                                                                            id={
                                                                                                'iterations_results_switch_' +
                                                                                                (nested_item_counter -
                                                                                                    1)
                                                                                            }
                                                                                            value={
                                                                                                graph_type_index
                                                                                            }
                                                                                            classes={{
                                                                                                switchBase:
                                                                                                    classes.switchBase,
                                                                                                checked:
                                                                                                    classes.switchChecked,
                                                                                                thumb: classes.switchIcon,
                                                                                                track: classes.switchBar
                                                                                            }}
                                                                                        />
                                                                                    }
                                                                                    classes={{
                                                                                        label: classes.label
                                                                                    }}
                                                                                    label={
                                                                                        graph_type_index
                                                                                    }
                                                                                />
                                                                            );
                                                                        },
                                                                        this
                                                                    )}
                                                                </div>
                                                                {_.map(
                                                                    filtered_result_item[
                                                                        'visual_results'
                                                                    ],
                                                                    function (
                                                                        result_item,
                                                                        result_index
                                                                    ) {
                                                                        if (
                                                                            this.state
                                                                                .graph_types_checked[
                                                                                nested_item_counter -
                                                                                    1
                                                                            ][result_index]
                                                                        ) {
                                                                            plot_counter++;
                                                                            if (
                                                                                result_item.constructor ===
                                                                                Object
                                                                            ) {
                                                                                const Plot =
                                                                                    createPlotlyComponent(
                                                                                        window.Plotly
                                                                                    );
                                                                                return (
                                                                                    <Plot
                                                                                        key={
                                                                                            'plot_' +
                                                                                            item_counter +
                                                                                            '_' +
                                                                                            plot_counter
                                                                                        }
                                                                                        divId={
                                                                                            'plot_' +
                                                                                            item_counter +
                                                                                            '_' +
                                                                                            plot_counter
                                                                                        }
                                                                                        data={
                                                                                            result_item[
                                                                                                'data'
                                                                                            ]
                                                                                        }
                                                                                        layout={
                                                                                            result_item[
                                                                                                'layout'
                                                                                            ]
                                                                                        }
                                                                                        frames={
                                                                                            result_item[
                                                                                                'frames'
                                                                                            ]
                                                                                        }
                                                                                    />
                                                                                );
                                                                            } else {
                                                                                return (
                                                                                    <object
                                                                                        aria-label={
                                                                                            'plot_' +
                                                                                            item_counter +
                                                                                            '_' +
                                                                                            plot_counter
                                                                                        }
                                                                                        key={
                                                                                            'plot_' +
                                                                                            item_counter +
                                                                                            '_' +
                                                                                            plot_counter
                                                                                        }
                                                                                        style={{
                                                                                            minHeight:
                                                                                                '500px',
                                                                                            width: '100%'
                                                                                        }}
                                                                                        data={
                                                                                            'data:text/html,' +
                                                                                            encodeURIComponent(
                                                                                                result_item
                                                                                            )
                                                                                        }
                                                                                    ></object>
                                                                                );
                                                                            }
                                                                        } else {
                                                                            return '';
                                                                        }
                                                                    },
                                                                    this
                                                                )}
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            );
                                        }

                                        return '';
                                    }
                                },
                                this
                            )}
                        </Grid>
                    </TabPanel>
                );
            },
            this
        );
    };

    a11yProps = (index) => {
        return {
            id: `iteration-results-tab-${index}`,
            'aria-controls': `iteration-results-tabpanel-${index}`
        };
    };

    backToIterations = () => {
        this.setState({
            selected_iteration_id: false,
            selected_iteration_result_tab: false,
            loading: false
        });
    };

    render() {
        const { classes } = this.props;

        return this.state.error ? (
            <Error fontSize="large" />
        ) : this.state.loading ? (
            <LinearProgress />
        ) : this.state.selected_iteration_id ? (
            [
                <Button key={'backToIterations'} onClick={this.backToIterations} aria-label="Back">
                    <ArrowBack fontSize="large" /> Back to Iterations
                </Button>,
                <Tabs
                    key={'iterationResults'}
                    value={this.state.selected_iteration_result_tab}
                    onChange={this.onTabChange}
                    aria-label="Iteration results"
                >
                    {_.map(
                        this.state.result_groups,
                        function (result_group_item, index) {
                            return <Tab label={result_group_item} {...this.a11yProps(index)} />;
                        },
                        this
                    )}
                </Tabs>,
                this.getTabs()
            ]
        ) : (
            <TableContainer>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableCell}>ID</TableCell>
                            {_.map(this.state.tags, function (tag_item) {
                                return (
                                    <TableCell className={classes.tableCell}>{tag_item}</TableCell>
                                );
                            })}
                            <TableCell className={classes.tableCell}>Created On</TableCell>
                            <TableCell className={classes.tableCell}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {_.map(
                            this.state.iterations,
                            function (iteration_item) {
                                return (
                                    <TableRow className={classes.tableDataRow}>
                                        <TableCell className={classes.tableCell}>
                                            {iteration_item.id}
                                        </TableCell>
                                        {_.map(this.state.tags, function (tag_item) {
                                            return (
                                                <TableCell className={classes.tableCell}>
                                                    {iteration_item[tag_item.toLowerCase()]}
                                                </TableCell>
                                            );
                                        })}
                                        <TableCell className={classes.tableCell}>
                                            {iteration_item.created_at}
                                        </TableCell>
                                        <TableCell className={classes.tableCell}>
                                            <IconButton
                                                title="Results"
                                                onClick={() =>
                                                    this.showIterationResults(iteration_item)
                                                }
                                            >
                                                <Assessment fontSize="large" />
                                            </IconButton>
                                            <IconButton title="Trigger">
                                                <FlashOn fontSize="large" />
                                            </IconButton>
                                            <IconButton title="Delete">
                                                <Delete fontSize="large" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            },
                            this
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}

AppAdminIterations.propTypes = {
    classes: PropTypes.object.isRequired,
    app_info: PropTypes.object.isRequired
};

export default withStyles(
    (theme) => ({
        ...tableStyle(theme),
        ...breadcrumbStyle(theme)
    }),
    { withTheme: true }
)(AppAdminIterations);
