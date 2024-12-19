import React from 'react';
import PropTypes from 'prop-types';

import { Grid /*, Tooltip, Typography*/ } from '@material-ui/core';
import {
    OndemandVideo,
    Build,
    Assessment,
    TrendingUp,
    Dashboard,
    List,
    Functions
} from '@material-ui/icons';

import { getWidgetComponents } from 'services/admin.js';

// import nl2br from "react-newline-to-break";

import * as _ from 'underscore';

class WidgetComponents extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            widget_id: props.widget_id,
            loading: false,
            code_metadata: false,
            code_demo: false,
            repo: false,
            path: false
        };
    }

    refreshMetadata = () => {
        const { widget_id } = this.props;

        if (widget_id && widget_id !== '') {
            this.setState({
                loading: true
            });

            getWidgetComponents({
                widget_id: widget_id,
                callback: this.onResponseGetComponents
            });
        }
    };

    componentDidMount() {
        this.refreshMetadata();
    }

    componentDidUpdate() {
        const { widget_id } = this.props;

        if (widget_id !== this.state.widget_id) {
            this.setState({
                widget_id: widget_id
            });

            this.refreshMetadata();
        }
    }

    onResponseGetComponents = (response_data) => {
        this.setState({
            code_metadata: response_data['metadata'],
            code_demo: response_data['code_demo'],
            repo: response_data['code_details']['repo'],
            path: response_data['code_details']['path']
        });
    };

    codeDemo = () => {
        var demo_url = import.meta.env['REACT_APP_JUPYTER_DEMO_URL'];
        demo_url += this.state.path
            .replace('codex_widget_factory/', '')
            .replace('.py', '.ipynb')
            .replace('/', '_');

        if (import.meta.env['REACT_APP_JUPYTER_DEMO_TOKEN'] !== '') {
            demo_url += '?token=' + import.meta.env['REACT_APP_JUPYTER_DEMO_TOKEN'];
        }

        window.open(demo_url, '_new');
    };

    render() {
        const { classes } = this.props;

        return this.state.code_metadata ? (
            <div>
                {this.state.code_demo ? (
                    <div
                        contained
                        onClick={this.codeDemo}
                        style={{ textAlign: 'left' }}
                        aria-label="Demo"
                        className={classes.demo}
                    >
                        <OndemandVideo />
                        <span>Demo</span>
                    </div>
                ) : (
                    ''
                )}
                <Grid container spacing={2}>
                    {_.map(this.state.code_metadata, function (metadata_item) {
                        return (
                            <Grid item key={'grid-item-' + metadata_item['name']} xs={3}>
                                <div
                                    title={metadata_item.doc_string}
                                    className={classes.blueprintWidgetComponentContainer}
                                >
                                    {/* <Typography className={classes.blueprintWidgetComponentLabel}>{metadata_item['name']}</Typography> */}
                                    <div className={classes.blueprintWidgetComponentIcon}>
                                        {metadata_item.return_type === 'MODEL' ? (
                                            <Build />
                                        ) : metadata_item.return_type === 'VISUALS' ? (
                                            <Assessment />
                                        ) : metadata_item.return_type === 'PREDICTIONS' ? (
                                            <TrendingUp />
                                        ) : metadata_item.return_type === 'METADATA' ? (
                                            <Dashboard />
                                        ) : metadata_item.return_type === 'DATA' ? (
                                            <List />
                                        ) : (
                                            <Functions />
                                        )}
                                    </div>
                                </div>
                            </Grid>
                        );
                    })}
                </Grid>
            </div>
        ) : (
            ''
        );
    }
}

WidgetComponents.propTypes = {
    classes: PropTypes.object.isRequired,
    widget_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default WidgetComponents;
