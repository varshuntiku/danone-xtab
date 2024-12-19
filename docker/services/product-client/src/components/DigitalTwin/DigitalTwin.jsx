import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { withStyles } from '@material-ui/core/styles';
import { Typography, RadioGroup, Button, Tooltip, Grid, IconButton } from '@material-ui/core';
import {
    Select,
    MenuItem,
    ListItemText,
    FormControl,
    InputLabel,
    Checkbox
} from '@material-ui/core';
import { fetch_socket_connection } from 'util/initiate_socket.js';
import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import createPlotlyComponent from 'react-plotly.js/factory';
import { withThemeContext } from 'themes/customThemeContext.jsx';
import { executeCode } from 'services/widget.js';
import digitalTwinCanvasStyle from 'assets/jss/digitalTwinCanvasStyle.jsx';
import appWidgetPlotStyle from 'assets/jss/appWidgetPlotStyle.jsx';
import Drawer from './Drawer.jsx';
import { GLOBAL_FONT_FAMILY } from 'util/fontFamilyConfig.js';
import * as _ from 'underscore';
// const Plotly = window.Plotly;
// const Plot = createPlotlyComponent(Plotly);
const CodxFontFamily = GLOBAL_FONT_FAMILY;

class DigitalTwin extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        let current_date = new Date();
        current_date.setDate(current_date.getDate() - 1);

        this.state = {
            app_id: props.app_id,
            screen_id: props.screen_id,
            widget_value_id: props.widgetData?.data?.widget_value_id,
            widget_id: props.details.id,
            digitaltwin_data: props.widgetData?.data?.value?.digital_twin,
            digitaltwin_simulated_data: props.widgetData?.data?.simulated_value?.digital_twin,
            displayKPI: false,
            hoverMetric: false,
            drawerOpen: false,
            simulateOpen: false,
            actionOpen: false,
            actionLoading: false,
            actionPlot: false,
            drawer_zone: 'all',
            show_simulate_output: false,
            show_simulate_input: false,
            historic_dropdowns: {},
            analysis_filters: {
                metric: null,
                metric_dropdowns: []
            },
            rightpopout_filters: {},
            digitaltwin_drawer_data: props.widgetData?.data?.value?.digital_twin?.drawer,
            rightpopoutLoading: false,
            simulate_filters: {
                scenarios: null,
                sales_channel: []
            },
            simulateLoading: false,
            source: this.props.title,
            drawerSizes: {
                large: 185,
                medium: 120,
                small: 60
            },
            historicdrop_down: false
        };
        this.socket = fetch_socket_connection();
    }
    componentDidMount() {
        let display_kpis = this.state.digitaltwin_data.display_kpis;
        let display_kpi = false;
        if (display_kpis && display_kpis.length > 0) {
            display_kpi = display_kpis[0]?.value;
        }
        let slider_values = false;
        if (this.state.digitaltwin_data.simulate) {
            slider_values = [
                22500, 4000, 3000, 6000, 4000, 8000, 4, 9, 257, 4, 15, 14, 0, 1000, 0, 50, 0, 30
            ];
        }
        this.setState({
            displayKPI: display_kpi,
            simulate_input_values: slider_values
        });
        let screen = this.props.source.split('>>')[1].trim();
        let widget = this.props.title.trim();
        this.socket['socket_product']?.emit('init_progress_loader_component', {
            app_id: this.props.app_id,
            screen_name: screen,
            widget_name: widget
        });
        if (
            !this.socket['socket_product']?.hasListeners(
                'progress_loader_' + this.props.app_id + '#' + screen + '#' + widget
            )
        ) {
            this.socket['socket_product']?.on(
                'progress_loader_' + this.props.app_id + '#' + screen + '#' + widget,
                (data) => {
                    if (!this.state.digitaltwin_data.historic) {
                        let updatedData = this.state.digitaltwin_data;
                        data.widget_data.map(function (data) {
                            for (let i = 0; i < updatedData.metrics.length; i++) {
                                if (
                                    updatedData.metrics[i].group == data.group &&
                                    updatedData.metrics[i].name == data.name &&
                                    updatedData.metrics[i].metric_key == data.metric_key
                                ) {
                                    updatedData.metrics[i].metric_value = data.metric_value;
                                    updatedData.metrics[i].style.backgroundColor =
                                        data?.backgroundColor ||
                                        updatedData.metrics[i].style.backgroundColor;
                                    updatedData.metrics[i]['recommendations'] =
                                        data?.recommendations || false;
                                    updatedData.metrics[i].recommendationsList =
                                        data?.recommendationsList ||
                                        updatedData.metrics[i]?.recommendationsList;
                                }
                            }
                        });
                        this.setState({
                            digitaltwin_data: updatedData
                        });
                    }
                }
            );
        }
        let simulateObj = {};
        let analysisObj = {};
        let historicDropdown = {};
        let drawerObj = {};
        if (this.state.digitaltwin_data?.simulate?.extra_filters) {
            this.state.digitaltwin_data?.simulate?.extra_filters.map((el) => {
                if (this.state.digitaltwin_data?.simulate?.default_filters) {
                    simulateObj = {
                        ...simulateObj,
                        [`${el.name}`]: this.state.digitaltwin_data?.simulate?.default_filters
                            ? this.state.digitaltwin_data?.simulate?.default_filters[0][el.id]
                                ? this.state.digitaltwin_data?.simulate?.default_filters[0][el.id]
                                : []
                            : []
                    };
                } else {
                    simulateObj = { ...simulateObj, [`${el.name}`]: [] };
                }
            });
        }

        if (this.state.digitaltwin_data?.time_series?.extra_filters) {
            this.state.digitaltwin_data?.time_series?.extra_filters.map((el) => {
                if (this.state.digitaltwin_data?.time_series?.default_filters) {
                    analysisObj = {
                        ...analysisObj,
                        [`${el.name}`]: this.state.digitaltwin_data?.time_series?.default_filters
                            ? this.state.digitaltwin_data?.time_series?.default_filters[0][el.id]
                                ? this.state.digitaltwin_data?.time_series?.default_filters[0][
                                      el.id
                                  ]
                                : []
                            : []
                    };
                } else {
                    analysisObj = { ...analysisObj, [`${el.name}`]: [] };
                }
            });
        }
        if (this.state.digitaltwin_data?.historic?.extra_filters) {
            this.state.digitaltwin_data?.historic?.extra_filters.map((el) => {
                if (this.state.digitaltwin_data?.historic?.default_filters) {
                    historicDropdown = {
                        ...historicDropdown,
                        [`${el.name}`]: this.state.digitaltwin_data?.historic?.default_filters
                            ? this.state.digitaltwin_data?.historic?.default_filters[0][el.id]
                                ? this.state.digitaltwin_data?.historic?.default_filters[0][el.id]
                                : []
                            : []
                    };
                } else {
                    historicDropdown = { ...historicDropdown, [`${el.name}`]: [] };
                }
                this.setState({
                    historicdrop_down: true
                });
            });
        }
        if (this.state.digitaltwin_data?.drawer?.extra_filters) {
            this.state.digitaltwin_data?.drawer?.extra_filters.map((el) => {
                if (this.state.digitaltwin_data?.time_series?.default_filters) {
                    drawerObj = {
                        ...drawerObj,
                        [`${el.name}`]: this.state.digitaltwin_data?.drawer?.default_filters
                            ? this.state.digitaltwin_data?.drawer?.default_filters[0][el.id]
                                ? this.state.digitaltwin_data?.drawer?.default_filters[0][el.id]
                                : []
                            : []
                    };
                } else {
                    drawerObj = { ...drawerObj, [`${el.name}`]: [] };
                }
            });
        }
        this.setState({
            simulate_filters: {
                ...this.state.simulate_filters,
                ...simulateObj
            },
            analysis_filters: {
                ...this.state.analysis_filters,
                ...analysisObj
            },
            historic_dropdowns: {
                ...this.state.historic_dropdowns,
                ...historicDropdown
            },
            rightpopout_filters: {
                ...this.state.rightpopout_filters,
                ...drawerObj
            }
        });
    }

    componentWillUnmount = () => {
        if (this.props.source && this.props.title) {
            let screen = this.props.source.split('>>')[1].trim();
            let widget = this.props.title.trim();
            this.socket['socket_product']?.emit('stop_progress_loader', {
                app_id: this.props.app_id,
                screen_name: screen,
                widget_name: widget
            });
            if (
                this.socket['socket_product']?.hasListeners(
                    'progress_loader_' + this.props.app_id + '#' + screen + '#' + widget
                )
            ) {
                this.socket['socket_product']?.removeListener(
                    'progress_loader_' + this.props.app_id + '#' + screen + '#' + widget
                );
            }
        }
    };

    updateWidgetData = (data) => {
        this.setState({
            digitaltwin_data: data.digital_twin
        });
    };

    handleKPIChange = (value) => {
        this.setState({
            displayKPI: value
        });
    };

    onMouseOverMetric = (metric_item) => {
        this.setState({
            hoverMetric: metric_item
        });
    };

    onMouseOutMetric = () => {
        this.setState({
            hoverMetric: false
        });
    };

    onClickZone = (metric_item) => {
        this.setState({
            hoverMetric: false,
            selectedMetric: metric_item
        });
    };

    onCloseZone = () => {
        this.setState({
            selectedMetric: false
        });
    };

    onOpenDrawer = () => {
        this.setState({
            drawerOpen: true
        });
        this.rightPopoutStateChange(['all'], 'sales_channel', true);
    };

    onCloseDrawer = () => {
        this.setState({
            drawerOpen: false
            // rightpopout_filters: {}
        });
    };

    onChangeZone = (evt) => {
        this.setState({
            drawer_zone: evt.target.value
        });
    };

    onRenderDrawerZone = () => {
        const { classes } = this.props;

        let drawer_zone_options = [{ label: 'Select All', value: 'all' }];

        let filtered_metrics = _.filter(
            this.state.digitaltwin_data.metrics,
            function (metric_item) {
                return metric_item.group;
            }
        );

        _.each(
            _.groupBy(
                _.unique(
                    _.map(filtered_metrics, function (metric_item) {
                        return {
                            name: metric_item.name,
                            group: metric_item.group
                        };
                    }),
                    false
                ),
                function (metric_mapped_item) {
                    return metric_mapped_item.group;
                }
            ),
            function (zones, zone_group) {
                drawer_zone_options.push({
                    label: zone_group + '/ All Zones',
                    value: zone_group + '_all'
                });

                _.each(
                    _.uniq(
                        _.map(zones, function (zone_item) {
                            return zone_item.name;
                        })
                    ),
                    function (filtered_zone_item) {
                        if (filtered_zone_item) {
                            drawer_zone_options.push({
                                label: zone_group + '/ ' + filtered_zone_item,
                                value: zone_group + '_' + filtered_zone_item
                            });
                        }
                    }
                );
            }
        );

        return (
            <div
                key={'digital_twin_drawer_zone_container'}
                className={clsx(classes.drawerDropdown, classes.digitalTwinPopupDropdown)}
            >
                <Typography
                    variant="body1"
                    className={classes.digitalTwinDetailsDrawerFilterHeader}
                >
                    Sales Channel
                </Typography>
                <Select
                    fullWidth={true}
                    value={this.state.drawer_zone}
                    onChange={this.onChangeZone}
                >
                    {drawer_zone_options.map((element) => (
                        <MenuItem
                            key={element.value}
                            value={element.value}
                            className={classes.digitalTwinPopupDropdownMenuItem}
                        >
                            <ListItemText primary={element.label} />
                        </MenuItem>
                    ))}
                </Select>
                <br clear="all" />
            </div>
        );
    };

    onChangeHistoricDropdown = (dropdown_value, dropdown_type) => {
        let dropdownLength = this.state.digitaltwin_data.historic.extra_filters.filter(
            (ele) => ele.name === dropdown_type
        )[0].options.length;
        let historicDropdownValues = this.state.historic_dropdowns[dropdown_type].length;
        if (dropdown_value.includes('all' || 'All')) {
            let filterValues = ['all'];
            let values = this.state.digitaltwin_data.historic.extra_filters.find(
                (ele) => ele.name === dropdown_type
            )['options'];
            for (let i in values) {
                filterValues.push(values[i].value);
            }
            this.setState({
                historic_dropdowns: {
                    ...this.state.historic_dropdowns,
                    [dropdown_type]: filterValues
                },
                historicdrop_down: true
            });
        } else if (
            historicDropdownValues - 1 === dropdownLength &&
            !dropdown_value.includes('all' || 'All')
        ) {
            this.setState({
                historic_dropdowns: { ...this.state.historic_dropdowns, [dropdown_type]: [] },
                actionLoading: true
            });
        } else {
            this.setState({
                ...this.state,
                historic_dropdowns: {
                    ...this.state.historic_dropdowns,
                    [dropdown_type]: dropdown_value
                },
                historicdrop_down: true
            });
        }
    };

    renderHistoricOptions = () => {
        const { classes } = this.props;
        return [
            this.state.digitaltwin_data.historic.extra_filters.map((filter_item) => {
                return (
                    <FormControl
                        key={filter_item.name}
                        className={classes.digitalTwinHistoricFilterDropdowmMultiple}
                    >
                        <InputLabel>{filter_item.name}</InputLabel>
                        <Select
                            value={this.state.historic_dropdowns[filter_item.name]}
                            multiple={filter_item?.multiselect ? true : false}
                            onChange={(evt) =>
                                this.onChangeHistoricDropdown(evt.target.value, filter_item.name)
                            }
                            renderValue={(selected) => {
                                let selectedLabels = [];
                                if (filter_item.multiselect) {
                                    if (selected.includes('all')) {
                                        let reselected = selected.filter((el) => el !== 'all');
                                        for (let i in reselected) {
                                            selectedLabels.push(
                                                filter_item.options.filter(
                                                    (el) => el.value === reselected[i]
                                                )[0].label
                                            );
                                        }
                                    } else {
                                        for (let i in selected) {
                                            selectedLabels.push(
                                                filter_item.options.filter(
                                                    (el) => el.value === selected[i]
                                                )[0].label
                                            );
                                        }
                                    }
                                }
                                let content = filter_item?.multiselect
                                    ? selectedLabels.join(',')
                                    : selected;
                                return content;
                            }}
                        >
                            {filter_item.multiselect && (
                                <MenuItem value="all">
                                    <Checkbox
                                        checked={
                                            this.state.historic_dropdowns[filter_item.name].indexOf(
                                                'all'
                                            ) > -1
                                        }
                                    />
                                    <ListItemText primary="Select all" />
                                </MenuItem>
                            )}
                            {filter_item.options.map((item) => {
                                return (
                                    <MenuItem
                                        key={item.value}
                                        value={item.value}
                                        className={classes.digitalTwinPopupDropdownMenuItem}
                                    >
                                        {filter_item?.multiselect && (
                                            <Checkbox
                                                checked={
                                                    this.state.historic_dropdowns[
                                                        filter_item.name
                                                    ].indexOf(item.value) > -1
                                                }
                                            />
                                        )}
                                        <ListItemText primary={item.label} />
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                );
            })
        ];
    };

    renderSectionOptions = (dropdown_options) => {
        const { classes } = this.props;

        return (
            <div className={classes.drawerSectionOptionsContainer}>
                <div
                    className={clsx(
                        classes.drawerSectionOptionsBody,
                        classes.digitalTwinPopupDropdown
                    )}
                >
                    <Select fullWidth={true} value={dropdown_options[0]}>
                        {dropdown_options.map((element) => (
                            <MenuItem
                                key={element}
                                value={element}
                                className={classes.digitalTwinPopupDropdownMenuItem}
                            >
                                <ListItemText primary={element} />
                            </MenuItem>
                        ))}
                    </Select>
                    <br clear="all" />
                </div>
                <br clear="all" />
            </div>
        );
    };

    debounce = (cb, delay) => {
        let timer;
        return () => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => cb(), delay);
        };
    };
    delayFunction = this.debounce(() => this.loadActionPlot(this.state.actionOpen), 1500);

    delayFunction2 = this.debounce(() => this.loadRightpopoutData(), 1500);

    onChangeDropDown = (dropdown_value, dropdown_type) => {
        let filtersLength;
        let dropdownLength;
        if (dropdown_type !== 'metric') {
            filtersLength = this.state.digitaltwin_data[this.state.actionOpen].extra_filters.filter(
                (ele) => ele.name === dropdown_type
            )[0].options.length;
            dropdownLength = this.state.analysis_filters[dropdown_type].length;
        }
        if (dropdown_value.includes('all' || 'All')) {
            let filterValues = ['all'];
            let values = this.state.digitaltwin_data[this.state.actionOpen].extra_filters.find(
                (ele) => ele.name === dropdown_type
            )['options'];
            for (let i in values) {
                filterValues.push(values[i].value);
            }
            this.setState({
                analysis_filters: { ...this.state.analysis_filters, [dropdown_type]: filterValues },
                actionLoading: true
            });
        } else if (
            dropdownLength - 1 === filtersLength &&
            !dropdown_value.includes('all' || 'All')
        ) {
            this.setState({
                analysis_filters: { ...this.state.analysis_filters, [dropdown_type]: [] },
                actionLoading: true
            });
        } else {
            if (dropdown_type === 'metric') {
                this.setState({
                    displayKPI: dropdown_value,
                    analysis_filters: {
                        ...this.state.analysis_filters,
                        [dropdown_type]: dropdown_value
                    },
                    actionLoading: true
                });
            } else {
                this.setState({
                    analysis_filters: {
                        ...this.state.analysis_filters,
                        [dropdown_type]: dropdown_value
                    },
                    actionLoading: true
                });
            }
        }

        this.delayFunction();
    };

    onClickMetricAction = (action_type, group_name, metric_name) => {
        this.setState({
            drawerOpen: false,
            simulateOpen: false,
            selectedMetric: false,
            actionOpen: action_type,
            actionLoading: true,
            analysis_filters: {
                ...this.state.analysis_filters,
                sales_channel: [...this.state.analysis_filters.sales_channel, group_name],
                metric: metric_name
            }
        });
        this.delayFunction();
    };

    onCloseMetricAction = () => {
        this.setState({
            actionOpen: false,
            actionLoading: false
        });
    };

    loadActionPlot = (action_type) => {
        const { app_id } = this.props;
        executeCode({
            app_id: app_id,
            inputs: [],
            code: this.state.digitaltwin_data[action_type].code,
            selected_filters: [this.state.analysis_filters],
            callback: this.onResposeActionPlot
        });
    };

    loadRightpopoutData = () => {
        const { app_id } = this.props;
        executeCode({
            app_id: app_id,
            inputs: [],
            code: this.state.digitaltwin_data.drawer.code,
            selected_filters: this.state.rightpopout_filters,
            callback: this.onResponseRightPopout
        });
    };
    onResponseRightPopout = (response) => {
        if (response?.data) {
            this.setState({
                digitaltwin_data: {
                    ...this.state.digitaltwin_data,
                    drawer: { ...this.state.digitaltwin_data.drawer, ...response.data }
                }
            });
        }
        this.setState({ rightpopoutLoading: false });
    };
    rightPopoutStateChange = (dropdown_value, dropdown_type, initial = false) => {
        if (this.state.drawerOpen || initial) {
            let filtersLength;
            let dropdownLength;
            filtersLength = this.state.digitaltwin_data.drawer.extra_filters.filter(
                (ele) => ele.name === dropdown_type
            )[0].options.length;
            dropdownLength = this.state.rightpopout_filters[dropdown_type].length;
            if (dropdown_value.includes('all' || 'All')) {
                let filterValues = ['all'];
                let values = this.state.digitaltwin_data.drawer.extra_filters.find(
                    (ele) => ele.name === dropdown_type
                )['options'];
                for (let i in values) {
                    filterValues.push(values[i].value);
                }
                this.setState({
                    rightpopout_filters: {
                        ...this.state.rightpopout_filters,
                        [dropdown_type]: filterValues
                    },
                    rightpopoutLoading: true
                });
            } else if (
                dropdownLength - 1 === filtersLength &&
                !dropdown_value.includes('all' || 'All')
            ) {
                this.setState({
                    rightpopout_filters: { ...this.state.simulate_filters, [dropdown_type]: [] },
                    rightpopoutLoading: true
                });
            } else {
                this.setState({
                    rightpopout_filters: {
                        ...this.state.rightpopout_filters,
                        [dropdown_type]: dropdown_value
                    },
                    rightpopoutLoading: true
                });
            }
            this.delayFunction2();
        } else if (this.state.simulateOpen) {
            let filtersLength;
            let dropdownLength;
            if (dropdown_type !== 'scenarios') {
                filtersLength = this.state.digitaltwin_data.simulate.extra_filters.filter(
                    (ele) => ele.name === dropdown_type
                )[0].options.length;
                dropdownLength = this.state.simulate_filters[dropdown_type].length;
            }
            if (dropdown_value.includes('all' || 'All')) {
                let filterValues = ['all'];
                let values = this.state.digitaltwin_data.simulate.extra_filters.find(
                    (ele) => ele.name === dropdown_type
                )['options'];
                for (let i in values) {
                    filterValues.push(values[i].value);
                }
                this.setState({
                    simulate_filters: {
                        ...this.state.simulate_filters,
                        [dropdown_type]: filterValues
                    }
                });
            } else if (
                dropdownLength - 1 === filtersLength &&
                !dropdown_value.includes('all' || 'All')
            ) {
                this.setState({
                    simulate_filters: { ...this.state.simulate_filters, [dropdown_type]: [] }
                });
            } else {
                this.setState({
                    simulate_filters: {
                        ...this.state.simulate_filters,
                        [dropdown_type]: dropdown_value
                    }
                });
            }
        }
    };

    onResposeActionPlot = (response_data) => {
        let html_fontsize = window.document.getElementsByTagName('html')[0].style.fontSize;
        const { CodxBkgdColor, CodxTextColor } = this.props.themeContext.plotTheme;

        if (response_data.data.layout) {
            delete response_data.data.layout.template;
        } else {
            response_data.data.layout = {};
        }

        response_data.data.layout.font = {
            family: CodxFontFamily,
            color: CodxTextColor,
            size: (html_fontsize.replace('%', '') * 24) / 100
        };

        response_data.data.layout.legend = {
            orientation: 'h',
            yanchor: 'top',
            y: -0.1,
            xanchor: 'left',
            x: 0
        };

        response_data.data.layout.padding = {
            t: 0,
            r: 0,
            l: 0,
            b: 0
        };

        //Background
        response_data.data.layout.paper_bgcolor = CodxBkgdColor;
        response_data.data.layout.plot_bgcolor = CodxBkgdColor;

        //Shapes
        _.each(response_data.data.layout.shapes, function (shape_item) {
            shape_item.fillcolor = CodxTextColor;
        });

        const Plot = createPlotlyComponent(window.Plotly);

        this.setState({
            actionPlot: (
                <Plot
                    data={response_data.data.data}
                    layout={response_data.data.layout}
                    config={{ displayModeBar: false, responsive: true }}
                    style={{
                        width: '100%',
                        height: 'calc(100% -  1rem)',
                        position: 'relative'
                    }}
                    useResizeHandler={true}
                />
            ),
            actionLoading: false
        });
    };

    onOpenSimulate = () => {
        this.setState({
            simulateOpen: true,
            show_simulate_input: true
        });
    };

    onCloseSimulate = () => {
        this.setState({
            simulateOpen: false,
            show_simulate_input: false,
            show_simulate_output: false
        });
    };

    onShowSimulateOutput = () => {
        this.setState({
            show_simulate_input: false,
            show_simulate_output: true,
            simulateLoading: true
        });
        setTimeout(() => {
            this.setState({ simulateLoading: false });
        }, 2000);
    };

    onShowSimulateInput = () => {
        this.setState({
            show_simulate_input: true,
            show_simulate_output: false
        });
    };
    simualteCallback = (response) => {
        if (response.data) {
            this.setState({
                digitaltwin_data: {
                    ...this.state.digitaltwin_data,
                    simulate: { ...this.state.digitaltwin_data.simulate, ...response.data }
                },
                simulateLoading: false
            });
        }
    };
    onSimulateScenario = () => {
        const { app_id } = this.props;
        this.setState({
            simulateLoading: true,
            show_simulate_input_results: true
        });
        executeCode({
            app_id: app_id,
            inputs: [this.state.simulate_input_values],
            code: this.state.digitaltwin_data.simulate.code,
            selected_filters: [this.state.simulate_filters],
            callback: this.simualteCallback
        });
    };

    onChangeSlider = (value, index) => {
        let slider_values = this.state.simulate_input_values;

        slider_values[index] = value;

        this.setState({
            simulate_input_values: slider_values
        });
    };

    get_drawer_zone_options = () => {
        let drawer_zone_options = [{ label: 'Select All', value: 'all' }];

        _.each(
            _.groupBy(
                _.unique(
                    _.map(this.state.digitaltwin_data.metrics, function (metric_item) {
                        return {
                            name: metric_item.name,
                            group: metric_item.group
                        };
                    }),
                    false
                ),
                function (metric_mapped_item) {
                    return metric_mapped_item.group;
                }
            ),
            function (zones, zone_group) {
                drawer_zone_options.push({
                    label: zone_group + '/ All Zones',
                    value: zone_group + '_all'
                });

                _.each(
                    _.uniq(
                        _.map(zones, function (zone_item) {
                            return zone_item.name;
                        })
                    ),
                    function (filtered_zone_item) {
                        if (filtered_zone_item) {
                            drawer_zone_options.push({
                                label: zone_group + '/ ' + filtered_zone_item,
                                value: zone_group + '_' + filtered_zone_item
                            });
                        }
                    }
                );
            }
        );

        return drawer_zone_options;
    };

    render() {
        const { classes } = this.props;
        let selected_display_kpi = _.find(
            this.state.digitaltwin_data.display_kpis,
            function (disp_kpi) {
                return disp_kpi.value === this.state.displayKPI;
            },
            this
        );
        return (
            <div
                key={'digital_twin_container'}
                style={{ width: '100%', height: '100%', position: 'relative' }}
                data-testid="digital-twin-container"
            >
                <div
                    key={'digital_twin_video_container'}
                    className={classes.digitalTwinVideoContainer}
                    data-testid="digital-twin-video-container"
                >
                    <div
                        key={'digital_twin_options_container'}
                        className={classes.digitalTwinOptionContainer}
                        data-testid="digital-twin-options-container"
                    >
                        {this.state.historicdrop_down && this.renderHistoricOptions()}
                        <RadioGroup
                            className={classes.digitalTwinRadioGroup}
                            aria-label="Display KPI"
                            name="displayKPI"
                            value={this.state.displayKPI}
                            data-testid="digital-twin-radio-group"
                        >
                            {_.map(
                                this.state.digitaltwin_data.display_kpis,
                                function (display_kpi) {
                                    return (
                                        <Tooltip
                                            key={'display_kpi_' + display_kpi.name}
                                            classes={{
                                                tooltip: classes.digitalTwinRadioGroupTooltip
                                            }}
                                            title={display_kpi.desc}
                                            data-testid={`display-kpi-tooltip-${display_kpi.value}`}
                                        >
                                            <Button
                                                variant={
                                                    display_kpi.value === this.state.displayKPI
                                                        ? 'contained'
                                                        : 'outlined'
                                                }
                                                className={
                                                    display_kpi.value === this.state.displayKPI
                                                        ? classes.digitalTwinRadioLabelSelected
                                                        : classes.digitalTwinRadioLabel
                                                }
                                                onClick={() =>
                                                    this.handleKPIChange(display_kpi.value)
                                                }
                                                aria-label={display_kpi.name}
                                                data-testid={`display-kpi-button-${display_kpi.value}`}
                                            >
                                                {display_kpi.name}
                                            </Button>
                                        </Tooltip>
                                    );
                                },
                                this
                            )}
                        </RadioGroup>
                        <br clear="all" />
                    </div>
                    {(!this.state.digitaltwin_data.historic ||
                        this.state.historic_dropdowns['shift']?.length > 0 ||
                        this.state.historic_dropdowns['Shift']?.length > 0) &&
                        this.state.displayKPI && (
                            <div
                                key={'digital_twin_canvas_container'}
                                className={classes.digitalTwinCanvasContainer}
                                data-testid="digital-twin-canvas-container"
                            >
                                {_.map(
                                    _.filter(
                                        this.state.digitaltwin_data.metrics,
                                        function (data_item) {
                                            return (
                                                data_item.metric_key === this.state.displayKPI ||
                                                data_item.metric_key === 'all'
                                            );
                                        },
                                        this
                                    ),
                                    function (filtered_data_item, filtered_data_item_index) {
                                        let selected_display_icon = false;
                                        if (
                                            selected_display_kpi &&
                                            filtered_data_item.metric_key !== 'all' &&
                                            selected_display_kpi.icon
                                        ) {
                                            selected_display_icon = selected_display_kpi.icon;
                                        } else if (
                                            filtered_data_item.metric_key === 'all' &&
                                            filtered_data_item.metric_icon
                                        ) {
                                            // eslint-disable-next-line no-unused-vars
                                            selected_display_icon = filtered_data_item.metric_icon;
                                        }
                                        if (
                                            this.state.selectedMetric &&
                                            this.state.selectedMetric.name ===
                                                filtered_data_item.name &&
                                            this.state.selectedMetric.group ===
                                                filtered_data_item.group
                                        ) {
                                            return (
                                                <div
                                                    key={'canvas_zone_' + filtered_data_item_index}
                                                    className={
                                                        classes.digitalTwinCanvasZoneContainer
                                                    }
                                                    style={{
                                                        top: filtered_data_item.style.top,
                                                        left:
                                                            parseInt(
                                                                filtered_data_item.style.left
                                                            ) < 75
                                                                ? filtered_data_item.style.left
                                                                : `calc(${filtered_data_item.style.left} - 35rem)`
                                                    }}
                                                    data-testid={`canvas-zone-${filtered_data_item_index}`}
                                                >
                                                    <CloseIcon
                                                        className={
                                                            classes.digitalTwinCanvasZoneClose
                                                        }
                                                        onClick={this.onCloseZone}
                                                        data-testid="canvas-zone-close-icon"
                                                    />
                                                    <div
                                                        className={
                                                            classes.digitalTwinCanvasZoneDetails
                                                        }
                                                        data-testid="canvas-zone-details"
                                                    >
                                                        {filtered_data_item.group && (
                                                            <Typography
                                                                variant={'h3'}
                                                                className={
                                                                    classes.digitalTwinCanvasZoneGroup
                                                                }
                                                                data-testid="canvas-zone-group"
                                                            >
                                                                {filtered_data_item.group}
                                                            </Typography>
                                                        )}
                                                        {filtered_data_item.name && (
                                                            <Typography
                                                                variant={'h5'}
                                                                className={
                                                                    classes.digitalTwinCanvasZoneName
                                                                }
                                                                data-testid="canvas-zone-name"
                                                            >
                                                                {filtered_data_item.name}
                                                            </Typography>
                                                        )}
                                                        <Grid container>
                                                            {_.map(
                                                                _.filter(
                                                                    this.state.digitaltwin_data
                                                                        .metrics,
                                                                    function (metric_item) {
                                                                        return (
                                                                            metric_item.name ===
                                                                                filtered_data_item.name &&
                                                                            metric_item.group ===
                                                                                filtered_data_item.group
                                                                        );
                                                                    }
                                                                ),
                                                                function (filtered_metric_item) {
                                                                    return (
                                                                        <Grid item xs>
                                                                            <Typography
                                                                                variant={'h5'}
                                                                                className={
                                                                                    classes.digitalTwinCanvasZoneMetricName
                                                                                }
                                                                                data-testid="canvas-zone-metric-name"
                                                                            >
                                                                                {
                                                                                    filtered_metric_item.metric_name
                                                                                }
                                                                            </Typography>
                                                                        </Grid>
                                                                    );
                                                                }
                                                            )}
                                                        </Grid>
                                                        <Grid container>
                                                            {_.map(
                                                                _.filter(
                                                                    this.state.digitaltwin_data
                                                                        .metrics,
                                                                    function (metric_item) {
                                                                        return (
                                                                            metric_item.name ===
                                                                                filtered_data_item.name &&
                                                                            metric_item.group ===
                                                                                filtered_data_item.group
                                                                        );
                                                                    }
                                                                ),
                                                                function (filtered_metric_item) {
                                                                    return (
                                                                        <Grid item xs={4}>
                                                                            <Typography
                                                                                variant={'body1'}
                                                                                className={
                                                                                    classes.digitalTwinCanvasZoneMetricValue
                                                                                }
                                                                                style={{
                                                                                    color: filtered_metric_item
                                                                                        .style
                                                                                        .backgroundColor
                                                                                }}
                                                                                data-testid="canvas-zone-metric-value"
                                                                            >
                                                                                {
                                                                                    filtered_metric_item.metric_value
                                                                                }
                                                                            </Typography>
                                                                            {filtered_metric_item.metric_unit && (
                                                                                <Typography
                                                                                    variant={
                                                                                        'body1'
                                                                                    }
                                                                                    className={
                                                                                        classes.digitalTwinCanvasZoneMetricUnit
                                                                                    }
                                                                                    data-testid="canvas-zone-metric-unit"
                                                                                >
                                                                                    {
                                                                                        filtered_metric_item.metric_unit
                                                                                    }
                                                                                </Typography>
                                                                            )}
                                                                            <br clear="all" />
                                                                        </Grid>
                                                                    );
                                                                }
                                                            )}
                                                        </Grid>
                                                        {filtered_data_item.recommendations &&
                                                            filtered_data_item.recommendationsList && (
                                                                <Grid container direction="column">
                                                                    <Typography
                                                                        variant={'h5'}
                                                                        className={
                                                                            classes.digitalTwinCanvasZoneRecommendationHeading
                                                                        }
                                                                        data-testid="canvas-zone-recommendation-heading"
                                                                    >
                                                                        Recommendations :
                                                                    </Typography>{' '}
                                                                    <br />
                                                                    <ul
                                                                        className={
                                                                            classes.digitalTwinCanvasZoneRecommendationListStyles
                                                                        }
                                                                        data-testid="canvas-zone-recommendation-list"
                                                                    >
                                                                        {_.map(
                                                                            filtered_data_item.recommendationsList,
                                                                            function (
                                                                                recommendation
                                                                            ) {
                                                                                return (
                                                                                    <li
                                                                                        className={
                                                                                            classes.digitalTwinCanvasZoneRecommendations
                                                                                        }
                                                                                        data-testid={`canvas-zone-recommendation-${recommendation}`}
                                                                                    >
                                                                                        <Typography
                                                                                            variant={
                                                                                                'h5'
                                                                                            }
                                                                                        >
                                                                                            {
                                                                                                recommendation
                                                                                            }
                                                                                        </Typography>
                                                                                    </li>
                                                                                );
                                                                            },
                                                                            this
                                                                        )}
                                                                    </ul>
                                                                </Grid>
                                                            )}
                                                    </div>
                                                    <div
                                                        className={
                                                            classes.digitalTwinCanvasZoneActions
                                                        }
                                                        data-testid="canvas-zone-actions"
                                                    >
                                                        {filtered_data_item.metric_group_name && (
                                                            <Grid container>
                                                                {this.state.digitaltwin_data
                                                                    .actions &&
                                                                    _.map(
                                                                        this.state.digitaltwin_data
                                                                            .actions,
                                                                        function (action_item) {
                                                                            return (
                                                                                <Grid item xs>
                                                                                    <Typography
                                                                                        variant={
                                                                                            'h5'
                                                                                        }
                                                                                        className={
                                                                                            classes.digitalTwinCanvasZoneMetricActionLink
                                                                                        }
                                                                                        onClick={() =>
                                                                                            this.onClickMetricAction(
                                                                                                action_item.action,
                                                                                                filtered_data_item.metric_group_name,
                                                                                                filtered_data_item.metric_name
                                                                                            )
                                                                                        }
                                                                                        data-testid={`canvas-zone-action-${action_item.action}`}
                                                                                    >
                                                                                        {
                                                                                            action_item.name
                                                                                        }
                                                                                    </Typography>
                                                                                </Grid>
                                                                            );
                                                                        },
                                                                        this
                                                                    )}
                                                            </Grid>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        } else if (
                                            this.state.hoverMetric &&
                                            this.state.hoverMetric.name ===
                                                filtered_data_item.name &&
                                            this.state.hoverMetric.group ===
                                                filtered_data_item.group
                                        ) {
                                            return (
                                                <div
                                                    key={
                                                        'canvas_metric_' + filtered_data_item_index
                                                    }
                                                    className={
                                                        classes.digitalTwinCanvasMetricContainerExpanded
                                                    }
                                                    style={{
                                                        top: filtered_data_item.style.top,
                                                        left: filtered_data_item.style.left,
                                                        backgroundColor:
                                                            filtered_data_item.style.backgroundColor
                                                    }}
                                                    onMouseLeave={this.onMouseOutMetric}
                                                    onClick={() =>
                                                        this.onClickZone(filtered_data_item)
                                                    }
                                                >
                                                    {filtered_data_item.group && (
                                                        <Typography
                                                            variant={'h5'}
                                                            className={
                                                                classes.digitalTwinCanvasMetricZoneGroupExpanded
                                                            }
                                                        >
                                                            {filtered_data_item.group}
                                                        </Typography>
                                                    )}
                                                    {filtered_data_item.name && (
                                                        <Typography
                                                            variant={'body1'}
                                                            className={
                                                                classes.digitalTwinCanvasMetricZoneNameExpanded
                                                            }
                                                        >
                                                            {filtered_data_item.name}
                                                        </Typography>
                                                    )}
                                                    {!filtered_data_item.name &&
                                                        filtered_data_item.metric_name && (
                                                            <Typography
                                                                variant={'body1'}
                                                                className={
                                                                    classes.digitalTwinCanvasMetricZoneNameExpanded
                                                                }
                                                            >
                                                                {filtered_data_item?.picking
                                                                    ? null
                                                                    : filtered_data_item.metric_name}
                                                            </Typography>
                                                        )}
                                                    <Typography
                                                        variant={'h5'}
                                                        className={
                                                            classes.digitalTwinCanvasMetricValueExpanded
                                                        }
                                                    >
                                                        {filtered_data_item?.picking
                                                            ? filtered_data_item.accuracy
                                                            : filtered_data_item.metric_value}
                                                    </Typography>
                                                    {filtered_data_item.metric_unit && (
                                                        <Typography
                                                            variant={'h5'}
                                                            className={
                                                                classes.digitalTwinCanvasMetricUnitExpanded
                                                            }
                                                        >
                                                            {filtered_data_item.metric_unit}
                                                        </Typography>
                                                    )}
                                                    <br clear="all" />
                                                </div>
                                            );
                                        } else {
                                            let visual_classes =
                                                classes.digitalTwinCanvasMetricContainerVisual;
                                            if (filtered_data_item.style.marker) {
                                                visual_classes = clsx(
                                                    classes.digitalTwinCanvasMetricContainerVisual,
                                                    classes[
                                                        'digitalTwinCanvasMetricContainerVisualBorder' +
                                                            filtered_data_item.style.marker.toUpperCase()
                                                    ]
                                                );
                                            }
                                            return (
                                                <div
                                                    key={
                                                        'canvas_metric_' + filtered_data_item_index
                                                    }
                                                    className={
                                                        classes.digitalTwinCanvasMetricContainer
                                                    }
                                                    style={{
                                                        top: filtered_data_item.style.top,
                                                        left: filtered_data_item.style.left,
                                                        width: filtered_data_item.style.width
                                                    }}
                                                    onMouseOver={() =>
                                                        this.onMouseOverMetric(filtered_data_item)
                                                    }
                                                >
                                                    <div
                                                        className={visual_classes}
                                                        style={{
                                                            borderColor:
                                                                filtered_data_item.style
                                                                    .backgroundColor
                                                        }}
                                                    ></div>
                                                    {filtered_data_item.name && (
                                                        <Typography
                                                            variant={'body1'}
                                                            className={
                                                                classes.digitalTwinCanvasMetricZoneName
                                                            }
                                                        >
                                                            {filtered_data_item.name}
                                                        </Typography>
                                                    )}
                                                    {!filtered_data_item.name &&
                                                        filtered_data_item.metric_name && (
                                                            <Typography
                                                                variant={'body1'}
                                                                className={
                                                                    classes.digitalTwinCanvasMetricZoneName
                                                                }
                                                            >
                                                                {filtered_data_item?.picking
                                                                    ? 'Picking Accuracy'
                                                                    : filtered_data_item.metric_name}
                                                            </Typography>
                                                        )}
                                                    <Typography
                                                        variant={'h5'}
                                                        className={
                                                            classes.digitalTwinCanvasMetricValue
                                                        }
                                                    >
                                                        {filtered_data_item?.picking
                                                            ? filtered_data_item.accuracy
                                                            : filtered_data_item.metric_value}
                                                    </Typography>
                                                </div>
                                            );
                                        }
                                    },
                                    this
                                )}
                            </div>
                        )}
                    {this.state.digitaltwin_data.simulate
                        ? [
                              this.state.simulateOpen ? (
                                  <IconButton
                                      className={classes.digitalTwinCanvasCloseSimulate}
                                      onClick={this.onCloseSimulate}
                                      aria-label="Close simulate"
                                      style={{ transition: 'all 1s' }}
                                  >
                                      <CloseIcon fontSize="large" />
                                  </IconButton>
                              ) : (
                                  <Button
                                      variant={'contained'}
                                      className={classes.digitalTwinCanvasOpenSimulate}
                                      onClick={this.onOpenSimulate}
                                      aria-label="Simulate"
                                      style={{ transition: 'all 1s' }}
                                      data-testid="simulate-drawer-open"
                                  >
                                      {'Simulate'}
                                  </Button>
                              ),
                              this.state.simulateOpen ? (
                                  <Drawer
                                      data={this.state}
                                      classes={classes}
                                      onRenderDrawerZone={this.onRenderDrawerZone}
                                      renderSectionOptions={this.renderSectionOptions}
                                      CodxFontFamily={CodxFontFamily}
                                      themeContextPlot={this.props.themeContext.plotTheme}
                                      onRenderMetricAction={this.onRenderMetricAction}
                                      onChangeSlider={this.onChangeSlider}
                                      onSimulateScenario={this.onSimulateScenario}
                                      onShowSimulateOutput={this.onShowSimulateOutput}
                                      onShowSimulateInput={this.onShowSimulateInput}
                                      drawer_zone_options={this.get_drawer_zone_options}
                                      rightPopoutStateChange={(evt, dropdown_type) =>
                                          this.rightPopoutStateChange(evt, dropdown_type)
                                      }
                                  />
                              ) : (
                                  ''
                              )
                          ]
                        : [
                              this.state.drawerOpen ? (
                                  <IconButton
                                      className={classes.digitalTwinCanvasCloseDrawer}
                                      style={{
                                          position: 'absolute',
                                          top: '4rem',
                                          right:
                                              this.state.drawerSizes[
                                                  this.state.digitaltwin_drawer_data.size
                                              ] -
                                              3 +
                                              'rem',
                                          zIndex: '4',
                                          transition: 'all 1s'
                                      }}
                                      onClick={this.onCloseDrawer}
                                      aria-label="Close details drawer"
                                  >
                                      <ArrowForwardIosIcon fontSize="large" />
                                  </IconButton>
                              ) : (
                                  <IconButton
                                      className={classes.digitalTwinCanvasOpenDrawer}
                                      onClick={this.onOpenDrawer}
                                      aria-label="Open details drawer"
                                      style={{ transition: 'all 1s' }}
                                  >
                                      <ArrowBackIosIcon fontSize="large" />
                                  </IconButton>
                              ),
                              this.state.drawerOpen ? (
                                  <Drawer
                                      data={this.state}
                                      classes={classes}
                                      drawer_zone_options={this.get_drawer_zone_options}
                                      onChangeZone={this.onChangeZone}
                                      onRenderDrawerZone={this.onRenderDrawerZone}
                                      renderSectionOptions={this.renderSectionOptions}
                                      CodxFontFamily={CodxFontFamily}
                                      themeContextPlot={this.props.themeContext.plotTheme}
                                      onRenderMetricAction={this.onRenderMetricAction}
                                      onChangeSlider={this.onChangeSlider}
                                      onSimulateScenario={this.onSimulateScenario}
                                      onShowSimulateOutput={this.onShowSimulateOutput}
                                      onShowSimulateInput={this.onShowSimulateInput}
                                      drawer_data={this.state.digitaltwin_drawer_data}
                                      rightPopoutStateChange={(evt, dropdown_type) =>
                                          this.rightPopoutStateChange(evt, dropdown_type)
                                      }
                                  />
                              ) : (
                                  ''
                              )
                          ]}
                    {this.state.actionOpen && (
                        <IconButton
                            className={classes.digitalTwinCanvasCloseAction}
                            onClick={this.onCloseMetricAction}
                            aria-label="Close details drawer"
                            style={{ transition: 'all 1s' }}
                        >
                            <CloseIcon fontSize="large" />
                        </IconButton>
                    )}
                    <div
                        key={'digital_twin_action_container'}
                        className={
                            this.state.actionOpen
                                ? clsx(classes.digitalTwinPopup, classes.digitalTwinMetricAction)
                                : classes.digitalTwinPopupHidden
                        }
                    >
                        {this.state.actionOpen && (
                            <Drawer
                                data={this.state}
                                classes={classes}
                                drawer_zone_options={this.get_drawer_zone_options}
                                onRenderDrawerZone={this.onRenderDrawerZone}
                                renderSectionOptions={this.renderSectionOptions}
                                CodxFontFamily={CodxFontFamily}
                                themeContextPlot={this.props.themeContext.plotTheme}
                                onChangeSlider={this.onChangeSlider}
                                onSimulateScenario={this.onSimulateScenario}
                                onShowSimulateOutput={this.onShowSimulateOutput}
                                onShowSimulateInput={this.onShowSimulateInput}
                                onChangeDropDown={(value, type) =>
                                    this.onChangeDropDown(value, type)
                                }
                            />
                        )}
                    </div>
                    {/* <Button
                        variant={'outlined'}
                        className={classes.digitalTwinReportButton}
                        // onClick={() => this.handleKPIChange(display_kpi.value)}
                        aria-label="Generate Report"
                    >
                        {'Generate Report'}
                    </Button> */}
                    <video
                        key={'video-' + this.props.themeContext.themeMode}
                        className={classes.digitalTwinVideo}
                        preload="auto"
                        autoPlay
                        loop
                        muted
                    >
                        <source
                            key={'video-source-' + this.props.themeContext.themeMode}
                            src={
                                this.props.themeContext.themeMode === 'dark'
                                    ? this.state.digitaltwin_data.video.dark_mode
                                    : this.state.digitaltwin_data.video.light_mode
                            }
                            type="video/mp4"
                        />
                        Your browser does not support HTML5 video.
                    </video>
                </div>
            </div>
        );
    }
}

DigitalTwin.propTypes = {
    classes: PropTypes.object.isRequired,
    widgetData: PropTypes.object.isRequired
};

export default withStyles(
    (theme) => ({
        ...appWidgetPlotStyle(theme),
        ...digitalTwinCanvasStyle(theme)
    }),
    { useTheme: true }
)(withThemeContext(DigitalTwin));
