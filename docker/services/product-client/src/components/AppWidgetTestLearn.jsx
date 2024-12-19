import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, Grid, Menu, MenuItem, Button } from '@material-ui/core';

import { ExpandMore, ExpandLess } from '@material-ui/icons';
import DateRangeSelect from './AppWidgetMultiSelect/DateRangeSelect';
import appWidgetTestLearnStyle from 'assets/jss/appWidgetTestLearnStyle.jsx';

import * as _ from 'underscore';

class AppWidgetTestLearn extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            test_learn_menu_open: false,
            test_learn_menu_anchorEl: false,
            selected_options: []
        };
    }

    closeTestLearnMenu = () => {
        this.setState({
            test_learn_menu_open: false,
            test_learn_menu_anchorEl: false
        });
    };

    onClickTestLearn = (event, field_index) => {
        this.setState({
            test_learn_menu_open: field_index,
            test_learn_menu_anchorEl: event.currentTarget
        });
    };

    onClickTestLearnOption = (option_label, field_index) => {
        var found_selected = false;

        var response_selected = _.map(this.state.selected_options, function (selected_option) {
            if (selected_option.field_index === field_index) {
                selected_option.label = option_label;
                found_selected = true;
            }

            return selected_option;
        });

        if (!found_selected) {
            response_selected = _.union(this.state.selected_options, [
                { field_index: field_index, label: option_label }
            ]);
        }

        this.setState({
            selected_options: response_selected,
            test_learn_menu_open: false,
            test_learn_menu_anchorEl: false
        });
    };

    renderTestLearnMenu = (field_item, field_index) => {
        const { classes } = this.props;

        var value = ' -- select --';
        if (field_item.multiple) {
            value = 'select all';
        }

        var selected_value = false;
        if (this.state.selected_options.length > 0) {
            selected_value = _.find(this.state.selected_options, function (selected_option) {
                return selected_option.field_index === field_index;
            });
        }

        if (selected_value) {
            value = selected_value.label;
        } else if (field_item.value) {
            value = field_item.value;
        }

        if (field_item.multiple) {
            field_item.options = _.union(['selected all'], field_item.options);
        } else {
            field_item.options = _.union(['-- select --'], field_item.options);
        }

        var options = _.map(
            field_item.options,
            function (option_item, option_index) {
                return (
                    <MenuItem
                        key={'filter_option_' + field_index + '_' + option_index}
                        value={option_item}
                        classes={{
                            root: classes.graphFilterMenuItem,
                            selected: classes.graphFilterMenuItemSelected
                        }}
                        className={option_item === value ? classes.selectedItem : ''}
                        onClick={() => this.onClickTestLearnOption(option_item, field_index)}
                    >
                        {option_item}
                    </MenuItem>
                );
            },
            this
        );
        return (
            <div
                key={'chart_filter_container_' + field_index}
                className={classes.testLearnContainer}
            >
                <div key={'chart_filter_' + field_index} className={classes.graphOptionContainer}>
                    {field_item.type === 'date_range' ? (
                        this.renderDataPicker(field_item, field_index)
                    ) : (
                        <React.Fragment>
                            <Typography className={classes.graphOptionLabel} variant="h5">
                                {field_item.name && field_item.name.trim() !== ''
                                    ? field_item.name.trim()
                                    : 'Option ' + (field_index + 1)}
                            </Typography>
                            <div
                                aria-label="graph-option"
                                className={classes.graphOptionValue}
                                onClick={(event) => this.onClickTestLearn(event, field_index)}
                            >
                                <Typography variant="h5" className={classes.graphOptionValueType}>
                                    {value}
                                </Typography>
                                {this.state.test_learn_menu_open === field_index ? (
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
                            <Menu
                                key={'chart_filter_menu_' + field_index}
                                keepMounted
                                anchorEl={this.state.test_learn_menu_anchorEl}
                                open={this.state.test_learn_menu_open === field_index}
                                onClose={this.closeTestLearnMenu}
                            >
                                {options}
                            </Menu>
                        </React.Fragment>
                    )}
                </div>
                <br />
            </div>
        );
    };

    renderDataPicker = (dateitem, dateindex) => {
        const { classes } = this.props;
        return (
            <div style={{ display: 'flex' }}>
                <Typography className={classes.graphOptionLabel} variant="h5">
                    {dateitem.name}
                </Typography>
                <DateRangeSelect
                    key={dateindex}
                    // item={"dateRange"}
                    // selectedValue={{ "dateRange": { "start_date": dateitem.start_date, "end_date": dateitem.end_date } }}
                    // data={dateitem}
                    value={dateitem}
                    onChangeFilter={() => {}}
                />
            </div>
        );
    };

    onCloseSimulator = () => {
        const { parent_obj } = this.props;

        parent_obj.onCloseSimulator();
    };

    onApplySimulator = () => {
        const { parent_obj } = this.props;
        let action = parent_obj.props.data?.data?.value?.test_learn_data?.goto;
        if (action) {
            window.location.href =
                window.location.origin + '/app/' + parent_obj.props.app_id + action;
        } else {
            parent_obj.onApplySimulator();
        }
    };

    render() {
        const { classes, params } = this.props;

        return (
            <div>
                <Grid container spacing={0}>
                    <Grid item xs={4} className={classes.itemContianer}>
                        <Typography variant="h5" className={classes.sectionHeader}>
                            {params.test_learn_data.sample.name}
                        </Typography>
                        {_.map(
                            params.test_learn_data.sample.fields,
                            function (field_item, field_index) {
                                return this.renderTestLearnMenu(field_item, field_index);
                            },
                            this
                        )}
                    </Grid>
                    <Grid item xs={4} className={classes.itemContianer}>
                        <Typography variant="h5" className={classes.sectionHeader}>
                            {params.test_learn_data.test.name}
                        </Typography>
                        {_.map(
                            params.test_learn_data.test.fields,
                            function (field_item, field_index) {
                                return this.renderTestLearnMenu(
                                    field_item,
                                    params.test_learn_data.sample.fields.length + field_index
                                );
                            },
                            this
                        )}
                    </Grid>
                    {params.test_learn_data.compare && params.test_learn_data.compare.name ? (
                        <Grid item xs={4} className={classes.itemContianer}>
                            <Typography variant="h5" className={classes.sectionHeader}>
                                {params.test_learn_data.compare.name}
                            </Typography>
                            {_.map(
                                params.test_learn_data.compare.fields,
                                function (field_item, field_index) {
                                    return this.renderTestLearnMenu(
                                        field_item,
                                        params.test_learn_data.sample.fields.length +
                                            params.test_learn_data.test.fields.length +
                                            field_index
                                    );
                                },
                                this
                            )}
                        </Grid>
                    ) : (
                        ''
                    )}
                    {params.test_learn_data.compare1 && params.test_learn_data.compare1.name ? (
                        <Grid item xs={4} className={classes.itemContianer}>
                            <Typography variant="h5" className={classes.sectionHeader}>
                                {params.test_learn_data.compare1.name}
                            </Typography>
                            {_.map(
                                params.test_learn_data.compare1.fields,
                                function (field_item, field_index) {
                                    return this.renderTestLearnMenu(
                                        field_item,
                                        params.test_learn_data.sample.fields.length +
                                            params.test_learn_data.test.fields.length +
                                            params.test_learn_data.compare.fields.length +
                                            field_index
                                    );
                                },
                                this
                            )}
                        </Grid>
                    ) : (
                        ''
                    )}
                    {params.test_learn_data.compare2 && params.test_learn_data.compare2.name ? (
                        <Grid item xs={4} className={classes.itemContianer}>
                            <Typography variant="h5" className={classes.sectionHeader}>
                                {params.test_learn_data.compare2.name}
                            </Typography>
                            {_.map(
                                params.test_learn_data.compare2.fields,
                                function (field_item, field_index) {
                                    return this.renderTestLearnMenu(
                                        field_item,
                                        params.test_learn_data.sample.fields.length +
                                            params.test_learn_data.test.fields.length +
                                            params.test_learn_data.compare.fields.length +
                                            params.test_learn_data.compare1.fields.length +
                                            field_index
                                    );
                                },
                                this
                            )}
                        </Grid>
                    ) : (
                        ''
                    )}
                    {params.test_learn_data.compare3 && params.test_learn_data.compare3.name ? (
                        <Grid item xs={4} className={classes.itemContianer}>
                            <Typography variant="h5" className={classes.sectionHeader}>
                                {params.test_learn_data.compare3.name}
                            </Typography>
                            {_.map(
                                params.test_learn_data.compare3.fields,
                                function (field_item, field_index) {
                                    return this.renderTestLearnMenu(
                                        field_item,
                                        params.test_learn_data.sample.fields.length +
                                            params.test_learn_data.test.fields.length +
                                            params.test_learn_data.compare.fields.length +
                                            params.test_learn_data.compare1.fields.length +
                                            params.test_learn_data.compare2.fields.length +
                                            field_index
                                    );
                                },
                                this
                            )}
                        </Grid>
                    ) : (
                        ''
                    )}
                </Grid>
                <div className={classes.simulatorFormDivider}></div>
                <div className={classes.graphActions}>
                    <Button
                        variant="outlined"
                        className={classes.simulatorButtons}
                        onClick={this.onCloseSimulator}
                        aria-label="Reset"
                    >
                        {'Reset'}
                    </Button>
                    <Button
                        variant="contained"
                        className={classes.simulatorButtons}
                        onClick={this.onApplySimulator}
                        aria-label="Apply"
                    >
                        {'Apply'}
                    </Button>
                    <Button
                        variant="contained"
                        className={classes.simulatorButtons}
                        aria-label="Save Test"
                    >
                        {'Save Test'}
                    </Button>
                </div>
                <br />
            </div>
        );
    }
}

AppWidgetTestLearn.propTypes = {
    classes: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    parent_obj: PropTypes.object.isRequired
};

export default withStyles((theme) => appWidgetTestLearnStyle(theme), { useTheme: true })(
    AppWidgetTestLearn
);
