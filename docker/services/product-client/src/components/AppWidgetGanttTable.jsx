import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, Grid, MenuItem, Popover } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

import appWidgetGanttTableStyle from 'assets/jss/appWidgetGanttTableStyle.jsx';

import * as _ from 'underscore';

class AppWidgetGanttTable extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;
        this.state = {
            loading: false,
            resources: props.params.resources,
            extra_assignment_options: props.params.extra_assignment_options,
            waves: props.params.waves,
            range: props.params.range,
            assignments: props.params.assignments,
            selected_cells: [],
            action_option_menu_open: false,
            action_option_menu_anchorEl: false
        };
    }

    onClickEmptyCell = (event) => {
        var resource_name = event.target.getAttribute('resource');
        var tick_item = event.target.getAttribute('tick');
        var selected_cells = this.state.selected_cells;
        var found_selected_index = false;

        if (selected_cells.length > 0 && selected_cells[0]['resource'] !== resource_name) {
            selected_cells = [
                {
                    resource: resource_name,
                    tick: tick_item
                }
            ];
        } else {
            _.each(selected_cells, function (selected_item, selected_index) {
                if (selected_item.resource === resource_name && selected_item.tick === tick_item) {
                    found_selected_index = selected_index;
                }
            });

            if (found_selected_index === false) {
                selected_cells.push({
                    resource: resource_name,
                    tick: tick_item
                });
            } else {
                selected_cells.splice(found_selected_index, 1);
            }
        }

        this.setState({
            selected_cells: selected_cells
        });
    };

    onClickFilterOption = (resource, task) => {
        if (!task || !resource) {
            return;
        } else {
            if (task) {
                var task_details = task.split(' : ');
                var wave_name = task_details[0];
                var task_name = false;
                if (task_details.length > 1) {
                    wave_name = task_details[0];
                    task_name = task_details[1];
                }

                var assignments = this.state.assignments;
                var selected_cells = this.state.selected_cells;
                var current_add = false;
                var current_index = 0;
                var tick_start, tick_end;
                while (selected_cells.length > 0) {
                    if (current_index === selected_cells.length) {
                        if (current_add) {
                            assignments.push(current_add);
                        }
                        current_index = 0;
                        current_add = false;
                    } else {
                        if (!current_add) {
                            tick_start = selected_cells[current_index].tick;
                            tick_end =
                                this.state.range.ticks[
                                    this.state.range.ticks.indexOf(
                                        selected_cells[current_index].tick
                                    ) + 1
                                ];
                            current_add = {
                                resource: resource,
                                wave: wave_name,
                                task: task_name,
                                ticks: [tick_start, tick_end]
                            };
                            selected_cells.splice(current_index, 1);
                        } else {
                            tick_start = selected_cells[current_index].tick;
                            tick_end =
                                this.state.range.ticks[
                                    this.state.range.ticks.indexOf(
                                        selected_cells[current_index].tick
                                    ) + 1
                                ];
                            if (tick_start === current_add.ticks[current_add.ticks.length - 1]) {
                                current_add.ticks.push(tick_end);
                                selected_cells.splice(current_index, 1);
                            } else if (tick_end === current_add.ticks[0]) {
                                current_add.ticks = _.union(tick_start, current_add.ticks);
                                selected_cells.splice(current_index, 1);
                            } else {
                                current_index++;
                            }
                        }
                    }
                }

                if (current_add) {
                    assignments.push(current_add);
                }

                this.setState({
                    selected_cells: selected_cells,
                    assignments: assignments,
                    action_option_menu_anchorEl: false,
                    action_option_menu_open: false
                });
            } else {
                return;
            }
        }
    };

    renderActionsDropdown = (resource_name) => {
        const { classes } = this.props;

        var resource_selected_cells = _.filter(this.state.selected_cells, function (selected_item) {
            return selected_item.resource === resource_name;
        });
        var resource = _.find(this.state.resources, function (resource_item) {
            return resource_item.name === resource_name;
        });

        if (resource_selected_cells.length > 0) {
            var skill_options = false;

            _.each(
                resource_selected_cells,
                function (resource_selected_item) {
                    var tick_task_options = [];

                    _.each(this.state.waves, function (wave_item) {
                        _.each(wave_item.tasks, function (wave_task_item) {
                            if (
                                wave_task_item.ticks.indexOf(resource_selected_item.tick) !== -1 &&
                                wave_task_item.ticks.indexOf(resource_selected_item.tick) !==
                                    wave_task_item.ticks.length - 1 &&
                                resource.skills.indexOf(wave_task_item.type) !== -1 &&
                                tick_task_options.indexOf(
                                    wave_item.name + ' : ' + wave_task_item.type
                                ) === -1
                            ) {
                                tick_task_options.push(
                                    wave_item.name + ' : ' + wave_task_item.type
                                );
                            }
                        });
                    });

                    if (skill_options === false) {
                        skill_options = tick_task_options;
                    } else {
                        skill_options = _.intersection(skill_options, tick_task_options);
                    }
                },
                this
            );

            skill_options = _.union(skill_options, this.state.extra_assignment_options);

            var action_options = _.map(
                skill_options,
                function (option_item) {
                    return (
                        <MenuItem
                            key={'action_option'}
                            value={option_item}
                            classes={{
                                root: classes.actionOptionMenuItem,
                                selected: classes.actionOptionMenuItemSelected
                            }}
                            onClick={() => this.onClickFilterOption(resource_name, option_item)}
                        >
                            {option_item}
                        </MenuItem>
                    );
                },
                this
            );

            return (
                <div className={classes.graphOptionContainer}>
                    <div
                        aria-label="action-dropdown"
                        className={classes.graphOptionValue}
                        onClick={(event) => this.onClickActionDropdown(event)}
                    >
                        <Typography variant="h5" className={classes.graphOptionValueType}>
                            Allocate
                        </Typography>
                        {this.state.action_option_menu_open ? (
                            <ExpandLess fontSize="large" className={classes.graphOptionIcon} />
                        ) : (
                            <ExpandMore
                                aria-label="expand-more"
                                fontSize="large"
                                className={classes.graphOptionIcon}
                            />
                        )}
                    </div>
                    <br />
                    <Popover
                        aria-label="popover"
                        key={'action_option_menu'}
                        keepMounted
                        anchorEl={this.state.action_option_menu_anchorEl}
                        open={this.state.action_option_menu_open}
                        onClose={this.closeGraphFilterMenu}
                    >
                        <div className={classes.filterMenuContainer}>{action_options}</div>
                    </Popover>
                </div>
            );
        } else {
            return (
                <Typography variant="h3" className={classes.ganttTableCellEmpty}>
                    -
                </Typography>
            );
        }
    };

    onClickActionDropdown = (event) => {
        this.setState({
            action_option_menu_open: true,
            action_option_menu_anchorEl: event.currentTarget
        });
    };

    closeGraphFilterMenu = () => {
        this.setState({
            action_option_menu_open: false,
            action_option_menu_anchorEl: false
        });
    };

    render() {
        const { classes } = this.props;

        return (
            <Grid key={'gantt_table_container'} container spacing={1}>
                <Grid key={'gantt_table_name_header'} item xs={1}>
                    <Typography variant="h3" className={classes.ganttTableHeader}>
                        Name
                    </Typography>
                </Grid>
                {_.map(
                    this.state.range.ticks,
                    function (tick_item, tick_index) {
                        if (tick_index === this.state.range.ticks.length - 1) {
                            return (
                                <Grid key={'gantt_table_name_header_actions'} item xs={1}>
                                    <Typography variant="h3" className={classes.ganttTableHeader}>
                                        Actions
                                    </Typography>
                                </Grid>
                            );
                        } else {
                            return (
                                <Grid key={'gantt_table_name_header_' + tick_index} item xs={1}>
                                    <Typography variant="h3" className={classes.ganttTableHeader}>
                                        {tick_item}
                                    </Typography>
                                </Grid>
                            );
                        }
                    },
                    this
                )}
                {_.map(
                    this.state.resources,
                    function (resource_item, resource_index) {
                        var resource_row = [];

                        resource_row.push(
                            <Grid key={'gantt_table_resource_name_' + resource_index} item xs={1}>
                                <Typography variant="h3" className={classes.ganttTableCell}>
                                    {resource_item.name}
                                </Typography>
                            </Grid>
                        );

                        var current_tick_index = 0;

                        while (current_tick_index < this.state.range.ticks.length - 1) {
                            var current_tick_item = this.state.range.ticks[current_tick_index];
                            var is_selected = _.find(
                                this.state.selected_cells,
                                function (selected_item) {
                                    return (
                                        selected_item.resource === resource_item.name &&
                                        selected_item.tick === current_tick_item
                                    );
                                }
                            );

                            var cell_classname = classes.ganttTableCellSelectable;
                            if (is_selected) {
                                cell_classname = classes.ganttTableCellSelected;
                            }

                            var found_break = this.state.range.break[0] === current_tick_item;
                            var found_assignment = _.find(
                                this.state.assignments,
                                function (assignment_item) {
                                    return (
                                        assignment_item.resource === resource_item.name &&
                                        assignment_item.ticks.indexOf(current_tick_item) !== -1 &&
                                        assignment_item.ticks.indexOf(current_tick_item) !==
                                            assignment_item.ticks.length - 1
                                    );
                                }
                            );

                            if (found_assignment) {
                                var found_wave_index = false;
                                _.each(this.state.waves, function (wave_item, wave_index) {
                                    if (wave_item.name === found_assignment.wave) {
                                        found_wave_index = wave_index;
                                    }
                                });

                                if (found_wave_index !== false) {
                                    cell_classname =
                                        classes['ganttTableCellMain' + found_wave_index];
                                } else if (
                                    this.state.extra_assignment_options.indexOf(
                                        found_assignment.wave
                                    ) !== -1
                                ) {
                                    cell_classname =
                                        classes[
                                            'ganttTableCellExtra' +
                                                this.state.extra_assignment_options.indexOf(
                                                    found_assignment.wave
                                                )
                                        ];
                                }

                                resource_row.push(
                                    <Grid item xs={found_assignment.ticks.length - 1}>
                                        <Typography variant="h3" className={cell_classname}>
                                            {found_assignment.task
                                                ? found_assignment.task
                                                : found_assignment.wave}
                                        </Typography>
                                    </Grid>
                                );
                                current_tick_index =
                                    current_tick_index + found_assignment.ticks.length - 1;
                            } else if (found_break) {
                                resource_row.push(
                                    <Grid item xs={this.state.range.break.length - 1}>
                                        <Typography
                                            variant="h3"
                                            className={classes.ganttTableCellBreak}
                                        >
                                            -
                                        </Typography>
                                    </Grid>
                                );
                                current_tick_index =
                                    current_tick_index + this.state.range.break.length - 1;
                            } else {
                                resource_row.push(
                                    <Grid item xs={1}>
                                        <Typography
                                            aria-label="empty-cell"
                                            variant="h3"
                                            className={cell_classname}
                                            resource={resource_item.name}
                                            tick={current_tick_item}
                                            onClick={(event) => this.onClickEmptyCell(event)}
                                        >
                                            -
                                        </Typography>
                                    </Grid>
                                );
                                current_tick_index++;
                            }
                        }

                        resource_row.push(
                            <Grid item xs={1}>
                                {this.renderActionsDropdown(resource_item.name)}
                            </Grid>
                        );

                        return resource_row;
                    },
                    this
                )}
            </Grid>
        );
    }
}

AppWidgetGanttTable.propTypes = {
    classes: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired
};

export default withStyles((theme) => appWidgetGanttTableStyle(theme), { useTheme: true })(
    AppWidgetGanttTable
);
