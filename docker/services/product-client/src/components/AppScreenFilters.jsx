import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography } from '@material-ui/core';
import appScreenFilterStyle from 'assets/jss/appScreenFilterStyle.jsx';
import clsx from 'clsx';

import { Grid, Paper, AppBar, Toolbar, Button } from '@material-ui/core';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import { getFilters } from 'services/filters.js';
import Tooltip from '@material-ui/core/Tooltip';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import CheckIcon from '@material-ui/icons/Check';
import CodxCircularLoader from './CodxCircularLoader';
import ScreenFilterIcon from 'assets/Icons/ScreenFilterIcon';

import * as _ from 'underscore';

const FilterRadioGroup = withStyles((theme) => ({
    checked: {
        color: theme.palette.primary.contrastText
    }
}))(RadioGroup);

const FilterRadio = withStyles((theme) => ({
    checked: {
        color: theme.palette.primary.contrastText
    }
}))(Radio);

class AppScreenFilters extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            loading: false,
            filters: false,
            filters_open: props.open ? true : false,
            filter_order: false,
            filter_options: false,
            filter_topics: false,
            current_filter_options: false,
            default_open: props.open,
            tooltipOpen: true,
            snackbarOpen: false
        };
    }

    componentDidMount() {
        const { app_id, screen_id } = this.props;

        this.setState({
            loading: true
        });

        getFilters({
            app_id: app_id,
            screen_id: screen_id,
            callback: this.onResponseGetFilters
        });
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = () => {
            return;
        };
    }

    onResponseGetFilters = (response_data) => {
        const { parent_obj, app_info } = this.props;
        const filter_topics = [];
        const filter_relationships = [];

        _.each(response_data.values, function (value_mapping_item) {
            var pushable = true;
            value_mapping_item = _.map(
                value_mapping_item,
                function (value_mapping_spec_value, value_mapping_spec_key) {
                    // delete value_mapping_spec['value_id'];
                    _.each(
                        app_info['modules']['filter_settings'],
                        function (filter_setting, filter_key) {
                            if (
                                !filter_setting['enabled'] &&
                                filter_key === value_mapping_spec_key
                            ) {
                                if (filter_setting['include'] !== value_mapping_spec_value) {
                                    pushable = false;
                                }
                            }
                        }
                    );
                    return {
                        key: value_mapping_spec_key,
                        value: value_mapping_spec_value
                    };
                }
            );

            if (pushable) {
                filter_relationships.push(value_mapping_item);
            }
        });

        _.each(response_data.topics, function (grouped_filter_item, grouped_filter_key) {
            if (
                app_info.permissions &&
                app_info.permissions.data &&
                app_info.permissions.data[grouped_filter_key]
            ) {
                filter_topics[grouped_filter_key] = _.sortBy(
                    _.filter(grouped_filter_item, function (grouped_filter_item_value) {
                        return app_info.permissions.data[grouped_filter_key].includes(
                            grouped_filter_item_value
                        );
                    })
                );
            } else {
                filter_topics[grouped_filter_key] = _.sortBy(grouped_filter_item);
            }
        });

        var filter_order = this.setupFilterOrder(filter_topics, []);

        var filter_options = {};

        _.each(
            filter_order,
            function (order_item) {
                filter_options[order_item['key']] = this.findFilterOptions(
                    order_item['key'],
                    order_item['parent'],
                    filter_topics,
                    filter_relationships,
                    filter_options
                );
                filter_options[order_item['key']]['label'] = order_item['label'];
            },
            this
        );

        _.each(app_info['modules']['filter_settings'], function (filter_item, filter_key) {
            if (!filter_item['enabled']) {
                filter_options[filter_key] = {
                    options: false,
                    disabled: true,
                    checked: filter_item['include']
                };
            }
        });

        this.setState({
            loading: false,
            filter_relationships: filter_relationships,
            filter_order: filter_order,
            filter_options: filter_options,
            filter_topics: filter_topics,
            current_filter_options: false
        });
        this.setupSessionStorage(filter_options);
        parent_obj.getWidgetData(filter_options);
    };

    setupFilterOrder = (filter_topics, filter_order, parent = false) => {
        const { app_info } = this.props;

        var found_filter_category = false;

        _.each(app_info['modules']['filter_settings'], function (filter_item, filter_key) {
            if (
                ((!parent && filter_item.parent === '') || filter_item.parent === parent) &&
                filter_item.enabled
            ) {
                if (filter_topics[filter_key]) {
                    found_filter_category = filter_key;
                }
            }
        });

        if (found_filter_category) {
            filter_order.push({
                key: found_filter_category,
                label: app_info['modules']['filter_settings'][found_filter_category]['label'],
                parent: app_info['modules']['filter_settings'][found_filter_category]['parent']
            });
            filter_order = this.setupFilterOrder(
                filter_topics,
                filter_order,
                found_filter_category
            );
        }

        return filter_order;
    };

    findFilterOptions = (
        filter_category,
        parent,
        filter_topics,
        filter_relationships,
        filter_options
    ) => {
        const { app_info } = this.props;

        var session_filters = {};
        if (sessionStorage.getItem('app_filter_info_' + app_info.id)) {
            session_filters = JSON.parse(sessionStorage.getItem('app_filter_info_' + app_info.id));
        }

        var default_checked = false;
        if (parent === '') {
            if (session_filters && session_filters[filter_category]) {
                default_checked = session_filters[filter_category];
            } else {
                default_checked = app_info['modules']['filter_settings'][filter_category]['default']
                    ? app_info['modules']['filter_settings'][filter_category]['default']
                    : false;
            }

            if (!default_checked || !filter_topics[filter_category].includes(default_checked)) {
                default_checked = filter_topics[filter_category][0];
            }
            return {
                options: filter_topics[filter_category],
                checked: default_checked
            };
        } else {
            var options = _.sortBy(
                _.unique(
                    _.map(
                        _.filter(filter_relationships, function (tag_values) {
                            var parent_satisfied = true;
                            _.each(
                                filter_options,
                                function (filter_option_value, filter_option_key) {
                                    var found_parent_tag_value = false;
                                    var found_permission_tag_value = false;
                                    found_parent_tag_value = _.find(
                                        tag_values,
                                        function (tag_value) {
                                            if (
                                                tag_value['key'] === filter_option_key &&
                                                tag_value['value'] ===
                                                    filter_option_value['checked']
                                            ) {
                                                return true;
                                            }
                                        }
                                    );

                                    if (filter_topics[filter_category]) {
                                        found_permission_tag_value = _.find(
                                            tag_values,
                                            function (tag_value) {
                                                if (
                                                    tag_value['key'] === filter_category &&
                                                    filter_topics[filter_category].includes(
                                                        tag_value['value']
                                                    )
                                                ) {
                                                    return true;
                                                }
                                            }
                                        );
                                    } else {
                                        found_permission_tag_value = true;
                                    }

                                    if (found_parent_tag_value && found_permission_tag_value) {
                                        parent_satisfied = parent_satisfied && true;
                                    } else {
                                        parent_satisfied = false;
                                    }
                                }
                            );

                            var found_tag_value = false;
                            found_tag_value = _.find(tag_values, function (tag_value) {
                                return tag_value['key'] === filter_category;
                            });

                            return parent_satisfied && found_tag_value;
                        }),
                        function (filtered_tag_values) {
                            var found_tag_value = false;
                            found_tag_value = _.find(
                                filtered_tag_values,
                                function (filtered_tag_value) {
                                    return filtered_tag_value['key'] === filter_category;
                                }
                            );

                            if (found_tag_value) {
                                return found_tag_value['value'];
                            } else {
                                return false;
                            }
                        }
                    )
                ),
                function (filter_value) {
                    return filter_value;
                }
            );

            if (options.length === 1 && options[0] === false) {
                options = false;
            } else if (options.length === 0) {
                options = false;
            }

            if (session_filters && session_filters[filter_category]) {
                default_checked = session_filters[filter_category];
            } else {
                default_checked = app_info['modules']['filter_settings'][filter_category]['default']
                    ? app_info['modules']['filter_settings'][filter_category]['default']
                    : false;
            }

            if (!default_checked || !options.includes(default_checked)) {
                default_checked = options[0];
            }

            return {
                options: options,
                checked: default_checked
            };
        }
    };

    handleFiltersOpen = () => {
        this.setState({
            filters_open: true
        });
    };

    handleFiltersClose = () => {
        this.setState({
            filters_open: false,
            current_filter_options: false
        });
    };

    filterValueToggle = (event, filter_key) => {
        const { app_info } = this.props;

        var saved_filter_options = this.state.current_filter_options
            ? this.state.current_filter_options
            : this.state.filter_options;
        saved_filter_options = JSON.parse(JSON.stringify(saved_filter_options));

        if (saved_filter_options && saved_filter_options[filter_key]) {
            saved_filter_options[filter_key]['checked'] = event.target.value;
        }

        var filter_options = {};

        _.each(
            this.state.filter_order,
            function (order_item) {
                filter_options[order_item['key']] = this.findFilterOptions(
                    order_item['key'],
                    order_item['parent'],
                    this.state.filter_topics,
                    this.state.filter_relationships,
                    filter_options
                );
                if (
                    filter_options[order_item['key']]['options'] &&
                    filter_options[order_item['key']]['options'].includes(
                        saved_filter_options[order_item['key']]['checked']
                    ) !== false
                ) {
                    filter_options[order_item['key']]['checked'] =
                        saved_filter_options[order_item['key']]['checked'];
                }
                filter_options[order_item['key']]['label'] = order_item['label'];
            },
            this
        );

        _.each(app_info['modules']['filter_settings'], function (filter_item, filter_key) {
            if (!filter_item['enabled']) {
                filter_options[filter_key] = {
                    options: false,
                    disabled: true,
                    checked: filter_item['include']
                };
            }
        });

        this.setState({
            current_filter_options: filter_options
        });
    };

    handleFiltersApply = () => {
        const { parent_obj } = this.props;

        this.setState({
            filters_open: false,
            filter_options: JSON.parse(JSON.stringify(this.state.current_filter_options)),
            current_filter_options: false
        });

        this.setupSessionStorage(this.state.current_filter_options);

        parent_obj.getWidgetData(this.state.current_filter_options);
    };

    setupSessionStorage = (current_filter_options) => {
        const { app_info } = this.props;

        var filter_options = current_filter_options;
        var storage_response = {};

        _.each(filter_options, function (filter_option_value, filter_option_key) {
            storage_response[filter_option_key] = filter_option_value.checked;
        });
        sessionStorage.setItem(
            'app_screen_filter_info_' + app_info.id + '_' + this.props.screen_id,
            JSON.stringify(storage_response)
        );
        sessionStorage.setItem('app_filter_info_' + app_info.id, JSON.stringify(storage_response));
    };

    filterSelectionHandler = () => {
        this.setState({
            tooltipOpen: false,
            snackbarOpen: true
        });
        // this.props.tooltipAction()
    };
    filterDefaultHandler = () => {
        this.setState({
            tooltipOpen: false
        });
    };

    render() {
        const { classes } = this.props;
        // const is_objectives = this.props.parent_obj.props.location.pathname.includes("/app/" + this.props.app_id + "/objectives");
        const is_objectives =
            this.props.parent_obj.props.location?.pathname.indexOf('/objectives') !== -1;

        const filterTooltip = (
            <Fragment>
                <Typography className={classes.tooltipText}>
                    Please continue with the default filter selection OR change the filter values to
                    view the guided flow as per your selection.
                </Typography>
                <Typography className={classes.tooltipNote}>
                    Note: You can not change the filter selections once the flow starts.
                </Typography>
                <div className={classes.buttonSection}>
                    <Button
                        aria-label="default-filter"
                        variant="outlined"
                        className={classes.tooltipButton}
                        onClick={this.filterDefaultHandler}
                    >
                        No
                    </Button>
                    <Button
                        aria-label="selection-filter"
                        variant="contained"
                        className={classes.tooltipButton}
                        onClick={this.filterSelectionHandler}
                    >
                        Yes
                    </Button>
                </div>
            </Fragment>
        );
        var enabled_filters = [];
        if (this.state.filter_order) {
            var filter_options = this.state.current_filter_options
                ? this.state.current_filter_options
                : this.state.filter_options;
            enabled_filters = _.map(
                this.state.filter_order,
                function (filter_item) {
                    return filter_options && filter_options[filter_item['key']]['options'] ? (
                        <Grid key={'filter_category_container_' + filter_item['label']} item xs>
                            <FormControl component="fieldset" className={classes.filterFormControl}>
                                <Typography color="inherit" variant="h5">
                                    {filter_item['label'] && filter_item['label'].length <= 3
                                        ? filter_item['label'].toUpperCase()
                                        : filter_item['label']}
                                </Typography>
                                <div className={classes.filterFormOptionsContainer}>
                                    <FilterRadioGroup
                                        aria-label={filter_item['key']}
                                        name={filter_item['key']}
                                        value={filter_options[filter_item['key']]['checked']}
                                        onChange={(event) =>
                                            this.filterValueToggle(event, filter_item['key'])
                                        }
                                    >
                                        {_.map(
                                            filter_options[filter_item['key']]['options'],
                                            function (filter_value) {
                                                return (
                                                    <FormControlLabel
                                                        key={filter_item['key'] + filter_value}
                                                        value={filter_value}
                                                        control={
                                                            <FilterRadio
                                                                className={classes.radio}
                                                            />
                                                        }
                                                        classes={{
                                                            label: classes.filterRadioLabel
                                                        }}
                                                        label={filter_value}
                                                    />
                                                );
                                            },
                                            this
                                        )}
                                    </FilterRadioGroup>
                                </div>
                            </FormControl>
                        </Grid>
                    ) : (
                        ''
                    );
                },
                this
            );
        }

        if (this.state.filters_open) {
            return (
                <Grid
                    container
                    className={clsx(
                        classes.filtersGridBody,
                        !this.state.filters_open && classes.hide
                    )}
                    spacing={0}
                >
                    <Grid item xs={12}>
                        <Paper className={classes.filterCategoryBody}>
                            <Grid container justify="center" spacing={2}>
                                {enabled_filters}
                            </Grid>
                            {this.state.default_open ? (
                                ''
                            ) : (
                                <Toolbar>
                                    <Button
                                        aria-label="apply filter"
                                        variant="contained"
                                        onClick={this.handleFiltersApply}
                                        edge="end"
                                        className={classes.filterToolbarButtonApply}
                                        disabled={this.state.current_filter_options === false}
                                    >
                                        Apply
                                    </Button>
                                    <Button
                                        aria-label="close filter"
                                        variant="outlined"
                                        onClick={this.handleFiltersClose}
                                        className={classes.filterToolbarButtonCancel}
                                    >
                                        Cancel
                                    </Button>
                                </Toolbar>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            );
        } else {
            return (
                <AppBar
                    position="relative"
                    color="default"
                    className={clsx(classes.appBar, this.state.filters_open && classes.hide)}
                >
                    <Toolbar className={classes.filterToolbar}>
                        {is_objectives ? (
                            <Fragment>
                                <Snackbar
                                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    open={this.state.snackbarOpen}
                                    autoHideDuration={2000}
                                    onClose={() => {
                                        this.setState({ snackbarOpen: false });
                                    }}
                                >
                                    <Alert
                                        icon={
                                            <CheckIcon
                                                fontSize="large"
                                                className={classes.snackIcon}
                                            />
                                        }
                                        className={classes.tooltipSnack}
                                    >
                                        Your filters have been locked.
                                    </Alert>
                                </Snackbar>
                                <Tooltip
                                    title={filterTooltip}
                                    arrow
                                    placement="bottom-start"
                                    classes={{
                                        arrow: classes.arrow,
                                        tooltip: classes.tooltip
                                    }}
                                    open={this.state.tooltipOpen}
                                    interactive
                                >
                                    <Button
                                        variant="outlined"
                                        className={clsx(
                                            classes.filterButton,
                                            this.state.filters_open && classes.hide
                                        )}
                                        onClick={this.handleFiltersOpen}
                                        startIcon={
                                            <ScreenFilterIcon
                                                height={'14'}
                                                width={'16'}
                                                color={this.props.theme.palette.text.contrastText}
                                            />
                                        }
                                        aria-label="Filters"
                                    >
                                        Filters
                                    </Button>
                                </Tooltip>
                            </Fragment>
                        ) : (
                            <Button
                                aria-label="filters"
                                variant="outlined"
                                className={clsx(
                                    classes.filterButton,
                                    this.state.filters_open && classes.hide
                                )}
                                onClick={this.handleFiltersOpen}
                                startIcon={
                                    <ScreenFilterIcon
                                        height={'14'}
                                        width={'16'}
                                        color={this.props.theme.palette.text.contrastText}
                                    />
                                }
                            >
                                Filters
                            </Button>
                        )}
                        {this.state.loading && <CodxCircularLoader size={50} center />}
                        <div className={classes.filterAppliedList}>
                            {_.map(this.state.filter_options, function (filter_option) {
                                if (filter_option['disabled']) {
                                    return '';
                                } else {
                                    return (
                                        <React.Fragment>
                                            <div
                                                key={'selected_filter_' + filter_option['label']}
                                                className={classes.filterOptionContainer}
                                            >
                                                <span className={classes.filterOptionHeader}>
                                                    <Typography variant="inherit" noWrap>
                                                        {filter_option['label'] &&
                                                        filter_option['label'].length <= 3
                                                            ? filter_option['label'].toUpperCase()
                                                            : filter_option['label']}
                                                    </Typography>
                                                </span>
                                                <span className={classes.filterOptionValue}>
                                                    <Typography variant="inherit" noWrap>
                                                        {filter_option['checked']}
                                                    </Typography>
                                                </span>
                                            </div>
                                            <div className={classes.verticalLine}></div>
                                        </React.Fragment>
                                    );
                                }
                            })}
                            <br />
                        </div>
                    </Toolbar>
                </AppBar>
            );
        }
    }
}

AppScreenFilters.propTypes = {
    classes: PropTypes.object.isRequired,
    parent_obj: PropTypes.object.isRequired,
    app_info: PropTypes.object.isRequired
};

export default withStyles(
    (theme) => ({
        ...appScreenFilterStyle(theme)
    }),
    { withTheme: true }
)(AppScreenFilters);
