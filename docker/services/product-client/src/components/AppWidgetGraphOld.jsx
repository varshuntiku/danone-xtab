import React from "react";
import PropTypes from "prop-types";
import { withStyles, Typography, /*ButtonGroup,*/ Button, CircularProgress, Checkbox, Box } from "@material-ui/core";
import { Grid, Input, Slider, MenuItem, Popover } from '@material-ui/core';
import Search from '@material-ui/icons/Search';
import Skeleton from '@material-ui/lab/Skeleton';

import appWidgetGraphStyle from "assets/jss/appWidgetGraphStyle.jsx";

import AppWidgetTable from "components/AppWidgetTable.jsx";
import AppWidgetPlot from "components/AppWidgetPlot.jsx";
import AppWidgetInsights from "components/AppWidgetInsights.jsx";
import AppWidgetTestLearn from "components/AppWidgetTestLearn.jsx";
import AppWidgetFlowTable from 'components/AppWidgetFlowTable.jsx';
import AppWidgetAssumptions from 'components/AppWidgetAssumptionsOld.jsx';
import AppWidgetExpandableTable from "components/app-expandable-table/appWidgetExpandableTable.jsx";
import AppWidgetTableSimulator from "./AppWidgetTableSimulator.jsx";
import AppWidgetGanttTable from 'components/AppWidgetGanttTable.jsx';
import SearchBar from "../components/CustomSearchComponent/SearchComponent";

import { GetApp, Error, ExpandMore, ExpandLess } from '@material-ui/icons';
import { getWidget, getMultiWidget, executeCode } from "services/widget.js";

// import CsvDownload from 'react-json-to-csv';
import AppConfigWrapper, { AppConfigOptions } from "../hoc/appConfigWrapper.js";
import DownloadWorkBook from "./workbook/downloadWorkBook";
import AppWidgetKpi from "./AppWidgetKpi.jsx";
import AppWidgetSimulator from "./AppWidgetSimulator.jsx";
import { triggerWidgetActionHandler } from "services/widget.js";
// import for Specific Simulator:
// import AlternateSimulatorTypeA from "./simulators/AlternateSimulatorTypeA.jsx";
// import AlternateSimulatorTypeB from "./simulators/AlternateSimulatorTypeB.jsx";
import { getScrenarios } from "../services/scenario";
import FormDialogSaveScenario from "../components/dynamic-form/saveScenarioDialog.jsx";
import { connect } from "react-redux";
import GridTable from "./gridTable/GridTable.jsx";
import AlertDialog from './alert-dialog/AlertDialog';
import CustomSnackbar from './CustomSnackbar';
import AppWidgetPreLoader from "./AppWidgetPreLoader.jsx";
import CodxCircularLoader from "./CodxCircularLoader.jsx";
import Calendar from "./custom-calendar/Calendar.jsx";
import AppWidgetDynamicForm from "./AppWidgetDynamicForm.jsx";

import * as _ from 'underscore';
class AppWidgetGraph extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            loading: true,
            error: false,
            error_message: false,
            download_data: false,
            data: false,
            simulated_data: false,
            slider_values: {

            },
            graph_filters: [],
            graph_filter_menu_open: false,
            graph_filter_menu_anchorEl: false,
            filter_search_value: '',
            checked: false,
            search: "",
            filter_index: 0,
            option_index: 0,
            save_scenario_dialog_open: false,
            notification: null,
            traceList: false,
            alertWidgetType: false,
            savedScenarios: [],
            alert_data: null,
            searchKey: '',
        };
        this.getScenarios = this.getScenarios.bind(this);
        this.loadScenario = this.loadScenario.bind(this);
    }

    componentDidMount() {
        if (this.props.data) {
            this.onResponseGetWidget(this.props.data);
        } else {
            this.refreshWidget();
        }
    }

    refreshWidget() {

        const { app_id, screen_id, details, selected_filters, screen_filter_settings, dataProvided, data } = this.props;
        if (dataProvided && data) {
            this.onResponseGetWidget(data);
            return;
        }
        this.setState({
            loading: true
        });
        if (screen_filter_settings) {
            getMultiWidget({
                app_id: app_id,
                screen_id: screen_id,
                details: details,
                filters: selected_filters,
                callback: this.onResponseGetWidget,
                data_state_key: this.state.data?.data_state_key
            });
        } else {
            getWidget({
                app_id: app_id,
                screen_id: screen_id,
                details: details,
                filters: selected_filters,
                callback: this.onResponseGetWidget,
                data_state_key: this.state.data?.data_state_key
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.selected_filters !== this.props.selected_filters) {
            this.refreshWidget();
        } else if (prevProps.simulator_apply !== this.props.simulator_apply) {
            this.refreshWidget();
        } else if (prevProps.data !== this.props.data) {
            this.onResponseGetWidget(this.props.data);
        }
    }


    componentWillReceiveProps(nextProps) {

        if (nextProps.screenId) {
            var appScreenDetails = _.where(nextProps.screens, { id: nextProps.screenId });

            this.setState({ checked: appScreenDetails[0]?.selected });
            this.onCheckboxValueChange(appScreenDetails[0]?.selected);

        }
    }

    getScenarios() {
        const { app_id, screen_id, details, selected_filters } = this.props;
        getScrenarios({
            app_id: app_id,
            screen_id: screen_id,
            widget_id: details.id,
            filters: selected_filters,
            user_email: [sessionStorage.getItem('user_email')]
            // callback:this.onResponseGetScrenario
        }).then(res => {
            let scenarios = res['data']
            this.setState({
                savedScenarios: scenarios
            });
        }).catch(err => {
            return err;
        });
    }

    loadScenario(scenario) {
        let timerId
        this.setState({
            loading: true,
            slider_values: {}
        });
        var plot_details = this.setupPlot(scenario.scenarios_json);
        clearTimeout(timerId)
        timerId = setTimeout(this.loadScenarioState(plot_details), 2000);
    }

    loadScenarioState(plot_details) {
        this.setState({
            loading: false,
            error: false,
            error_message: false,
            data: plot_details.plot,
            simulated_data: plot_details.plot.simulator
        });
    }

    onClickGraphFilter = (event, filter_index) => {
        this.setState({
            graph_filter_menu_open: filter_index,
            graph_filter_menu_anchorEl: event.currentTarget
        });
    };

    closeGraphFilterMenu = () => {
        this.setState({
            graph_filter_menu_open: false,
            graph_filter_menu_anchorEl: false
        });
    };

    onSelectGraphFilterMenu = () => {

    };

    onChangeFilterSearchValue = (event) => {
        this.setState({
            filter_search_value: event.target.value
        });
    };

    renderChartFilters = () => {
        const { classes } = this.props;

        return [
            _.map(this.state.graph_filters, function (filter_item, filter_index) {
                var value = false;
                var options = _.map(_.filter(filter_item.options, function (option_instance) {
                    if (option_instance.selected) {
                        value = option_instance.label;
                    }

                    if (this.state.filter_search_value !== '') {
                        return option_instance.label.toLowerCase().indexOf(this.state.filter_search_value.toLowerCase()) !== -1;
                    } else {
                        return true;
                    }
                }, this), function (option_item, option_index) {
                    return (
                        <MenuItem key={'filter_option_' + filter_index + '_' + option_index} value={option_item.label} classes={{
                            root: classes.graphFilterMenuItem,
                            selected: classes.graphFilterMenuItemSelected
                        }} onClick={() => this.onClickFilterOption(option_item.label, filter_index)}>{option_item.label}</MenuItem>
                    );
                }, this);

                if (filter_item.options.length > 9) {
                    options.splice(0, 0, (
                        <MenuItem key={'filter_option_search_' + filter_index} classes={{
                            root: classes.graphFilterMenuSearchItem
                        }}>
                            <Input
                                className={classes.graphFilterMenuSearchInput} variant="filled"
                                placeholder="search..."
                                value={this.state.filter_search_value}
                                onChange={this.onChangeFilterSearchValue}
                            />
                            <Search fontSize="large" className={classes.graphFilterMenuSearchIcon} />
                        </MenuItem>
                    ));
                }

                return (
                    <div key={"chart_filter_" + filter_index} className={classes.graphOptionContainer}>
                        <Typography className={classes.graphOptionLabel} variant="h5">{filter_item.name && filter_item.name.trim() !== '' ? filter_item.name.trim() : 'Option ' + (filter_index + 1)}</Typography>
                        <div className={classes.graphOptionValue} onClick={(event) => this.onClickGraphFilter(event, filter_index)}>
                            <Typography variant="h5" className={classes.graphOptionValueType}>{value}</Typography>
                            {this.state.graph_filter_menu_open === filter_index ? (
                                <ExpandLess fontSize="large" className={classes.graphOptionIcon} />
                            ) : (
                                <ExpandMore fontSize="large" className={classes.graphOptionIcon} />
                            )}
                        </div>
                        <br clear="all" />
                        <Popover
                            key={"chart_filter_menu_" + filter_index}
                            keepMounted
                            anchorEl={this.state.graph_filter_menu_anchorEl}
                            open={this.state.graph_filter_menu_open === filter_index}
                            onClose={this.closeGraphFilterMenu}
                        >
                            <div className={classes.filterMenuContainer}>
                                {options}
                            </div>
                        </Popover>
                    </div>
                );
            }, this),
            <br key="chart-filters-clear" clear="all" />
        ];
    };

    onClickFilterOption = (selected_value, filter_index) => {
        var graph_filters = this.state.graph_filters;
        var option_index = false;
        var current_data = this.state.data;
        const search = this.state.search;

        graph_filters = _.map(graph_filters, function (filter_item, filter_item_index) {
            if (filter_index === filter_item_index) {
                filter_item.options = _.map(filter_item.options, function (option_item, option_item_index) {
                    if (selected_value === option_item.label) {
                        option_item.selected = true;
                        option_index = option_item_index;
                    } else {
                        option_item.selected = false;
                    }

                    return option_item;
                });
            }
            return filter_item;
        });

        current_data['layout']['updatemenus'][filter_index].active = option_index;
        current_data['layout']['updatemenus'][filter_index].showActive = true;

        var chart_option_args = current_data['layout']['updatemenus'][filter_index]['buttons'][option_index]['args'];

        _.each(chart_option_args, function (filter_item, filter_item_index) {

            if (filter_item['visible']) {
                var visible = filter_item['visible'];
                current_data['data'] = _.map(current_data['data'], function (data_item, trace_index) {
                    data_item.visible = visible[trace_index] && (data_item.text + "").toLowerCase().includes(search);;
                    return data_item;
                });
            }
            else if (filter_item['yaxis']) {
                if (!current_data['layout']['yaxis']) {
                    current_data['layout']['yaxis'] = {};
                }
                current_data['layout']['yaxis']['title'] = {
                    ...current_data['layout']['yaxis']['title'],
                    text: filter_item['yaxis']['title']
                };
                if (filter_item['yaxis']['range'])
                    current_data['layout']['yaxis']['range'] = filter_item['yaxis']['range'];
                if (filter_item['yaxis']['tickprefix'])
                    current_data['layout']['yaxis']['tickprefix'] = filter_item['yaxis']['tickprefix'];
                if (filter_item['yaxis']['ticksuffix'])
                    current_data['layout']['yaxis']['ticksuffix'] = filter_item['yaxis']['ticksuffix'];

            }
            else if (filter_item['xaxis']) {

                if (!current_data['layout']['xaxis']) {
                    current_data['layout']['xaxis'] = {};
                }
                current_data['layout']['xaxis']['title'] = {
                    ...current_data['layout']['xaxis']['title'],
                    text: filter_item['xaxis']['title']
                };
                if (filter_item['xaxis']['range'])
                    current_data['layout']['xaxis']['range'] = filter_item['xaxis']['range'];
                if (filter_item['xaxis']['tickprefix'])
                    current_data['layout']['xaxis']['tickprefix'] = filter_item['xaxis']['tickprefix'];
                if (filter_item['xaxis']['ticksuffix'])
                    current_data['layout']['xaxis']['ticksuffix'] = filter_item['xaxis']['ticksuffix'];

            }
            else {
                return;
            }
        });

        this.setState({
            graph_filters: graph_filters,
            data: current_data,
            graph_filter_menu_open: false,
            graph_filter_menu_anchorEl: false,
            filter_search_value: '',
            filter_index,
            option_index
        });
    };

    setupPlot = (current_value) => {
        const { details } = this.props;

        var trace_config = details.config.traces;

        if (current_value['layout']) {
            var graph_filters = [];
            if (current_value['layout']['updatemenus'] && current_value['layout']['updatemenus'].length > 0) {
                if (!current_value['frames']) {
                    current_value['layout']['updatemenus'] = _.map(current_value['layout']['updatemenus'], function (update_menu_item, updatemenu_index) {
                        graph_filters.push({
                            'name': update_menu_item.name ? update_menu_item.name : 'update_menu_' + updatemenu_index,
                            'options': _.map(update_menu_item.buttons, function (button_item, button_index) {
                                return {
                                    label: button_item.label,
                                    selected: (current_value['data'] && button_item.args.length > 0 && button_item.args[0] && JSON.stringify(button_item.args[0].visible) === JSON.stringify(_.map(current_value['data'], function (data_item) {
                                        return data_item.visible !== false;
                                    }))) || (button_index === update_menu_item.active)
                                };
                            })
                        });
                        update_menu_item.visible = false;
                        return update_menu_item;
                    });
                }
            }
        }

        if (current_value['data']) {
            current_value['data'] = _.filter(current_value['data'], function (data_item, index) {
                var trace_config_selected = _.find(trace_config, function (trace_config_item) {
                    return trace_config_item.index === index;
                });

                if (trace_config_selected && trace_config_selected['hide']) {
                    return false;
                } else {
                    return true;
                }
            });
        }

        return {
            plot: current_value,
            filters: graph_filters
        };
    };

    onResponseGetWidget = (response_data) => {
        if (response_data.status && response_data.status === 'error') {
            this.setState({
                loading: false,
                error: true,
                error_message: response_data.message,
                data: false,
                simulated_data: false
            });

            return;
        }

        const { simulator_apply } = this.props;

        var widget_value_id = response_data['data']['widget_value_id'] || this.props.widget_value_id;
        var current_value = response_data['data']['value'];
        var simulated_value = response_data['data']['simulated_value'];

        if (current_value && current_value['is_alternate_simulator_type_a'] || current_value['is_alternate_simulator_type_b'] || simulated_value) {
            this.getScenarios();
        }
        if (simulator_apply && simulated_value) {
            if (current_value.simulator && !simulated_value.simulator) {
                simulated_value.simulator = current_value.simulator;
            }
            current_value = simulated_value;
        }

        if (response_data?.data?.value?.is_kpi) {
            this.setState({
                loading: false,
                error: false,
                error_message: false,
                data: response_data,
                download_data: current_value.download_data,
                simulated_data: null,
                graph_filters: null,
                widget_value_id: widget_value_id
            });
        } else {
            if (this.isHTML(current_value)) {
                this.setState({
                    loading: false,
                    error: false,
                    error_message: false,
                    data: current_value,
                    download_data: false,
                    simulated_data: simulated_value,
                    graph_filters: null,
                    widget_value_id: widget_value_id
                });
            } else {
                var plot_details = this.setupPlot(current_value);

                this.setState({
                    loading: false,
                    error: false,
                    error_message: false,
                    data: plot_details.plot,
                    download_data: current_value.download_data,
                    simulated_data: simulated_value,
                    graph_filters: plot_details.filters,
                    widget_value_id: widget_value_id,
                    alert_data: current_value
                });
            }
        }



        var payloadMap = new Map(JSON.parse(localStorage.getItem('create-stories-payload')));

        if (payloadMap && payloadMap.size) {
            var payloadObject = payloadMap.get(this.props.app_id);

            if (payloadObject) {
                var widgetValueIds = _.pluck(payloadObject, 'app_screen_widget_value_id');
                if (widgetValueIds.includes(widget_value_id)) {
                    this.setState({ checked: true });
                }
            }
        }
    };

    onClickSimulator = () => {

        this.setState({
            show_simulator: true,
            request_id: 0
        });
    };

    onResetSimulator = () => {

        const { parent_obj } = this.props;

        parent_obj.onApplySimulator();

        this.setState({
            show_simulator: false
        });
    };

    onCloseSimulator = () => {
        this.setState({
            show_simulator: false,
            request_id: 0
        });
    };

    onLoadScenario = (scenario_data) => {
        this.setState({
            data: {
                ...this.state.data,
                download_data: scenario_data.download_data
            },
            download_data: scenario_data.download_data
        })
    }


    setRequestId = (request_id) => {
        this.setState({
            request_id: request_id
        });
    };


    onApplySimulator = () => {
        const { parent_obj, details, app_id } = this.props;

        if (!this.state.data.simulator || !this.state.data.simulator.code || (this.state.data.simulator.code && this.state.data.simulator.code === 'Fake')) {
            if (details && details.config && details.config.action_link) {
                parent_obj.onSimulatorApplyDrilldown(details.config.action_link);
            } else {
                parent_obj.onApplySimulator(true);
            }
        } else {
            var inputs = {};

            _.each(this.state.data.simulator.options.readonly_headers, function (section, section_index) {
                inputs[section] = {};

                _.each(this.state.data.simulator.options.fields[section_index], function (field_item, field_index) {
                    inputs[section][field_item.name] = this.state.slider_values[section_index + '_' + field_index] ? this.state.slider_values[section_index + '_' + field_index] : field_item.values;;
                }, this);
            }, this);

            this.setState({
                loading: true
            });

            executeCode({
                app_id: app_id,
                code: this.state.data.simulator.code,
                inputs: inputs,
                selected_filters: JSON.parse(sessionStorage.getItem('app_screen_filter_info_' + app_id + '_' + this.props.screen_id)),
                callback: this.onResponseExecuteCode
            });
        }
    };

    onSaveScenario = () => {
        this.setState({
            save_scenario_dialog_open: true
        });
    };

    onCloseSaveScenarioDialog = () => {
        this.setState({
            save_scenario_dialog_open: false
        });
    };

    onResponseExecuteCode = (response_data) => {
        if (response_data.status && response_data.status === 'error') {
            this.setState({
                loading: false,
                error: true,
                error_message: response_data.status.message
            });
            return;
        }

        if (response_data && response_data.data && response_data.data.plot && response_data.data.plot.data && response_data.data.plot.layout) {
            var plot_details = this.setupPlot(response_data.data.plot);
            this.setState({
                loading: false,
                error: false,
                error_message: false,
                data: {
                    ...this.state.data,
                    data: plot_details.plot.data,
                    layout: plot_details.plot.layout
                }
            });
        }
    };

    onSliderChange = (value, header_index, field_index) => {
        let distributation_info = { "is_distributable": false };
        if (this.state.data.simulator.options.distribution_header)
            distributation_info = this.state.data.simulator.options.distribution_header[header_index];
        if (distributation_info.is_distributable === false) {
            this.setState({
                slider_values: {
                    ...this.state.slider_values,
                    [header_index + '_' + field_index]: value
                }
            });
        }
        else {
            // List of keys to check
            let sliders_keys_to_check = [];
            // Dictionary for key value pairs to check
            let sliders_to_check = {};
            // Dictionary of keys which we should compare from the original values.
            // These will be updated with the corresponding values from the state
            let slider_set_to_compare = {};
            // sum of current sliders
            let current_slider_values_sum = 0;
            // get the already existing slider states for the header_index
            sliders_keys_to_check = _.filter(Object.keys(this.state.slider_values),
                (x) => { return x[0] === header_index; });
            // get the values and store in a dictionary
            sliders_keys_to_check.forEach(
                (key, index) => {
                    sliders_to_check[key] = this.state.slider_values[key];
                }
            );
            // get the original data
            this.state.data.simulator.options.fields[header_index].forEach((item, index) => {
                slider_set_to_compare[header_index + "_" + index] = item.values;
            });
            // updating the orignal data with the latest data from the state
            let updated_slider_values = {
                ...slider_set_to_compare,
                ...sliders_to_check,
                [header_index + '_' + field_index]: value
            };
            // getting the sum
            current_slider_values_sum = Object.values(updated_slider_values).reduce((sum, item) => sum + item);
            // Update the state only if the sum is less than the max value, else pass the event
            if (current_slider_values_sum <= distributation_info.max_value) {
                this.setState({
                    slider_values: {
                        ...this.state.slider_values,
                        [header_index + '_' + field_index]: value
                    }
                });
            }
        }
    };

    renderSimulatorSliders = (offset, limit) => {
        const { classes } = this.props;

        return _.map(this.state.data.simulator.options.readonly_headers, function (readonly_header, header_index) {
            if (header_index >= offset && header_index < (offset + limit)) {
                return (
                    <div key={'simulator_section_' + header_index} className={classes.simulatorTableRow}>
                        <Typography className={classes.simulatorSectionHeader} variant="h5">{readonly_header}</Typography>
                        {
                            this.state.data.simulator.options.fields[header_index].map((field_item, field_index) => {
                                const slider_value = this.state.slider_values[header_index + '_' + field_index] ? this.state.slider_values[header_index + '_' + field_index] : field_item.values;
                                const slider_range = this.getSliderValueRange(field_item.values);
                                return (
                                    <Grid container spacing={0} key={field_index}>
                                        <Grid item xs={5}>
                                            <Typography key={'simulator_header_' + header_index + '_' + field_item.name} className={classes.simulatorSliderLabel} variant="h5">{field_item.name}</Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Slider
                                                className={classes.simulatorSliderInput}
                                                key={'slider_' + header_index + '_' + field_index}
                                                value={slider_value}
                                                step={field_item.step || 0.01}
                                                max={field_item.range ? field_item.range[1] : (field_item.max ? field_item.max : (field_item.is_percent ? 100 : slider_range[1]))}
                                                min={field_item.range ? field_item.range[0] : (field_item.min ? field_item.min : (field_item.is_percent ? 0 : slider_range[0]))}
                                                onChange={(event, new_value) => this.onSliderChange(new_value, header_index, field_index)}
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Input
                                                key={'slider_input_' + header_index + '_' + field_index}
                                                className={classes.simulatorSliderInputBox}
                                                value={(this.state.slider_values[header_index + '_' + field_index] ? this.state.slider_values[header_index + '_' + field_index] : field_item.values) + (field_item.is_percent ? '%' : '')}
                                                readOnly
                                            />
                                        </Grid>
                                    </Grid>
                                );
                            })
                        }
                    </div>
                );
            } else {
                return '';
            }
        }, this);
    };

    getSliderValueRange = (slider_value) => {
        if (slider_value > 0) {
            return [0, parseFloat(slider_value) * 1.5];
        } else {
            return [parseFloat(slider_value) * 1.5, parseFloat(slider_value) * (-1) * 1.5];
        }
    };

    renderSimulatorGroups = () => {
        const { classes } = this.props;

        var split_sections = this.state.data.simulator.options.split.split('-');

        return (
            <Grid key={'simulator_container'} container spacing={2} className={classes.simulatorBodyContainer}>
                {parseInt(split_sections[0]) !== 0 ? [
                    <Grid key={'simulator_sliders'} item xs>
                        {this.renderSimulatorSliders(
                            0,
                            parseInt(split_sections[0])
                        )}
                    </Grid>,
                    <Grid key={'simulator_divider'} item xs={1}></Grid>
                ] : (
                    ''
                )}
                {parseInt(split_sections[1]) !== 0 ? [
                    <Grid key={'simulator_sections'} item xs>
                        {this.renderSimulatorSliders(
                            parseInt(split_sections[0]),
                            parseInt(split_sections[1])
                        )}
                    </Grid>,
                    <Grid key={'simulator_divider_2'} item xs={1}></Grid>
                ] : (
                    ''
                )}
                {this.state.data.simulator.optimize_options ? (
                    <Grid key={'simulator_optimize_section'} item xs={2}>
                        <Typography className={classes.simulatorSectionHeader} variant="h5">{this.state.data.simulator.optimize_options.section_header || 'Optimize for the goal below:'}</Typography>
                        {_.map(this.state.data.simulator.optimize_options.fields, function (field_group) {
                            return _.map(field_group, function (field_item, field_index) {
                                return (
                                    <Grid key={'simulator_groups_' + field_index} container spacing={2}>
                                        <Grid item xs>
                                            <Typography className={classes.simulatorOptimizeCellLabel} variant="h5">{field_item.name}</Typography>
                                        </Grid>
                                        {field_item.sub_name ? (
                                            <Grid item xs>
                                                <Typography className={classes.simulatorOptimizeCellLabel} variant="h5">({field_item.sub_name})</Typography>
                                            </Grid>
                                        ) : (
                                            <Grid item xs></Grid>
                                        )}
                                        <Grid item xs>
                                            <Input className={classes.simulatorOptimizeCellInput} variant="filled" value={field_item.value} />
                                        </Grid>
                                    </Grid>
                                );
                            });
                        })}
                    </Grid>
                ) : (
                    ''
                )}
            </Grid>
        );
    };

    handleTableWidgetAction = async (params) => {
        this.setState({ loading: true });
        try {
            triggerWidgetActionHandler({
                screen_id: this.props.screen_id,
                app_id: this.props.app_id,
                payload: {
                    widget_value_id: this.state.widget_value_id,
                    action_type: params.actionName,
                    data: params.tableProps,
                    filters: JSON.parse(sessionStorage.getItem('app_screen_filter_info_' + this.props.app_id + '_' + this.props.screen_id)),
                },
                callback: d => {
                    const rowData = d.rowData || d.tableProps?.rowData || params?.tableProps?.rowData || this.state.data?.tableProps?.rowData;
                    const coldef = d.coldef || d.tableProps?.coldef || params?.tableProps?.coldef || this.state.data?.tableProps?.coldef;
                    const gridOptions = d.gridOptions || d.tableProps?.gridOptions || params?.tableProps?.gridOptions || this.state.data?.tableProps?.gridOptions;
                    this.setState({
                        loading: false,
                        error: false,
                        error_message: false,
                        data: {
                            ...this.state.data,
                            ...d,
                            assumptions: d.assumptions ?? this.state.data.assumptions,
                            tableProps: {
                                rowData,
                                coldef,
                                gridOptions: {
                                    ...gridOptions,
                                    caption: d.tableCaption ?? gridOptions.tableCaption,
                                    errorMessage: d.tableErrorMessage ?? gridOptions.tableErrorMessage
                                }
                            }
                        }
                    });
                    this.handleStateUpdateRequest({
                        notification: {
                            message: d.message,
                            severity: d.error ? "error" : "success"
                        },
                        ...d?.extra_dir
                    })
                }
            })
        } catch(err) {
            this.setState({
                loading: false,
            });
            this.handleStateUpdateRequest({
                notification: {
                    message: err.message,
                    severity: "error"
                }
            })
        }
    }

    handleDynamicFormAction = async (action_type, payloadData, data) => {
        this.setState({ loading: true });
        try {
            await triggerWidgetActionHandler({
                screen_id: this.props.screen_id,
                app_id: this.props.app_id,
                payload: {
                    widget_value_id: this.state.widget_value_id,
                    action_type: action_type,
                    data: { simulator_options: this.state.data.simulator_options, ...payloadData},
                    filters: JSON.parse(sessionStorage.getItem('app_screen_filter_info_' + this.props.app_id + '_' + this.props.screen_id)),
                },
                callback: d => {
                    this.setState({
                        loading: false,
                        error: false,
                        error_message: false,
                        data: {
                            ...this.state.data,
                            ...data,
                            ...d,
                        }
                    });
                    this.handleStateUpdateRequest({
                        notification: {
                            message: d.message,
                            severity: d.error ? "error" : "success"
                        },
                        ...d?.extra_dir
                    })
                }
            })
        } catch(err) {
            this.setState({
                loading: false,
                data: {
                    ...this.state.data,
                    ...data,
                }
            });
            this.handleStateUpdateRequest({
                notification: {
                    message: err.message,
                    severity: "error"
                }
            })
        }
    }

    handleFetchFormData = async (action_type, payloadData, data) => {
        return await triggerWidgetActionHandler({
            screen_id: this.props.screen_id,
            app_id: this.props.app_id,
            payload: {
                widget_value_id: this.state.widget_value_id,
                action_type: action_type,
                data: { simulator_options: this.state.data.simulator_options, ...payloadData},
                filters: JSON.parse(sessionStorage.getItem('app_screen_filter_info_' + this.props.app_id + '_' + this.props.screen_id)),
            }
        });
    }

    handleModalFormAction =  async (action_type, payloadData, data) => {
        // this.setState({ loading: true });
        try {
            const d = await triggerWidgetActionHandler({
                screen_id: this.props.screen_id,
                app_id: this.props.app_id,
                payload: {
                    widget_value_id: this.state.widget_value_id,
                    action_type: action_type,
                    data: { simulator_options: this.state.data.simulator_options, ...payloadData},
                    filters: JSON.parse(sessionStorage.getItem('app_screen_filter_info_' + this.props.app_id + '_' + this.props.screen_id)),
                }
            });
            if (d.open) {
                return d;
            }
            this.setState({
                loading: false,
                error: false,
                error_message: false,
                data: {
                    ...this.state.data,
                    ...data,
                    ...d,
                }
            });
            this.handleStateUpdateRequest({
                notification: {
                    message: d.message,
                    severity: d.error ? "error" : "success"
                },
                ...d?.extra_dir
            })
            if (d.error) {
                throw new Error(d.message);
            } else {
                this.setState({loading: true});
                setTimeout(() => {this.setState({loading: false});}, 300);
                return true;
            }
        } catch (err) {
            this.setState({
                loading: false,
                data: {
                    ...this.state.data,
                    ...data,
                }
            });
            this.handleStateUpdateRequest({
                notification: {
                    message: err.message,
                    severity: "error"
                }
            })
            throw err;
        }
    }

    handleValidateValueChangeInGridTable = async (params) => {
        return new Promise(async (resolve, reject) => {
            try {
                await triggerWidgetActionHandler({
                    screen_id: this.props.screen_id,
                    app_id: this.props.app_id,
                    payload: {
                        widget_value_id: this.state.widget_value_id,
                        action_type: params.validator,
                        data: params,
                        filters: JSON.parse(sessionStorage.getItem('app_screen_filter_info_' + this.props.app_id + '_' + this.props.screen_id)),
                    },
                    callback: d => {
                        resolve(d);
                    }
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    handleStateUpdateRequest(params) {
        const { onStateUpdateRequest } = this.props;
        if (onStateUpdateRequest) {
            onStateUpdateRequest({
                tabActiveIndex: params.tabActiveIndex,
                refreshWidget: params.refreshWidget,
                notification: params.notification
            })
        } else {
            if (params.notification) {
                this.setState({
                    notification: params.notification,
                    notificationOpen: true
                })
            }
            if (params.refreshWidget) {
                this.refreshWidget()
            }
        }
    }

    handlePreLoaderAction = (params) => {
        const { isCancel, name, actionParams, quickAction, quickActionParams } = params;
        if (quickAction) {
            switch (quickAction) {
                case "toaster":
                    this.setState({ notification: quickActionParams, notificationOpen: true });
                    break;
                default:
                    break;
            }
        }
        if (!isCancel) {
            this.setState({ loading: true });
            triggerWidgetActionHandler({
                screen_id: this.props.screen_id,
                app_id: this.props.app_id,
                payload: {
                    widget_value_id: this.state.widget_value_id,
                    action_type: name,
                    data: actionParams,
                    filters: JSON.parse(sessionStorage.getItem('app_screen_filter_info_' + this.props.app_id + '_' + this.props.screen_id)),
                },
                callback: d => {
                    this.props.updateDataStateKey(d?.data_state_key); // needed to maintain the current widget data state, if one widget renders multiple state of data/view
                    this.setState({
                        loading: false,
                        error: false,
                        error_message: false,
                        data: d
                    });
                }
            })
        }
    }

    isTable = (params) => {
        return params && (params.multiple_tables || (params.table_data && params.table_headers));
    };

    isExpandableTable = (params) => {
        return params && params.isExpandable;
    };

    isPlot = (params) => {
        return params && (params.data && params.layout)
    };

    isInsights = (params) => {
        return params && (params.insight_data && params.insight_label);
    };

    isTestLearn = (params) => {
        return params && (params.test_learn_data);
    };

    isFlowTable = (params) => {
        return params && (params.flow_table);
    };

    isTableSimulator = (params) => {
        return params && (params.is_table_simulator);
    };

    isHTML = (params) => {
        return params && typeof params === 'string' && params.indexOf('DOCTYPE html') > -1;
    }

    isGanttTable = (params) => {
        return params && (params.is_gantt_table);
    };

    isKPI = params => {
        return params?.data?.value?.is_kpi;
    };

    isGridTable = params => {
        return params?.is_grid_table;
    };

    isAlternateSimulatorTableTypeA = params => {
        return params?.is_alternate_simulator_type_a;
    };

    isAlternateSimulatorTableTypeB = params => {
        return params?.is_alternate_simulator_type_b;
    };

    isPreLoader = params => {
        return !!params?.preLoader;
    }

    isCalendar = params => {
        return params.isCalendar
    }

    searchKeyUpdate = (key) => {
        this.setState({ searchKey: key })
    }

    isDynamicForm = params => {
        return params.form_config
    }

    renderVisualContent = () => {
        const { details, classes, graph_height } = this.props;

        if (this.isDynamicForm(this.state.data)) {
            return <AppWidgetDynamicForm params={this.state.data} onAction={this.handleDynamicFormAction} onValidateValueChangeInGridTable={this.handleValidateValueChangeInGridTable} cellInsightsGetter={this.handleCellInsightsGetter} onFetchFormData={this.handleFetchFormData} onModalFormAction={this.handleModalFormAction}  />
        } else if (this.isPreLoader(this.state.data)) {
            return <AppWidgetPreLoader params={this.state.data} onAction={this.handlePreLoaderAction} />
        } else if (this.isCalendar(this.state.data)) {
            return <Calendar parent_obj={this} params={this.state.data} />;
        } else if (this.isGridTable(this.state.data)) {
            return <GridTable params={this.state.data.tableProps} onOuterAction={this.handleTableWidgetAction} validateValueChange={this.handleValidateValueChangeInGridTable} />;
        } else if (this.isKPI(this.state.data)) {
            return <AppWidgetKpi params={this.state.data} />;
        } else if (this.isPlot(this.state.data)) {
            return <AppWidgetPlot
                params={this.state.data} graph_height={graph_height}
                size_nooverride={details.config.size_nooverride}
                color_nooverride={details.config.color_nooverride} trace_config={details.config.traces}
            />;
        } else if (this.isTable(this.state.data)) {
            return <div className={classes.gridTableBody}>
                <AppWidgetTable params={this.state.data} search={this.state.search} />
            </div>;
        } else if (this.isInsights(this.state.data)) {
            return <AppWidgetInsights params={this.state.data} />;
        } else if (this.isTestLearn(this.state.data)) {
            return <AppWidgetTestLearn params={this.state.data} parent_obj={this} />;
        } else if (this.isFlowTable(this.state.data)) {
            return <AppWidgetFlowTable params={this.state.data} parent_obj={this} />;
        } else if (this.isExpandableTable(this.state.data)) {
            return <AppWidgetExpandableTable params={this.state.data} />;
        } else if (this.isTableSimulator(this.state.data)) {
            return <AppWidgetTableSimulator params={this.state.data} parent_obj={this} searchKeyUpdate={this.searchKeyUpdate} />;
        } else if (this.isGanttTable(this.state.data)) {
            return <AppWidgetGanttTable params={this.state.data} />;
        } else if (this.isAlternateSimulatorTableTypeA(this.state.data)) {
            // return <AlternateSimulatorTypeA params={this.state.data}
            //     parent_obj={this}
            //     getScenarios={this.getScenarios}
            //     savedScenarios={this.state.savedScenarios}
            //     show_simulator={this.state.show_simulator}
            //     onCloseSimulator={this.onCloseSimulator}
            //     onLoadScenario={this.onLoadScenario}
            // />;
        } else if (this.isAlternateSimulatorTableTypeB(this.state.data)) {
            // return <AlternateSimulatorTypeB params={this.state.data}
            //     parent_obj={this}
            //     getScenarios={this.getScenarios}
            //     savedScenarios={this.state.savedScenarios}
            //     show_simulator={this.state.show_simulator}
            //     onCloseSimulator={this.onCloseSimulator}
            //     onLoadScenario={this.onLoadScenario}
            // />;
        } else if (this.isHTML(this.state.data)) {
            return <object aria-label={"app-widget-html-content"} style={{ height: "100%", width: "100%" }} data={'data:text/html,' + encodeURIComponent(this.state.data)}></object>;
        } else {
            return '';
        }
    };

    getCreateStoriesPayload = () => {
        return {
            name: this.props.title,
            description: '',
            app_id: this.props.app_id,
            app_screen_id: this.props.screen_id,
            app_screen_widget_id: this.props.details.id,
            app_screen_widget_value_id: this.state.widget_value_id,
            graph_data: '',
            filter_data: JSON.parse(sessionStorage.getItem('app_screen_filter_info_' + this.props.app_id + '_' + this.props.screen_id))
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
            payloadObject = payloadMap.get(this.props.app_id);
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
            // get index of object with widget_value_id
            var removeIndex = payloadObject.map(function (item) { return item.app_screen_widget_value_id; }).indexOf(this.state.widget_value_id);
            if (removeIndex !== -1) {
                payloadObject.splice(removeIndex, 1);
            }
        }

        payloadMap.set(this.props.app_id, payloadObject);
        localStorage.setItem('create-stories-payload', JSON.stringify(Array.from(payloadMap.entries())));
        this.props.parent_obj.props.handleStoriesCount();
    };

    onSearch = (v) => {
        this.setState({ search: v });
        const option_index = this.state.option_index;
        const filter_index = this.state.filter_index;
        var current_data = JSON.parse(JSON.stringify(this.state.data));
        const search = v.toLowerCase();
        if (current_data?.layout?.updatemenus) {
            current_data['layout']['updatemenus'][filter_index].active = option_index;
            current_data['layout']['updatemenus'][filter_index].showActive = true;

            var chart_option_args = current_data['layout']['updatemenus'][filter_index]['buttons'][option_index]['args'];

            _.each(chart_option_args, function (filter_item, filter_item_index) {

                if (filter_item['visible']) {
                    var visible = filter_item['visible'];
                    current_data['data'] = _.map(current_data['data'], function (data_item, trace_index) {
                        data_item.visible = visible[trace_index] && (data_item.text + "").toLowerCase().includes(search);
                        return data_item;
                    });
                }
                else if (filter_item['yaxis']) {
                    if (!current_data['layout']['yaxis']) {
                        current_data['layout']['yaxis'] = {};
                    }
                    current_data['layout']['yaxis']['title'] = {
                        ...current_data['layout']['yaxis']['title'],
                        text: filter_item['yaxis']['title']
                    };
                    if (filter_item['yaxis']['range'])
                        current_data['layout']['yaxis']['range'] = filter_item['yaxis']['range'];
                    if (filter_item['yaxis']['tickprefix'])
                        current_data['layout']['yaxis']['tickprefix'] = filter_item['yaxis']['tickprefix'];
                    if (filter_item['yaxis']['ticksuffix'])
                        current_data['layout']['yaxis']['ticksuffix'] = filter_item['yaxis']['ticksuffix'];

                }
                else if (filter_item['xaxis']) {

                    if (!current_data['layout']['xaxis']) {
                        current_data['layout']['xaxis'] = {};
                    }
                    current_data['layout']['xaxis']['title'] = {
                        ...current_data['layout']['xaxis']['title'],
                        text: filter_item['xaxis']['title']
                    };
                    if (filter_item['xaxis']['range'])
                        current_data['layout']['xaxis']['range'] = filter_item['xaxis']['range'];
                    if (filter_item['xaxis']['tickprefix'])
                        current_data['layout']['xaxis']['tickprefix'] = filter_item['xaxis']['tickprefix'];
                    if (filter_item['xaxis']['ticksuffix'])
                        current_data['layout']['xaxis']['ticksuffix'] = filter_item['xaxis']['ticksuffix'];

                }
                else {
                    return;
                }
            });

            this.setState({
                data: current_data,
                graph_filter_menu_open: false,
                graph_filter_menu_anchorEl: false,
                filter_search_value: ''
            });
        }
    };

    handleSimulatorChange = (newSimulatorValue) => {
        newSimulatorValue["errors"] = {};
        this.setState((v) => ({
            ...v,
            simulator_options: newSimulatorValue,
        }));
    };

    changefunc = (params) => {
        if (this.isTableSimulator(this.state.data)) {
            const tableData = { ...this.state.data };
            let rowsToChange = tableData.aux_table.rows;
            for (let row = 0; row < rowsToChange.length; row++) {
                for (let cell = 0; cell < rowsToChange[row].length; cell++) {
                    if (rowsToChange[row][cell]['update']) {
                        if (!isNaN(rowsToChange[row][cell]['value'])) {
                            rowsToChange[row][cell]['value'] = Math.floor((Math.random() * 100) + 1);
                        }
                        if (rowsToChange[row][cell]['formatted']) {
                            rowsToChange[row][cell]['value'] = Math.floor((Math.random() * 10000) + 1000);
                        }
                    }
                    else continue;

                }
            }
            tableData.aux_table.rows = rowsToChange;
            this.setData(d => ({ ...d, data: tableData }));
            this.setState({
                loading: false,
                error: false,
                error_message: false,
                data: {
                    ...this.state.data,
                    ...tableData
                }
            });
        }
    };

    resetfunc = (params) => {
        window.location.reload();
    };

    submitfunc = (params) => {
        alert("Submitted!");
    };

    uploadfunc = () => {
        let inpbutton = document.getElementById("contained-button-file");
        inpbutton.click();
    };

    downloadfunc = (params) => {
        window.location.href = 'https://willbedeletedsoon.blob.core.windows.net/rgm-data/TableSimulator_Scenario.xlsx';
    };

    handleActionInvoke = (action_type) => {
        // console.log(params);
        // console.log(props);
        // alert(action_type);
        // if (this.isTableSimulator(this.state.data)) {
        const widgetData = { ...this.state.data };
        let shouldUpdate = true;
        let errorMessages = [];
        if (!(action_type.toLowerCase().indexOf("reset") >= 0)) {
            // Not validating if type contains reset
            let comp = widgetData.simulator_options?.sections?.forEach((section, section_index) => {
                // console.log("SectionIndex: ", section_index);
                let controlerInputs = section.inputs.filter(input => input.control?.length);
                // console.log(controlerInputs);
                controlerInputs.map(controller => {
                    let maxSum = Number(controller.value);
                    let currSum = 0;
                    let controlledSliders = [];
                    section.inputs.forEach(input => {
                        if (controller.control.indexOf(input.id) >= 0) {
                            currSum += Number(input.value);
                            controlledSliders.push(input.label);
                        }
                    });
                    let isErrored = currSum !== maxSum; // Only for GMI
                    if (isErrored) {
                        errorMessages.push("* In Section: " + section.header + " sliders: " + controlledSliders.join(", ") + " do not sum up to Controller: " + controller.label);
                        errorMessages.push("Current Sum: " + +currSum.toFixed(12));
                    }
                    shouldUpdate = shouldUpdate && !isErrored;
                    // console.log("CurrentShouldUpdate: ", shouldUpdate);
                });
            });
        }

        if (shouldUpdate) {
            this.setState({ loading: true });
            triggerWidgetActionHandler({
                screen_id: this.props.screen_id,
                app_id: this.props.app_id,
                payload: {
                    widget_value_id: this.state.widget_value_id,
                    action_type,
                    data: widgetData,
                    filters: JSON.parse(sessionStorage.getItem('app_screen_filter_info_' + this.props.app_id + '_' + this.props.screen_id)),
                },
                callback: d => {
                    // removing error if applied
                    if (d.simulator_options?.errors) {
                        d.simulator_options.errors = {};
                    }
                    this.setState({
                        loading: false,
                        error: false,
                        error_message: false,
                        data: {
                            ...this.state.data,
                            ...d,
                        }
                    });
                    // this.setData((v) => ({
                    //     ...v,
                    //     simulator_options: d.simulator_options,
                    //     aux_table: d.aux_table,
                    //     main_table: d.main_table,
                    // }));
                }
            });
        }
        else {
            let errors = { show: true, messages: errorMessages };
            widgetData.simulator_options.errors = errors;
            // this.setData(d => ({ ...d, data: tableData }));
            this.setState({
                loading: false,
                error: false,
                error_message: false,
                data: {
                    ...this.state.data,
                    simulator_options: widgetData.simulator_options
                }
            });

        }
        // }

    };

    handleAltActionInvoke = (action_type, widgetData, defaultData, request_id) => {
        // console.log(params);
        // console.log(props);
        // alert(action_type);
        // if (this.isTableSimulator(this.state.data)) {
        // const widgetData = { ...this.state.data };

        this.setState({ loading: true });
        triggerWidgetActionHandler({
            screen_id: this.props.screen_id,
            app_id: this.props.app_id,
            payload: {
                // user_id: authContext.getCachedUser(authContext.config.clientId).userName,
                widget_value_id: this.state.widget_value_id,
                request_id: request_id,
                action_type,
                data: widgetData,
                old_data: defaultData ? defaultData : null,
                filters: JSON.parse(sessionStorage.getItem('app_screen_filter_info_' + this.props.app_id + '_' + this.props.screen_id)),
            },
            callback: d => {
                // removing error if applied
                if (d.simulator_options?.errors) {
                    d.simulator_options.errors = {};
                }
                this.setState({
                    loading: false,
                    error: false,
                    error_message: false,
                    data: {
                        ...this.state.data,
                        ...d,
                    }
                });
            }
        });


    };


    render() {
        const { title, details, classes } = this.props;
        const { notificationOpen, notification } = this.state;
        return (
            <div className={classes.graphBody}>
                <CustomSnackbar open={notificationOpen && notification?.message} autoHideDuration={notification?.autoHideDuration === undefined ? 3000 : notification?.autoHideDuration} onClose={() => this.setState({ notificationOpen: false })} severity={notification?.severity || "success"} message={notification?.message} />
                {this.state.data && this.state.data.simulator && (this.state.show_simulator || (!this.isTable(this.state.data) && !this.isInsights(this.state.data) && !this.isPlot(this.state.data) && !this.isTestLearn(this.state.data) && !this.isFlowTable(this.state.data) && !this.isExpandableTable(this.state.data) && !this.isTableSimulator(this.state.data) && !this.isGanttTable(this.state.data) && !this.isCalendar(this.state.data))) ? (
                    <div className={this.state.show_simulator ? classes.graphSimulatorHalfContainer : classes.graphSimulatorContainer}>
                        <div className={classes.graphSimulatorContainer}>
                            <div className={classes.graphLabel}>
                                <Typography color="initial" variant="h5">{this.state.data.simulator.options.button_name ? this.state.data.simulator.options.button_name : title.toUpperCase()}</Typography>
                            </div>

                            <Grid container spacing={0}>
                                {this.state.data.simulator.options.readonly_fields ? (
                                    <Grid item className={classes.simulatorTableHeaders} xs={2 + this.state.data.simulator.options.readonly_fields.length}>
                                        <Typography className={classes.simulatorTableHeaderText} component="span" variant="h5">{this.state.data.simulator.options.readonly_header}</Typography>
                                    </Grid>
                                ) : (
                                    ''
                                )}
                                {this.state.data.simulator.options.readonly_fields ? (
                                    <Grid item className={classes.simulatorTableHeaders} xs={this.state.data.simulator.options.multiple_field_value_labels.length - this.state.data.simulator.options.readonly_fields.length}>
                                        <Typography className={classes.simulatorTableHeaderText} component="span" variant="h5">{this.state.data.simulator.options.fields_header}</Typography>
                                    </Grid>
                                ) : (
                                    ''
                                )}
                            </Grid>
                            {this.state.data.simulator.options.readonly_headers ? (
                                this.state.data.simulator.options.split ? (
                                    this.renderSimulatorGroups()
                                ) : (
                                    <div className={classes.simulatorBodyContainer}>
                                        {this.renderSimulatorSliders(0, this.state.data.simulator.options.readonly_headers.length)}
                                    </div>
                                )
                            ) : (
                                <div className={classes.simulatorBodyContainerMultiple}>
                                    <Grid container spacing={0}>
                                        <Grid item xs={2}>
                                            <div className={classes.simulatorTableCell}>
                                                <Typography className={classes.simulatorTableCellText} style={{ color: '#ffffff' }} variant="h5">{"Drivers"}</Typography>
                                            </div>
                                            {_.map(this.state.data.simulator.options.fields, function (field_item, field_item_index) {
                                                return (
                                                    <div key={"level-labels-" + field_item_index} className={classes.simulatorTableFirstColCell}>
                                                        <Typography className={classes.simulatorTableFirstColCellText} variant="h5" display="inline">{field_item.name}</Typography>
                                                        <Typography className={classes.simulatorTableFirstColCellText} variant="subtitle1" display="inline">{field_item.subtitle ? ' (' + field_item.subtitle + ')' : ''}</Typography>
                                                    </div>
                                                );
                                            })}
                                        </Grid>
                                        {_.map(this.state.data.simulator.options.multiple_field_value_labels, function (field_value_label, field_value_label_index) {
                                            return (
                                                <Grid key={"level-values-container-" + field_value_label_index} item xs={1}>
                                                    <div className={classes.simulatorTableCell}>
                                                        <Typography className={classes.simulatorTableCellText} variant="h5">{field_value_label}</Typography>
                                                    </div>
                                                    {_.map(this.state.data.simulator.options.fields, function (field_item, field_item_index) {
                                                        return (
                                                            <div key={"level-values-" + field_item_index + "-" + field_value_label_index} className={classes.simulatorTableCell}>
                                                                {this.state.data.simulator.options.readonly_fields.includes(field_value_label) ? (
                                                                    <Typography className={classes.simulatorTableCellText} variant="h5">
                                                                        {field_item.values[field_value_label_index]}
                                                                    </Typography>
                                                                ) : (
                                                                    <Input className={classes.simulatorTableCellInput} variant="filled" value={field_item.values[field_value_label_index]} />
                                                                )}
                                                            </div>
                                                        );
                                                    }, this)}
                                                </Grid>
                                            );
                                        }, this)}
                                    </Grid>
                                </div>
                            )}


                            <div className={classes.simulatorFormDivider}></div>
                            <div className={classes.graphActions}>
                                {(this.state.data && this.state.data.simulator && this.state.show_simulator) &&
                                    <Button variant="outlined" className={classes.simulatorButtons} onClick={this.onCloseSimulator}>
                                        {'Close'}
                                    </Button>
                                }
                                <Button variant="outlined" className={classes.simulatorButtons} onClick={this.onResetSimulator}>
                                    {'Reset'}
                                </Button>
                                <Button variant="contained" className={classes.simulatorButtons} onClick={this.onApplySimulator}>
                                    {'Apply'}
                                </Button>
                                <Button variant="contained" className={classes.simulatorButtons} onClick={this.onSaveScenario}>
                                    {'Save Scenario'}
                                </Button>
                                <FormDialogSaveScenario dialogOpen={this.state.save_scenario_dialog_open} handleDialogClose={this.onCloseSaveScenarioDialog} />
                            </div>
                            <br clear="all" />
                        </div>
                        {this.state.show_simulator ? (
                            <div className={classes.simulatorFormDivider}></div>
                        ) : (
                            ''
                        )}
                    </div>
                ) : (
                    ''
                )}
                {(!this.state.data && this.state.loading) || (!this.state.loading && this.state.data && (this.isHTML(this.state.data) || this.isTable(this.state.data) || this.isInsights(this.state.data) || this.isPlot(this.state.data) || this.isTestLearn(this.state.data) || this.isFlowTable(this.state.data) || this.isExpandableTable(this.state.data) || this.isTableSimulator(this.state.data) || this.isGanttTable(this.state.data))) || this.isKPI(this.state.data) || this.isGridTable(this.state.data) || this.isAlternateSimulatorTableTypeA(this.state.data) || this.isAlternateSimulatorTableTypeB(this.state.data) || this.isPreLoader(this.state.data) || this.isCalendar(this.state.data) ? (
                    <div className={this.state.show_simulator ? classes.graphHalfWrapper : classes.graphWrapper}>
                        <Box display="flex" justifyContent="space-between">
                            <div className={classes.graphLabel}>
                                <AppConfigWrapper appConfig={AppConfigOptions.data_story}>
                                    <Checkbox
                                        checked={this.state.checked}
                                        className={classes.storyCheckbox}
                                        style={{ visibility: this.state.checked ? 'visible' : 'hidden' }}
                                        disableRipple={true}
                                        onChange={event => { this.onCheckboxValueChange(event.target.checked); }}
                                    />
                                </AppConfigWrapper>
                                <div>
                                    {/* <Typography color="initial" variant="h5">{title}</Typography> */}
                                    <Typography color="initial" variant="h5">{this.state.data && this.state.data.title ? this.state.data.title : title}</Typography>
                                    <Typography color="initial" variant="h6">{details['config']['subtitle']}</Typography>
                                </div>
                            </div>

                            <div className={classes.graphActionsBar}>
                                {this.props.alert_enable && this.state.alert_data?.alert_config?.categories ? <AlertDialog
                                    app_screen_widget_id={this.props.details.id}
                                    app_id={this.props.app_id}
                                    app_screen_id={this.props.screen_id}
                                    category={this.state.alert_data.alert_config.categories}
                                    alertWidgetType={this.state.alertWidgetType}
                                    source={this.props.source}
                                    widget_value={this.state.alert_data}
                                /> : ''
                                    //this.generateAlertData(this.state.data)
                                }

                                {this.state.graph_filters && this.state.graph_filters.length > 0 ? (
                                    <div className={classes.actionsBarItem}>
                                        {this.renderChartFilters()}
                                    </div>
                                ) : ''}

                                {this.state.data && this.state.data.simulator && !this.state.show_simulator || this.isAlternateSimulatorTableTypeA(this.state.data) || this.isAlternateSimulatorTableTypeB(this.state.data) && !this.state.show_simulator ? (
                                    <div className={classes.actionsBarItem}>
                                        <Button variant="contained" className={classes.simulateButton} onClick={this.onClickSimulator}>
                                            {this.state.data.simulator && this.state.data.simulator.options.button_name ? this.state.data.simulator.options.button_name : 'Simulate'}
                                        </Button>
                                    </div>
                                ) : (
                                    null
                                )}

                                {this.state.data && this.state.download_data && (this.isPlot(this.state.data) || this.isExpandableTable(this.state.data) || this.isTableSimulator(this.state.data) || this.isAlternateSimulatorTableTypeA(this.state.data) || this.isAlternateSimulatorTableTypeB(this.state.data) || this.isGridTable(this.state.data) || this.isDynamicForm(this.state.data)) ? (
                                    <div className={classes.actionsBarItem}>
                                        <DownloadWorkBook searchKey={this.state.searchKey} tableData={this.state.data.download_data} filename={this.state.data.download_data.fileName ? this.state.data.download_data.fileName : this.props.title} />
                                    </div>

                                ) : (this.state.data && this.isTable(this.state.data) && !this.state.data.multiple_tables && !this.state.data?.suppress_download ? (
                                    <CsvDownload
                                        className={classes.downloadButtonSingleTable}
                                        data={_.map(this.state.data.table_data, function (data_item, row_index) {
                                            var response = {};
                                            _.each(this.state.data.table_headers, function (table_header, table_header_index) {
                                                if (typeof data_item[table_header_index] === 'object' && data_item[table_header_index] && data_item[table_header_index].value) {
                                                    response[table_header] = data_item[table_header_index].value;
                                                } else {
                                                    response[table_header] = data_item[table_header_index];
                                                }
                                            });

                                            return response;
                                        }, this)}
                                    >
                                        <GetApp fontSize="large" color="inherit" />
                                    </CsvDownload>
                                ) : ''
                                )}

                                <div className={classes.actionsBarItem}>
                                    <AppWidgetAssumptions key={'widget_graph_assumptions_' + details.id + '_' + details.widget_index} large={true} params={this.state.data} />
                                </div>

                                <div className={classes.actionsBarItem}>
                                    {this.props.actionItem}
                                </div>
                            </div>
                        </Box>
                        <br clear="all" />
                        {this.state.loading ? (
                            <div className={classes.graphLoader}>
                                {/* <CircularProgress className={classes.graphLoaderIcon} classes={{
                                    colorPrimary: classes.graphLoaderColor
                                }} /> */}
                                <Skeleton variant="rect"
                                    animation="wave"
                                    component="div"
                                    width="100%"
                                    height="100%"
                                    className={classes.skeletonWave}
                                />;
                                <CodxCircularLoader size={120} center />
                            </div>
                        ) : (
                            this.state.data ? (
                                <React.Fragment>
                                    {this.state.data.show_searchbar ? <div className={classes.halfSearchBar}>
                                        <SearchBar placeholder={"Search Here!"} onChangeWithDebounce={this.onSearch} />
                                    </div> : ''}
                                    <div className={classes.graphContainer}>
                                        {this.state.data.simulator_options &&
                                            <AppWidgetSimulator
                                                onChange={this.handleSimulatorChange}
                                                classes={classes}
                                                simulatorInfo={this.state.data.simulator_options}
                                                changefunc={this.changefunc}
                                                resetfunc={this.resetfunc}
                                                submitfunc={this.submitfunc}
                                                uploadfunc={this.uploadfunc}
                                                downloadfunc={this.downloadfunc}
                                                actionfunc={this.handleActionInvoke} />}

                                        {this.state.data ? this.renderVisualContent() : ''}
                                    </div>
                                </React.Fragment>

                            ) : (
                                <div className={classes.graphLoader}>
                                    <Error fontSize="large" color="secondary" className={classes.graphLoaderIcon} classes={{
                                        colorPrimary: classes.graphLoaderColor
                                    }} />
                                </div>
                            )
                        )}
                    </div>
                ) : (
                    this.state.loading ? (
                        <div className={classes.graphLoader}>
                            <CircularProgress className={classes.graphLoaderIcon} classes={{
                                colorPrimary: classes.graphLoaderColor
                            }} />
                        </div>
                    ) : ''
                )}
                {this.state.error ? (
                    <Error role="img" fontSize="large" titleAccess={this.state.error_message ? this.state.error_message : "Internal Server Error"} />
                ) : (
                    ''
                )}
            </div>
        );
    }
};

AppWidgetGraph.propTypes = {
    classes: PropTypes.object.isRequired,
    app_id: PropTypes.string.isRequired,
    screen_id: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
    title: PropTypes.string.isRequired,
    details: PropTypes.object.isRequired,
    selected_filters: PropTypes.object.isRequired,
    graph_height: PropTypes.string.isRequired,
};

const mapStateToProps = state => {
    return {
        screens: state.createStories.selectedScreens,
        screenId: state.createStories.screenId
    };
};

// const mapDispatchToProps = dispatch => {
//     return {
//     }
// }


export default connect(mapStateToProps, null)(withStyles(
    (theme) => ({
        ...appWidgetGraphStyle(theme),
    }),
    { useTheme: true }
)(AppWidgetGraph));