import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import {
    /*Button, */ Grid,
    Dialog /*, DialogActions*/,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography
} from '@material-ui/core';
import { Tabs, Tab } from '@material-ui/core';
import { Close } from '@material-ui/icons';

import AppWidgetTable from 'components/AppWidgetTable.jsx';
import AppWidgetPlot from 'components/AppWidgetPlot.jsx';

import blueprintWidgetOutputsStyle from 'assets/jss/blueprintWidgetOutputsStyle.jsx';

import { getBlueprintWidgetInputs, getBlueprintWidgetOutput } from 'services/admin_execution.js';

import * as _ from 'underscore';

class BlueprintWidgetInputs extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            open: true,
            output_list: false,
            selected_tab: false,
            selected_output: false,
            loading_output: false
        };
    }

    componentDidMount() {
        const { input_widgets, notebook_id, iteration_id } = this.props;

        getBlueprintWidgetInputs({
            payload: {
                input_widget_ids: _.map(input_widgets, function (input_widget) {
                    return input_widget.id;
                })
            },
            notebook_id: notebook_id,
            iteration_id: iteration_id,
            callback: this.onResponseGetInputs
        });
    }

    onResponseGetInputs = (response_data) => {
        this.setState({
            output_list: response_data['list']
        });
    };

    closeInputs = () => {
        const { parent_obj } = this.props;

        parent_obj.closeInputs();
    };

    onChangeTab = (evt, selected_tabindex) => {
        const { notebook_id, iteration_id } = this.props;

        this.setState({
            selected_tab: selected_tabindex,
            loading_output: true
        });

        getBlueprintWidgetOutput({
            notebook_id: notebook_id,
            iteration_id: iteration_id,
            widget_id: this.state.output_list[selected_tabindex].widget_id,
            payload: {
                output_blobpath: this.state.output_list[selected_tabindex].output
            },
            callback: this.onResponseOutputWidget
        });
    };

    onResponseOutputWidget = (response_data) => {
        this.setState({
            loading_output: false,
            selected_output: response_data['output']
        });
    };

    render() {
        const { classes, input_widgets } = this.props;

        var output_filetype = false;
        if (
            this.state.selected_tab !== false &&
            this.state.output_list &&
            this.state.output_list.length > 0
        ) {
            var output_widget_id = this.state.output_list[this.state.selected_tab].widget_id;
            var output_filename_elements =
                this.state.output_list[this.state.selected_tab].output.split('/');
            var output_filename = output_filename_elements[output_filename_elements.length - 1]
                .replace('output-', '')
                .replace(output_widget_id + '-', '');
            var output_filename_parts = output_filename.split('.');
            output_filetype = output_filename_parts[output_filename_parts.length - 1];
        }

        return (
            <Dialog
                open={this.state.open}
                fullWidth
                classes={{ paper: classes.paper }}
                maxWidth="xl"
                onClose={() => {
                    this.closeInputs();
                }}
                aria-labelledby="blueprint-widget-inputs-title"
                aria-describedby="blueprint-widget-inputs-content"
            >
                <DialogTitle
                    className={classes.title}
                    disableTypography
                    id="blueprint-widget-inputs-title"
                >
                    <Typography variant="h4" className={classes.heading}>
                        {'Widget Inputs'}
                    </Typography>
                    <IconButton
                        title="Close"
                        onClick={() => {
                            this.closeInputs();
                        }}
                        className={classes.actionIcon}
                    >
                        <Close fontSize="large" />
                    </IconButton>
                </DialogTitle>
                <DialogContent id="blueprint-widget-inputs-content">
                    <Grid key="form-body" container spacing={2}>
                        <Grid item xs>
                            <Tabs
                                value={this.state.selected_tab}
                                onChange={this.onChangeTab}
                                classes={{}}
                                aria-label="widget input tabs list"
                            >
                                {_.map(this.state.output_list, function (output_list_details) {
                                    var output_list_item = output_list_details.output;
                                    var widget_id = output_list_details.widget_id;
                                    var found_input_widget = _.find(
                                        input_widgets,
                                        function (input_widget) {
                                            return input_widget.id === widget_id;
                                        }
                                    );
                                    var output_filename_elements = output_list_item.split('/');
                                    var output_filename = output_filename_elements[
                                        output_filename_elements.length - 1
                                    ]
                                        .replace('output-', '')
                                        .replace(widget_id + '-', '');
                                    var output_filename_parts = output_filename.split('.');
                                    return (
                                        <Tab
                                            label={
                                                found_input_widget.name +
                                                ' - ' +
                                                output_filename_parts[0]
                                            }
                                        />
                                    );
                                })}
                            </Tabs>
                            <div className={classes.widgetOutputBody}>
                                {!this.state.loading_output && output_filetype === 'csv' ? (
                                    <AppWidgetTable params={this.state.selected_output} />
                                ) : !this.state.loading_output && output_filetype === 'json' ? (
                                    this.state.selected_output['data'] &&
                                    this.state.selected_output['layout'] ? (
                                        <AppWidgetPlot params={this.state.selected_output} />
                                    ) : (
                                        ''
                                    )
                                ) : (
                                    ''
                                )}
                            </div>
                        </Grid>
                    </Grid>
                    ,
                </DialogContent>
            </Dialog>
        );
    }
}

BlueprintWidgetInputs.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(
    (theme) => ({
        ...blueprintWidgetOutputsStyle(theme)
    }),
    { withTheme: true }
)(BlueprintWidgetInputs);
