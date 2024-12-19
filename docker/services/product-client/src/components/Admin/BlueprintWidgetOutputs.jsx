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
import { Tabs, Tab, LinearProgress } from '@material-ui/core';
import { Close } from '@material-ui/icons';

import AppWidgetTable from 'components/AppWidgetTable.jsx';
import AppWidgetPlot from 'components/AppWidgetPlot.jsx';

import blueprintWidgetOutputsStyle from 'assets/jss/blueprintWidgetOutputsStyle.jsx';

import { getBlueprintWidgetOutputs, getBlueprintWidgetOutput } from 'services/admin_execution.js';

import nl2br from 'react-newline-to-break';

import * as _ from 'underscore';

class BlueprintWidgetOutputs extends React.Component {
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
        const { notebook_id, iteration_id, widget_id } = this.props;

        getBlueprintWidgetOutputs({
            notebook_id: notebook_id,
            iteration_id: iteration_id,
            widget_id: widget_id,
            callback: this.onResponseOutputsWidget
        });
    }

    onResponseOutputsWidget = (response_data) => {
        this.setState({
            output_list: response_data['list']
        });
    };

    closeOutputs = () => {
        const { parent_obj } = this.props;

        parent_obj.closeOutputs();
    };

    onChangeTab = (evt, selected_tabindex) => {
        const { notebook_id, iteration_id, widget_id } = this.props;

        this.setState({
            selected_tab: selected_tabindex,
            loading_output: true
        });

        getBlueprintWidgetOutput({
            notebook_id: notebook_id,
            iteration_id: iteration_id,
            widget_id: widget_id,
            payload: {
                output_blobpath: this.state.output_list[selected_tabindex]
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

    renderOutput = () => {
        const { classes, widget_id } = this.props;

        var output_filetype = false;
        if (
            this.state.selected_tab !== false &&
            this.state.output_list &&
            this.state.output_list.length > 0
        ) {
            var output_filename_elements =
                this.state.output_list[this.state.selected_tab].split('/');
            var output_filename = output_filename_elements[output_filename_elements.length - 1]
                .replace('output-', '')
                .replace(widget_id + '-', '');
            var output_filename_parts = output_filename.split('.');
            output_filetype = output_filename_parts[output_filename_parts.length - 1];
        }

        if (output_filetype === 'csv') {
            return <AppWidgetTable params={this.state.selected_output} />;
        } else {
            if (output_filetype === 'json') {
                if (this.state.selected_output['data'] && this.state.selected_output['layout']) {
                    return <AppWidgetPlot params={this.state.selected_output} />;
                } else {
                    return _.map(this.state.selected_output, function (output_item, output_key) {
                        if (output_item === false || output_item === null) {
                            return '';
                        }

                        if (typeof output_item === 'string') {
                            output_item = JSON.parse(output_item);
                        }

                        return (
                            <div className={classes.tabContainer}>
                                <br />
                                <Typography variant="h5" className={classes.subHeading}>
                                    {output_key}
                                </Typography>
                                <br />
                                {Array.isArray(output_item) ? (
                                    typeof output_item[0] === 'object' ? (
                                        <AppWidgetTable
                                            params={{
                                                table_headers: _.keys(output_item[0]),
                                                table_data: _.map(
                                                    output_item,
                                                    function (output_counter) {
                                                        return _.values(output_counter);
                                                    }
                                                )
                                            }}
                                        />
                                    ) : (
                                        <AppWidgetTable
                                            params={{
                                                table_headers: ['Data'],
                                                table_data: _.map(
                                                    output_item,
                                                    function (output_counter) {
                                                        return [output_counter];
                                                    }
                                                )
                                            }}
                                        />
                                    )
                                ) : typeof output_item === 'object' ? (
                                    output_item['data'] && output_item['layout'] ? (
                                        <AppWidgetPlot params={output_item} />
                                    ) : (
                                        <AppWidgetTable
                                            params={{
                                                table_headers: _.keys(output_item),
                                                table_data: [_.values(output_item)]
                                            }}
                                        />
                                    )
                                ) : (
                                    <Typography className={classes.tabOutputText} variant="h6">
                                        {nl2br(output_item)}
                                    </Typography>
                                )}
                            </div>
                        );
                    });
                }
            } else {
                return '';
            }
        }
    };

    render() {
        const { classes, widget_id } = this.props;

        return (
            <Dialog
                open={this.state.open}
                fullWidth
                maxWidth="xl"
                onClose={() => {
                    this.closeOutputs();
                }}
                aria-labelledby="blueprint-widget-outputs-title"
                aria-describedby="blueprint-widget-outputs-content"
            >
                <DialogTitle
                    className={classes.title}
                    disableTypography
                    id="blueprint-widget-outputs-title"
                >
                    <Typography variant="h4" className={classes.heading}>
                        {'Widget Outputs'}
                    </Typography>
                    <IconButton
                        title="Close"
                        onClick={() => {
                            this.closeOutputs();
                        }}
                        className={classes.actionIcon}
                    >
                        <Close fontSize="large" />
                    </IconButton>
                </DialogTitle>
                <DialogContent id="blueprint-widget-outputs-content">
                    <Grid key="form-body" container spacing={2}>
                        <Grid item xs>
                            <Tabs
                                value={this.state.selected_tab}
                                onChange={this.onChangeTab}
                                classes={{}}
                                aria-label="widget output tabs list"
                            >
                                {_.map(this.state.output_list, function (output_list_item) {
                                    var output_filename_elements = output_list_item.split('/');
                                    var output_filename = output_filename_elements[
                                        output_filename_elements.length - 1
                                    ]
                                        .replace('output-', '')
                                        .replace(widget_id + '-', '');
                                    var output_filename_parts = output_filename.split('.');
                                    return <Tab label={output_filename_parts[0]} />;
                                })}
                            </Tabs>
                            <div className={classes.widgetOutputBody}>
                                {this.state.loading_output ? (
                                    <LinearProgress />
                                ) : (
                                    this.renderOutput()
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

BlueprintWidgetOutputs.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(
    (theme) => ({
        ...blueprintWidgetOutputsStyle(theme)
    }),
    { withTheme: true }
)(BlueprintWidgetOutputs);
