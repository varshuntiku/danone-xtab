import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Paper, withStyles, Checkbox } from '@material-ui/core';
import appWidgetLabelStyle from 'assets/jss/appWidgetLabelStyle.jsx';
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from 'components/elements/typography/typography';
import ErrorIcon from '@material-ui/icons/Error';
import { ReactComponent as MarkerUpIcon } from 'assets/img/marker-up.svg';
import { getWidget, getMultiWidget } from 'services/widget.js';
import { connect } from 'react-redux';
import {
    setWidgetEventData,
    updateMaxScreenWidgetCount,
    updateCurrentSelectedWidgetCount,
    removeWidgetFromUsed
} from 'store/index';
import { CircularProgress, Tooltip, IconButton } from '@material-ui/core';
import * as _ from 'underscore';
import AppConfigWrapper, { AppConfigOptions } from '../hoc/appConfigWrapper.js';
import { withThemeContext } from '../themes/customThemeContext';
import GraphComponent from './AppWidgetLabelGraph.jsx';
import AppWidgetAssumptions from './AppWidgetAssumptions.jsx';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

/**
 * It renders the key performance indicators to measure the performance over time for specific objectives, alert data and widget filters
 * @extends ParentClassNameHereIfAny
 */
class AppWidgetLabel extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;
        this.assumptionProps = React.createRef();
        this.state = {
            loading: true,
            data: false,
            simulated_data: false,
            params: false,
            simulated_params: false,
            checked: false,
            error: false,
            error_message: false,
            traceList: false,
            alert_widget_type: false,
            widget_details: props.details,
            isHovered: false
        };
    }

    componentDidMount() {
        this.refreshWidget();
    }

    refreshWidget() {
        const { app_id, screen_id, selected_filters, screen_filter_settings } = this.props;

        if (screen_filter_settings) {
            getMultiWidget({
                app_id: app_id,
                screen_id: screen_id,
                details: this.state.widget_details,
                filters: selected_filters,
                callback: this.onResponseGetWidget
            });
        } else {
            getWidget({
                app_id: app_id,
                screen_id: screen_id,
                details: this.state.widget_details,
                filters: selected_filters,
                callback: this.onResponseGetWidget
            });
        }
    }
    refreshWidgetOnEvent() {
        const { app_id, screen_id, selected_filters } = this.props;
        let affectedWidget = this.state?.params?.affected_by;
        if (!(affectedWidget && affectedWidget?.includes(this.props.widget_action.action_origin))) {
            return;
        }
        this.setState({ loading: true });
        getMultiWidget({
            app_id: app_id,
            screen_id: screen_id,
            details: this.state.widget_details,
            filters: selected_filters,
            widget_event: this.props.widget_action,
            callback: this.onResponseGetWidget
        });
    }
    handleStateUpdateRequest(params) {
        if (params.notification) {
            this.setState({
                notification: params.notification,
                notificationOpen: true
            });
        }

        if (params.refreshWidget) {
            this.setState({
                widget_details: {
                    ...this.state.widget_details,
                    config: params.config
                }
            });
            this.refreshWidget();
        }
    }

    componentDidUpdate(prevProps) {
        const appScreenDetails = _.where(this.props.screens, { id: this.props.screenId });
        if (
            prevProps.screens != this.props.screens &&
            appScreenDetails[0]?.selected != this.state.checked &&
            prevProps.checkFlag !== this.props.checkFlag
        ) {
            this.setState({ checked: appScreenDetails[0]?.selected });
            this.onCheckboxValueChange(appScreenDetails[0]?.selected);
        }
        if (
            this.props.screenId !== prevProps.screenId &&
            prevProps.checkFlag !== this.props.checkFlag
        ) {
            if (this.props.screenId) {
                this.setState({ checked: appScreenDetails[0]?.selected });
                this.onCheckboxValueChange(appScreenDetails[0]?.selected);
            }
        }
        if (JSON.stringify(prevProps.widget_action) !== JSON.stringify(this.props.widget_action)) {
            this.refreshWidgetOnEvent();
        }
        if (
            JSON.stringify(prevProps.selected_filters) !==
            JSON.stringify(this.props.selected_filters)
        ) {
            this.refreshWidget();
        }
    }

    onResponseGetWidget = (response_data) => {
        const { title, parent_obj } = this.props;

        if (response_data.status && response_data.status === 'error') {
            this.setState({
                loading: false,
                error: true,
                error_message: response_data.message,
                data: false,
                simulated_data: false
            });

            return;
        }

        var current_value = response_data['data']['value'];
        var simulated_value = response_data['data']['simulated_value'];
        var widget_value_id = response_data['data']['widget_value_id'];
        //adding the current KPI as a valid KPIs for the current screen
        //allows screen level checkbox's("select all items")  checking and unchecking against count changes w.r.t  max possible count per screen
        if (widget_value_id && this.props?.screenId && current_value['value'])
            this.props.validWidgetsMaxCountUpdate({
                screenId: this.props.screen_id,
                widget_value_id
            });
        if (typeof current_value === 'object') {
            this.setState({
                loading: false,
                error: false,
                error_message: false,
                data: current_value['value'],
                simulated_data: simulated_value ? simulated_value['value'] : null,
                params: current_value,
                simulated_params: simulated_value,
                widget_value_id: widget_value_id
            });
        } else {
            this.setState({
                loading: false,
                error: false,
                error_message: false,
                data: current_value,
                simulated_data: simulated_value,
                params: false,
                simulated_params: false,
                widget_value_id: widget_value_id
            });
        }

        if (current_value) {
            if (parent_obj && parent_obj.updateScreenDataItems) {
                parent_obj.updateScreenDataItems({
                    title: title,
                    value: current_value
                });
            }
            this.generateAlertData(Object.keys(current_value), 'KPI');
        }
        var payloadMap = new Map(JSON.parse(localStorage.getItem('create-stories-payload')));

        if (payloadMap && payloadMap.size) {
            var payloadObject = payloadMap.get(this.props.app_id);

            if (payloadObject && widget_value_id) {
                var widgetValueIds = _.pluck(payloadObject, 'app_screen_widget_value_id');
                if (widgetValueIds.includes(widget_value_id)) {
                    this.setState({ checked: true });
                    if (widget_value_id && this.props?.screenId && current_value['value'])
                        this.props.addToStoriesCount({
                            screenId: this.props.screen_id,
                            widget_value_id
                        });
                }
            }
        }
    };

    getCreateStoriesPayload = () => {
        return {
            name: this.props.title,
            description: '',
            app_id: this.props.app_id,
            app_screen_id: this.props.screen_id,
            app_screen_widget_id: this.props.details.id,
            app_screen_widget_value_id: this.state.widget_value_id,
            graph_data: this.state.params,
            filter_data: JSON.parse(
                sessionStorage.getItem(
                    'app_screen_filter_info_' + this.props.app_id + '_' + this.props.screen_id
                )
            )
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
            payloadObject = payloadMap.get(this.props.app_id);
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
            //checking whether there are already widgets in the main payload and if the current KPI is truly valid
            if (payloadObject.length && this.state.widget_value_id && this.state.data) {
                var widgetValueIds = _.pluck(payloadObject, 'app_screen_widget_value_id');
                if (!widgetValueIds.includes(this.state.widget_value_id)) {
                    let requestPayload = this.getCreateStoriesPayload();
                    payloadObject.push(requestPayload);
                }
            } else if (this.state.widget_value_id && this.state.data) {
                let requestPayload = this.getCreateStoriesPayload();
                payloadObject.push(requestPayload);
            }
            if (this.props?.screenId && this.state.widget_value_id && this.state.data)
                this.props.addToStoriesCount({
                    screenId: this.props.screen_id,
                    widget_value_id: this.state.widget_value_id
                });
        } else {
            // get index of object with widget_value_id
            var removeIndex = payloadObject
                .map(function (item) {
                    return item.app_screen_widget_value_id;
                })
                .indexOf(this.state.widget_value_id);
            if (removeIndex !== -1) {
                payloadObject.splice(removeIndex, 1);
                if (this.props?.screenId && this.state.widget_value_id)
                    this.props.removeFromStoriesCount({
                        screenId: this.props.screen_id,
                        widget_value_id: this.state.widget_value_id
                    });
            }
        }

        payloadMap.set(this.props.app_id, payloadObject);
        localStorage.setItem(
            'create-stories-payload',
            JSON.stringify(Array.from(payloadMap.entries()))
        );
        this.props.parent_obj.props.handleStoriesCount();
    };

    generateAlertData = (data, type) => {
        let traceList = [];
        if (data) {
            data.forEach((element, index) => {
                if (element.includes('value')) {
                    element = element.replaceAll('_', ' ');
                    traceList.push(element || 'trace-' + element.type + '-' + index);
                }
            });
        }

        if (traceList.length !== this.state.traceList.length) {
            this.setState({
                traceList: traceList,
                alert_widget_type: type
            });
        }
    };
    eventEnum = {
        TRIGGER_ASSUMPTION_ON_VALUE: 'trigger_assumption_on_value',
        TRIGGER_CROSS_FILTER_ON_CLICK: 'trigger_cross_filter_on_click'
    };
    validateEvent = (key, extra_event) => {
        return key === extra_event ? true : false;
    };
    handleWidgetEvent = (data) => {
        let widgetData = {
            action_origin: this.props.details.id,
            widget_data: data
        };
        this.props.onWidgetEvent(widgetData);
    };
    handleClick = (params) => {
        if (this.validateEvent(this.eventEnum.TRIGGER_CROSS_FILTER_ON_CLICK, params.extra_event)) {
            this.handleWidgetEvent(params.data);
        }
    };
    handleDoubleClick = (e, extra_event) => {
        e.preventDefault();
        if (this.validateEvent(this.eventEnum.TRIGGER_CROSS_FILTER_ON_CLICK, extra_event)) {
            this.handleWidgetEvent(null);
        }
    };

    handleMouseEnter = () => {
        if (!this.state.isHovered) {
            this.setState({
                isHovered: true
            });
        }
    };

    handleMouseLeave = () => {
        if (this.state.isHovered) {
            this.setState({
                isHovered: false
            });
        }
    };

    render() {
        const { simulator_apply, classes, label_widgets = [] } = this.props;
        const theme = this.props?.parent_obj?.props?.theme;
        const isInline = label_widgets.length < 4;
        const isWidgetsLessThanThree = label_widgets.length <= 3;
        // const details = this.state.widget_details;
        const title =
            this.props.title ||
            this.state.widget_details['config']['title'] ||
            this.state.widget_details['widget_key'];
        const noTitleCasing = this.state.widget_details['config']['title_caseNoOverride'];
        const noContentCasing = this.state.widget_details['config']['content_caseNoOverride'];
        var extra_label_class = classes.graphDataExtraLabel;
        const subTitle = this.state?.widget_details['config']['subtitle'];
        var extra_label = '';
        var params = this.state.params;
        var value_data = this.state.data;

        if (simulator_apply) {
            if (this.state.simulated_params) {
                params = this.state.simulated_params;
            }

            if (this.state.simulated_data) {
                value_data = this.state.simulated_data;
            }
        }

        if (params) {
            if (params.extra_label) {
                extra_label = params.extra_label;
            }

            if (params.extra_dir) {
                if (params.extra_dir === 'up') {
                    const arrowColor = params.alt_behaviour
                        ? theme?.palette?.error?.main
                        : theme?.palette?.text?.indicatorGreenText;
                    extra_label_class = params.alt_behaviour
                        ? classes.graphDataExtraLabelDown
                        : classes.graphDataExtraLabelUp;
                    if (!params.extra_label) {
                        extra_label = (
                            <div
                                className={extra_label_class}
                                style={{ '--svg-bgColor': params.extra_dir_color || arrowColor }}
                            >
                                <MarkerUpIcon
                                    className={`${classes.iconStyle} ${
                                        isWidgetsLessThanThree ? classes.customIconStyle : ''
                                    }`}
                                    style={{
                                        color: params.extra_dir_color ? params.extra_dir_color : ''
                                    }}
                                />
                            </div>
                        );
                    }
                } else if (params.extra_dir === 'down') {
                    const arrowColor = params.alt_behaviour
                        ? theme?.palette?.text?.indicatorGreenText
                        : theme?.palette?.error?.main;
                    extra_label_class = params.alt_behaviour
                        ? classes.graphDataExtraLabelUp
                        : classes.graphDataExtraLabelDown;
                    if (!params.extra_label) {
                        extra_label = (
                            <div
                                className={extra_label_class}
                                style={{ '--svg-bgColor': params.extra_dir_color || arrowColor }}
                            >
                                <MarkerUpIcon
                                    style={{
                                        color: params.extra_dir_color ? params.extra_dir_color : ''
                                    }}
                                    className={`${classes.graphDataExtraIcon} ${
                                        classes.iconStyle
                                    } ${isWidgetsLessThanThree ? classes.customIconStyle : ''}`}
                                />
                            </div>
                        );
                    }
                }
            }
        }

        return (
            <Paper
                className={`${classes.widgetContent} ${
                    isInline && params.variant !== 'percentage' && params.variant !== 'scorecard'
                        ? isWidgetsLessThanThree
                            ? classes.labelWrapperStyle
                            : classes.customLabelWrapperStyle
                        : ''
                }`}
            >
                {value_data && !this.state.loading && (
                    <div
                        className={`${
                            isWidgetsLessThanThree ? classes.kpistorybtn : classes.exceptional
                        }`}
                    >
                        <AppConfigWrapper appConfig={AppConfigOptions.data_story}>
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
                        </AppConfigWrapper>
                    </div>
                )}

                <div
                    className={`${classes.graphLabelContainer} ${
                        isWidgetsLessThanThree
                            ? classes.shortCustomLabel
                            : classes.lengthyCustomLabel
                    }`}
                >
                    {params.variant !== 'scorecard' ? (
                        <div className={classes.graphLabel}>
                            {this.state.loading ? (
                                <React.Fragment>
                                    <Typography color="initial" variant="h5">
                                        <Skeleton
                                            variant="text"
                                            animation="wave"
                                            className={classes.skeletonWave}
                                        />
                                    </Typography>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <div className={classes.graphLabelWrapper}>
                                        <div className={classes.graphLabelKPI}>
                                            <Tooltip
                                                title={
                                                    title && noTitleCasing
                                                        ? title
                                                        : title.toLowerCase()
                                                }
                                                placement="top"
                                                classes={{ tooltip: classes.headerTooltip }}
                                                disableHoverListener={title?.length <= 55}
                                            >
                                                <div>
                                                    <Typography
                                                        color="initial"
                                                        variant={
                                                            isWidgetsLessThanThree
                                                                ? noTitleCasing
                                                                    ? 'k13'
                                                                    : 'k9'
                                                                : noTitleCasing
                                                                ? 'k12'
                                                                : 'k8'
                                                        }
                                                    >
                                                        {title && noTitleCasing
                                                            ? title
                                                            : title.toLowerCase()}
                                                    </Typography>
                                                </div>
                                            </Tooltip>
                                            <div>
                                                <Typography
                                                    color="initial"
                                                    variant={
                                                        isWidgetsLessThanThree
                                                            ? noTitleCasing
                                                                ? 'k13'
                                                                : 'k9'
                                                            : noTitleCasing
                                                            ? 'k12'
                                                            : 'k8'
                                                    }
                                                    className={classes.subTitle}
                                                >
                                                    {subTitle
                                                        ? noTitleCasing
                                                            ? subTitle
                                                            : subTitle.toLowerCase()
                                                        : null}
                                                </Typography>
                                            </div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            )}
                        </div>
                    ) : (
                        ''
                    )}
                    {this.state.loading ? (
                        <div className={classes.graphDataContainer}>
                            <div className={params ? classes.graphDataExtra : classes.graphData}>
                                <Typography
                                    color="initial"
                                    className={classes.graphDataLabel}
                                    variant="h4"
                                >
                                    <Skeleton
                                        data-testid="label-skeleton"
                                        variant="text"
                                        animation="wave"
                                        className={classes.skeletonWave}
                                    />
                                </Typography>
                                <Typography
                                    color="initial"
                                    className={classes.graphDataLabel}
                                    variant="h5"
                                >
                                    <Skeleton
                                        variant="text"
                                        animation="wave"
                                        className={classes.skeletonWave}
                                    />
                                </Typography>
                            </div>
                        </div>
                    ) : (
                        ''
                    )}
                    {this.state.error ? (
                        <div className={classes.graphActionsBar}>
                            <ErrorIcon
                                role="img"
                                fontSize="large"
                                color="secondary"
                                titleAccess={
                                    this.state.error_message
                                        ? this.state.error_message
                                        : 'Internal Server Error'
                                }
                            />
                        </div>
                    ) : (
                        ''
                    )}
                    {value_data ? (
                        this.state.loading ? (
                            <div className={classes.graphDataContainer}>
                                <div
                                    className={params ? classes.graphDataExtra : classes.graphData}
                                >
                                    <Typography
                                        color="initial"
                                        className={classes.graphDataLabel}
                                        variant="h4"
                                    >
                                        <Skeleton
                                            data-testid="label-skeleton"
                                            variant="text"
                                            animation="wave"
                                            className={classes.skeletonWave}
                                        />
                                    </Typography>
                                    <Typography
                                        color="initial"
                                        className={classes.graphDataLabel}
                                        variant="h5"
                                    >
                                        <Skeleton
                                            variant="text"
                                            animation="wave"
                                            className={classes.skeletonWave}
                                        />
                                    </Typography>
                                </div>
                            </div>
                        ) : (
                            <div
                                className={
                                    params.variant === 'scorecard'
                                        ? classes.graphDataContainerScoreCard
                                        : `${classes.graphDataContainer} ${
                                              isInline ? classes.customGraphDataContainer : ''
                                          }`
                                }
                                onClick={() => this.handleClick(params)}
                                onDoubleClick={(e) => this.handleDoubleClick(e, params.extra_event)}
                            >
                                <VariantComponent
                                    params={params}
                                    extra_label={extra_label}
                                    extra_label_class={extra_label_class}
                                    classes={classes}
                                    parent_obj={this}
                                    title={title}
                                    subTitle={subTitle}
                                    value_data={value_data}
                                    label_widgets={label_widgets}
                                    noTitleCasing={noTitleCasing}
                                    noContentCasing={noContentCasing}
                                    askNucliosOpen={this.props.askNucliosOpen}
                                />
                                <br />
                            </div>
                        )
                    ) : (
                        // </Tooltip>
                        ''
                    )}
                    {value_data && !this.state.loading && (
                        <>
                            <div
                                className={`${
                                    !this.props?.app_info?.modules?.data_story
                                        ? classes.kpiBtnGroup
                                        : params.variant !== 'percentage'
                                        ? !isInline
                                            ? classes.kpiBtnGroupOne
                                            : classes.kpiBtnGrpForLessKpi
                                        : classes.kpiBtnGrp
                                }`}
                            >
                                {params && params.assumptions ? (
                                    <AppWidgetAssumptions
                                        params={params}
                                        ref={this.assumptionProps}
                                        hideInfoButton={this.validateEvent(
                                            this.eventEnum.TRIGGER_ASSUMPTION_ON_VALUE,
                                            params.extra_event
                                        )}
                                        isKpi={true}
                                        dataStory={this.props?.app_info?.modules?.data_story}
                                    />
                                ) : null}
                            </div>
                        </>
                    )}
                </div>
                {params?.graph_data ? (
                    <GraphComponent
                        props={this.props}
                        label_widgets={label_widgets}
                        themeContext={this.props.themeContext}
                        params={params}
                        isHovered={this.state.isHovered}
                        handleMouseEnter={this.handleMouseEnter}
                        handleMouseLeave={this.handleMouseLeave}
                    />
                ) : null}
            </Paper>
        );
    }
}

const VariantComponent = ({
    params,
    extra_label,
    extra_label_class,
    classes,
    parent_obj,
    title,
    value_data,
    label_widgets,
    subTitle,
    noTitleCasing,
    noContentCasing,
    askNucliosOpen
}) => {
    //Conditionally Rendering Component
    switch (params.variant) {
        case 'percentage':
            return (
                <PercentageVariantKpi
                    params={params}
                    title={title}
                    classes={classes}
                    value_data={value_data}
                    parent_obj={parent_obj}
                    noTitleCasing={noTitleCasing}
                    noContentCasing={noContentCasing}
                />
            );
        case 'scorecard':
            return (
                <ScoreCardVariantKpi
                    params={params}
                    classes={classes}
                    parent_obj={parent_obj}
                    noContentCasing={noContentCasing}
                />
            );
        default:
            return (
                <RegulatVariantKpi
                    params={params}
                    extra_label={extra_label}
                    subTitle={subTitle}
                    extra_label_class={extra_label_class}
                    classes={classes}
                    parent_obj={parent_obj}
                    label_widgets={label_widgets}
                    noContentCasing={noContentCasing}
                    askNucliosOpen={askNucliosOpen}
                />
            );
    }
};

const RegulatVariantKpi = ({
    params,
    extra_label,
    classes,
    parent_obj,
    extra_label_class,
    label_widgets,
    noContentCasing
}) => {
    const details = parent_obj.state.widget_details;
    const value_data = parent_obj.state.data;
    const isWidgetsLessThanThree = label_widgets.length <= 3;

    return (
        <>
            <div
                className={
                    params
                        ? `${classes.graphDataExtra} ${
                              isWidgetsLessThanThree ? classes.customGraphDataExtra : ''
                          }`
                        : classes.graphData
                }
            >
                <Typography
                    color="initial"
                    className={classes.graphDataLabel}
                    variant={
                        isWidgetsLessThanThree
                            ? 'k1'
                            : label_widgets.length > 3
                            ? `${label_widgets.length > 5 ? 'k9' : 'k5'}`
                            : 'k7'
                    }
                    onClick={() =>
                        params.assumptions &&
                        parent_obj.validateEvent(
                            parent_obj.eventEnum.TRIGGER_ASSUMPTION_ON_VALUE,
                            params.extra_event
                        )
                            ? parent_obj.assumptionProps.current.onClickDialog()
                            : undefined
                    }
                    style={{
                        cursor:
                            params.assumptions &&
                            parent_obj.validateEvent(
                                parent_obj.eventEnum.TRIGGER_ASSUMPTION_ON_VALUE,
                                params.extra_event
                            )
                                ? 'pointer'
                                : null,
                        color: params.value_color ? params.value_color : '',
                        textTransform: noContentCasing ? 'none' : undefined
                        // fontSize:'3rem'
                    }}
                >
                    {getParsedKPIValue(details.config, value_data)}
                </Typography>

                {params?.extra_value ? (
                    <div
                        className={`${classes.indicatorWrapper} ${
                            params?.extra_dir === 'down' &&
                            !params?.alt_behaviour &&
                            classes.downIndicatorWrapper
                        } ${
                            params?.extra_dir === 'up' &&
                            params?.alt_behaviour &&
                            classes.downIndicatorWrapper
                        }`}
                        style={{ backgroundColor: params.extra_value_background_color || '' }}
                    >
                        {extra_label}
                        <Typography
                            color="initial"
                            className={`${extra_label_class} ${classes.extraLabelStyle}`}
                            style={{
                                color: params.extra_value_color ? params.extra_value_color : '',
                                textTransform: noContentCasing ? 'none' : undefined
                            }}
                            variant={isWidgetsLessThanThree ? 'k6' : 'k10'}
                        >
                            {params.extra_value}
                        </Typography>
                    </div>
                ) : null}
            </div>
            <div className={classes.visualTooltipContainer}>
                {params.isTooltip ? (
                    <Tooltip
                        title={params.tooltip_text}
                        placement={params.placement}
                        classes={{ tooltip: classes.visualTooltip }}
                    >
                        <IconButton className={classes.InfoIcon}>
                            <InfoOutlinedIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                ) : null}
            </div>
        </>
    );
};
const PercentageVariantKpi = ({
    params,
    title,
    classes,
    value_data,
    parent_obj,
    noTitleCasing,
    noContentCasing
}) => {
    return (
        <div id={'percentageVariant' + title} className={classes.variantPercentageRootDiv}>
            <div className={classes.extraTitle}>
                <div>
                    <Typography color="initial" variant={noTitleCasing ? 'k12' : 'k8'}>
                        {params.extra_title
                            ? noTitleCasing
                                ? params.extra_title
                                : params.extra_title.toLowerCase()
                            : ''}
                    </Typography>
                </div>
                <div id={'percentageVariant_textcontainer' + title}>
                    <div>
                        <Typography
                            color="initial"
                            className={classes.variantPercentageExtraLabel}
                            style={{
                                color: params.extra_value_color,
                                textTransform: noContentCasing ? 'none' : undefined
                            }}
                            variant="k8"
                        >
                            {params.extra_value}
                        </Typography>
                    </div>
                </div>
            </div>
            <div className={classes.circularProgress}>
                <div>
                    <Typography
                        className={classes.variantPercentageValue}
                        style={{
                            color: params.value_color,
                            cursor:
                                params.assumptions &&
                                parent_obj.validateEvent(
                                    parent_obj.eventEnum.TRIGGER_ASSUMPTION_ON_VALUE,
                                    params.extra_event
                                )
                                    ? 'pointer'
                                    : null,
                            textTransform: noContentCasing ? 'none' : undefined
                        }}
                        variant="k11"
                        onClick={() =>
                            params.assumptions &&
                            parent_obj.validateEvent(
                                parent_obj.eventEnum.TRIGGER_ASSUMPTION_ON_VALUE,
                                params.extra_event
                            )
                                ? parent_obj.assumptionProps.current.onClickDialog()
                                : undefined
                        }
                    >
                        {' '}
                        {params.extra_dir &&
                            (params.extra_dir == 'down' ? (
                                <div>
                                    <MarkerUpIcon
                                        className={`${classes.variantPercentageExtraIcon} ${classes.graphDataExtraIconPercent} ${classes.iconStyle}`}
                                        style={{
                                            color: params.extra_dir_color
                                        }}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <MarkerUpIcon
                                        className={`${classes.variantPercentageExtraIcon} ${classes.iconStyle}`}
                                        style={{
                                            color: params.extra_dir_color
                                        }}
                                    />
                                </div>
                            ))}
                        {value_data + '%'}
                    </Typography>
                </div>
                <div className={classes.circular}>
                    <CircularProgress
                        variant="determinate"
                        className={classes.bottom}
                        size={'6rem'}
                        thickness={6}
                        value={100}
                    />
                    <CircularProgress
                        className={classes.variantPercentageProgress}
                        style={{
                            color: params.variant_color
                        }}
                        thickness={6}
                        size={'6rem'}
                        variant="determinate"
                        value={value_data}
                    />
                </div>
            </div>
            <div className={classes.visualTooltipContainer}>
                {params.isTooltip ? (
                    <Tooltip
                        title={params.tooltip_text}
                        placement={params.placement}
                        classes={{ tooltip: classes.visualTooltip }}
                    >
                        <IconButton className={classes.InfoIcon}>
                            <InfoOutlinedIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                ) : null}
            </div>
        </div>
    );
};

const ScoreCardVariantKpi = ({ params, classes, noContentCasing }) => {
    const getItemAlignment = (input) => {
        if (input.toLowerCase().includes('left')) {
            return 'flex-start';
        } else if (input.toLowerCase().includes('right')) {
            return 'flex-end';
        } else {
            return 'center';
        }
    };

    const position = useMemo(() => {
        return getItemAlignment(params.position ? params.position : 'center');
    }, []);

    return (
        <div
            className={classes.variantScoreCardRootDiv}
            style={{
                alignItems: position,
                backgroundColor: params.background_color
            }}
        >
            <Typography
                color="initial"
                style={{
                    fontSize: params.value_size ? params.value_size : '4rem',
                    color: params.value_color ? params.value_color : '',
                    lineHeight: params.value_line_height ? params.value_line_height : 1.1,
                    letterSpacing: params.value_letter_spacing ? params.value_letter_spacing : 1,
                    textTransform: noContentCasing ? 'none' : 'capitalize'
                }}
                className={classes.scoreStyle}
            >
                {params.value}
            </Typography>
            <Typography
                color="initial"
                style={{
                    fontSize: params.value_type_size ? params.value_type_size : '4rem',
                    color: params.value_type_color ? params.value_type_color : '',
                    lineHeight: params.value_type_line_height ? params.value_type_line_height : 1.1,
                    letterSpacing: params.value_type_letter_spacing
                        ? params.value_type_letter_spacing
                        : 1,
                    textTransform: noContentCasing ? 'none' : 'capitalize'
                }}
            >
                {params.value_type}
            </Typography>
            <div className={classes.visualTooltipContainer}>
                {params.isTooltip ? (
                    <Tooltip
                        title={params.tooltip_text}
                        placement={params.placement}
                        classes={{ tooltip: classes.visualTooltip }}
                    >
                        <IconButton className={classes.InfoIcon}>
                            <InfoOutlinedIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                ) : null}
            </div>
        </div>
    );
};

export function getParsedKPIValue(config, value) {
    return (
        (config.prefix ? config.prefix : '') +
        (config.value_factor
            ? (parseInt(value) / Math.pow(10, parseInt(config.value_factor))).toFixed(1)
            : value?.toFixed
            ? value.toFixed(1)
            : value
            ? value
            : '--')
    );
}

AppWidgetLabel.propTypes = {
    classes: PropTypes.object.isRequired,
    app_id: PropTypes.string.isRequired,
    screen_id: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
    title: PropTypes.string.isRequired,
    details: PropTypes.object.isRequired,
    selected_filters: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        screens: state.createStories.selectedScreens,
        screenId: state.createStories.screenId,
        checkFlag: state.createStories.checkFlag,
        widget_action: state.appScreen.widget_action
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onWidgetEvent: (widgetData) => dispatch(setWidgetEventData(widgetData)),
        validWidgetsMaxCountUpdate: (widgetCred) =>
            dispatch(updateMaxScreenWidgetCount(widgetCred)),
        addToStoriesCount: (widgetCred) => dispatch(updateCurrentSelectedWidgetCount(widgetCred)),
        removeFromStoriesCount: (widgetCred) => dispatch(removeWidgetFromUsed(widgetCred))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    withStyles(
        (theme) => ({
            ...appWidgetLabelStyle(theme)
        }),
        { useTheme: true }
    )(withThemeContext(AppWidgetLabel))
);
