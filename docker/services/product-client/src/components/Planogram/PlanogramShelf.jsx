import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import {
    Button,
    LinearProgress,
    ButtonGroup,
    Typography,
    Menu,
    MenuItem,
    Tooltip
} from '@material-ui/core';
import planogramStyle from 'assets/jss/planogramStyle.jsx';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import PublishIcon from '@material-ui/icons/Publish';
import RestoreIcon from '@material-ui/icons/Restore';
import SaveIcon from '@material-ui/icons/Save';
import GetAppIcon from '@material-ui/icons/GetApp';
import CheckIcon from '@material-ui/icons/Check';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import InfoIcon from '@material-ui/icons/Info';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CodxCircularLoader from 'components/CodxCircularLoader.jsx';
import PlanogramChat from 'assets/img/planogram_chat.svg';

import PlanogramChatPopup from './PlanogramChatPopup';

import {
    getPlanogram,
    savePlanogram,
    getActionInference,
    getAnalyticsRearrangement
} from 'services/planogram.js';
import * as _ from 'underscore';
class PlanogramShelf extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;
        // this.genAIPanelClasses = genAIPanelStyles();
        this.state = {
            menu_open: false,
            actions_anchor_el: null,
            sku_list_type: 'CORE',
            loading: false,
            saveLoading: false,
            approveLoading: false,
            publishLoading: false,
            widget_value_id: this.props.widgetData.data.widget_value_id,
            config: this.props.widgetData.data.value.planogram,
            skus: this.props.widgetData.data.value.skus,
            genAISwapCommand: '',
            genAIReorgCommand: '',
            planogramLoading: false,
            genAIPanel: true,
            genAIPanelOpen: false,
            genAIPanelContent: this.props.widgetData.data.simulator_options || null,
            genAIAnalyticsFile: null,
            originalConfig: this.props.widgetData.data.value.planogram,
            chatOpen: false,
            snackbar: {
                open: false,
                message: '',
                severity: ''
            },
            rearrangement_rules: '',
            sku_affinities: '',
            thought_process: null,
            affinity_info: null,
            initialRules: this.props.widgetData.data.value.rules
        };
    }

    handleRearrangementRules = (rules) => {
        this.setState({
            rearrangement_rules: rules
        });
    };

    handleSKUAffinities = (skuAffinities) => {
        this.setState({
            sku_affinities: skuAffinities
        });
    };

    handleSnackbarValue = (open, message, severity) => {
        this.setState({
            snackbar: {
                open: open,
                severity: 'error' || severity,
                message: message || 'Something went wrong'
            }
        });
    };

    onDragEnter = (drop_row_index, drop_unit_index) => {
        var config = this.state.config;

        config.rows[drop_row_index].units[drop_unit_index]['drop_enter'] = true;

        this.setState({
            config: config
        });
    };

    onDragLeave = (drop_row_index, drop_unit_index) => {
        var config = this.state.config;

        config.rows[drop_row_index].units[drop_unit_index]['drop_enter'] = false;

        this.setState({
            config: config
        });
    };

    onDrop = (dropped_row_index, dropped_unit_index, dragged_row_index, dragged_unit_index) => {
        var config = this.state.config;

        var dragged_sku = config.rows[dragged_row_index].units[dragged_unit_index].sku_image;
        delete config.rows[dragged_row_index].units[dragged_unit_index].sku_image;
        config.rows[dropped_row_index].units[dropped_unit_index].sku_image = dragged_sku;

        this.setState({
            config: config
        });
    };

    onDropSku = (dropped_row_index, dropped_unit_index, sku_item) => {
        var config = this.state.config;

        var dragged_sku = sku_item.sku_image;
        config.rows[dropped_row_index].units[dropped_unit_index].sku_image = dragged_sku;

        this.setState({
            config: config
        });
    };

    onClickAddSKU = () => {
        // TODO
    };

    onRefreshPlanogram = () => {
        const { app_id } = this.props;

        this.setState({
            loading: true
        });

        getPlanogram({
            app_id: app_id,
            widget_value_id: this.state.widget_value_id,
            callback: this.onResponseGetPlanogram
        });
    };

    onResponseGetPlanogram = (response_data) => {
        this.setState({
            config: response_data.data.planogram,
            skus: response_data.data.skus,
            loading: false
        });
    };

    onSavePlanogram = () => {
        const { app_id } = this.props;

        this.setState({
            saveLoading: true
        });

        savePlanogram({
            app_id: app_id,
            widget_value_id: this.state.widget_value_id,
            planogram: this.state.config,
            skus: this.state.skus,
            approve: false,
            publish: false,
            callback: this.onResponseSavePlanogram
        });
    };

    onApprovePlanogram = () => {
        const { app_id } = this.props;

        this.setState({
            approveLoading: true
        });

        savePlanogram({
            app_id: app_id,
            widget_value_id: this.state.widget_value_id,
            planogram: this.state.config,
            skus: this.state.skus,
            approve: true,
            publish: false,
            callback: this.onResponseSavePlanogram
        });
    };

    onPublishPlanogram = () => {
        const { app_id } = this.props;

        this.setState({
            publishLoading: true
        });

        savePlanogram({
            app_id: app_id,
            widget_value_id: this.state.widget_value_id,
            planogram: this.state.config,
            skus: this.state.skus,
            approve: false,
            publish: true,
            callback: this.onResponseSavePlanogram
        });
    };

    handleActionsClick = (event) => {
        this.setState({
            menu_open: true,
            actions_anchor_el: event.currentTarget
        });
    };

    handleActionsClose = () => {
        this.setState({
            menu_open: false,
            actions_anchor_el: null
        });
    };

    onResponseSavePlanogram = () => {
        this.setState({
            approveLoading: false,
            saveLoading: false,
            publishLoading: false,
            menu_open: false,
            actions_anchor_el: null
        });

        this.onRefreshPlanogram();
    };

    onSelectSkuType = (sku_type) => {
        this.setState({
            sku_list_type: sku_type
        });
    };

    onCommandSwap = () => {
        const { app_id } = this.props;

        this.setState({
            planogramLoading: true
        });

        getActionInference({
            app_id: app_id,
            widget_value_id: this.state.widget_value_id,
            planogram: this.state.config,
            skus: this.state.skus,
            approve: false,
            publish: true,
            action_command: this.state.genAISwapCommand,
            callback: this.onResponseRearrange
        });
    };

    onCommandGenAIReOrganization = () => {
        const { app_id } = this.props;

        this.setState({
            planogramLoading: true
        });
        getAnalyticsRearrangement({
            app_id: app_id,
            widget_value_id: this.state.widget_value_id,
            planogram: this.state.config,
            skus: this.state.skus,
            approve: false,
            publish: true,
            analytics_file: this.state.genAIAnalyticsFile,
            rearrangement_rules: this.state.rearrangement_rules,
            sku_affinities: this.state.sku_affinities,
            callback: this.onResponseRearrange
        });
    };

    handleAIReOrgCommandChange = (event) => {
        this.setState({
            genAIReorgCommand: event.target.value
        });
    };
    handleAISwapCommandChange = (value) => {
        this.setState({
            genAISwapCommand: value
        });
    };
    handleAIPanelToggle = () => {
        let currentPanelState = this.state.genAIPanelOpen;

        this.setState({ genAIPanelOpen: !currentPanelState });
    };
    handleAIAnalyticsFileUpload = (file_info) => {
        this.setState({
            genAIAnalyticsFile: file_info && file_info.length > 0 ? file_info : null
        });
    };

    onResponseRearrange = (data) => {
        if (data?.error) {
            this.setState({
                planogramLoading: false
            });
            this.handleSnackbarValue(true, data?.error, 'error');
        } else {
            this.setState({
                config: data.planogram,
                planogramLoading: false,
                genAIPanelOpen: false,
                chatOpen: true,
                thought_process: data?.planogram?.thought_process,
                affinity_info: data?.planogram?.affinity_info
            });
        }
    };

    onRestorePlanogram = async () => {
        this.setState({
            planogramLoading: true
        });

        setTimeout(() => {
            this.setState({
                config: this.state.originalConfig,
                planogramLoading: false
            });
        }, 500);
    };

    handleChatPopup = (value) => {
        this.setState({
            chatOpen: value
        });
    };
    handleAddRule = (rules) => {
        this.setState({
            initialRules: [...rules]
        });
    };
    resetChatFeature = () => {
        this.setState({
            thought_process: null,
            affinity_info: null
        });
    };
    render() {
        const { classes } = this.props;

        return this.state.loading ? (
            <LinearProgress />
        ) : (
            <div className={classes.planogramBody}>
                <div className={classes.planogramGenAIContainer}>
                    <Typography variant="h3" className={classes.planogramHeader}>
                        Planogram
                    </Typography>
                    {/* <Button
                        className={classes.planogramUploadButton}
                        variant="contained"
                        startIcon={<img src={UploadAnalytics} className={classes.uploadAnalyticsIcon} />}
                        size="small"
                        // onClick={handleCreateNewChat}
                        aria-label="upload"
                    >
                        Upload Analytics & Rules
                    </Button> */}
                    {/* {
                        <Accordion
                            expanded={this.state.genAIPanelOpen}
                            onChange={this.handleAIPanelToggle}
                        >
                            <AccordionSummary
                                // expandIcon={<ExpandMoreIcon />}
                     ()           aria-controls="panel1bh-content"
                                id="panel1bh-header"
                            >
                                <Typography variant="h4" className={classes.heading}>
                                    {'Use The GenAI Assistant'}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid
                                    container
                                    direction="column"
                                    justifyContent="center"
                                    alignItems="center"
                                    spacing={1}
                                >
                                    <Grid item spacing={1}>
                                        <Typography variant="h5">
                                            Upload an Excel File Which has the analytics Results,
                                            and the GenAI Assistant will use the results to
                                            automatically Rearrange the SKUs.
                                        </Typography>
                                        <hr />
                                    </Grid>
                                    <Grid item spacing={1}>
                                        <FileUpload
                                            fieldInfo={{
                                                id: 9,
                                                name: 'analytics-upload',
                                                label: 'Upload Analytics',
                                                type: 'upload',
                                                value: '',
                                                variant: 'outlined',
                                                margin: 'none',
                                                inputprops: {
                                                    type: 'file',
                                                    error: 'false',
                                                    multiple: false
                                                    // "accept": "/*"
                                                },
                                                InputLabelProps: {
                                                    disableAnimation: true,
                                                    shrink: true
                                                },
                                                placeholder: 'Enter your Input',
                                                grid: 12
                                            }}
                                            onChange={(v) => {
                                                this.handleAIAnalyticsFileUpload(v);
                                            }}
                                            key={'upload'}
                                        />
                                    </Grid>
                                    <Grid item spacing={1}>
                                        <Button
                                            variant="outlined"
                                            onClick={this.onCommandGenAIReOrganization}
                                        >
                                            {'Process Analytics'}
                                        </Button>
                                    </Grid>
                                    <Grid item spacing={1}>
                                        <Typography
                                            variant="h4"
                                            className={classes.planogramSkuListHeader}
                                        >
                                            Or Ask Co-Pilot:
                                        </Typography>
                                    </Grid>
                                    <Grid item spacing={1}>
                                        <TextField
                                            variant="outlined"
                                            style={{
                                                width: '80vh',
                                                backgroundColor: '#ffffff',
                                                color: '#ffffff'
                                            }}
                                            placeholder="Example: Swap SKU on Shelve 1 Rack 1 with Shelve 4 Rack 3"
                                            value={this.state.genAISwapCommand}
                                            onChange={(e)=>this.handleAISwapCommandChange(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item spacing={1}>
                                        <Button variant="outlined" onClick={this.onCommandSwap}>
                                            {'Run GenAI Swap'}
                                        </Button>
                                    </Grid>
                                </Grid>

                                <div></div>
                            </AccordionDetails>
                        </Accordion>
                    } */}
                </div>
                <div
                    className={`${
                        this.state.chatOpen
                            ? classes.planogramShelfContainer
                            : classes.planogramShelfContainerLarge
                    }`}
                >
                    <div
                        className={`${
                            this.state.chatOpen
                                ? classes.planogramShelf
                                : classes.planogramShelfLarge
                        }`}
                    >
                        {this.state.planogramLoading ? (
                            <LinearProgress />
                        ) : (
                            _.map(
                                this.state.config.rows,
                                function (row_item, row_index) {
                                    return (
                                        <div
                                            className={`${
                                                this.state.chatOpen
                                                    ? classes.planogramShelfRowWithoutBorder
                                                    : classes.planogramShelfRowWithBorder
                                            }`}
                                        >
                                            {_.map(
                                                row_item.units,
                                                function (unit_item, unit_index) {
                                                    return (
                                                        <div
                                                            className={
                                                                unit_item.drop_enter
                                                                    ? classes.planogramShelfUnitDropEnter
                                                                    : classes.planogramShelfUnit
                                                            }
                                                            style={{
                                                                width:
                                                                    'calc(' +
                                                                    (unit_item.size * 100) /
                                                                        this.state.config.row_size +
                                                                    '% - 0.48rem)'
                                                            }}
                                                            // onDragEnter={event => {
                                                            //   event.preventDefault();
                                                            //   event.stopPropagation();
                                                            //   this.onDragEnter(row_index, unit_index);
                                                            // }}
                                                            onDrop={(event) => {
                                                                var data = JSON.parse(
                                                                    event.dataTransfer.getData(
                                                                        'draggable-chip'
                                                                    )
                                                                );
                                                                if (
                                                                    !data.row_index &&
                                                                    !data.unit_index &&
                                                                    data.sku_item
                                                                ) {
                                                                    this.onDropSku(
                                                                        row_index,
                                                                        unit_index,
                                                                        data.sku_item
                                                                    );
                                                                    return true;
                                                                } else if (
                                                                    data.row_index === row_index &&
                                                                    data.unit_index === unit_index
                                                                ) {
                                                                    return false;
                                                                } else {
                                                                    this.onDrop(
                                                                        row_index,
                                                                        unit_index,
                                                                        data.row_index,
                                                                        data.unit_index
                                                                    );
                                                                    return true;
                                                                }
                                                            }}
                                                            onDragOver={(event) => {
                                                                event.preventDefault();
                                                            }}
                                                            // OnDragLeave={event => {
                                                            //   this.onDragLeave(row_index, unit_index);
                                                            // }}
                                                        >
                                                            {unit_item.sku_image ? (
                                                                <div
                                                                    aria-label="draggable-chip"
                                                                    draggable={true}
                                                                    onDragStart={(event) => {
                                                                        event.dataTransfer.setData(
                                                                            'draggable-chip',
                                                                            JSON.stringify({
                                                                                row_index:
                                                                                    row_index,
                                                                                unit_index:
                                                                                    unit_index
                                                                            })
                                                                        );
                                                                    }}
                                                                    className={
                                                                        classes.planogramShelfUnitDraggable
                                                                    }
                                                                >
                                                                    {_.times(
                                                                        unit_item.size,
                                                                        function () {
                                                                            return (
                                                                                <div
                                                                                    className={
                                                                                        classes.planogramShelfUnitSKU
                                                                                    }
                                                                                    style={{
                                                                                        width:
                                                                                            100 /
                                                                                                unit_item.size +
                                                                                            '%'
                                                                                    }}
                                                                                >
                                                                                    <img
                                                                                        draggable={
                                                                                            false
                                                                                        }
                                                                                        src={
                                                                                            unit_item.sku_image
                                                                                        }
                                                                                        className={
                                                                                            classes.planogramShelfUnitSKUImage
                                                                                        }
                                                                                        alt="planogram image"
                                                                                    />
                                                                                </div>
                                                                            );
                                                                        }
                                                                    )}
                                                                    <br />
                                                                </div>
                                                            ) : (
                                                                <div
                                                                    className={
                                                                        classes.planogramShelfUnitEmpty
                                                                    }
                                                                >
                                                                    <AddCircleOutlineIcon
                                                                        fontSize="large"
                                                                        className={
                                                                            classes.planogramShelfUnitAddIcon
                                                                        }
                                                                        onClick={() =>
                                                                            this.onClickAddSKU(
                                                                                row_index,
                                                                                unit_index
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                },
                                                this
                                            )}
                                            <br />
                                        </div>
                                    );
                                },
                                this
                            )
                        )}
                    </div>
                </div>
                <div
                    className={`${
                        this.state.chatOpen
                            ? classes.planogramMetricsContainer
                            : classes.planogramMetricsContainerLarge
                    }`}
                >
                    <div className={classes.planogramMetrics}>
                        <div className={classes.planogramMetricContainer}>
                            <div className={classes.planogramMetricStatus}>
                                <Typography variant="h4" className={classes.planogramMetricLabel}>
                                    STATUS
                                </Typography>
                                <div
                                    className={
                                        this.state.config?.status?.label === 'Approved' ||
                                        this.state.config?.status?.label === 'Published'
                                            ? classes.planogramMetricValue
                                            : classes.planogramMetricValueWaiting
                                    }
                                >
                                    {this.state.config.status?.label
                                        ? this.state.config.status?.label
                                        : '-'}
                                </div>
                            </div>

                            {this.state.config.status?.updated_at
                                ? [
                                      <div
                                          key={'updatedAt1'}
                                          className={classes.planogramMetricValueDate}
                                      >
                                          Updated on : {this.state.config.status.updated_at}
                                      </div>
                                  ]
                                : ''}
                            {this.state.config.status?.updated_by
                                ? [
                                      <div
                                          key={'updatedBy1'}
                                          className={classes.planogramMetricValueDate}
                                      >
                                          Updated by : {this.state.config.status.updated_by}
                                      </div>
                                  ]
                                : ''}

                            <MoreVertIcon
                                fontSize="large"
                                id="demo-positioned-button"
                                aria-controls={
                                    this.state.menu_open ? 'demo-positioned-menu' : undefined
                                }
                                aria-haspopup="true"
                                aria-expanded={this.state.menu_open ? 'true' : undefined}
                                onClick={this.handleActionsClick}
                                className={classes.actionsButton}
                            />
                            <Menu
                                id="demo-positioned-menu"
                                aria-labelledby="demo-positioned-button"
                                anchorEl={this.state.actions_anchor_el}
                                open={this.state.menu_open}
                                onClose={this.handleActionsClose}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left'
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left'
                                }}
                            >
                                <MenuItem onClick={this.onRestorePlanogram}>
                                    <RestoreIcon
                                        fontSize="large"
                                        className={classes.actionsMenuIcon}
                                    />{' '}
                                    Reset
                                </MenuItem>
                                <MenuItem>
                                    <PublishIcon
                                        fontSize="large"
                                        className={classes.actionsMenuIcon}
                                    />{' '}
                                    Import
                                </MenuItem>
                                <MenuItem>
                                    <GetAppIcon
                                        fontSize="large"
                                        className={classes.actionsMenuIcon}
                                    />{' '}
                                    Export
                                </MenuItem>
                                <MenuItem onClick={this.onSavePlanogram}>
                                    {this.state.saveLoading ? (
                                        <div className={classes.actionsMenuLoaderContainer}>
                                            <CodxCircularLoader className={classes.buttonLoader} />
                                        </div>
                                    ) : (
                                        <SaveIcon
                                            fontSize="large"
                                            className={classes.actionsMenuIcon}
                                        />
                                    )}{' '}
                                    Save
                                </MenuItem>
                                <MenuItem onClick={this.onApprovePlanogram}>
                                    {this.state.approveLoading ? (
                                        <div className={classes.actionsMenuLoaderContainer}>
                                            <CodxCircularLoader className={classes.buttonLoader} />
                                        </div>
                                    ) : (
                                        <CheckIcon
                                            fontSize="large"
                                            className={classes.actionsMenuIcon}
                                        />
                                    )}{' '}
                                    Approve
                                </MenuItem>
                                <MenuItem onClick={this.onPublishPlanogram}>
                                    {this.state.publishLoading ? (
                                        <div className={classes.actionsMenuLoaderContainer}>
                                            <CodxCircularLoader className={classes.buttonLoader} />
                                        </div>
                                    ) : (
                                        <CheckCircleIcon
                                            fontSize="large"
                                            className={classes.actionsMenuIcon}
                                        />
                                    )}{' '}
                                    Publish
                                </MenuItem>
                            </Menu>
                        </div>
                        <Typography variant="h4" className={classes.planogramSkuListHeader}>
                            Move SKUs on Shelf
                        </Typography>
                        <ButtonGroup
                            variant="contained"
                            className={classes.planogramSkuListTypes}
                            aria-label="outlined primary button group"
                        >
                            {_.map(
                                _.unique(
                                    _.map(
                                        this.state.skus,
                                        function (sku_item) {
                                            return sku_item.type;
                                        },
                                        this
                                    )
                                ),
                                function (type_item) {
                                    return (
                                        <Button
                                            className={
                                                type_item === this.state.sku_list_type
                                                    ? classes.buttonGroupActive
                                                    : classes.buttonGroup
                                            }
                                            onClick={() => this.onSelectSkuType(type_item)}
                                            aria-label="Select sku type"
                                        >
                                            {type_item}
                                        </Button>
                                    );
                                },
                                this
                            )}
                        </ButtonGroup>
                        <div className={classes.planogramSkuList}>
                            {_.map(
                                _.filter(
                                    this.state.skus,
                                    function (sku_item_type) {
                                        return sku_item_type.type === this.state.sku_list_type;
                                    },
                                    this
                                ),
                                function (sku_item) {
                                    return (
                                        <div
                                            aria-label="draggable-chip"
                                            draggable={true}
                                            onDragStart={(event) => {
                                                event.dataTransfer.setData(
                                                    'draggable-chip',
                                                    JSON.stringify({
                                                        row_index: null,
                                                        unit_index: null,
                                                        sku_item: sku_item
                                                    })
                                                );
                                            }}
                                            className={classes.planogramSkuItem}
                                        >
                                            <Typography
                                                variant="h6"
                                                className={classes.planogramSkuItemLabel}
                                            >
                                                {sku_item.name}
                                            </Typography>
                                            <div className={classes.planogramSkuItemImageContainer}>
                                                <img
                                                    src={sku_item.sku_image}
                                                    className={classes.planogramSkuItemImage}
                                                    alt={sku_item.name || ''}
                                                />
                                            </div>
                                            <Tooltip
                                                classes={{ tooltip: classes.skuItemTooltip }}
                                                title={_.map(_.keys(sku_item), function (key_item) {
                                                    if (
                                                        key_item === 'label' ||
                                                        key_item === 'sku_image'
                                                    ) {
                                                        return '';
                                                    } else {
                                                        return (
                                                            key_item.toUpperCase() +
                                                            ': ' +
                                                            sku_item[key_item] +
                                                            '\n'
                                                        );
                                                    }
                                                }).join('')}
                                            >
                                                <InfoIcon
                                                    className={classes.planogramSkuItemInfo}
                                                />
                                            </Tooltip>
                                            <br />
                                        </div>
                                    );
                                },
                                this
                            )}
                        </div>
                    </div>
                </div>
                <div className={classes.planogramBottomContainer}>
                    <img
                        src={PlanogramChat}
                        className={classes.planogramChatIcon}
                        alt="planogram chat icon"
                        onClick={() => this.handleChatPopup(true)}
                    />
                    {this.state.chatOpen && (
                        <PlanogramChatPopup
                            handleChatPopup={this.handleChatPopup}
                            open={this.state.chatOpen}
                            genAIAnalyticsFile={this.state.genAIAnalyticsFile}
                            handleAIAnalyticsFileUpload={this.handleAIAnalyticsFileUpload}
                            handleAISwapCommandChange={this.handleAISwapCommandChange}
                            onCommandSwap={this.onCommandSwap}
                            snackbar={this.state.snackbar}
                            handleSnackbarValue={this.handleSnackbarValue}
                            onRestorePlanogram={this.onRestorePlanogram}
                            onCommandGenAIReOrganization={this.onCommandGenAIReOrganization}
                            handleRearrangementRules={this.handleRearrangementRules}
                            handleSKUAffinities={this.handleSKUAffinities}
                            thought_process={this.state.thought_process}
                            rules={this.state.initialRules}
                            handleAddRule={this.handleAddRule}
                            resetChatFeature={this.resetChatFeature}
                            affinity_info={this.state.affinity_info}
                        />
                    )}
                </div>
            </div>
        );
    }
}

PlanogramShelf.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(planogramStyle)(PlanogramShelf);

/*
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    tableContainer: {
        padding: theme.spacing(1.2),
        width: '100%'
    },
    buttonFloat: {
        float: 'right'
    },
    button: {
        margin: theme.spacing(0, 1, 0, 1)
    },
    downloadSheet: {
        margin: theme.spacing(1, 0, 1, 3)
    },
    hiddenElement: {
        display: 'none'
    },
    displayedElement: {
        display: 'block'
    },
    simulatorSectionHeader: {
        color: theme.palette.text.default,
        fontSize: '2rem',
        fontWeight: 400,
        padding: theme.spacing(2, 0),
        textDecoration: 'underline'
    },
    simulatorSliderInputBox: {
        marginLeft: theme.spacing(2),
        '&&&:before': {
            borderBottom: 'none'
        },
        '& input': {
            backgroundColor: theme.palette.background.paper,
            border: '2px solid ' + theme.palette.background.paper,
            color: theme.palette.primary.contrastText,
            textAlign: 'right',
            padding: theme.spacing(0.3, 0),
            margin: theme.spacing(0.6, 0),
            fontSize: '1.8rem'
        }
    },
    totalValues: {
        textAlign: 'center'
    },
    simulatorOptionText: {
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        fontWeight: 200,
        padding: theme.spacing(2, 0)
    },
    floatingDiv: {
        zIndex: 10,
        position: 'absolute',
        padding: '10px',
        background: theme.palette.primary.light
    },
    graphGridContainer: {
        minHeight: '35vh'
    },
    graphTitleTypography: {
        fontSize: theme.spacing(1.5),
        color: theme.palette.text.titleText,
        opacity: '0.8'
    },
    simulatorContainer: {
        maxHeight: '65vh',
        overflowY: 'scroll',
        padding: theme.spacing(0, 2, 0, 2)
    },
    widgetContent: {
        width: '100%',
        height: '100%',
        borderRadius: theme.spacing(1),
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '0.5rem'
    },
    plot: {
        height: '100%',
        flex: 1
    },
    graphContainer: {
        width: '100%',
        background: theme.palette.primary.main,
        margin: '0'
    },
    simulatorSliderLabel: {
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        padding: theme.spacing(1, 0)
    },
    simulatorTotal: {
        color: theme.palette.text.default,
        fontSize: '2rem',
        fontWeight: 400,
        padding: theme.spacing(1, 0),
        display: 'flex',
        justifyContent: 'center'
    },
    sectionHeading: {
        color: theme.palette.text.default,
        fontSize: '2rem',
        fontWeight: 400,
        padding: theme.spacing(2, 0)
    },
    simulatorSection: {
        border: ' 1px solid',
        padding: '1.6rem',
        marginBottom: '1.6rem',
        borderColor: theme.palette.background.default,
        background: theme.palette.background.default
    },
    customContainer: {
        display: 'flex',
        direction: 'row',
        color: theme.palette.text.default
    }
}));
*/
