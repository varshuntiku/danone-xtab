import React, { Component } from 'react';
import AppWidgetPlot from 'components/AppWidgetPlot.jsx';
import { withStyles, Typography, Box } from '@material-ui/core';
import { ExpandMore, ExpandLess } from '@material-ui/icons';
import { MenuItem, Popover } from '@material-ui/core';
import CardView from './cardView';
import DataTable from './tableView';
import Widget from 'components/Widget';

// import AppConfigWrapper, { AppConfigOptions } from 'hoc/appConfigWrapper.js';

import * as _ from 'underscore';

class WidgetOutput extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            loader: false,
            checked: false,
            graph_filter_menu_open: false,
            selectedWidgetIndex: 0
        };
    }

    componentDidMount = () => {
        this.checkStoryState();
    };

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            this.setState(
                {
                    selectedWidgetIndex: 0,
                    // graphData: null,
                    checked: false
                },
                () => {
                    this.checkStoryState();
                }
            );
        }
    }

    checkStoryState = () => {
        this.setState({
            checked: false
        });
        var payloadMap = new Map(JSON.parse(localStorage.getItem('create-stories-payload')));

        if (payloadMap && payloadMap.size) {
            var payloadObject = payloadMap.get(this.props.appId);

            if (payloadObject) {
                payloadObject.map(function (item) {
                    if (
                        _.isEqual(
                            item.graph_data,
                            this.props.data.widgets[this.state.selectedWidgetIndex].value
                        )
                    ) {
                        this.setState({ checked: true });
                        return true;
                    }
                    return true;
                }, this);
            }
        }
    };

    onClickGraphFilter = (event) => {
        this.setState({
            graph_filter_menu_open: true,
            graph_filter_menu_anchorEl: event.currentTarget
        });
    };

    closeGraphFilterMenu = () => {
        this.setState({
            graph_filter_menu_open: false,
            graph_filter_menu_anchorEl: false
        });
    };

    onClickFilterOption = (index) => {
        this.setState(
            {
                selectedWidgetIndex: index,
                graph_filter_menu_open: false,
                graph_filter_menu_anchorEl: false
            },
            () => {
                this.checkStoryState();
            }
        );
    };

    getCreateStoriesPayload = () => {
        const widget = this.props.data.widgets[this.state.selectedWidgetIndex];
        return {
            name: widget.title,
            description: '',
            app_id: this.props.appId,
            app_screen_id: '',
            app_screen_widget_id: '',
            app_screen_widget_value_id: '',
            graph_data: widget.value,
            filter_data: ''
        };
    };

    getPayloadMap = () => {
        var payloadMap = new Map(JSON.parse(localStorage.getItem('create-stories-payload')));
        if (!payloadMap && !payloadMap.size) {
            payloadMap = new Map();
        }
        return payloadMap;
    };

    getPayloadArray = () => {
        var payloadMap = this.getPayloadMap();
        var payloadObject;
        if (payloadMap && payloadMap.size) {
            payloadObject = payloadMap.get(this.props.app_info.id);
        }
        if (!payloadObject) {
            payloadObject = [];
        }
        return payloadObject;
    };

    onCheckboxValueChange = (checked) => {
        this.setState({ checked: checked });

        var payloadMap = this.getPayloadMap();
        var payloadObject = this.getPayloadArray();

        if (checked) {
            if (payloadObject.length) {
                var widgetValueIds = _.pluck(payloadObject, 'app_screen_widget_value_id');
                if (!widgetValueIds.includes(this.state.widget_value_id)) {
                    var requestPayload = this.getCreateStoriesPayload();
                    payloadObject.push(requestPayload);
                }
            } else {
                requestPayload = this.getCreateStoriesPayload();
                payloadObject.push(requestPayload);
            }
        } else {
            var removeIndex = -1;
            const widget = this.props.data.widgets[this.state.selectedWidgetIndex];
            payloadObject.map(function (item, index) {
                if (_.isEqual(item.graph_data, widget)) {
                    removeIndex = index;
                    return true;
                }
                return true;
            }, this);
            if (removeIndex !== -1) {
                payloadObject.splice(removeIndex, 1);
            }
        }

        payloadMap.set(this.props.app_info.id.toString(), payloadObject);
        localStorage.setItem(
            'create-stories-payload',
            JSON.stringify(Array.from(payloadMap.entries()))
        );
        this.props.updateStoriesCount();
    };

    render() {
        const { classes, data } = this.props;
        const widget = JSON.parse(
            JSON.stringify(data.widgets[this.state.selectedWidgetIndex] || null)
        );
        const widgetNames = data?.widgets?.map((o) => o.name);
        const widgetValue = widget.value;

        if (!widget) {
            return null;
        }

        let comp = null;

        switch (widget.type) {
            case 'card':
                comp = <CardView graphData={widgetValue} />;
                break;
            case 'dataTable':
                comp = widgetValue.data.columns ? (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            width: '100%',
                            padding: '5rem 0'
                        }}
                    >
                        <DataTable
                            tableHead={widgetValue.data.columns}
                            tableData={widgetValue.data.values}
                        />
                    </div>
                ) : (
                    <div className={classes.ploltyContainer}>
                        <AppWidgetPlot
                            params={widgetValue}
                            graph_height={'full'}
                            size_nooverride={false}
                            color_nooverride={false}
                        />
                    </div>
                );
                break;
            case 'chart':
                comp = (
                    <div className={classes.ploltyContainer}>
                        <AppWidgetPlot
                            params={widgetValue}
                            graph_height={'full'}
                            size_nooverride={false}
                            color_nooverride={false}
                        />
                    </div>
                );
                break;
            default:
                comp = (
                    <Widget
                        data={widgetValue}
                        graph_height={'full'}
                        size_nooverride={false}
                        color_nooverride={false}
                    />
                );
        }

        return (
            <div className={classes.graphBody}>
                <div style={{ width: '100%' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <div className={classes.graphLabel}>
                            {/* <AppConfigWrapper appConfig={AppConfigOptions.data_story}>
                                {!(
                                    widgetNames[this.state.selectedWidgetIndex] === 'card' ||
                                    widgetNames[this.state.selectedWidgetIndex] === 'dataTable'
                                ) && (
                                    <Checkbox
                                        checked={this.state.checked}
                                        className={classes.storyCheckbox}
                                        style={{
                                            visibility: this.state.checked ? 'visible' : 'hidden'
                                        }}
                                        disableRipple={true}
                                        onChange={(event) => {
                                            this.onCheckboxValueChange(event.target.checked);
                                        }}
                                    />
                                )}
                            </AppConfigWrapper> */}
                            <Typography
                                color="initial"
                                variant="h5"
                                className={classes.widgetTitle}
                            >
                                {widget.title}
                            </Typography>
                        </div>

                        <div className={classes.graphActionsBar}>
                            {widgetNames?.length > 0 ? (
                                <div className={classes.actionsBarItem}>
                                    <div
                                        key={'widget_type'}
                                        className={classes.graphOptionContainer}
                                    >
                                        <Typography
                                            className={classes.graphOptionLabel}
                                            variant="h5"
                                        >
                                            {'Type'}
                                        </Typography>
                                        <div
                                            aria-label="widget-type"
                                            className={classes.graphOptionValue}
                                            onClick={(event) => this.onClickGraphFilter(event)}
                                        >
                                            <Typography
                                                variant="h5"
                                                className={classes.graphOptionValueType}
                                            >
                                                {widgetNames[this.state.selectedWidgetIndex]}
                                            </Typography>
                                            {this.state.graph_filter_menu_open ? (
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
                                        <Popover
                                            key={'widget_type_options'}
                                            keepMounted
                                            anchorEl={this.state.graph_filter_menu_anchorEl}
                                            open={this.state.graph_filter_menu_open}
                                            onClose={this.closeGraphFilterMenu}
                                        >
                                            <div className={classes.filterMenuContainer}>
                                                {_.map(
                                                    widgetNames,
                                                    function (option, index) {
                                                        return (
                                                            <MenuItem
                                                                key={'widget_options_' + index}
                                                                value={index}
                                                                classes={{
                                                                    root: classes.graphFilterMenuItem,
                                                                    selected:
                                                                        classes.graphFilterMenuItemSelected
                                                                }}
                                                                onClick={() =>
                                                                    this.onClickFilterOption(index)
                                                                }
                                                            >
                                                                {option}
                                                            </MenuItem>
                                                        );
                                                    },
                                                    this
                                                )}
                                            </div>
                                        </Popover>
                                    </div>
                                </div>
                            ) : (
                                ''
                            )}
                        </div>
                    </Box>
                </div>
                <div style={{ flex: 1, width: '100%' }}>{comp}</div>
            </div>
        );
    }
}

const styles = (theme) => ({
    graphBody: {
        height: '100%',
        backgroundColor: theme.palette.primary.dark,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        '& :hover': {
            '& $storyCheckbox': {
                visibility: 'visible !important'
            }
        }
    },
    storyCheckbox: {
        padding: 0,
        '& svg': {
            width: '3rem',
            height: '3rem'
        }
    },
    actionsBarItem: {
        // float: 'right',
        // position: 'relative',
        // marginRight: theme.spacing(1),
        display: 'flex'
    },
    actionsBarItemLeftContainer: {
        position: 'relative',
        marginLeft: theme.spacing(2),
        float: 'left'
    },
    downloadButton: {
        padding: theme.spacing(0.5),
        minWidth: theme.spacing(5)
    },
    graphActions: {
        position: 'relative',
        float: 'right',
        padding: theme.spacing(0, 2, 0, 0)
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
    filterMenuContainer: {
        maxHeight: '30rem'
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
        // color: theme.palette.text.default,
        fontWeight: 700
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
    graphHideUpdateMenu: {
        display: 'none'
    },
    widgetTitle: {
        color: theme.palette.text.default,
        fontSize: '1.6rem',
        background: theme.palette.primary.dark,
        textTransform: 'uppercase'
    },
    ploltyContainer: {
        height: '45rem'
    }
});

export default withStyles(
    (theme) => ({
        ...styles(theme)
    }),
    { withTheme: true }
)(WidgetOutput);
