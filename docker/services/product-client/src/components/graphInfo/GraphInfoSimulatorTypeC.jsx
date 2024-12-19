import { Grid, Paper, Typography, MenuItem, Popover } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import AppWidgetPlot from '../AppWidgetPlot';
import clsx from 'clsx';
import { ExpandMore, ExpandLess } from '@material-ui/icons';
import * as _ from 'underscore';

const useStyles = makeStyles((theme) => ({
    graphGridContainer: {
        padding: theme.spacing(2),
        border: '1px solid',
        borderColor: theme.palette.primary.main
    },
    graphTitleTypography: {
        fontSize: theme.spacing(2),
        color: theme.palette.text.titleText,
        opacity: '0.8'
    },
    actionsBarItemSimulator: {
        float: 'right',
        position: 'relative'
    },
    graphOptionContainer: {
        float: 'right',
        position: 'relative',
        backgroundColor: theme.palette.primary.light,
        borderRadius: theme.spacing(0.5),
        // width: '100%',
        marginRight: '1rem',
        zIndex: '100'
    },
    graphOptionValue: {
        float: 'left',
        position: 'relative',
        padding: theme.spacing(0.5, 0),
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(4),
        color: theme.palette.primary.contrastText,
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: theme.palette.primary.contrastText,
            color: theme.palette.primary.dark,
            borderRadius: theme.spacing(0.5)
        }
    },
    graphOptionValueType: {
        fontWeight: 700
    },
    graphOptionIcon: {
        position: 'absolute',
        right: theme.spacing(0.5),
        top: theme.spacing(0.5),
        fontWeight: 700
    },
    graphOptionMenu: {
        position: 'absolute'
    },
    graphOptionLabel: {
        float: 'left',
        position: 'relative',
        padding: theme.spacing(0.5, 0),
        marginRight: theme.spacing(1),
        marginLeft: theme.spacing(1.5),
        color: theme.palette.text.default,
        fontWeight: 500
    },
    graphFilterMenuItem: {
        fontSize: '1.5rem',
        color: theme.palette.primary.contrastText + ' !important',
        '&:hover': {
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.primary.light
        }
    },
    graphFilterMenuItemSelected: {
        fontSize: '1.5rem',
        color: theme.palette.primary.main + ' !important',
        backgroundColor: theme.palette.primary.contrastText + ' !important'
    },
    graphFilterMenuSearchItem: {
        fontSize: '1.5rem',
        color: theme.palette.primary.contrastText + ' !important'
    },
    graphFilterMenuSearchInput: {
        // marginLeft: theme.spacing(2),
        '&&&:before': {
            borderBottom: 'none'
        },
        '& input': {
            // padding: theme.spacing(1),
            // float: 'right',
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.contrastText,
            textAlign: 'left',
            padding: theme.spacing(0.5, 1),
            margin: theme.spacing(0.6, 0),
            fontSize: '1.5rem',
            borderRadius: '5px'
        }
    },
    graphFilterMenuSearchIcon: {
        position: 'absolute',
        right: theme.spacing(5),
        top: theme.spacing(1.5)
    },
    titleAndFilterContainer: {
        display: 'flex',
        justifyContent: 'space-between'
    }
}));

export function GraphInfoSimulatorTypeC({ graphInfo, size_nooverride, color_nooverride }) {
    const classes = useStyles();
    const [data, setData] = useState({ ...graphInfo });
    useEffect(() => setData({ ...data, ...graphInfo }), [graphInfo]);
    return (
        <Grid container spacing={2} direction="row" style={{ padding: '2rem 0' }}>
            {data?.graph_list.map((graph, index) => {
                const md = data.grid_config.split('-')[index];
                return (
                    <Grid
                        item
                        xs={12}
                        md={md ? Number(md) : false}
                        key={'GraphInfo' + index + graph.layout?.title?.text}
                    >
                        <Paper
                            elevation={6}
                            className={clsx(classes.graphGridContainer)}
                            style={{
                                height: graphInfo?.graph_height ? graphInfo.graph_height : '320px'
                            }}
                        >
                            <MapGraphComponent
                                classes={classes}
                                graphData={graph}
                                onChange={setData}
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

const MapGraphComponent = ({ classes, graphData, size_nooverride, color_nooverride }) => {
    const [graph, setGraph] = useState('');
    const [graphFilters, setGraphFilters] = useState([]);

    useEffect(() => {
        const { plot, filters } = setupPlot(graphData, graphData['combinationPlot']);
        setGraph(plot);
        setGraphFilters(filters);
    }, []);

    return (
        <>
            <div className={classes.titleAndFilterContainer}>
                <Typography variant="h6" className={classes.graphTitleTypography}>
                    {graph.layout?.title?.text || ''}
                </Typography>
                {graphFilters && graphFilters.length > 0 ? (
                    <div className={classes.actionsBarItemSimulator}>
                        <GraphFilterComponent
                            classes={classes}
                            graph_data={graph}
                            isCombinationUpdateMenu={graph['combinationPlot'] || false}
                            onFilterChange={setGraph}
                            graphFilters={graphFilters}
                            onGraphFilterChange={setGraphFilters}
                        />
                    </div>
                ) : null}
            </div>
            {graph && (
                <AppWidgetPlot
                    params={graph}
                    graph_height={'half'}
                    size_nooverride={size_nooverride}
                    color_nooverride={color_nooverride}
                />
            )}
        </>
    );
};

const getCombinationUpdateMenu = (current_data, graph_filters, search) => {
    const combinationUpdateMenu = current_data?.combinationPlot;
    let combinationVisibleArray;
    const possibleCombination = [];

    if (combinationUpdateMenu) {
        current_data['layout']['updatemenus'].forEach((el, elIndex) => {
            if (!graph_filters[elIndex].hide) {
                possibleCombination.push(el.buttons[el.active].label);
            }
        });
        const combinationLabel = possibleCombination.join('-');
        for (let el of combinationUpdateMenu) {
            if (el.label === combinationLabel) {
                combinationVisibleArray = el['args'];
                break;
            }
        }
    }
    if (combinationVisibleArray) {
        _.each(combinationVisibleArray, function (filter_item) {
            current_data['layout']['yaxis']['title'] = filter_item?.yaxis
                ? {
                      ...current_data['layout']['yaxis']['title'],
                      text: filter_item['yaxis']['title']
                  }
                : current_data['layout']['yaxis']['title'];

            current_data['layout']['xaxis']['title'] = filter_item?.xaxis
                ? {
                      ...current_data['layout']['xaxis']['title'],
                      text: filter_item['xaxis']['title']
                  }
                : current_data['layout']['xaxis']['title'];

            if (filter_item['visible']) {
                let visible = filter_item['visible'];
                current_data['data'] = _.map(
                    current_data['data'],
                    function (data_item, trace_index) {
                        data_item.visible =
                            visible[trace_index] &&
                            (data_item.text + '').toLowerCase().includes(search);
                        return data_item;
                    }
                );
            } else if (filter_item['annotations']) {
                current_data['layout']['annotations'] = filter_item['annotations'];
                if (filter_item['title']) {
                    current_data['layout']['title']['text'] = filter_item['title'];
                }
            } else {
                return;
            }
        });
    }
    return [combinationVisibleArray, current_data];
};

const setupPlot = (current_value, isCombinationUpdateMenu) => {
    const graph_filters = [];
    const trace_config = 'false';
    if (current_value['layout']) {
        if (
            current_value['layout']['updatemenus'] &&
            current_value['layout']['updatemenus'].length > 0
        ) {
            if (!current_value['frames']) {
                current_value['layout']['updatemenus'] = _.map(
                    current_value['layout']['updatemenus'],
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
                                            (current_value['data'] &&
                                                button_item.args.length > 0 &&
                                                button_item.args[0] &&
                                                JSON.stringify(button_item.args[0].visible) ===
                                                    JSON.stringify(
                                                        _.map(
                                                            current_value['data'],
                                                            function (data_item) {
                                                                return data_item.visible !== false;
                                                            }
                                                        )
                                                    )) ||
                                            button_index === update_menu_item.active
                                    };
                                }
                            ),
                            hideMenus: update_menu_item?.hideMenus
                                ? update_menu_item.hideMenus
                                : false,
                            hide: update_menu_item?.hide ? update_menu_item.hide : false
                        });
                        update_menu_item.visible = false;
                        return update_menu_item;
                    }
                );
            }
        }
    }

    if (!isCombinationUpdateMenu && current_value['layout']['updatemenus']) {
        let activeIndex = current_value['layout']['updatemenus'][0]['active'];

        let args = current_value['layout']['updatemenus'][0]['buttons'][activeIndex]['args'];
        let annotations = _.compact(_.pluck(args, 'annotations'))[0];
        let title = _.compact(_.pluck(args, 'title'))[0];

        if (annotations) {
            current_value['layout']['annotations'] = annotations;
        }
        if (title) {
            current_value['layout']['title'] = { text: title };
        }
    }

    if (graph_filters && isCombinationUpdateMenu) {
        [, current_value] = getCombinationUpdateMenu(current_value, graph_filters, '');
    }
    if (current_value['data']) {
        current_value['data'] = _.filter(current_value['data'], function (data_item, index) {
            let trace_config_selected = _.find(trace_config, function (trace_config_item) {
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

const GraphFilterComponent = ({
    classes,
    graph_data,
    onFilterChange,
    graphFilters,
    onGraphFilterChange
}) => {
    const [anchorEl, setanchorEl] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [data, setData] = useState(graph_data);
    const [graph_filters, setGraphFilters] = useState(graphFilters);
    const [filter_search_value] = useState('');

    const onClickGraphFilter = (event, filter_index) => {
        setMenuOpen(filter_index);
        setanchorEl(event.currentTarget);
    };

    const onClickFilterOption = (selected_value, filter_index) => {
        let option_index = false;
        let current_data = data;
        const search = filter_search_value;

        const new_graph_filters = _.map(graph_filters, function (filter_item, filter_item_index) {
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

        current_data['layout']['updatemenus'][filter_index].active = option_index;
        current_data['layout']['updatemenus'][filter_index].showActive = true;

        let [combinationVisibleArray, new_current_data] = getCombinationUpdateMenu(
            current_data,
            new_graph_filters,
            filter_search_value
        );

        let chart_option_args =
            current_data['layout']['updatemenus'][filter_index]['buttons'][option_index]['args'];
        if (!combinationVisibleArray) {
            _.each(chart_option_args, function (filter_item) {
                if (filter_item['annotations']) {
                    current_data['layout']['annotations'] = filter_item['annotations'];
                }
                if (filter_item['title']) {
                    current_data['layout']['title'] = { text: filter_item['title'] };
                }

                if (filter_item['visible']) {
                    let visible = filter_item['visible'];
                    current_data['data'] = _.map(
                        current_data['data'],
                        function (data_item, trace_index) {
                            data_item.visible =
                                visible[trace_index] &&
                                (data_item.text + '').toLowerCase().includes(search);
                            return data_item;
                        }
                    );
                } else if (filter_item['yaxis']) {
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
                        current_data['layout']['yaxis']['tickprefix'] =
                            filter_item['yaxis']['tickprefix'];
                    if (filter_item['yaxis']['ticksuffix'])
                        current_data['layout']['yaxis']['ticksuffix'] =
                            filter_item['yaxis']['ticksuffix'];
                } else if (filter_item['xaxis']) {
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
                        current_data['layout']['xaxis']['tickprefix'] =
                            filter_item['xaxis']['tickprefix'];
                    if (filter_item['xaxis']['ticksuffix'])
                        current_data['layout']['xaxis']['ticksuffix'] =
                            filter_item['xaxis']['ticksuffix'];
                } else {
                    return;
                }
            });
        } else {
            current_data = new_current_data;
        }
        setData(current_data);
        onFilterChange(current_data);
        onGraphFilterChange(new_graph_filters);
        setGraphFilters(new_graph_filters);
        setanchorEl(false);
        setMenuOpen(false);
    };
    const closeGraphFilterMenu = () => {
        setMenuOpen(false);
        setanchorEl(false);
    };
    return [
        _.map(graph_filters, function (filter_item, filter_index) {
            let value = false;
            let options = _.map(
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

            return (
                <div
                    key={'chart_filter_' + filter_index}
                    className={clsx(
                        classes.graphOptionContainer,
                        filter_item?.hide && classes.graphHideUpdateMenu
                    )}
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
