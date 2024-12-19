import React from "react";

import { withStyles, Switch, FormControlLabel } from "@material-ui/core";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import { GridList, GridListTile } from "@material-ui/core";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";

// form components
import Select from "components/CustomSelect/CustomSelect.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";

import SettingsIcon from "@material-ui/icons/Settings";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";

import layoutSelectorStyle from "assets/jss/layoutSelectorStyle.jsx";
import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";

let _ = require("underscore");

class LayoutSelector extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;

        var selected_layout = false;
        var selected_settings = [];
        if (this.props.layout_option) {
            selected_layout = {
                no_labels: this.props.layout_option['no_labels'],
                no_graphs: this.props.layout_option['no_graphs'],
                graph_type: this.props.layout_option['graph_type'],
                horizontal: this.props.layout_option['horizontal']
            };
            selected_settings = this.props.layout_option['settings'];
        }

        this.state = {
            selected_layout: selected_layout,
            selected_widget: {
                item_index: false,
                item_is_label: false
            },
            selected_settings: selected_settings
        };
    }

    onSelectLayout = (layout_option) => {
        const { parent_obj, screen_index } = this.props;

        this.setState({
            selected_layout: layout_option,
            selected_widget: {
                item_index: false,
                item_is_label: false
            },
            selected_settings: []
        });

        parent_obj.setSelectedLayout(screen_index, layout_option, []);
    }

    onClickSetting(event, item_index, item_is_label) {
        this.setState({
            selected_widget: {
                item_index: item_index,
                item_is_label: item_is_label
            }
        });

        event.stopPropagation();
    }

    hideSetting() {
        this.setState({
            selected_widget: {
                item_index: false,
                item_is_label: false
            }
        });
    }

    renderSettingSelect(item_key) {
        const { result_options } = this.props;

        var main_options = this.state.selected_widget['item_is_label'] ? result_options['metrics'] : result_options['graphs'];
        var selected_widget_setting = _.find(this.state.selected_settings, function (selected_setting) {
            return selected_setting['item_index'] === this.state.selected_widget['item_index'] &&
                selected_setting['item_is_label'] === this.state.selected_widget['item_is_label'];
        }, this);

        if (!selected_widget_setting) {
            selected_widget_setting = {
                type: false,
                name: false,
                component: false,
                item: false,
                simulator_type: false,
                simulator_name: false,
                simulator_component: false,
                simulator_item: false,
                assumptions_type: false,
                assumptions_name: false,
                assumptions_component: false,
                assumptions_item: false,
                item_index: this.state.selected_widget['item_index'],
                item_is_label: this.state.selected_widget['item_is_label']
            };
        }

        if (item_key === 'type' || item_key === 'component' || item_key === 'name' || item_key === 'item') {
            if (!selected_widget_setting['type']) {
                if (item_key !== 'type') {
                    return '';
                }
            } else if (!selected_widget_setting['name']) {
                if (item_key === 'component' || item_key === 'item') {
                    return '';
                }
            } else if (!selected_widget_setting['component']) {
                if (item_key === 'item') {
                    return '';
                }
            }
        } else if (item_key === 'simulator_type' || item_key === 'simulator_component' || item_key === 'simulator_name' || item_key === 'simulator_item') {
            if (!selected_widget_setting['simulator_type']) {
                if (item_key !== 'simulator_type') {
                    return '';
                }
            } else if (!selected_widget_setting['simulator_name']) {
                if (item_key === 'simulator_component' || item_key === 'simulator_item') {
                    return '';
                }
            } else if (!selected_widget_setting['simulator_component']) {
                if (item_key === 'simulator_item') {
                    return '';
                }
            }
        } else if (item_key === 'assumptions_type' || item_key === 'assumptions_component' || item_key === 'assumptions_name' || item_key === 'assumptions_item') {
            if (!selected_widget_setting['assumptions_type']) {
                if (item_key !== 'assumptions_type') {
                    return '';
                }
            } else if (!selected_widget_setting['assumptions_name']) {
                if (item_key === 'assumptions_component' || item_key === 'assumptions_item') {
                    return '';
                }
            } else if (!selected_widget_setting['assumptions_component']) {
                if (item_key === 'assumptions_item') {
                    return '';
                }
            }
        }

        var options = _.keys(main_options);
        if (item_key === 'name') {
            options = _.keys(main_options[selected_widget_setting['type']]);
            if (options.length === 0) {
                return '';
            }
        } else if (item_key === 'component') {
            options = _.keys(main_options[selected_widget_setting['type']][selected_widget_setting['name']]);
            if (options.length === 0) {
                return '';
            }
        } else if (item_key === 'item') {
            if (main_options[selected_widget_setting['type']][selected_widget_setting['name']][selected_widget_setting['component']] === true) {
                return '';
            }
            options = main_options[selected_widget_setting['type']][selected_widget_setting['name']][selected_widget_setting['component']];
            if (!options || options.length === 0) {
                return '';
            }
        } else if (item_key === 'simulator_name') {
            options = _.keys(main_options[selected_widget_setting['simulator_type']]);
            if (options.length === 0) {
                return '';
            }
        } else if (item_key === 'simulator_component') {
            options = _.keys(main_options[selected_widget_setting['simulator_type']][selected_widget_setting['simulator_name']]);
            if (options.length === 0) {
                return '';
            }
        } else if (item_key === 'simulator_item') {
            if (main_options[selected_widget_setting['simulator_type']][selected_widget_setting['simulator_name']][selected_widget_setting['simulator_component']] === true) {
                return '';
            }
            options = main_options[selected_widget_setting['simulator_type']][selected_widget_setting['simulator_name']][selected_widget_setting['simulator_component']];
            if (!options || options.length === 0) {
                return '';
            }
        } else if (item_key === 'assumptions_name') {
            options = _.keys(main_options[selected_widget_setting['assumptions_type']]);
            if (options.length === 0) {
                return '';
            }
        } else if (item_key === 'assumptions_component') {
            options = _.keys(main_options[selected_widget_setting['assumptions_type']][selected_widget_setting['assumptions_name']]);
            if (options.length === 0) {
                return '';
            }
        } else if (item_key === 'assumptions_item') {
            if (main_options[selected_widget_setting['assumptions_type']][selected_widget_setting['assumptions_name']][selected_widget_setting['assumptions_component']] === true) {
                return '';
            }
            options = main_options[selected_widget_setting['assumptions_type']][selected_widget_setting['assumptions_name']][selected_widget_setting['assumptions_component']];
            if (!options || options.length === 0) {
                return '';
            }
        }

        return (
            <GridItem xs={3}>
                <Select
                    title={"Choose results widget " + item_key}
                    options={_.map(options, function (item_option) {
                        return {
                            value: item_option,
                            label: item_option
                        };
                    })}
                    inputProps={{
                        value: selected_widget_setting[item_key] ? selected_widget_setting[item_key] : false,
                        onChange: event => this.onSettingChange(item_key, event.target.value)
                    }}
                />
            </GridItem>
        );
    }

    getSettingValue = (item_key) => {
        var selected_widget_setting = _.find(this.state.selected_settings, function (selected_setting) {
            return selected_setting['item_index'] === this.state.selected_widget['item_index'] &&
                selected_setting['item_is_label'] === this.state.selected_widget['item_is_label'];
        }, this);

        if (!selected_widget_setting) {
            return false;
        } else {
            return selected_widget_setting[item_key];
        }
    }

    renderSettingText = (item_key, item_label, help_text) => {
        var selected_widget_setting = _.find(this.state.selected_settings, function (selected_setting) {
            return selected_setting['item_index'] === this.state.selected_widget['item_index'] &&
                selected_setting['item_is_label'] === this.state.selected_widget['item_is_label'];
        }, this);

        if (!selected_widget_setting) {
            selected_widget_setting = {
                type: false,
                name: false,
                component: false,
                item: false,
                item_index: this.state.selected_widget['item_index'],
                item_is_label: this.state.selected_widget['item_is_label']
            };
        }

        return (
            <GridItem xs={3}>
                <CustomInput
                    labelText={item_label}
                    id={item_key}
                    formControlProps={{
                        fullWidth: true
                    }}
                    inputProps={{
                        onChange: event => this.onSettingChange(item_key, event.target.value),
                        type: "text",
                        value: selected_widget_setting[item_key] ? selected_widget_setting[item_key] : "",
                    }}
                    helpText={help_text}
                />
            </GridItem>
        );
    }

    renderSettingTextarea = (item_key, item_label, help_text) => {
        var selected_widget_setting = _.find(this.state.selected_settings, function (selected_setting) {
            return selected_setting['item_index'] === this.state.selected_widget['item_index'] &&
                selected_setting['item_is_label'] === this.state.selected_widget['item_is_label'];
        }, this);

        if (!selected_widget_setting) {
            selected_widget_setting = {
                type: false,
                name: false,
                component: false,
                item: false,
                item_index: this.state.selected_widget['item_index'],
                item_is_label: this.state.selected_widget['item_is_label']
            };
        }

        return (
            <GridItem xs={3}>
                <CustomInput
                    labelText={item_label}
                    id={item_key}
                    formControlProps={{
                        fullWidth: true
                    }}
                    inputProps={{
                        onChange: event => this.onSettingChange(item_key, event.target.value),
                        type: "text",
                        value: selected_widget_setting[item_key] ? selected_widget_setting[item_key] : "",
                        multiline: true,
                        rows: 10
                    }}
                    helpText={help_text}
                />
            </GridItem>
        );
    }

    onSettingChange = (item_key, item_value) => {
        const { parent_obj, screen_index } = this.props;

        var selected_settings = this.state.selected_settings;

        var found_selected_setting = _.find(selected_settings, function (selected_setting) {
            return selected_setting['item_index'] === this.state.selected_widget['item_index'] &&
                selected_setting['item_is_label'] === this.state.selected_widget['item_is_label'];
        }, this);

        if (!found_selected_setting) {
            found_selected_setting = {
                type: false,
                name: false,
                component: false,
                item: false,
                simulator_type: false,
                simulator_name: false,
                simulator_component: false,
                simulator_item: false,
                assumptions_type: false,
                assumptions_name: false,
                assumptions_component: false,
                assumptions_item: false,
                item_index: this.state.selected_widget['item_index'],
                item_is_label: this.state.selected_widget['item_is_label']
            }

            selected_settings.push(found_selected_setting);
        }

        if (item_key === 'type') {
            found_selected_setting = {
                ...found_selected_setting,
                type: item_value,
                name: false,
                component: false,
                item: false
            };
        } else if (item_key === 'name') {
            found_selected_setting = {
                ...found_selected_setting,
                name: item_value,
                component: false,
                item: false
            };
        } else if (item_key === 'component') {
            found_selected_setting = {
                ...found_selected_setting,
                component: item_value,
                item: false
            };
        } else if (item_key === 'item') {
            found_selected_setting = {
                ...found_selected_setting,
                item: item_value
            };
        } else if (item_key === 'simulator_type') {
            found_selected_setting = {
                ...found_selected_setting,
                simulator_type: item_value,
                simulator_name: false,
                simulator_component: false,
                simulator_item: false
            };
        } else if (item_key === 'simulator_name') {
            found_selected_setting = {
                ...found_selected_setting,
                simulator_name: item_value,
                simulator_component: false,
                simulator_item: false
            };
        } else if (item_key === 'simulator_component') {
            found_selected_setting = {
                ...found_selected_setting,
                simulator_component: item_value,
                simulator_item: false
            };
        } else if (item_key === 'simulator_item') {
            found_selected_setting = {
                ...found_selected_setting,
                simulator_item: item_value
            };
        } else if (item_key === 'assumptions_type') {
            found_selected_setting = {
                ...found_selected_setting,
                assumptions_type: item_value,
                assumptions_name: false,
                assumptions_component: false,
                assumptions_item: false
            };
        } else if (item_key === 'assumptions_name') {
            found_selected_setting = {
                ...found_selected_setting,
                assumptions_name: item_value,
                assumptions_component: false,
                assumptions_item: false
            };
        } else if (item_key === 'assumptions_component') {
            found_selected_setting = {
                ...found_selected_setting,
                assumptions_component: item_value,
                assumptions_item: false
            };
        } else if (item_key === 'assumptions_item') {
            found_selected_setting = {
                ...found_selected_setting,
                assumptions_item: item_value
            };
        } else if (item_key === 'title' || item_key === 'subtitle' || item_key === 'value_factor' || item_key === 'prefix' || item_key === 'legend' || item_key === 'assumptions_header' || item_key === 'action_link') {
            found_selected_setting[item_key] = item_value;
        } else if (item_key === 'size_nooverride' || item_key === 'color_nooverride') {
            found_selected_setting[item_key] = !found_selected_setting[item_key];
        }

        var response_selected_settings = _.map(selected_settings, function (selected_setting) {
            if (selected_setting['item_index'] === this.state.selected_widget['item_index'] &&
                selected_setting['item_is_label'] === this.state.selected_widget['item_is_label']) {
                return found_selected_setting;
            } else {
                return selected_setting;
            }
        }, this);

        this.setState({
            selected_settings: response_selected_settings
        });

        parent_obj.setSelectedLayout(screen_index, this.state.selected_layout, response_selected_settings);
    }

    renderSettingTraces() {
        const { result_options } = this.props;

        var widget_graph = _.find(this.state.selected_settings, function (selected_setting) {
            return selected_setting.item_index === this.state.selected_widget.item_index && selected_setting.item_is_label === this.state.selected_widget.item_is_label;
        }, this);

        if (widget_graph && widget_graph['type'] && widget_graph['name'] && widget_graph['component'] && widget_graph['item'] && widget_graph['traces']) {
            var selected_traces = result_options['traces'][widget_graph['type']][widget_graph['name']][widget_graph['component']][widget_graph['item']];
            return _.map(selected_traces, function (selected_trace, index) {
                var trace_setting = false;
                if (widget_graph.traces && widget_graph.traces.length > 0) {
                    trace_setting = _.find(widget_graph.traces, function (trace_item) {
                        return trace_item.index === index;
                    });
                }
                return [
                    (<GridItem key={"griditem_trace_key_" + index} xs={2}>
                        <CustomInput
                            labelText={"Trace key"}
                            id={"trace_key_" + index}
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                type: "text",
                                value: selected_trace['key'],
                            }}
                            helpText={'The trace label defaults to this if left empty.'}
                            readonly
                        />
                    </GridItem>),
                    (<GridItem key={"griditem_trace_label_" + index} xs={2}>
                        <CustomInput
                            labelText={"Trace label"}
                            id={"trace_label_" + index}
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                onChange: event => this.onTraceSettingChange(index, 'label', event.target.value),
                                type: "text",
                                value: trace_setting && trace_setting['label'] ? trace_setting['label'] : '',
                            }}
                            helpText={'Label for the graph trace which will come up in the legend.'}
                        // readonly
                        />
                    </GridItem>),
                    (<GridItem key={"griditem_trace_color_" + index} xs={3}>
                        <CustomInput
                            labelText={"Trace color"}
                            id={"trace_color_" + index}
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                onChange: event => this.onTraceSettingChange(index, 'color', event.target.value),
                                type: "text",
                                value: trace_setting && trace_setting['color'] ? trace_setting['color'] : '',
                            }}
                            helpText={'Hex color codes for ex: #000000 for black.'}
                        />
                    </GridItem>),
                    (<GridItem key={"griditem_trace_type_" + index} xs={3}>
                        <Select
                            title={"Trace graph type"}
                            options={[
                                { value: '', label: '_________' },
                                { value: 'dash', label: '---------' },
                                { value: 'dashdot', label: '_._._._._.' },
                                { value: 'dot', label: '.........' }
                            ]}
                            inputProps={{
                                value: trace_setting && trace_setting['type'] ? trace_setting['type'] : '',
                                onChange: event => this.onTraceSettingChange(index, 'type', event.target.value)
                            }}
                        />
                    </GridItem>),
                    (<GridItem key={"griditem_trace_toggle_" + index} xs={2}>
                        <Switch
                            onChange={() => this.onTraceSettingChange(index, 'hide')}
                            checked={trace_setting && trace_setting['hide'] ? false : true}
                        // inputProps={{ 'aria-labelledby': 'switch-list-label-' + category }}
                        />
                    </GridItem>),
                    // (<GridItem key={"griditem_trace_drilldown_" + index} xs={3}>
                    //   <Select
                    //     title={"Trace drilldown"}
                    //     options={_.map(this.state.selected_settings, function(selected_setting) {
                    //       return {};
                    //     })}
                    //     inputProps={{
                    //       value: trace_setting && trace_setting['drilldown'] ? trace_setting['drilldown'] : '',
                    //       onChange: event => this.onTraceSettingChange(index, 'drilldown', event.target.value)
                    //     }}
                    //   />
                    // </GridItem>)
                ]
            }, this);
        } else {
            return '';
        }
    }

    onTraceSettingChange = (trace_index, trace_type, trace_value) => {
        var selected_settings = _.map(this.state.selected_settings, function (selected_setting) {
            if (selected_setting.item_index === this.state.selected_widget.item_index && selected_setting.item_is_label === this.state.selected_widget.item_is_label) {
                if (!selected_setting.traces) {
                    selected_setting.traces = [];
                }

                var found_trace = false;
                selected_setting.traces = _.map(selected_setting.traces, function (trace) {
                    if (trace.index === trace_index) {
                        found_trace = true;
                        if (trace_type === 'hide') {
                            if (trace['hide']) {
                                trace['hide'] = false;
                            } else {
                                trace['hide'] = true;
                            }
                        } else {
                            trace[trace_type] = trace_value;
                        }

                        return trace;
                    } else {
                        return trace;
                    }
                });

                if (!found_trace) {
                    var new_trace = {
                        index: trace_index
                    };
                    if (trace_type === 'hide') {
                        if (new_trace['hide']) {
                            new_trace['hide'] = false;
                        } else {
                            new_trace['hide'] = true;
                        }
                    } else {
                        new_trace[trace_type] = trace_value;
                    }

                    selected_setting.traces.push(new_trace);
                }

                return selected_setting;
            } else {
                return selected_setting;
            }
        }, this);

        this.setState({
            selected_settings: selected_settings
        });
    }

    renderLayoutItem = (selected_layout, layout_option, graph_index, cardClass) => {
        const { classes } = this.props;

        var cardBodyContent = ' ';
        if (selected_layout) {
            if (this.state.selected_widget['item_index'] === graph_index && this.state.selected_widget['item_is_label'] === false) {
                cardBodyContent = <SettingsIcon className={classes.cardBodyIcon + " " + classes.cardBodyIconSelected} />;
            } else {
                var found_setting = _.find(this.state.selected_settings, function (selected_setting) {
                    return selected_setting['item_index'] === graph_index &&
                        selected_setting['item_is_label'] === false;
                });
                var cardBodyClass = classes.cardBodyIcon;
                if (found_setting && found_setting['type']) {
                    if (!found_setting['name'] || !found_setting['component']) {
                        cardBodyClass += " " + classes.cardBodyIconIncomplete;
                    } else {
                        cardBodyClass += " " + classes.cardBodyIconComplete;
                    }
                }

                cardBodyContent = <SettingsIcon className={cardBodyClass} />;
            }
        }

        if (!cardClass) {
            cardClass = layout_option['no_labels'] === 0 && layout_option['no_graphs'] < 4 ?
                classes.fullCard :
                (
                    layout_option['no_labels'] === 0 ?
                        classes.halfCard :
                        (
                            layout_option['no_graphs'] < 4 ?
                                classes.bigCard :
                                classes.halfBigCard
                        )
                );
        } else {
            cardClass = layout_option['no_labels'] === 0 && cardClass === '1' ?
                classes.fullCard :
                (
                    layout_option['no_labels'] === 0 ?
                        classes.halfCard :
                        (
                            cardClass === '1' ?
                                classes.bigCard :
                                classes.halfBigCard
                        )
                );
        }

        return (
            <Card className={classes.card + " " + cardClass}>
                <CardBody className={classes.cardBody}>{cardBodyContent}</CardBody>
            </Card>
        );
    }

    renderLayoutOption = (selected_layout, layout_option, layout_option_index) => {
        const { classes } = this.props;

        var gridItemClickProps = {};
        var response = [];

        if (layout_option['graph_type']) {
            var graph_sections = layout_option['graph_type'].split('-').map(Number);
            var graph_index_prefix = 0;
            if (layout_option['horizontal']) {
                _.each(graph_sections, function (graph_section, graph_section_index) {
                    var graph_widgets = _.times(graph_section, function (graph_index) {
                        graph_index = graph_index + graph_index_prefix;
                        if (selected_layout) {
                            gridItemClickProps = {
                                onClick: (event) => this.onClickSetting(event, graph_index, false)
                            };
                        }

                        return (
                            <GridItem key={'grid_item_graph_' + layout_option_index + graph_index} xs={(12 / parseInt(graph_section))} className={classes.gridItem} {...gridItemClickProps}>
                                {this.renderLayoutItem(selected_layout, layout_option, graph_index, 1)}
                            </GridItem>
                        );
                    }, this);

                    graph_index_prefix = graph_index_prefix + graph_section;

                    response.push(
                        <GridItem key={'grid_item_graph_section_' + graph_section_index} xs={12}>
                            <GridContainer justify="center" spacing={0}>
                                {graph_widgets}
                            </GridContainer>
                        </GridItem>
                    );
                }, this);
            } else {
                _.each(graph_sections, function (graph_section, graph_section_index) {
                    var graph_widgets = _.times(graph_section, function (graph_index) {
                        graph_index = graph_index + graph_index_prefix;
                        if (selected_layout) {
                            gridItemClickProps = {
                                onClick: (event) => this.onClickSetting(event, graph_index, false)
                            };
                        }

                        return (
                            <GridItem key={'grid_item_graph_' + layout_option_index + graph_index} xs={12} className={classes.gridItem} {...gridItemClickProps}>
                                {this.renderLayoutItem(selected_layout, layout_option, graph_index, graph_section)}
                            </GridItem>
                        );
                    }, this);

                    graph_index_prefix = graph_index_prefix + graph_section;

                    response.push(
                        <GridItem key={'grid_item_graph_section_' + graph_section_index} xs={(12 / graph_sections.length)}>
                            <GridContainer justify="center" spacing={0}>
                                {graph_widgets}
                            </GridContainer>
                        </GridItem>
                    );
                }, this);
            }
        } else {
            response = _.times(layout_option['no_graphs'], function (graph_index) {
                if (selected_layout) {
                    gridItemClickProps = {
                        onClick: (event) => this.onClickSetting(event, graph_index, false)
                    };
                }

                return (
                    <GridItem key={'grid_item_graph_' + layout_option_index + graph_index} xs={layout_option['no_graphs'] > 4 ? 4 : (layout_option['no_graphs'] === 4 ? 6 : 12 / layout_option['no_graphs'])} className={classes.gridItem} {...gridItemClickProps}>
                        {this.renderLayoutItem(selected_layout, layout_option, graph_index)}
                    </GridItem>
                );
            }, this);
        }

        return response;
    }

    clearSettings = () => {
        const { parent_obj, screen_index } = this.props;

        this.setState({
            selected_layout: false,
            selected_widget: {
                item_index: false,
                item_is_label: false
            },
            selected_settings: []
        });

        parent_obj.setSelectedLayout(screen_index, false, []);
    }

    render() {
        const { classes } = this.props;

        const layout_options = [
            { no_labels: 0, no_graphs: 1 },
            { no_labels: 0, no_graphs: 2 },
            { no_labels: 0, no_graphs: 2, graph_type: "1-1", horizontal: true },
            { no_labels: 0, no_graphs: 3, graph_type: "2-1" },
            { no_labels: 0, no_graphs: 3, graph_type: "2-1", horizontal: true },
            { no_labels: 0, no_graphs: 3, graph_type: "1-2" },
            { no_labels: 0, no_graphs: 3, graph_type: "1-2", horizontal: true },
            { no_labels: 0, no_graphs: 3 },
            { no_labels: 0, no_graphs: 4 },
            { no_labels: 0, no_graphs: 4, graph_type: "3-1", horizontal: true },
            { no_labels: 0, no_graphs: 4, graph_type: "1-3", horizontal: true },
            { no_labels: 0, no_graphs: 5, graph_type: "1-4", horizontal: true },
            { no_labels: 0, no_graphs: 5, graph_type: "1-3-1", horizontal: true },
            { no_labels: 0, no_graphs: 5, graph_type: "1-2-2", horizontal: false },
            { no_labels: 0, no_graphs: 6 },
            { no_labels: 0, no_graphs: 6, graph_type: "2-2-2", horizontal: true },
            { no_labels: 0, no_graphs: 7, graph_type: "4-2-1", horizontal: true },
            { no_labels: 0, no_graphs: 7, graph_type: "3-3-1", horizontal: true },
            { no_labels: 0, no_graphs: 7, graph_type: "1-2-2-2", horizontal: true },
            { no_labels: 0, no_graphs: 8, graph_type: "4-2-2", horizontal: true },
            { no_labels: 0, no_graphs: 9, graph_type: "4-3-2", horizontal: true },
            { no_labels: 0, no_graphs: 3, graph_type: "1-1-1", horizontal: true },
            { no_labels: 0, no_graphs: 9, graph_type: "4-3-1-1", horizontal: true },
            { no_labels: 1, no_graphs: 4 },
            { no_labels: 2, no_graphs: 1 },
            { no_labels: 2, no_graphs: 3, graph_type: "1-2", horizontal: true },
            { no_labels: 2, no_graphs: 2 },
            { no_labels: 2, no_graphs: 6 },
            { no_labels: 3, no_graphs: 1 },
            { no_labels: 3, no_graphs: 2 },
            { no_labels: 3, no_graphs: 3 },
            { no_labels: 3, no_graphs: 3, graph_type: "2-1" },
            { no_labels: 3, no_graphs: 3, graph_type: "2-1", horizontal: true },
            { no_labels: 3, no_graphs: 3, graph_type: "1-2" },
            { no_labels: 3, no_graphs: 3, graph_type: "1-2", horizontal: true },
            { no_labels: 3, no_graphs: 4 },
            { no_labels: 3, no_graphs: 4, graph_type: "1-3", horizontal: true },
            { no_labels: 4, no_graphs: 1 },
            { no_labels: 4, no_graphs: 2 },
            { no_labels: 4, no_graphs: 2, graph_type: "1-1", horizontal: true },
            { no_labels: 4, no_graphs: 3 },
            { no_labels: 4, no_graphs: 3, graph_type: "1-1-1", horizontal: true },
            { no_labels: 4, no_graphs: 3, graph_type: "2-1" },
            { no_labels: 4, no_graphs: 3, graph_type: "2-1", horizontal: true },
            { no_labels: 4, no_graphs: 3, graph_type: "1-2" },
            { no_labels: 4, no_graphs: 3, graph_type: "1-2", horizontal: true },
            { no_labels: 4, no_graphs: 4 },
            { no_labels: 4, no_graphs: 4, graph_type: "1-3", horizontal: true },
            { no_labels: 4, no_graphs: 5, graph_type: "3-2", horizontal: true },
            { no_labels: 4, no_graphs: 5, graph_type: "1-2-2", horizontal: false },
            { no_labels: 4, no_graphs: 6 },
            { no_labels: 4, no_graphs: 6, graph_type: "4-1-1", horizontal: true },
            { no_labels: 4, no_graphs: 8, graph_type: "4-4", horizontal: true },
            { no_labels: 5, no_graphs: 1 },
            { no_labels: 5, no_graphs: 2, graph_type: "1-1", horizontal: true },
            { no_labels: 5, no_graphs: 4 },
            { no_labels: 5, no_graphs: 3, graph_type: "2-1" },
            { no_labels: 5, no_graphs: 3, graph_type: "2-1", horizontal: true },
            { no_labels: 5, no_graphs: 3, graph_type: "1-2", horizontal: true },
            { no_labels: 5, no_graphs: 5, graph_type: "3-2", horizontal: true },
            { no_labels: 5, no_graphs: 8, graph_type: "4-4", horizontal: true },
            { no_labels: 6, no_graphs: 1 },
            { no_labels: 6, no_graphs: 2 },
            { no_labels: 6, no_graphs: 2, graph_type: "1-1", horizontal: true },
            { no_labels: 6, no_graphs: 3, graph_type: "1-2", horizontal: true },
            { no_labels: 6, no_graphs: 3, graph_type: "2-1" },
            { no_labels: 6, no_graphs: 3, graph_type: "2-1", horizontal: true },
            { no_labels: 6, no_graphs: 4 },
            { no_labels: 5, no_graphs: 6 },
            { no_labels: 6, no_graphs: 5, graph_type: "2-3", horizontal: true },
            { no_labels: 6, no_graphs: 7, graph_type: "3-2-2", horizontal: true },
            { no_labels: 6, no_graphs: 9, graph_type: "3-3-3", horizontal: true },
            { no_labels: 6, no_graphs: 3, graph_type: "1-1-1", horizontal: true },
            { no_labels: 6, no_graphs: 5, graph_type: "1-2-2", horizontal: true },
            { no_labels: 6, no_graphs: 6, graph_type: "2-2-2", horizontal: true },
            { no_labels: 6, no_graphs: 8, graph_type: "4-4", horizontal: true },
        ];

        return (
            <div className={classes.layoutSelector}>
                <h5 style={{ float: 'left' }}>Choose layout and configure widgets</h5>
                <IconButton
                    // className={classes.iconButton}
                    style={{ float: 'right' }}
                    key="clear"
                    aria-label="Clear Settings"
                    color="inherit"
                    onClick={() => this.clearSettings()}
                >
                    <Icon color="secondary">clear</Icon>
                </IconButton>
                <br clear="all" />
                <div className={classes.layoutGridRoot}>

                    <GridList className={classes.layoutGrid} cols={2.5}>
                        {
                            _.map(_.sortBy(layout_options, function (layout_sorting_option) {
                                return !(this.state.selected_layout &&
                                    this.state.selected_layout['no_labels'] === layout_sorting_option['no_labels'] &&
                                    this.state.selected_layout['no_graphs'] === layout_sorting_option['no_graphs'] &&
                                    this.state.selected_layout['graph_type'] === layout_sorting_option['graph_type'] &&
                                    this.state.selected_layout['horizontal'] === layout_sorting_option['horizontal']);
                            }, this), function (layout_option, layout_option_index) {
                                var layoutContainer = classes.layoutContainer;
                                var cardBodyContent = ' ';
                                var gridItemClickProps = {};
                                var selected_layout = false;
                                if (this.state.selected_layout &&
                                    this.state.selected_layout['no_labels'] === layout_option['no_labels'] &&
                                    this.state.selected_layout['no_graphs'] === layout_option['no_graphs'] &&
                                    this.state.selected_layout['graph_type'] === layout_option['graph_type'] &&
                                    this.state.selected_layout['horizontal'] === layout_option['horizontal']) {
                                    layoutContainer += " " + classes.layoutContainerSelected;
                                    selected_layout = true;
                                }

                                return (
                                    <GridListTile key={"layout_type_" + layout_option_index} className={classes.layoutGridTile} selected={selected_layout}>
                                        <div
                                            key={"layout_container_" + layout_option_index}
                                            className={layoutContainer}
                                            onClick={() => this.onSelectLayout(layout_option)}
                                        >
                                            <GridContainer justify="center" spacing={0}>
                                                {
                                                    _.times(layout_option['no_labels'], function (label_index) {
                                                        if (selected_layout) {
                                                            if (this.state.selected_widget['item_index'] === label_index &&
                                                                this.state.selected_widget['item_is_label'] === true
                                                            ) {
                                                                cardBodyContent = <SettingsIcon className={classes.cardBodyIcon + " " + classes.cardBodyIconSelected} />;
                                                            } else {
                                                                var found_setting = _.find(this.state.selected_settings, function (selected_setting) {
                                                                    return selected_setting['item_index'] === label_index &&
                                                                        selected_setting['item_is_label'] === true;
                                                                });
                                                                var cardBodyClass = classes.cardBodyIcon;
                                                                if (found_setting && found_setting['type']) {
                                                                    if (!found_setting['name'] || !found_setting['component']) {
                                                                        cardBodyClass += " " + classes.cardBodyIconIncomplete;
                                                                    } else {
                                                                        cardBodyClass += " " + classes.cardBodyIconComplete;
                                                                    }
                                                                }

                                                                cardBodyContent = <SettingsIcon className={cardBodyClass} />;
                                                            }
                                                            gridItemClickProps = {
                                                                onClick: (event) => this.onClickSetting(event, label_index, true)
                                                            };
                                                        }

                                                        return (
                                                            <GridItem key={'grid_item_label_' + layout_option_index + label_index} xs={(layout_option['no_labels'] > 5 || layout_option['no_labels'] < 2) ? 2 : true} className={classes.gridItem} {...gridItemClickProps}>
                                                                <Card className={classes.card + " " + classes.label_card} title="label/kpi">
                                                                    <CardBody className={classes.cardBody}>{cardBodyContent}</CardBody>
                                                                </Card>
                                                            </GridItem>
                                                        );
                                                    }, this)
                                                }
                                            </GridContainer>
                                            <GridContainer justify="center" spacing={0}>
                                                {this.renderLayoutOption(selected_layout, layout_option, layout_option_index)}
                                            </GridContainer>
                                        </div>
                                    </GridListTile>
                                )
                            }, this)
                        }
                    </GridList>
                </div>
                <br clear="all" />
                {this.state.selected_widget['item_index'] !== false ? (
                    <div>
                        {this.state.selected_widget['item_is_label'] ? (
                            <h5>Choose Metric:</h5>
                        ) : (
                            <h5>Choose Graph/Table/Insights:</h5>
                        )}
                        <GridContainer>
                            {this.renderSettingSelect('type')}
                            {this.renderSettingSelect('name')}
                            {this.renderSettingSelect('component')}
                            {this.renderSettingSelect('item')}
                        </GridContainer>
                        <GridContainer>
                            {this.renderSettingSelect('simulator_type')}
                            {this.renderSettingSelect('simulator_name')}
                            {this.renderSettingSelect('simulator_component')}
                            {this.renderSettingSelect('simulator_item')}
                        </GridContainer>
                        {this.state.selected_widget['item_is_label'] ? (
                            <h5>Configure Metric Settings:</h5>
                        ) : (
                            <h5>Configure Graph Settings:</h5>
                        )}
                        <GridContainer>
                            {this.renderSettingText('title', 'Title', '')}
                            {this.renderSettingText('subtitle', 'Subtitle', 'ex: Mn USD')}
                            {this.state.selected_widget['item_is_label'] ? this.renderSettingText('value_factor', 'Metric factor', 'ex: 6 for million') : ''}
                            {!this.state.selected_widget['item_is_label'] ? this.renderSettingText('legend', 'Legend position', 'options: Horizontal or Vertical') : ''}
                            {this.state.selected_widget['item_is_label'] ? this.renderSettingText('prefix', 'Prefix', 'ex: $') : ''}
                            {!this.state.selected_widget['item_is_label'] ? (
                                <GridItem key={"griditem_size_nooverride_toggle"} xs={2}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                onChange={() => this.onSettingChange('size_nooverride')}
                                                checked={this.getSettingValue('size_nooverride')}
                                            // inputProps={{ 'aria-labelledby': 'switch-list-label-' + category }}
                                            />
                                        }
                                        label={"Keep iteration size"}
                                    />
                                </GridItem>
                            ) : ''}
                            {!this.state.selected_widget['item_is_label'] ? (
                                <GridItem key={"griditem_color_nooverride_toggle"} xs={2}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                onChange={() => this.onSettingChange('color_nooverride')}
                                                checked={this.getSettingValue('color_nooverride')}
                                            // inputProps={{ 'aria-labelledby': 'switch-list-label-' + category }}
                                            />
                                        }
                                        label={"Keep iteration color"}
                                    />
                                </GridItem>
                            ) : ''}
                        </GridContainer>
                        <h5>Configure extra details & information:</h5>
                        <GridContainer>
                            {this.renderSettingText('assumptions_header', 'Assumptions Title', 'ex: view key events (or) view model performance details.')}
                            {this.renderSettingText('action_link', 'Action Link', 'ex: when you want to redirect an action to another screen. Put the screen index here.')}
                            {/* {this.renderSettingTextarea('assumptions', 'Assumptions', 'ex: definition of a kpi or a graph metric.')} */}
                        </GridContainer>
                        <GridContainer>
                            {this.renderSettingSelect('assumptions_type')}
                            {this.renderSettingSelect('assumptions_name')}
                            {this.renderSettingSelect('assumptions_component')}
                            {this.renderSettingSelect('assumptions_item')}
                        </GridContainer>
                        {!this.state.selected_widget['item_is_label'] ? (
                            <div>
                                <h5>Configure Graph Trace Settings:</h5>
                                <GridContainer>
                                    {this.renderSettingTraces()}
                                </GridContainer>
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                ) : (
                    ''
                )}
            </div>
        )
    }
};

export default withStyles({
    ...layoutSelectorStyle,
    ...customSelectStyle
})(LayoutSelector);