import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import clsx from 'clsx';
import appScreenLayoutStyle from 'assets/jss/appScreenLayoutStyle.jsx';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

import * as _ from 'underscore';

class AppScreenLayout extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;
        this.state = {
            layout_option: props.layout_option
        };
    }

    componentDidMount() {
        if (this.props.widgets) {
            this.setState({
                layout_option: {
                    ...this.state.layout_option,
                    no_labels: _.filter(this.props.widgets, function (widget_item) {
                        return widget_item.is_label;
                    }).length,
                    no_graphs: _.filter(this.props.widgets, function (widget_item) {
                        return !widget_item.is_label;
                    }).length
                }
            });
        }
        setTimeout(() => {
            const selectedLayout = document.getElementById('selectedLayout');
            if (selectedLayout) {
                window.innerHeight < 600
                    ? selectedLayout.scrollIntoView({ behavior: 'smooth', block: 'end' })
                    : selectedLayout.scrollIntoView({ behavior: 'smooth' });
            }
        }, 500);
    }

    componentDidUpdate(prevProps) {
        if (this.props?.layout_option !== prevProps?.layout_option && !this.props.widgets) {
            this.setState({
                layout_option: this.props?.layout_option
            });
        }
    }

    onClickSetting(e, widget) {
        if (this.props.onSelectWidget) {
            this.props.onSelectWidget(widget);
        }
    }

    renderLayoutItem = (selected, layout_option, cardClass, unsaved, widthResponsive) => {
        const { classes } = this.props;
        if (!cardClass) {
            cardClass =
                layout_option['no_labels'] === 0 && layout_option['no_graphs'] < 4
                    ? classes.fullCard
                    : layout_option['no_labels'] === 0
                    ? classes.halfCard
                    : layout_option['no_graphs'] < 4
                    ? classes.bigCard
                    : classes.halfBigCard;
        } else {
            cardClass =
                layout_option['no_labels'] === 0 && cardClass === '1'
                    ? classes.fullCard
                    : layout_option['no_labels'] === 0
                    ? classes.halfCard
                    : cardClass === '1'
                    ? classes.bigCard
                    : classes.halfBigCard;
        }
        return (
            <div
                className={
                    classes.card +
                    ' ' +
                    cardClass +
                    ' ' +
                    (selected ? classes.selectedCard : '') +
                    ' ' +
                    (widthResponsive && selected ? classes.cardSelected : '')
                }
                title={unsaved ? 'Unsaved changes' : ''}
            >
                <div className={classes.cardBody}>
                    {unsaved ? (
                        <FiberManualRecordIcon
                            fontSize="small"
                            color="inherit"
                            className={classes.unsavedIndicator}
                        />
                    ) : null}
                </div>
            </div>
        );
    };

    renderLayoutOption = (
        layoutSelected,
        layout_option,
        graphWidgets,
        selectedWidgetId,
        unsavedWidgets,
        widthResponsive
    ) => {
        const { classes } = this.props;
        var gridItemClickProps = {};
        var response = [];
        let index = 0;
        if (layout_option['graph_type']) {
            var graph_sections = layout_option['graph_type'].split('-');
            let graph_width =
                !layout_option['graph_width'] || layout_option['graph_width'] == 'false'
                    ? false
                    : layout_option['graph_width'];
            let graph_height =
                !layout_option['graph_height'] || layout_option['graph_height'] == 'false'
                    ? false
                    : layout_option['graph_height'];
            if (graph_width) {
                graph_width = layout_option['graph_width'].split(',');
                graph_width = graph_width.map(function (val) {
                    return val.split('-');
                });
                graph_width = [].concat(...graph_width);
            }
            if (graph_height && layout_option['horizontal']) {
                graph_height = graph_height.split('-');
            } else if (graph_height) {
                graph_height = graph_height.split(',');
                graph_height = graph_height.map(function (val) {
                    return val.split('-');
                });
                graph_height = [].concat(...graph_height);
            }
            var graph_index_prefix = 0;
            let height_index = 0;
            if (layout_option['horizontal']) {
                _.each(
                    graph_sections,
                    function (graph_section, graph_section_index) {
                        var graph_widgets = _.times(
                            graph_section,
                            function (graph_index) {
                                graph_index = Number(graph_index) + Number(graph_index_prefix);
                                const widget = graphWidgets?.[index];
                                gridItemClickProps = {
                                    onClick: (event) => this.onClickSetting(event, widget)
                                };
                                index++;
                                const selected =
                                    layoutSelected ||
                                    (selectedWidgetId && widget?.id === selectedWidgetId);
                                const unsaved = unsavedWidgets ? unsavedWidgets[widget?.id] : false;
                                if (parseInt(graph_section) === 5) {
                                    return (
                                        <Grid
                                            item
                                            key={
                                                'grid_item_graph_' + graph_index + '#' + widget?.id
                                            }
                                            xs
                                            className={`${classes.gridItem} `}
                                            {...gridItemClickProps}
                                        >
                                            {this.renderLayoutItem(
                                                selected,
                                                layout_option,
                                                1,
                                                unsaved,
                                                widthResponsive
                                            )}
                                        </Grid>
                                    );
                                } else {
                                    return (
                                        <Grid
                                            item
                                            key={
                                                'grid_item_graph_' + graph_index + '#' + widget?.id
                                            }
                                            xs={
                                                graph_width[index - 1]
                                                    ? graph_width[index - 1]
                                                    : 12 / parseInt(graph_section)
                                            }
                                            className={`${classes.gridItem} `}
                                            {...gridItemClickProps}
                                        >
                                            {this.renderLayoutItem(
                                                selected,
                                                layout_option,
                                                1,
                                                unsaved,
                                                widthResponsive
                                            )}
                                        </Grid>
                                    );
                                }
                            },
                            this
                        );

                        graph_index_prefix = Number(graph_index_prefix) + Number(graph_section);
                        height_index++;
                        let height_calc =
                            graph_height[height_index - 1] == 1
                                ? 9
                                : graph_height[height_index - 1] < 5
                                ? Number(graph_height[height_index - 1]) + 6
                                : 12;
                        response.push(
                            <Grid
                                item
                                key={'grid_item_graph_section_' + graph_section_index}
                                xs={12}
                                className={`${classes.gridChildItem}`}
                                style={{
                                    '--itemHeight': graph_height ? `${height_calc}rem` : '8rem'
                                }}
                            >
                                <Grid
                                    container
                                    justifyContent="center"
                                    spacing={0}
                                    className={`${classes.gridChildContainer}`}
                                >
                                    {graph_widgets}
                                </Grid>
                            </Grid>
                        );
                    },
                    this
                );
            } else {
                _.each(
                    graph_sections,
                    function (graph_section, graph_section_index) {
                        var graph_widgets = _.times(
                            graph_section,
                            function (graph_index) {
                                graph_index = Number(graph_index);
                                const widget = graphWidgets?.[index];
                                gridItemClickProps = {
                                    onClick: (event) => this.onClickSetting(event, widget)
                                };
                                index++;
                                const selected =
                                    layoutSelected ||
                                    (selectedWidgetId && widget?.id === selectedWidgetId);
                                const unsaved = unsavedWidgets ? unsavedWidgets[widget.id] : false;
                                let height_calc =
                                    graph_height[graph_index] == 1
                                        ? 9
                                        : graph_height[graph_index] < 5
                                        ? Number(graph_height[graph_index]) + 6
                                        : 12;
                                return (
                                    <Grid
                                        item
                                        key={'grid_item_graph_' + graph_index + '#' + widget?.id}
                                        xs={12}
                                        className={classes.verticalChild}
                                        style={{
                                            '--itemHeight': graph_height
                                                ? graph_section == 1
                                                    ? 'inherit'
                                                    : `${height_calc}rem`
                                                : null
                                        }}
                                        {...gridItemClickProps}
                                    >
                                        {this.renderLayoutItem(
                                            selected,
                                            layout_option,
                                            graph_section,
                                            unsaved,
                                            widthResponsive
                                        )}
                                    </Grid>
                                );
                            },
                            this
                        );

                        graph_index_prefix = graph_index_prefix + graph_section;
                        if (graph_sections.length === 5) {
                            response.push(
                                <Grid
                                    item
                                    key={'grid_item_graph_section_' + graph_section_index}
                                    xs
                                    className={`${classes.gridVerticalParentItemStyle}`}
                                >
                                    <Grid
                                        container
                                        justifyContent="center"
                                        spacing={0}
                                        className={`${classes.gridChildContainerVertical}`}
                                    >
                                        {graph_widgets}
                                    </Grid>
                                </Grid>
                            );
                        } else {
                            response.push(
                                <Grid
                                    item
                                    key={'grid_item_graph_section_' + graph_section_index}
                                    xs={
                                        graph_width[graph_section_index]
                                            ? graph_width[graph_section_index]
                                            : 12 / parseInt(graph_sections.length)
                                    }
                                    className={`${classes.gridVerticalParentItemStyle}`}
                                >
                                    <Grid
                                        container
                                        justifyContent="center"
                                        spacing={0}
                                        className={`${classes.gridChildContainerVertical}`}
                                    >
                                        {graph_widgets}
                                    </Grid>
                                </Grid>
                            );
                        }
                    },
                    this
                );
            }
        } else {
            response = _.times(
                layout_option['no_graphs'] || 0,
                function (graph_index) {
                    const widget = graphWidgets?.[index];
                    gridItemClickProps = {
                        onClick: (event) => this.onClickSetting(event, widget)
                    };
                    index++;
                    const selected =
                        layoutSelected || (selectedWidgetId && widget?.id === selectedWidgetId);
                    const unsaved = unsavedWidgets ? unsavedWidgets[widget.id] : false;
                    return (
                        <Grid
                            item
                            key={'grid_item_graph_' + graph_index + '#' + widget?.id}
                            xs={
                                layout_option['no_graphs'] > 4 && layout_option['no_graphs'] != 5
                                    ? 4
                                    : layout_option['no_graphs'] === 4
                                    ? 6
                                    : layout_option['no_graphs'] === 5
                                    ? 12
                                    : 12 / layout_option['no_graphs']
                            }
                            className={`${
                                layout_option['no_graphs'] === 4
                                    ? classes.gridItemCustomTwoStyle
                                    : classes.gridItemCustomOneStyle
                            }`}
                            {...gridItemClickProps}
                        >
                            {this.renderLayoutItem(
                                selected,
                                layout_option,
                                0,
                                unsaved,
                                widthResponsive
                            )}
                        </Grid>
                    );
                },
                this
            );
        }

        return response;
    };

    onClickLayoutOption = (layout_option) => {
        this.props.onChange(layout_option);
    };

    render() {
        const {
            classes,
            layoutSelected,
            onClick,
            disabled,
            widthResponsive,
            selectedWidgetId,
            onSelectWidget,
            unsavedWidgets
        } = this.props;
        const { layout_option } =
            this.props.custom_layout && this.props.layout_option ? this.props : this.state;
        let graphWidgets = null;
        let labelWidget = null;
        if (this.props.widgets) {
            labelWidget = this.props.widgets.filter((el) => el.is_label);
            graphWidgets = this.props.widgets.filter((el) => !el.is_label);
        }
        return (
            <div
                className={clsx(
                    classes.layoutContainer,
                    onSelectWidget ? classes.widgetSelectable : null,
                    onClick ? classes.layoutSelectable : '',
                    layoutSelected && classes.layoutContainerSelected,
                    widthResponsive && classes.widthResponsive
                )}
                onClick={onClick}
                disabled={disabled}
            >
                <div className={classes.topParentDiv}>
                    <div className={classes.bottomParentDiv}>
                        <Grid
                            container
                            justifyContent="center"
                            spacing={0}
                            style={{ paddingBottom: layout_option.no_labels ? '0.2rem' : 0 }}
                        >
                            {_.times(
                                layout_option['no_labels'] || 0,
                                function (label_index) {
                                    const widget = labelWidget?.[label_index];
                                    const selected =
                                        layoutSelected ||
                                        (selectedWidgetId && widget?.id === selectedWidgetId);
                                    const unsaved = unsavedWidgets
                                        ? unsavedWidgets[widget.id]
                                        : false;
                                    return (
                                        <Grid
                                            key={'layout-label-' + label_index + '#' + widget?.id}
                                            item
                                            xs={
                                                layout_option['no_labels'] > 5 ||
                                                layout_option['no_labels'] < 2
                                                    ? 2
                                                    : true
                                            }
                                            className={clsx(
                                                classes.gridItem,
                                                classes.kpiContianers
                                            )}
                                        >
                                            <div
                                                className={clsx(
                                                    classes.labelCard,
                                                    selected ? classes.selectedCard : '',
                                                    widthResponsive && selected
                                                        ? classes.cardSelected
                                                        : ''
                                                )}
                                                onClick={(e) => {
                                                    this.onClickSetting(e, widget);
                                                }}
                                                title={unsaved ? 'Unsaved changes' : ''}
                                            >
                                                <div className={classes.cardBody}>
                                                    {unsaved ? (
                                                        <FiberManualRecordIcon
                                                            fontSize="small"
                                                            color="inherit"
                                                            className={classes.unsavedIndicator}
                                                        />
                                                    ) : null}
                                                </div>
                                            </div>
                                        </Grid>
                                    );
                                },
                                this
                            )}
                        </Grid>
                        <Grid
                            container
                            justifyContent="center"
                            spacing={0}
                            direction={layout_option['horizontal'] ? 'column' : 'row'}
                        >
                            {this.renderLayoutOption(
                                layoutSelected,
                                layout_option,
                                graphWidgets,
                                selectedWidgetId,
                                unsavedWidgets,
                                widthResponsive
                            )}
                        </Grid>
                    </div>
                </div>
            </div>
        );
    }
}

AppScreenLayout.propTypes = {
    classes: PropTypes.object.isRequired,
    layout_option: PropTypes.object.isRequired
};

export default withStyles((theme) => appScreenLayoutStyle(theme), { withTheme: true })(
    AppScreenLayout
);
