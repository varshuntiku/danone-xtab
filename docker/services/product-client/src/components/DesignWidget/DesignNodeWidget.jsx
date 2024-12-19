import * as React from 'react';
import find from 'lodash/find';
import map from 'lodash/map';
import { DesignPortLabel } from './DesignPortLabelWidget';
import { DefaultNodeWidget } from 'storm-react-diagrams';

import AttachmentIcon from '@material-ui/icons/AttachFile';
import CommentIcon from '@material-ui/icons/Comment';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import ErrorIcon from '@material-ui/icons/Error';
import EditIcon from '@material-ui/icons/Edit';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import withStyles from '@material-ui/core/styles/withStyles';

import { IconButton, Tooltip, Typography } from '@material-ui/core';

import BlueprintWidgetOutputs from 'components/Admin/BlueprintWidgetOutputs.jsx';
import BlueprintWidgetInputs from 'components/Admin/BlueprintWidgetInputs.jsx';

import codex_loader from 'assets/img/codex-loader.gif';

import { getWidgetDefaultCode, executeBlueprintWidget } from 'services/admin_execution.js';
import designNodeWidgetStyle from './DesignNodeWidgetStyle';

class DesignNodeWidget extends DefaultNodeWidget {
    generatePort(port) {
        return <DesignPortLabel data-testid="port" model={port} key={port.id} />;
    }

    onClickInputs = () => {
        const { node } = this.props;

        var in_port = find(node.ports, function (port) {
            return port.in;
        });

        var input_widgets = [];

        if (in_port && in_port.links) {
            input_widgets = map(in_port.links, function (link) {
                return {
                    id: link.sourcePort.parent.id,
                    name: link.sourcePort.parent.name
                };
            });
        }

        this.setState({
            show_inputs: input_widgets
        });
    };

    closeInputs = () => {
        this.setState({
            show_inputs: false
        });
    };

    onClickOutputs = () => {
        this.setState({
            show_outputs: true
        });
    };

    closeOutputs = () => {
        this.setState({
            show_outputs: false
        });
    };

    onClickEdit = () => {
        const { node, design_obj } = this.props;

        var loading_nodecode = true;
        if (!node.extras.widget_code) {
            if (node.extras.widget_type === 'CUSTOM') {
                if (node.extras.widget_id === 'PLACEHOLDER') {
                    node.extras.widget_code = '# Please write your custom python code here...';
                }

                loading_nodecode = false;
            }
        } else {
            loading_nodecode = false;
        }

        design_obj.setState({
            item_selected: {
                id: node.id,
                name: node.name,
                extras: node.extras
            },
            clone_enabled: false,
            loading_nodecode: loading_nodecode
        });

        if (loading_nodecode) {
            getWidgetDefaultCode({
                widget_id: node.extras.widget_id,
                callback: this.onResponseGetDefaultCode
            });
        }
    };

    onClickExecute = () => {
        const { node, notebook_id, iteration_id } = this.props;

        executeBlueprintWidget({
            iteration_id: iteration_id,
            notebook_id: notebook_id,
            widget_id: node.id,
            callback: this.onResponseExecute
        });
    };

    onResponseExecute = () => {
        const { design_obj } = this.props;

        design_obj.clearChanges();
    };

    onResponseGetDefaultCode = (response_data) => {
        const { design_obj } = this.props;

        var item_selected = design_obj.state.item_selected;
        item_selected.extras.widget_code = response_data['details']['sourcecode'];
        item_selected.extras.doc_strings = response_data['details']['docstrings'];

        design_obj.setState({
            item_selected: item_selected,
            loading_nodecode: false
        });
    };

    render() {
        const { node, notebook_id, iteration_id, classes } = this.props;
        const isSelected = this.props.design_obj?.state?.item_selected.id === node.id;
        var container_styles = {
            background: node.light_color,
            position: 'relative'
        };

        if (node.extras.node_width) {
            container_styles['width'] = node.extras.node_width + 'px';
            container_styles['opacity'] = '0.75';
        }

        if (node.extras.node_height) {
            container_styles['height'] = node.extras.node_height + 'px';
            container_styles['opacity'] = '0.75';
        }

        if (node.extras.node_color) {
            container_styles['background'] = node.extras.node_color;
            container_styles['opacity'] = '0.75';
        }

        if (node.extras.title_color) {
            container_styles['color'] = node.extras.title_color;
            container_styles['opacity'] = '0.75';
        }
        return [
            <div key={'containerParentDiv'} className={isSelected ? classes.selectedStyle : ''}>
                <div
                    key={'containerDiv'}
                    {...this.getProps()}
                    style={container_styles}
                    data-testid="node"
                >
                    {node.comments_count > 0 ? (
                        <div className={classes.commentIconStyle} data-testid="comment-icon">
                            <CommentIcon style={{ color: '#b0b0b0' }} />
                        </div>
                    ) : (
                        ''
                    )}
                    {node.attachments_count > 0 ? (
                        <div
                            style={{
                                position: 'absolute',
                                top: '-15px',
                                left: '2px',
                                zIndex: '-1'
                            }}
                            data-testid="attachment-icon"
                        >
                            <AttachmentIcon style={{ color: '#b0b0b0' }} />
                        </div>
                    ) : (
                        ''
                    )}
                    {node.show_toolbar ? (
                        <div
                            style={{
                                position: 'absolute',
                                top: '0px',
                                left: '0px',
                                zIndex: '2',
                                height: '100%',
                                width: '100%',
                                marginTop: '48px'
                            }}
                        >
                            <div
                                style={{
                                    position: 'absolute',
                                    height: '50%',
                                    width: '100%',
                                    background: '#b0b0b0',
                                    borderRadius: '0 0 5px 5px'
                                }}
                            >
                                <Tooltip
                                    title="Inputs"
                                    aria-label="Inputs"
                                    data-testid="node-tooltip"
                                    classes={{ tooltip: this.bem('__iconTooltip') }}
                                >
                                    <IconButton
                                        className={this.bem('__iconButton')}
                                        onClick={this.onClickInputs}
                                        component="span"
                                    >
                                        <ArrowForwardIcon className={this.bem('__icon')} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip
                                    title="Edit"
                                    aria-label="Edit"
                                    classes={{ tooltip: this.bem('__iconTooltip') }}
                                >
                                    <IconButton
                                        className={this.bem('__iconButton')}
                                        onClick={this.onClickEdit}
                                        aria-label="Edit"
                                        component="span"
                                    >
                                        <EditIcon className={this.bem('__icon')} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip
                                    title="Execute"
                                    aria-label="Execute"
                                    classes={{ tooltip: this.bem('__iconTooltip') }}
                                >
                                    <IconButton
                                        className={this.bem('__iconButton')}
                                        onClick={this.onClickExecute}
                                        aria-label="Execute"
                                        component="span"
                                    >
                                        <PlayCircleFilledIcon className={this.bem('__icon')} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip
                                    title={
                                        <React.Fragment>
                                            <Typography variant="h5">Logs</Typography>
                                            <Typography variant="h6">
                                                {node.execution_logs ? node.execution_logs : '---'}
                                            </Typography>
                                        </React.Fragment>
                                    }
                                    aria-label="Logs"
                                    classes={{ tooltip: this.bem('__iconTooltip') }}
                                >
                                    <IconButton
                                        className={this.bem('__iconButton')}
                                        aria-label="Outputs"
                                        component="span"
                                    >
                                        <AssignmentIcon className={this.bem('__icon')} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip
                                    title="Outputs"
                                    aria-label="Outputs"
                                    classes={{ tooltip: this.bem('__iconTooltip') }}
                                >
                                    <IconButton
                                        className={this.bem('__iconButton')}
                                        onClick={this.onClickOutputs}
                                        aria-label="Outputs"
                                        component="span"
                                    >
                                        <ArrowForwardIcon className={this.bem('__icon')} />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>
                    ) : (
                        ''
                    )}
                    {node.execution_status === 'QUEUED' ? (
                        <div
                            style={{
                                position: 'absolute',
                                top: '0px',
                                left: '0px',
                                zIndex: '2',
                                height: '100%',
                                width: '100%'
                            }}
                        >
                            <Tooltip
                                title={
                                    <React.Fragment>
                                        <Typography variant="h5">QUEUED</Typography>
                                        <Typography variant="h6"></Typography>
                                        {node.execution_updated_at
                                            ? 'Updated at: ' + node.execution_updated_at
                                            : ''}
                                    </React.Fragment>
                                }
                                aria-label="QUEUED"
                                classes={{ tooltip: this.bem('__iconTooltip') }}
                            >
                                <MoreHorizIcon
                                    className={this.bem('__grey')}
                                    style={{
                                        position: 'absolute',
                                        bottom: '0px',
                                        backgroundColor: 'transparent',
                                        left: '35%'
                                    }}
                                />
                            </Tooltip>
                        </div>
                    ) : (
                        ''
                    )}
                    {node.execution_status === 'FINISHED' ? (
                        <div
                            style={{
                                position: 'absolute',
                                top: '0px',
                                left: '0px',
                                zIndex: '2',
                                height: '100%',
                                width: '100%'
                            }}
                            data-testid="status-finished"
                        >
                            <Tooltip
                                title={
                                    <React.Fragment>
                                        <Typography variant="h5">SUCCESS</Typography>
                                        <Typography variant="h6"></Typography>
                                        {node.execution_updated_at
                                            ? 'Updated at: ' + node.execution_updated_at
                                            : ''}
                                    </React.Fragment>
                                }
                                aria-label="SUCCESS"
                                classes={{ tooltip: this.bem('__iconTooltip') }}
                            >
                                <CheckBoxIcon
                                    className={this.bem('__green')}
                                    style={{
                                        position: 'absolute',
                                        bottom: '0px',
                                        backgroundColor: 'transparent',
                                        left: '35%'
                                    }}
                                />
                            </Tooltip>
                        </div>
                    ) : (
                        ''
                    )}
                    {node.execution_status === 'IN-PROGRESS' ? (
                        <div
                            style={{
                                position: 'absolute',
                                top: '0px',
                                left: '0px',
                                zIndex: '2',
                                height: '100%',
                                width: '100%'
                            }}
                            data-testid="status-in-progress"
                        >
                            <Tooltip
                                title={
                                    <React.Fragment>
                                        <Typography variant="h5">IN PROGRESS</Typography>
                                        <Typography variant="h6"></Typography>
                                        {node.execution_updated_at
                                            ? 'Updated at: ' + node.execution_updated_at
                                            : ''}
                                    </React.Fragment>
                                }
                                aria-label="IN PROGRESS"
                                classes={{ tooltip: this.bem('__iconTooltip') }}
                                data-testid="loading-spinner"
                            >
                                <img
                                    style={{
                                        position: 'absolute',
                                        bottom: '0px',
                                        background: 'transparent',
                                        left: '30%'
                                    }}
                                    data-testid="loading-spinner"
                                    height="35px"
                                    src={codex_loader}
                                    alt="Loader"
                                />
                            </Tooltip>
                        </div>
                    ) : (
                        ''
                    )}
                    {node.execution_status === 'FAILED' ? (
                        <div
                            style={{
                                position: 'absolute',
                                top: '0px',
                                left: '0px',
                                zIndex: '2',
                                height: '100%',
                                width: '100%'
                            }}
                            data-testid="error-icon"
                        >
                            <Tooltip
                                title={
                                    <React.Fragment>
                                        <Typography variant="h5">FAILED</Typography>
                                        <Typography variant="h6"></Typography>
                                        {node.execution_updated_at
                                            ? 'Updated at: ' + node.execution_updated_at
                                            : ''}
                                    </React.Fragment>
                                }
                                aria-label="FAILED"
                                classes={{ tooltip: this.bem('__iconTooltip') }}
                            >
                                <ErrorIcon
                                    className={this.bem('__red')}
                                    style={{
                                        position: 'absolute',
                                        bottom: '0px',
                                        backgroundColor: 'transparent',
                                        left: '35%'
                                    }}
                                />
                            </Tooltip>
                        </div>
                    ) : (
                        ''
                    )}
                    {node.execution_processing ? (
                        <div
                            style={{
                                position: 'absolute',
                                top: '0px',
                                left: '0px',
                                zIndex: '2',
                                height: '100%',
                                width: '100%'
                            }}
                            data-testid="loading-spinner"
                        >
                            <img
                                style={{
                                    position: 'absolute',
                                    bottom: '0px',
                                    background: 'transparent',
                                    left: '30%'
                                }}
                                height="35px"
                                src={codex_loader}
                                alt="Loader"
                            />
                        </div>
                    ) : node.execution_success ? (
                        <div
                            style={{
                                position: 'absolute',
                                top: '0px',
                                left: '0px',
                                zIndex: '2',
                                height: '100%',
                                width: '100%'
                            }}
                            data-testid="success-icon"
                        >
                            <CheckBoxIcon
                                className={this.bem('__green')}
                                style={{
                                    position: 'absolute',
                                    bottom: '0px',
                                    backgroundColor: 'transparent',
                                    left: '35%'
                                }}
                            />
                        </div>
                    ) : node.execution_failure ? (
                        <div
                            style={{
                                position: 'absolute',
                                top: '0px',
                                left: '0px',
                                zIndex: '2',
                                height: '100%',
                                width: '100%'
                            }}
                            data-testid="error-icon"
                        >
                            <ErrorIcon
                                className={this.bem('__red')}
                                style={{
                                    position: 'absolute',
                                    bottom: '0px',
                                    backgroundColor: 'transparent',
                                    left: '35%'
                                }}
                            />
                        </div>
                    ) : (
                        ''
                    )}
                    <div className={this.bem('__title')}>
                        <div className={this.bem('__name')}>{node.name}</div>
                    </div>
                    <div className={this.bem('__ports')}>
                        <div className={this.bem('__in')}>
                            {map(node.getInPorts(), this.generatePort.bind(this))}
                        </div>
                        <div className={this.bem('__out')}>
                            {map(node.getOutPorts(), this.generatePort.bind(this))}
                        </div>
                    </div>
                </div>
            </div>,
            this.state.show_outputs ? (
                <BlueprintWidgetOutputs
                    parent_obj={this}
                    notebook_id={notebook_id}
                    iteration_id={iteration_id}
                    widget_id={node.id}
                />
            ) : (
                ''
            ),
            this.state.show_inputs ? (
                <BlueprintWidgetInputs
                    parent_obj={this}
                    aria-label="Inputs"
                    notebook_id={notebook_id}
                    iteration_id={iteration_id}
                    input_widgets={this.state.show_inputs}
                />
            ) : (
                ''
            )
        ];
    }
}

export default withStyles(designNodeWidgetStyle)(DesignNodeWidget);
