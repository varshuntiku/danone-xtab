import React, { Component } from 'react';
import { Typography, Checkbox } from '@material-ui/core';
import CreateReportsDialog from 'components/CreateReportsDialog.jsx';
import { withStyles } from '@material-ui/core/styles';
import { ReactComponent as CreateStoriesIcon } from 'assets/img/add-stories.svg';
import { connect } from 'react-redux';
import { selectOrUnselectAllItems } from 'store/index';

import * as _ from 'underscore';

export class CreateStoriesActionPanel extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            createStoriesDialog: false,
            checked: false
        };
    }

    componentDidMount() {
        var screens = _.map(this.props.app_info.screens, (item) => {
            return _.extend({ selected: false }, _.pick(item, 'id', 'screen_name'));
        });
        this.props.setScreens(screens);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.screenId) {
            var appScreenDetails = _.where(nextProps.screens, { id: nextProps.screenId });
            const selected = appScreenDetails[0]?.selected;
            if (selected !== prevState.checked) {
                return {
                    checked: selected
                };
            }
        }
        return null;
    }

    openCreateStoriesDialog = () => {
        this.setState({
            createStoriesDialog: true
        });
    };

    closeCreateStoriesDialog = () => {
        this.setState({
            createStoriesDialog: false
        });
    };

    onResponseAddORCreateStory = () => {
        this.props.setScreens(this.props.app_info.screens);
        if (this.props.onResponseAddORCreateStory) {
            this.props.onResponseAddORCreateStory();
        }
    };

    selectAllCharts = (checked) => {
        var props = this.props;
        const tempScreens = structuredClone(props.screens);

        var screens = _.map(tempScreens, function (screen) {
            if (screen.id === props.screenId) {
                screen.selected = checked;
            }
            return screen;
        });

        props.setScreens(screens);
    };

    updateChartsCount = () => {
        this.setState({});
    };

    getPayload = () => {
        var payloadMap = new Map(JSON.parse(localStorage.getItem('create-stories-payload')));
        var payloadObject = null;
        if (payloadMap && payloadMap.size) {
            payloadObject = payloadMap.get(this.props.app_info.id);
        }
        return payloadObject;
    };

    renderStoriesActionPanel = () => {
        var payload = this.getPayload();
        if (payload && payload.length) {
            return true;
        }
        return false;
    };

    getSelectedItemsCount = () => {
        try {
            let payload = this.getPayload();

            // check whether graph_data is empty
            // check whether the widget is a table
            //check whether the widget is a custom component
            // don't increment the count in all the above cases if true
            let count = payload.reduce(
                (acc, val) =>
                    acc +
                    (val.graph_data && Object.keys(val.graph_data).length >= 1
                        ? !(
                              val.graph_data.multiple_tables ||
                              (val.graph_data.table_data && val.graph_data.table_headers) ||
                              val.graph_data.toggleLeft?.multiple_tables ||
                              (val.graph_data.toggleLeft?.table_data &&
                                  val.graph_data.toggleLeft?.table_headers) ||
                              val.graph_data.isExpandable ||
                              val.graph_data.toggleLeft?.isExpandable ||
                              val.graph_data.is_grid_table ||
                              val.graph_data.toggleLeft?.is_grid_table
                          )
                            ? val.graph_data?.componentType?.startsWith('custom:')
                                ? 0
                                : 1
                            : 0
                        : 0),
                0
            );
            return count;
        } catch (err) {
            console.error(err);
        }
        return this.getPayload().length;
    };

    render() {
        const { classes } = this.props;

        return (
            // <div style={{ marginLeft: "auto" }}>

            <div className={classes.storiesActionPanel}>
                {!this.props.fromMinervaDashboard
                    ? [
                          <Checkbox
                              key={'selectAllButton'}
                              checked={this.state.checked}
                              className={classes.selectAllButton}
                              disableRipple={true}
                              onChange={(event) => {
                                  this.selectAllCharts(event.target.checked);
                              }}
                          />,
                          <label key={'selectAllText'} className={classes.selectAllText}>
                              Select all items
                          </label>
                      ]
                    : null}

                {this.renderStoriesActionPanel() ? (
                    <div className={classes.storiesActionItems}>
                        <Typography className={classes.selectedItems} variant="h3">
                            {this.getSelectedItemsCount() + ' Selected '}
                        </Typography>
                        {/* <DownloadStoriesIcon className={classes.downloadReport}></DownloadStoriesIcon> */}
                        <CreateStoriesIcon
                            title="create stories"
                            className={classes.createReport}
                            onClick={() => this.openCreateStoriesDialog()}
                        ></CreateStoriesIcon>
                        {this.state.createStoriesDialog ? (
                            <CreateReportsDialog
                                onClose={this.closeCreateStoriesDialog}
                                app_info={this.props.app_info}
                                onResponseAddORCreateStory={this.onResponseAddORCreateStory}
                                logged_in_user_info={this.props.logged_in_user_info}
                            ></CreateReportsDialog>
                        ) : null}
                    </div>
                ) : null}
            </div>
            // </div >
        );
    }
}

const mapStateToProps = (state) => {
    return {
        screens: state.createStories.selectedScreens,
        screenId: state.createStories.screenId
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setScreens: (payload) => dispatch(selectOrUnselectAllItems(payload))
    };
};

const styles = (theme) => ({
    storiesActionPanel: {
        // right: 0,
        // position: 'absolute',
        // margin: theme.spacing(1.25),
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    storiesActionItems: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    },
    selectedItems: {
        fontWeight: 500,
        fontSize: '1.6rem',
        color: theme.palette.text.titleText
        // marginRight: theme.spacing(2),
    },
    createReport: {
        // marginRight: theme.spacing(2),
        cursor: 'pointer',
        '& circle': {
            // fill: theme.palette.primary.contrastText + ' !important'
        }
    },
    downloadReport: {
        marginRight: theme.spacing(2),
        '& circle': {
            fill: theme.palette.primary.contrastText + ' !important'
        }
    },
    selectAllButton: {
        transform: 'scale(1.5)',
        padding: 'unset',
        marginLeft: theme.spacing(4)
        // marginRight: theme.spacing(2),
    },
    selectAllText: {
        // fontWeight: 500,
        fontSize: '1.6rem',
        color: theme.palette.primary.contrastText
        // marginRight: theme.spacing(2),
    }
});

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(
    withStyles(styles)(CreateStoriesActionPanel)
);
