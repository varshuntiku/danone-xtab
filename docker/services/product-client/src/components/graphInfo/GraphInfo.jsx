import { Grid, Paper, Typography, MenuItem, Popover, Input } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import AppWidgetPlot from '../AppWidgetPlot';
import clsx from 'clsx';
import { ExpandMore, ExpandLess, Search } from '@material-ui/icons';
import appWidgetGraphStyle from 'assets/jss/appWidgetGraphStyle.jsx';
import * as _ from 'underscore';

export function GraphInfo({ graphInfo, size_nooverride, color_nooverride }) {
    const useStyles = makeStyles(appWidgetGraphStyle);
    const classes = useStyles();
    const [anchorEl, setanchorEl] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [graphFilters, setGraphFilters] = useState([]);
    const [data, setData] = useState(graphInfo['graph_list']);
    const [filter_search_value] = useState('');
    const setupPlot = (graphInfo) => {
        // const { details } = this.props;
        // var trace_config = details.config.traces;

        if (graphInfo.graph_list[0]['layout']) {
            var graph_filters = [];
            if (
                graphInfo.graph_list[0]['layout']['updatemenus'] &&
                graphInfo.graph_list[0]['layout']['updatemenus'].length > 0
            ) {
                if (!graphInfo.graph_list[0]['frames']) {
                    graphInfo.graph_list[0]['layout']['updatemenus'] = _.map(
                        graphInfo.graph_list[0]['layout']['updatemenus'],
                        function (update_menu_item, updatemenu_index) {
                            graph_filters.push({
                                name: update_menu_item.name
                                    ? update_menu_item.name
                                    : 'update_menu_' + updatemenu_index,
                                options: _.map(
                                    update_menu_item.buttons,
                                    function (button_item, button_index) {
                                        return {
                                            label: button_item.label,
                                            selected:
                                                (graphInfo.graph_list[0]['data'] &&
                                                    button_item.args.length > 0 &&
                                                    button_item.args[0] &&
                                                    JSON.stringify(button_item.args[0].visible) ===
                                                        JSON.stringify(
                                                            _.map(
                                                                graphInfo.graph_list[0]['data'],
                                                                function (data_item) {
                                                                    return (
                                                                        data_item.visible !== false
                                                                    );
                                                                }
                                                            )
                                                        )) ||
                                                button_index === update_menu_item.active
                                        };
                                    }
                                )
                            });
                            update_menu_item.visible = false;
                            return update_menu_item;
                        }
                    );
                }
            }
        }

        // if (graphInfo.graph_list[0]['data']) {
        //     graphInfo.graph_list[0]['data'] = _.filter(graphInfo.graph_list[0]['data'], function (data_item, index) {
        //         var trace_config_selected = _.find(trace_config, function (trace_config_item) {
        //             return trace_config_item.index === index;
        //         });

        //         if (trace_config_selected && trace_config_selected['hide']) {
        //             return false;
        //         } else {
        //             return true;
        //         }
        //     });
        // }

        return {
            filters: graph_filters
        };
    };
    React.useEffect(() => {
        setGraphFilters(setupPlot(graphInfo)['filters']);
    }, []);

    const renderChartFilters = () => {
        var plot_filters = graphFilters;

        return [
            _.map(plot_filters, function (filter_item, filter_index) {
                var value = false;
                var options = _.map(
                    _.filter(filter_item.options, function (option_instance) {
                        if (option_instance.selected) {
                            value = option_instance.label;
                        }

                        if (filter_search_value !== '') {
                            return (
                                option_instance.label
                                    .toLowerCase()
                                    .indexOf(filter_search_value.toLowerCase()) !== -1
                            );
                        } else {
                            return true;
                        }
                    }),
                    function (option_item, option_index) {
                        return (
                            <MenuItem
                                key={'filter_option_' + filter_index + '_' + option_index}
                                value={option_item.label}
                                classes={{
                                    root: classes.graphFilterMenuItem,
                                    selected: classes.graphFilterMenuItemSelected
                                }}
                                onClick={() => onClickFilterOption(option_item.label, filter_index)}
                            >
                                {option_item.label}
                            </MenuItem>
                        );
                    }
                );

                if (filter_item.options.length > 9) {
                    options.splice(
                        0,
                        0,
                        <MenuItem
                            key={'filter_option_search_' + filter_index}
                            classes={{
                                root: classes.graphFilterMenuSearchItem
                            }}
                        >
                            <Input
                                className={classes.graphFilterMenuSearchInput}
                                variant="filled"
                                placeholder="search..."
                                value={filter_search_value}
                                onChange={this.onChangeFilterSearchValue}
                            />
                            <Search
                                fontSize="large"
                                className={classes.graphFilterMenuSearchIcon}
                            />
                        </MenuItem>
                    );
                }

                return (
                    <div
                        key={'chart_filter_' + filter_index}
                        className={classes.graphOptionContainer}
                    >
                        <Typography className={classes.graphOptionLabel} variant="h5">
                            {filter_item.name && filter_item.name.trim() !== ''
                                ? filter_item.name.trim()
                                : 'Option ' + (filter_index + 1)}
                        </Typography>
                        <div
                            className={classes.graphOptionValue}
                            onClick={(event) => onClickGraphFilter(event, filter_index)}
                        >
                            <Typography variant="h5" className={classes.graphOptionValueType}>
                                {value}
                            </Typography>
                            {menuOpen === filter_index ? (
                                <ExpandLess fontSize="large" className={classes.graphOptionIcon} />
                            ) : (
                                <ExpandMore fontSize="large" className={classes.graphOptionIcon} />
                            )}
                        </div>
                        <br />
                        <Popover
                            key={'chart_filter_menu_' + filter_index}
                            keepMounted
                            anchorEl={anchorEl}
                            open={menuOpen === filter_index}
                            onClose={closeGraphFilterMenu}
                        >
                            <div className={classes.filterMenuContainer}>{options}</div>
                        </Popover>
                    </div>
                );
            }),
            <br key="chart-filters-clear" />
        ];
    };

    const onClickFilterOption = (selected_value, filter_index) => {
        var graph_filters = graphFilters;
        var option_index = false;
        var current_data = graphInfo['graph_list'];
        const search = '';

        graph_filters = _.map(graph_filters, function (filter_item, filter_item_index) {
            if (filter_index === filter_item_index) {
                filter_item.options = _.map(
                    filter_item.options,
                    function (option_item, option_item_index) {
                        if (selected_value === option_item.label) {
                            option_item.selected = true;
                            option_index = option_item_index;
                        } else {
                            option_item.selected = false;
                        }

                        return option_item;
                    }
                );
            }
            return filter_item;
        });

        current_data[0]['layout']['updatemenus'][filter_index].active = option_index;
        current_data[0]['layout']['updatemenus'][filter_index].showActive = true;

        var chart_option_args =
            current_data[0]['layout']['updatemenus'][filter_index]['buttons'][option_index]['args'];

        _.each(chart_option_args, function (filter_item) {
            if (filter_item['visible']) {
                var visible = filter_item['visible'];
                current_data[0]['data'] = _.map(
                    current_data[0]['data'],
                    function (data_item, trace_index) {
                        data_item.visible =
                            visible[trace_index] &&
                            (data_item.text + '').toLowerCase().includes(search);
                        return data_item;
                    }
                );
            } else if (filter_item['yaxis']) {
                if (!current_data[0]['layout']['yaxis']) {
                    current_data[0]['layout']['yaxis'] = {};
                }
                current_data[0]['layout']['yaxis']['title'] = {
                    ...current_data[0]['layout']['yaxis']['title'],
                    text: filter_item['yaxis']['title']
                };
                if (filter_item['yaxis']['range'])
                    current_data[0]['layout']['yaxis']['range'] = filter_item['yaxis']['range'];
                if (filter_item['yaxis']['tickprefix'])
                    current_data[0]['layout']['yaxis']['tickprefix'] =
                        filter_item['yaxis']['tickprefix'];
                if (filter_item['yaxis']['ticksuffix'])
                    current_data[0]['layout']['yaxis']['ticksuffix'] =
                        filter_item['yaxis']['ticksuffix'];
            } else if (filter_item['xaxis']) {
                if (!current_data[0]['layout']['xaxis']) {
                    current_data[0]['layout']['xaxis'] = {};
                }
                current_data[0]['layout']['xaxis']['title'] = {
                    ...current_data[0]['layout']['xaxis']['title'],
                    text: filter_item['xaxis']['title']
                };
                if (filter_item['xaxis']['range'])
                    current_data[0]['layout']['xaxis']['range'] = filter_item['xaxis']['range'];
                if (filter_item['xaxis']['tickprefix'])
                    current_data[0]['layout']['xaxis']['tickprefix'] =
                        filter_item['xaxis']['tickprefix'];
                if (filter_item['xaxis']['ticksuffix'])
                    current_data[0]['layout']['xaxis']['ticksuffix'] =
                        filter_item['xaxis']['ticksuffix'];
            } else {
                return;
            }
        });

        setData(current_data);
        setGraphFilters(graph_filters);
        setanchorEl(false);
        setMenuOpen(false);
    };

    const onClickGraphFilter = (event, filter_index) => {
        setMenuOpen(filter_index);
        setanchorEl(event.currentTarget);
    };

    const closeGraphFilterMenu = () => {
        setMenuOpen(false);
        setanchorEl(false);
    };
    return (
        <Grid container spacing={2}>
            {data.map((graph, index) => {
                const md = graphInfo.grid_config.split('-')[index];
                return (
                    <Grid
                        item
                        xs={md ? Number(md) : false}
                        key={'GraphInfo' + index + graph.layout?.title?.text}
                    >
                        <Paper
                            elevation={6}
                            className={clsx(classes.graphGridContainer)}
                            style={{ height: graph.graph_height }}
                        >
                            <Typography variant="h6" className={classes.graphTitleTypography}>
                                {graph.layout?.title?.text || ''}
                            </Typography>
                            <div className={classes.actionsBarItemSimulator}>
                                {renderChartFilters()}
                            </div>
                            <AppWidgetPlot
                                params={graph}
                                graph_height={'half'}
                                size_nooverride={size_nooverride}
                                color_nooverride={color_nooverride}
                            />
                        </Paper>
                    </Grid>
                );
            })}
        </Grid>
    );
}
