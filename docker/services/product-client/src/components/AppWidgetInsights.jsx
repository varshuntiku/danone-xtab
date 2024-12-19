import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, Box } from '@material-ui/core';
import InsightStatus from './InsightStatus';
import appWidgetInsightsStyle from 'assets/jss/appWidgetInsightsStyle.jsx';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
// import { ReactComponent as BulbIcon } from 'assets/img/bulbIcon.svg';
import BulbIcon from 'assets/img/bulbIcon.svg';
import * as _ from 'underscore';
import ScenarioSelector from './AppWidgetFilters';
/**
 * Renders a gantt chart that is mostly used to illustrate using the insight data
 * JSON strucutre -
 * config: {action_link: <boolean>, assumptions_header: <boolean>, auto_refresh: <boolean>, color_nooverride: <boolean>,…}
 *   action_link: <boolean>
 *   assumptions_header: <boolean>
 *   auto_refresh: <boolean>
 *   color_nooverride: <boolean>
 *   filters_open: <boolean>
 *   legend: <boolean>
 *   prefix: <boolean>
 *   size_nooverride: <boolean>
 *   subtitle: <boolean>
 *   title: <boolean>
 *   traces: <boolean>
 *   value_factor: <boolean>
 *   id: <widget id>
 *   is_label: <boolean>
 *   widget_index: <widget index>
 *   widget_key: <widget label>
 * @extends ParentClassNameHereIfAny
 */
class AppWidgetInsights extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = { simParam: this.props?.params };
    }
    componentDidUpdate(prevProps) {
        if (
            (this.props?.simulatorTrigger && prevProps?.params != this.props?.params) ||
            prevProps?.params != this.props?.params
        ) {
            let modParam = JSON.parse(JSON.stringify(this.props?.params));
            if (modParam?.insight_data) {
                this.setState({
                    simParam: modParam
                });
            }
        }
    }
    render() {
        const { classes, preview } = this.props;
        let insights = [];
        let params = this.state.simParam;
        let current_header = false;
        _.each(params.insight_data, function (insight_item, insight_index) {
            // let show_header =
            //     (current_header && current_header !== insight_item.header) ||
            //     (!current_header && insight_item.header)
            //         ? insight_item.header
            //         : false;

            if (current_header && current_header !== insight_item.header) {
                current_header = insight_item.header;
            } else if (!current_header && insight_item.header) {
                current_header = insight_item.header;
            }

            insights.push(
                <div
                    key={'insight_' + insight_index}
                    style={
                        preview
                            ? {
                                  height: 'auto',
                                  marginBottom: '1.2rem'
                              }
                            : {
                                  animationName: 'list-view-animateIn',
                                  animationDuration: '350ms',
                                  animationDelay: (insight_index + 10) * 100 + 'ms',
                                  '--animation-order': insight_index + 1,
                                  animationFillMode: 'both',
                                  animationTimingFunction: 'ease-in-out',
                                  height: 'auto',
                                  marginBottom: '1.2rem'
                              }
                    }
                >
                    {/* {show_header ? (
                        <Typography
                            className={classes.insightHeader}
                            style={insight_item.header_style}
                        >
                            {show_header}
                        </Typography>
                    ) : (
                        ''
                    )} */}

                    {params?.insight_data[0]?.insight_type == 'custom' ? (
                        <div className={classes.customInsightContainer}>
                            <div className={classes.customInsightLabelContainer}>
                                {insight_item?.iconLabel ? (
                                    <React.Fragment>
                                        {' '}
                                        <Typography
                                            className={
                                                insight_item?.success
                                                    ? classes.bulbHolderSuccess
                                                    : insight_item?.failure
                                                    ? classes.bulbHolderFailure
                                                    : classes.bulbHolderNeutral
                                            }
                                        >
                                            {' '}
                                            <img
                                                src={BulbIcon}
                                                className={classes.bulbIcon}
                                                alt="Bulb-Icon"
                                            />{' '}
                                            Positive
                                        </Typography>{' '}
                                        <Typography className={classes.customInsightHeading}>
                                            {insight_item.label}
                                        </Typography>
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        <img
                                            src={BulbIcon}
                                            className={
                                                insight_item?.success
                                                    ? classes.bulbIconSuccess
                                                    : insight_item?.failure
                                                    ? classes.bulbIconFailure
                                                    : classes.bulbIconNeutral
                                            }
                                            alt="Bulb-Icon"
                                        />{' '}
                                        <Typography className={classes.customInsightHeading}>
                                            {insight_item.label}
                                        </Typography>{' '}
                                    </React.Fragment>
                                )}
                            </div>
                            {insight_item?.icons && (
                                <div className={classes.customIconsHolder}>
                                    {insight_item?.likes && (
                                        <Typography className={classes.customIconText}>
                                            {' '}
                                            <div className={classes.dislikeIcon}></div>
                                            {insight_item?.likes}
                                        </Typography>
                                    )}
                                    {insight_item?.dislikes && (
                                        <Typography className={classes.customIconText}>
                                            {' '}
                                            <div className={classes.likeIcon}></div>
                                            {insight_item?.dislikes}
                                        </Typography>
                                    )}
                                    {insight_item?.comments && (
                                        <Typography className={classes.customIconText}>
                                            {' '}
                                            <div className={classes.commentIcon}></div>
                                            {insight_item?.comments}
                                        </Typography>
                                    )}
                                    {insight_item?.share && (
                                        <div className={classes.maskShareIcon}></div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={classes.insightContainer}>
                            <div className={classes.insightLabelContainer}>
                                <img
                                    src={BulbIcon}
                                    className={
                                        insight_item?.success
                                            ? classes.bulbIconSuccess
                                            : insight_item?.failure
                                            ? classes.bulbIconFailure
                                            : classes.bulbIconNeutral
                                    }
                                    alt="Bulb-Icon"
                                />{' '}
                                <Typography className={classes.insightHeading}>
                                    {insight_item.label}
                                </Typography>
                            </div>
                            <div className={classes.minWidth}>
                                {insight_item.arrow &&
                                    (insight_item.arrow === 'up' ? (
                                        <ArrowUpwardIcon
                                            className={
                                                insight_item.alt_behaviour
                                                    ? classes.arrowRedIcon
                                                    : classes.arrowGreenIcon
                                            }
                                            fontSize="large"
                                        />
                                    ) : (
                                        <ArrowDownwardIcon
                                            className={
                                                insight_item.alt_behaviour
                                                    ? classes.arrowGreenIcon
                                                    : classes.arrowRedIcon
                                            }
                                            fontSize="large"
                                        />
                                    ))}
                            </div>
                            <div className={classes.insightValue}>{insight_item.value}</div>
                            {insight_item.extra_value && <br />}
                            {insight_item.extra_value && (
                                <div>
                                    <div className={classes.insightExtraValue}>
                                        {insight_item.extra_value}
                                    </div>
                                    <br />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );
        });
        return (
            <Box
                height="100%"
                width="100%"
                display="flex"
                flexDirection="column"
                style={params.root_style}
            >
                {params?.insight_status && <InsightStatus data={params?.insight_status} />}
                {params?.widget_filters && (
                    <ScenarioSelector
                        scenario_list={params?.widget_filters}
                        params={params}
                        filter_index={params?.selected_filter_index || 0}
                        handleWidgetFilterTrigger={this.props?.handleWidgetFilterTrigger}
                    />
                )}
                {insights}
            </Box>
        );
    }
}

AppWidgetInsights.propTypes = {
    classes: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired
};

export default withStyles((theme) => appWidgetInsightsStyle(theme), { useTheme: true })(
    AppWidgetInsights
);
