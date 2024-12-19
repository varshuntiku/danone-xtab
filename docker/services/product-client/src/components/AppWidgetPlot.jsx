import React from 'react';
import PropTypes from 'prop-types';
import { alpha, IconButton, Popover, withStyles, Dialog } from '@material-ui/core';
import appWidgetPlotStyle from 'assets/jss/appWidgetPlotStyle.jsx';
import createPlotlyComponent from 'react-plotly.js/factory';
import clsx from 'clsx';
import { withThemeContext } from '../themes/customThemeContext';
import MarkdownRenderer from './MarkdownRenderer';
import DynamicFormModal from './dynamic-form/inputFields/DynamicFormModal';
import CloseIcon from '@material-ui/icons/Close';
import CodxCircularLoader from './CodxCircularLoader';
import CustomTextField from './Forms/CustomTextField.jsx';
import { GLOBAL_FONT_FAMILY } from 'util/fontFamilyConfig';

import * as _ from 'underscore';

// const Plotly = window.Plotly;
// const Plot = createPlotlyComponent(Plotly);
const CodxFontFamily = GLOBAL_FONT_FAMILY;

class AppWidgetPlot extends React.Component {
    constructor(props) {
        super(props);

        let html_fontsize = window.document.getElementsByTagName('html')[0].style.fontSize;

        this.props = props;
        this.state = {
            treated_params: false,
            usable_fontSize: (html_fontsize.replace('%', '') * 24) / 100,
            loading: false,
            activeUpdateMenus: null,
            openPopover: false,
            anchorPosition: null,
            popoverData: null,
            clickAreaData: null,
            dropdownSelectedValue: this.props.params?.dropdownConfig?.selectedOptionValue,
            openDialog: false
        };
        window.addEventListener('resize', this.handleResize);
    }

    handleResize = () => {
        let self = this;
        setTimeout(() => {
            let html_fontsize = window.document.getElementsByTagName('html')[0].style.fontSize;
            self.setFontSize((html_fontsize.replace('%', '') * 24) / 100);
        }, 500);
    };

    setFontSize = (fontSize) => {
        this.setState({
            usable_fontSize: fontSize
        });

        this.refreshPlot();
    };

    refreshPlot = () => {
        const treated_params = this.setupPlot();
        let activeUpdateMenus = this.state.activeUpdateMenus;
        if (!treated_params.frames && treated_params.layout?.updatemenus?.length) {
            activeUpdateMenus = treated_params.layout.updatemenus?.map((el) => el.active);
        }
        this.setState({
            treated_params: treated_params,
            activeUpdateMenus: activeUpdateMenus
        });
    };

    componentDidMount() {
        this.refreshPlot();
    }

    componentDidUpdate(prevProps) {
        const { params, themeContext } = this.props;

        if (this.shouldRefreshPlot()) {
            this.refreshPlot();
        } else if (JSON.stringify(prevProps.params) !== JSON.stringify(params)) {
            this.refreshPlot();
        } else if (prevProps?.themeContext?.themeName !== themeContext?.themeName) {
            this.refreshPlot();
        } else if (prevProps?.themeContext?.themeMode !== themeContext?.themeMode) {
            this.refreshPlot();
        } else if (prevProps?.themeContext?.themeLoadCount !== themeContext?.themeLoadCount) {
            this.refreshPlot();
        }

        // setTimeout(() => {
        //     if(!(params?.layout?.barmode == 'stack')){
        //     const legendGroups = document.getElementsByClassName('groups');
        //     let legendGroupsArray = [...legendGroups];
        //     legendGroupsArray.map((val) => {
        //         val.style.transform = 'translate(-1.45rem,0)';
        //     });
        //     const legendTexts = document.getElementsByClassName('legendtext');
        //     let legendTextsArray = [...legendTexts];
        //     legendTextsArray.map((val) => {
        //         // val.style.fontSize = '1.6rem';
        //         val.style.letterSpacing = '0.03rem';
        //         val.style.lineHeight = 'normal';
        //     });
        // }
        // }, [0]);
    }

    shouldRefreshPlot = () => {
        const { params } = this.props;
        if (
            params?.layout?.updatemenus?.length &&
            this.state?.treated_params?.layout?.updatemenus?.length
        ) {
            return _.some(params.layout.updatemenus, (item, index) => {
                return item?.active !== this.state.activeUpdateMenus?.[index];
                // this.state.treated_params.layout.updatemenus[index]?.active
                // &&  'active' in this.state.treated_params.layout.updatemenus[index];
                //  && item?.type === this.state.treated_params.layout.updatemenus[index]?.type
            });
        }

        return false;
    };
    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = () => {
            return;
        };
    }

    transformTickText = (val) => {
        return val?.padEnd(6, ' ');
    };

    setupAxisStyling = (axis_details) => {
        const { CodxTextColor } = this.props.themeContext.plotTheme;
        const { /*size_nooverride, */ color_nooverride } = this.props;

        if (axis_details) {
            axis_details.tickfont = {
                family: CodxFontFamily,
                color: CodxTextColor,
                size: this.state.usable_fontSize
            };

            if (axis_details.title) {
                axis_details.title.font = {
                    family: CodxFontFamily,
                    color: CodxTextColor,
                    size: this.state.usable_fontSize
                };

                axis_details.title.standoff = axis_details.ticktext ? 20 : 16;
            }
            if (axis_details.ticktext) {
                const transformedTickText = axis_details.ticktext.map(this.transformTickText);
                axis_details.ticktext = transformedTickText;
            }
            axis_details.automargin = true;

            if (!color_nooverride) {
                if (axis_details.line) {
                    axis_details.line.color = CodxTextColor;
                } else {
                    axis_details.line = {
                        color: CodxTextColor
                    };
                }

                // axis_details.gridcolor = CodxTextColor;
                // axis_details.gridwidth = 1;
                axis_details.zerolinecolor = CodxTextColor;
            }

            return axis_details;
        } else {
            return {
                tickfont: {
                    family: CodxFontFamily,
                    color: CodxTextColor,
                    size: this.state.usable_fontSize
                },
                title: {
                    font: {
                        family: CodxFontFamily,
                        color: CodxTextColor,
                        size: this.state.usable_fontSize
                    },
                    standoff: 30
                },
                automargin: true,
                line: {
                    color: CodxTextColor
                },
                zerolinecolor: CodxTextColor
            };
        }
    };

    setupLegend = (params) => {
        const { CodxTextColor, CodxBkgdLightColor } = this.props.themeContext.plotTheme;
        let is_scatter = false;
        let is_pie = false;
        let is_yaxis2 = false;
        let is_line = false;
        let is_legend_vertical = false;
        _.each(params.data, function (data_item) {
            switch (data_item.type) {
                case 'scatter':
                    is_scatter = true;
                    break;
                case 'bar':
                    break;
                case 'pie':
                    is_pie = true;
                    is_legend_vertical = data_item.legend == 'v' ? true : false;
                    break;
                case 'line':
                    is_line = true;
                    break;
                default:
                    break;
            }
            if (data_item.yaxis === 'y2') {
                is_yaxis2 = true;
            }
        });

        const { graph_height, graph_width } = this.props;
        if (graph_height === 'half') {
            if (graph_width == 'full') {
                params.layout.legend =
                    is_pie && is_legend_vertical
                        ? {
                              orientation: 'v',
                              y: params?.layout?.legend?.y ? params?.layout?.legend?.y : 0.5,
                              x: params?.layout?.legend?.x ? params?.layout?.legend?.x : 0.85,
                              font: {
                                  family: CodxFontFamily,
                                  color: CodxTextColor,
                                  size: this.state.usable_fontSize
                              },
                              bgColor: CodxBkgdLightColor
                          }
                        : {
                              orientation: params?.layout?.legend?.orientation || 'h',
                              y: params?.layout?.legend?.y
                                  ? params?.layout?.legend?.y
                                  : window?.innerWidth > 1600
                                  ? -0.34
                                  : -0.44,
                              x: params?.layout?.legend?.x
                                  ? params?.layout?.legend?.x
                                  : params.layout.yaxis?.ticktext
                                  ? is_line
                                      ? -0.02
                                      : -0.027
                                  : 0.49,
                              xanchor: 'center',
                              font: {
                                  family: CodxFontFamily,
                                  color: CodxTextColor,
                                  size: this.state.usable_fontSize
                              },
                              bgColor: CodxBkgdLightColor
                          };
            } else {
                params.layout.legend =
                    is_pie && is_legend_vertical
                        ? {
                              orientation: 'v',
                              y: params?.layout?.legend?.y ? params?.layout?.legend?.y : 0.5,
                              x: params?.layout?.legend?.x ? params?.layout?.legend?.x : 1,
                              font: {
                                  family: CodxFontFamily,
                                  color: CodxTextColor,
                                  size: this.state.usable_fontSize
                              },
                              bgColor: CodxBkgdLightColor
                          }
                        : {
                              orientation: params?.layout?.legend?.orientation || 'h',
                              y: params?.layout?.legend?.y
                                  ? params?.layout?.legend?.y
                                  : window?.innerWidth > 1600
                                  ? -0.34
                                  : -0.44,
                              x: params?.layout?.legend?.x
                                  ? params?.layout?.legend?.x
                                  : params.layout.yaxis?.ticktext
                                  ? is_line
                                      ? -0.052
                                      : -0.062
                                  : 0.49,
                              xanchor: 'center',
                              font: {
                                  family: CodxFontFamily,
                                  color: CodxTextColor,
                                  size: this.state.usable_fontSize
                              },
                              bgColor: CodxBkgdLightColor
                          };
            }
            if (is_yaxis2) {
                if (!params.layout.legend) {
                    params.layout.legend = {
                        orientation: params?.layout?.legend?.orientation || 'h',
                        yanchor: 'top',
                        xanchor: 'center',
                        y: params?.layout?.legend?.y ? params?.layout?.legend?.y : 1.25,
                        x: params?.layout?.legend?.x ? params?.layout?.legend?.x : 0.5,
                        font: {
                            family: CodxFontFamily,
                            color: CodxTextColor,
                            size: this.state.usable_fontSize
                        }
                    };
                }
                params.layout.margin = params?.layout?.margin
                    ? params?.layout?.margin
                    : {
                          t: 20,
                          r: 0,
                          b: 0,
                          l: 0
                      };
            } else if (is_scatter && is_pie) {
                if (!params.layout.legend) {
                    params.layout.legend = {
                        orientation: params?.layout?.legend?.orientation || 'h',
                        yanchor: 'top',
                        xanchor: 'center',
                        y: params?.layout?.legend?.y ? params?.layout?.legend?.y : -0.25,
                        x: params?.layout?.legend?.x ? params?.layout?.legend?.x : 0.5,
                        font: {
                            family: CodxFontFamily,
                            color: CodxTextColor,
                            size: this.state.usable_fontSize
                        },
                        bgColor: CodxBkgdLightColor
                    };
                }
                params.layout.margin = params?.layout?.margin
                    ? params?.layout?.margin
                    : {
                          t: 20,
                          r: 0,
                          b: 0,
                          l: 0
                      };
            } else {
                if (!params.layout.legend) {
                    params.layout.legend = {
                        orientation: 'v',
                        yanchor: 'center',
                        xanchor: 'left',
                        y: params?.layout?.legend?.y ? params?.layout?.legend?.y : 0.5,
                        x: params?.layout?.legend?.x ? params?.layout?.legend?.x : 1,
                        font: {
                            family: CodxFontFamily,
                            color: CodxTextColor,
                            size: this.state.usable_fontSize
                        }
                    };
                }
            }
        } else {
            if (graph_width == 'full') {
                if (!params.layout.legend) {
                    params.layout.legend = {
                        orientation: params?.layout?.legend?.orientation || 'h',
                        yanchor: 'top',
                        xanchor: 'left',
                        y: params?.layout?.legend?.y ? params?.layout?.legend?.y : -0.09,
                        x: params?.layout?.legend?.x
                            ? params?.layout?.legend?.x
                            : is_scatter || is_line
                            ? -0.02
                            : -0.027,
                        font: {
                            family: CodxFontFamily,
                            color: CodxTextColor,
                            size: this.state.usable_fontSize
                        },
                        bgColor: CodxBkgdLightColor
                    };
                }
            } else {
                if (!params.layout.legend) {
                    params.layout.legend = {
                        orientation: params?.layout?.legend?.orientation || 'h',
                        yanchor: 'top',
                        xanchor: 'left',
                        y: params?.layout?.legend?.y ? params?.layout?.legend?.y : -0.09,
                        x: params?.layout?.legend?.x
                            ? params?.layout?.legend?.x
                            : is_line
                            ? -0.05
                            : -0.06,
                        font: {
                            family: CodxFontFamily,
                            color: CodxTextColor,
                            size: this.state.usable_fontSize
                        },
                        bgColor: CodxBkgdLightColor
                    };
                }
            }
            if (is_yaxis2) {
                params.layout.margin = params?.layout?.margin
                    ? params?.layout?.margin
                    : {
                          t: 20,
                          r: 0,
                          b: 0,
                          l: 0
                      };
            }
        }

        return params;
    };

    setupMargin = () => {
        // Check domains if setup for various graphs
        // let visible_min_x_domain = _.min(params.data, function(data_item) {
        //   if (data_item.visible && data_item.domain && data_item.domain.x) {
        //     return data_item.domain.x[0]
        //   } else {
        //     return 0;
        //   }
        // });
        // let visible_min_y_domain = _.min(params.data, function(data_item) {
        //   if (data_item.visible && data_item.domain && data_item.domain.y) {
        //     return data_item.domain.y[0]
        //   } else {
        //     return 0;
        //   }
        // });
        // let visible_max_x_domain = _.max(params.data, function(data_item) {
        //   if (data_item.visible && data_item.domain && data_item.domain.x) {
        //     return data_item.domain.x[1]
        //   } else {
        //     return 0;
        //   }
        // });
        // let visible_max_y_domain = _.max(params.data, function(data_item) {
        //   if (data_item.visible && data_item.domain && data_item.domain.y) {
        //     return data_item.domain.y[1]
        //   } else {
        //     return 0;
        //   }
        // });
    };

    setupPlot = (plotData = null) => {
        const { CodxBkgdColor, CodxTextColor, CodxBkgdLightColor, CodxContrastColor } =
            this.props.themeContext.plotTheme;
        const { size_nooverride, color_nooverride /*graph_height*/, notFromAppWidgetGraph } =
            this.props;

        let params = JSON.parse(JSON.stringify(plotData || this.props.params));
        // let params = this.props.params;

        if (!params) {
            return null;
        }

        if (!size_nooverride) {
            //Size
            params.layout.autosize = true;
            delete params.layout.height;
            delete params.layout.width;
        }

        //Font
        params.layout.font = {
            family: CodxFontFamily,
            color: CodxTextColor,
            size: this.state.usable_fontSize
        };

        params.layout.hoverlabel = {
            font: {
                family: CodxFontFamily,
                // color: CodxTextColor,
                size: this.state.usable_fontSize
            }
        };

        //Margin
        this.setupMargin(params);
        // delete params.layout.margin;
        let defaultMargin = {
            t: 10,
            r: 1,
            l: 1,
            b: 30
        };
        if (params?.data && params?.data[0]?.type === 'pie') {
            defaultMargin = {
                t: 0,
                r: 0,
                l: 0,
                b: 0
            };
        }
        params.layout.margin = params?.layout?.margin ? params?.layout?.margin : defaultMargin;

        let xAxisOffset = 0;
        let xAxis = 'xaxis';
        while (params.layout[xAxis]) {
            params.layout[xAxis] = this.setupAxisStyling(params.layout[xAxis]);
            xAxisOffset += xAxisOffset ? 1 : 2;
            xAxis = 'xaxis' + xAxisOffset;
        }
        let yAxisOffset = 0;
        let yAxis = 'yaxis';
        while (params.layout[yAxis]) {
            params.layout[yAxis] = this.setupAxisStyling(params.layout[yAxis]);
            yAxisOffset += yAxisOffset ? 1 : 2;
            yAxis = 'yaxis' + yAxisOffset;
        }
        // params.layout.xaxis = this.setupAxisStyling(params.layout.xaxis);
        // params.layout.yaxis = this.setupAxisStyling(params.layout.yaxis);
        // params.layout.yaxis2 = this.setupAxisStyling(params.layout.yaxis2);

        if (params.layout.polar) {
            params.layout.polar.bgcolor = CodxBkgdColor;
            params.layout.polar.angularaxis = this.setupAxisStyling(
                params.layout.polar.angularaxis
            );
            params.layout.polar.radialaxis = this.setupAxisStyling(params.layout.polar.radialaxis);
        }

        // range selector
        if (params?.layout?.xaxis?.rangeselector?.buttons) {
            params.layout.xaxis.rangeselector.bgcolor = CodxBkgdColor;
            params.layout.xaxis.rangeselector.bordercolor = alpha(CodxContrastColor, 0.4);
            params.layout.xaxis.rangeselector.borderwidth = 1;
            params.layout.xaxis.rangeselector.activecolor = CodxBkgdLightColor;
            params.layout.xaxis.rangeselector.font = {
                color: CodxContrastColor,
                family: CodxFontFamily,
                size: this.state.usable_fontSize
            };
        }

        //Legend
        params = this.setupLegend(params);

        //Padding
        delete params.layout.padding;
        // params.layout.padding = {
        //   t: 0,
        //   r: 0,
        //   l: 0,
        //   b: 0
        // };

        //Title
        // if (params.data.length > 1 && _.filter(params.data, function(data_item) { return data_item.domain; }).length > 1) {
        //   params.layout.margin = {
        //     t: 0,
        //     r: 0,
        //     l: 0,
        //     b: 0
        //   };
        // }
        delete params.layout.title;

        //Background
        params.layout.paper_bgcolor = CodxBkgdColor;
        params.layout.plot_bgcolor = CodxBkgdColor;
        params.layout.geo = {
            ...params.layout.geo,
            bgcolor: CodxBkgdColor,
            subunitcolor: CodxTextColor
        };

        //General
        if (!color_nooverride) {
            params.layout.shapes = _.map(params.layout.shapes, function (shape_item) {
                if (
                    shape_item.type === 'line' &&
                    shape_item.line &&
                    shape_item.line.color &&
                    shape_item.line.color.toLowerCase() === 'black'
                ) {
                    shape_item.line.color = CodxTextColor;
                } else if (
                    shape_item.type === 'line' &&
                    shape_item.line &&
                    !shape_item.line.color
                ) {
                    shape_item.line.color = CodxTextColor;
                }

                return shape_item;
            });

            params.layout.annotations = _.map(
                params.layout.annotations,
                function (annotation) {
                    if (
                        annotation.font &&
                        annotation.font.color &&
                        annotation.font.color.toLowerCase() === 'black'
                    ) {
                        if (params.data.length > 0 && params.data[0].mode !== 'text') {
                            annotation.font.color = CodxTextColor;
                        }
                    }

                    if (annotation.font) {
                        annotation.font.size = this.state.usable_fontSize;
                    }

                    if (annotation.arrowcolor && annotation.arrowcolor.toLowerCase() === 'black') {
                        if (params.data.length > 0 && params.data[0].mode !== 'text') {
                            annotation.arrowcolor = CodxTextColor;
                        }
                    }

                    if (annotation.bgcolor) {
                        annotation.bgcolor = CodxBkgdLightColor;
                    }

                    return annotation;
                },
                this
            );
        }

        delete params.layout.template;

        // this.setupPercentDonutCharts(params);

        if (!color_nooverride) {
            this.setupLineAreaCharts(params);
            this.setupGeoCharts(params);
            this.setupSunburstCharts(params);
            this.setupHeatmapCharts(params);
            this.setupTreemapCharts(params);
            this.setupWaterfallCharts(params);
            this.setupPercentDonutCharts(params);
            // this.setupTableCharts(params);
        }

        if (params.data[0]?.type == 'bar' && params.layout?.addPadding) {
            const allYValues = params.data.map((trace) => trace.y);
            const flattenedYValues = allYValues.flat();
            const maxYValue = Math.max(...flattenedYValues);
            const padding = maxYValue * 0.1;
            params.layout.yaxis.range = [params.layout.yaxis.range[0], maxYValue + padding];
        }

        //setting up titles and their placements for dropdowns using annotations
        if (params.layout?.updatemenus && notFromAppWidgetGraph) {
            try {
                params.layout?.updatemenus?.forEach((menu) => {
                    const yValue = menu?.y;
                    const leftPosition = this.props?.titlePosition?.trim() === 'left';
                    const topPosition = this.props?.titlePosition?.trim() === 'top';
                    const yOffset = leftPosition ? yValue - 0.1 : topPosition ? yValue + 0.05 : 0;

                    if ((leftPosition || topPosition) && yValue > 0) {
                        const titleAnnotation = {
                            x: leftPosition ? menu?.x - 0.01 : menu?.x,
                            y: yOffset ? yOffset : 0,
                            xref: 'paper',
                            yref: 'paper',
                            xanchor: leftPosition ? 'right' : topPosition ? 'left' : undefined,
                            text: menu?.name ? menu?.name : '',
                            showarrow: false,
                            font: {
                                family: 'Graphik, sans-serif',
                                size: 12,
                                color: 'inherit'
                            },
                            align: 'center'
                        };
                        params.layout.annotations = params.layout?.annotations || [];
                        params.layout?.annotations.push(titleAnnotation);
                    }
                });
            } catch (err) {
                // console.error(err);
            }
        }
        return params;
    };

    // setupTableCharts = (params) => {
    //   params.data = _.map(params.data, function(data_item, data_index) {
    //     if (data_item.cells) {
    //       if (data_item.cells.font) {
    //         data_item.cells.font.size = this.state.usable_fontSize;
    //       } else {
    //         data_item.cells.font = {
    //           size: this.state.usable_fontSize
    //         };
    //       }
    //     }

    //     if (data_item.header) {
    //       if (data_item.header.font) {
    //         data_item.header.font.size = this.state.usable_fontSize;
    //       } else {
    //         data_item.header.font = {
    //           size: this.state.usable_fontSize
    //         };
    //       }
    //     }
    //     return data_item;
    //   }, this);
    // }

    setupPercentDonutCharts = (params) => {
        const { chartDefaultColors, CodxBkgdColor } = this.props.themeContext.plotTheme;
        params.data = _.map(params.data, function (data_item, data_index) {
            if (data_item.type === 'pie' && data_item.hole && data_item.direction) {
                if (data_item.marker) {
                    if (data_item.marker.colors) {
                        data_item.marker.colors = _.map(
                            data_item.marker.colors,
                            function (color_item) {
                                if (
                                    color_item === '#fff' ||
                                    color_item === '#ffffff' ||
                                    color_item === 'white'
                                ) {
                                    return CodxBkgdColor;
                                } else if (!data_item.domain) {
                                    return chartDefaultColors[
                                        'range-' +
                                            (params.data.length > 10 ? 10 : params.data.length)
                                    ][data_index];
                                } else {
                                    return color_item;
                                }
                            }
                        );
                    }

                    data_item.marker.line = {
                        color: CodxBkgdColor,
                        width: 1
                    };
                }
            } else if (data_item.type === 'pie') {
                data_item?.hole == undefined ? (data_item.hole = 0.78) : null;
                if (data_item.labels) {
                    params.layout.colorway =
                        chartDefaultColors[
                            'range-' + (data_item.labels.length > 10 ? 10 : data_item.labels.length)
                        ];
                }

                if (data_item.marker) {
                    data_item.marker.line = {
                        color: CodxBkgdColor,
                        width: 1
                    };

                    if (data_item.marker.colors) {
                        data_item.marker.colors = _.map(
                            data_item.marker.colors,
                            function (color_item, color_item_index) {
                                if (
                                    color_item === '#fff' ||
                                    color_item === '#ffffff' ||
                                    color_item === 'white'
                                ) {
                                    return CodxBkgdColor;
                                } else if (!data_item.domain) {
                                    return chartDefaultColors[
                                        'range-' +
                                            (data_item.marker.colors.length > 10
                                                ? 10
                                                : data_item.marker.colors.length)
                                    ][color_item_index];
                                } else {
                                    return color_item;
                                }
                            }
                        );
                    }
                } else {
                    data_item.marker = {
                        line: {
                            color: CodxBkgdColor,
                            width: 1
                        }
                    };
                }
            }

            return data_item;
        });
    };

    setupLineAreaCharts = (params) => {
        const { chartDefaultColors } = this.props.themeContext.plotTheme;
        let is_scatter = true;
        params.data = _.map(params.data, function (data_item) {
            if (
                data_item.type === 'scatter' ||
                data_item.type === 'bar' ||
                data_item.type === 'scatterpolar'
            ) {
                is_scatter = is_scatter && true;
            } else {
                is_scatter = false;
            }

            if (data_item.line && data_item.line.color && is_scatter) {
                delete data_item.line.color;
            }

            if (data_item.marker && data_item.marker.color && is_scatter) {
                delete data_item.marker.color;
                delete data_item.marker.line;
            }

            return data_item;
        });

        /* Note: Commenting out for now as it was not allowing chart colors to be applied to bar chart
                 Let's remove it after some time in future if everything keeps on working fine */
        // if (is_scatter) {
        params.layout.colorway =
            chartDefaultColors['range-' + (params.data.length > 10 ? 10 : params.data.length)];
        // }
    };

    setupTreemapCharts = (params) => {
        const { chartDefaultColors } = this.props.themeContext.plotTheme;
        _.each(params.data, function (data_item) {
            if (data_item.type === 'treemap') {
                params.layout.colorway = chartDefaultColors['range-10'];
            }
        });
    };

    setupWaterfallCharts = (params) => {
        params.data = _.map(params.data, function (data_item) {
            if (data_item.type === 'waterfall') {
                data_item['measure'][0] = 'absolute';
                if (data_item['connector']) {
                    if (data_item['connector']['line']) {
                        data_item['connector']['line']['color'] = '#00A8BD';
                        data_item['connector']['line']['width'] = '1';
                    } else {
                        data_item['connector']['line'] = {
                            color: '#00A8BD',
                            width: 1
                        };
                    }
                } else {
                    data_item['connector'] = {
                        line: {
                            color: '#00A8BD',
                            width: 1
                        }
                    };
                }

                data_item['increasing'] = {
                    marker: {
                        color: '#087B53'
                    }
                };
                data_item['decreasing'] = {
                    marker: {
                        color: '#E00E53'
                    }
                };
                data_item['totals'] = {
                    marker: {
                        color: '#A7C6EE'
                    }
                };
            }

            return data_item;
        });
    };

    setupGeoCharts = (params) => {
        const { chartDefaultColors, chartMapColors, CodxTextColor } =
            this.props.themeContext.plotTheme;
        let geo_traces = _.filter(params.data, function (data_item) {
            return data_item.type === 'choropleth' || data_item.type === 'scattergeo';
        });
        let multiple_geo = geo_traces && geo_traces.length > 1 ? true : false;
        if (!params.layout?.legend?.orientation) {
            params.layout.autosize = true;
            params.layout.margin = {
                t: 0,
                b: 0,
                l: 0,
                r: 0
            };
            // params.layout.template.layout.xaxis.automargin = false
            // params.layout.template.layout.xaxis.automargin = false
            params.layout.legend = {
                orientation: 'h',
                yanchor: 'top',
                xanchor: 'left',
                y: -0.09,
                x: 0,
                font: {
                    family: CodxFontFamily,
                    color: CodxTextColor,
                    size: this.state.usable_fontSize
                }
            };
        }
        if (!multiple_geo && geo_traces.length === 1) {
            if (params.layout.coloraxis) {
                params.layout.coloraxis.colorscale = chartMapColors;
            }
        } else {
            params.data = _.map(params.data, function (data_item, data_index) {
                let default_colors =
                    chartDefaultColors[
                        'range-' + (geo_traces.length > 10 ? 10 : geo_traces.length)
                    ];
                if (data_item.type === 'choropleth') {
                    data_item.colorscale = [
                        [0, default_colors[data_index]],
                        [1, default_colors[data_index]]
                    ];
                    if (data_item.marker) {
                        data_item.marker.color = default_colors[data_index];
                        data_item.marker.line.color = CodxTextColor;
                    } else {
                        data_item.marker = {
                            color: default_colors[data_index],
                            line: {
                                color:
                                    localStorage.getItem('codx-products-theme') === 'dark'
                                        ? '#0E0617'
                                        : '#ffffff',
                                width: 0.5
                            }
                        };
                    }
                } else if (data_item.type === 'scattergeo') {
                    if (data_item.marker) {
                        if (default_colors) {
                            data_item.marker.color = default_colors[data_index];
                        }

                        if (data_item.marker.line) {
                            data_item.marker.line.color = CodxTextColor;
                        } else {
                            data_item.marker.line = {
                                color: CodxTextColor
                            };
                        }
                    } else {
                        data_item.marker = {
                            color: default_colors[data_index]
                            // line: {
                            //   color: CodxTextColor,
                            //   width: 0.5
                            // }
                        };
                    }
                }

                return data_item;
            });
        }
    };

    setupSunburstCharts = (params) => {
        const { chartDefaultColors } = this.props.themeContext.plotTheme;
        // Commenting out since it's unused, uncomment if required
        // let sunburst_traces = _.filter(params.data, function (data_item) {
        //     return data_item.type === 'sunburst';
        // });

        // Commenting out since trace_count is redundant, please uncomment if required
        // if (sunburst_traces.length > 0) {
        //     let trace_count = _.filter(params.data[0]['ids'], function (id_item) {
        //         return id_item.split('/').length === 2;
        //     }).length;
        // }
        params.layout.colorway = chartDefaultColors['range-10'];
    };

    setupHeatmapCharts = (params) => {
        const { chartMapColors } = this.props.themeContext.plotTheme;
        let heatmap_traces = _.filter(params.data, function (data_item) {
            return data_item.type === 'heatmap';
        });

        if (heatmap_traces.length > 0) {
            if (params.layout.coloraxis) {
                params.layout.coloraxis.colorscale = chartMapColors;
            } else {
                params.layout.coloraxis = {
                    colorscale: chartMapColors
                };
            }
        }
    };

    onChange = (value) => {
        this.props.onDropdownAction({ actionType: value });
    };

    renderPlot = (isDialog = false) => {
        const { classes, className } = this.props;
        const { loading } = this.state;
        const view_detail =
            this.state.popoverData?.view_detail || this.state.treated_params?.view_detail;
        const view_detail_variant =
            this.state.popoverData?.view_detail_variant ||
            this.state.treated_params?.view_detail_variant;
        const view_detail_text =
            typeof view_detail == 'string' ? view_detail || 'View Details' : 'View Details';
        const layout = { ...this.state.treated_params.layout };

        if (isDialog) {
            layout.autosize = true;
            delete layout.height;
            delete layout.width;
        }

        const getFontSize = () => {
            switch (true) {
                case screen.availWidth >= 1900:
                    return 16;
                case screen.availWidth <= 1300:
                    return 10;
                default:
                    return 12;
            }
        };

        const Plot = createPlotlyComponent(window.Plotly);
        layout.responsive = true;
        // commenting this code, as this is causing differences in text size for annotaion in graph
        // layout?.annotations != undefined &&
        // layout?.annotations?.length != 0 &&
        // layout.annotations[0]?.font
        //     ? (layout.annotations[0].font.size = 14)
        //     : null;
        // layout?.annotations != undefined &&
        // layout?.annotations?.length != 0 &&
        // layout.annotations[1]?.font
        //     ? (layout.annotations[1].font.size = 14)
        //     : null;
        layout?.font ? (layout.font.family = 'Graphik') : null;
        layout?.margin ? (layout.margin.t = 25) : null;
        layout?.margin ? (layout.margin.b = layout.margin?.b || 0) : null;
        layout?.margin ? (layout.margin.l = 0) : null;
        layout?.margin
            ? (layout.margin.r = this.state.treated_params.data[0]?.legend == 'v' ? 150 : 1)
            : null;
        layout?.marginOverride && layout?.margin ? (layout.margin = layout.marginOverride) : null;
        layout?.legend ? (layout.legend['tracegroupgap'] = 10) : null;
        layout?.legend?.font ? (layout.legend['font']['size'] = getFontSize()) : null;
        layout?.x ? (layout.x = -1) : null;
        return this.state.treated_params ? (
            <React.Fragment>
                <React.Fragment>
                    {loading ? <CodxCircularLoader center size="45" /> : null}
                    {loading ? <div className={classes.backdrop}></div> : null}
                    <Plot
                        data={this.state.treated_params.data}
                        layout={layout}
                        frames={this.state.treated_params.frames}
                        config={{ displayModeBar: false, responsive: true }}
                        className={clsx(classes.graphPlot, className)}
                        useResizeHandler={true}
                        onClick={this.handleClick}
                        onDoubleClick={this.handleDoubleClick}
                    />
                </React.Fragment>
                <Popover
                    classes={{ paper: classes.popoverPaper }}
                    open={this.state.openPopover}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center'
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center'
                    }}
                    anchorReference="anchorPosition"
                    anchorPosition={this.state.anchorPosition}
                    onClose={this.handlePopoverClose}
                >
                    <span className={classes.arrow}></span>
                    <IconButton
                        aria-label="close"
                        size="small"
                        title="close"
                        className={classes.closeButton}
                        onClick={this.handlePopoverClose}
                    >
                        <CloseIcon fontSize="large" />
                    </IconButton>
                    {this.state.loadingPopover ? (
                        <CodxCircularLoader size={50} center />
                    ) : (
                        <>
                            {this.state.popoverData?.content ? (
                                <MarkdownRenderer markdownContent={this.state.popoverData.content}>
                                    {this.state.popoverData}
                                </MarkdownRenderer>
                            ) : null}
                            {view_detail ? (
                                <DynamicFormModal
                                    params={{
                                        fetch_on_open: true,
                                        trigger_button: {
                                            text: view_detail_text
                                        },
                                        form_config: { fields: [] },
                                        variant: view_detail_variant
                                    }}
                                    onFetchFormData={this.handleFetchFormData}
                                />
                            ) : null}
                        </>
                    )}
                </Popover>
                {this.state.treated_params?.dropdownConfig?.options ? (
                    <div className={classes.dropdownWrapper}>
                        <CustomTextField
                            field_info={{
                                label: this.state.treated_params.dropdownConfig.dropdownLabel,
                                value: this.state.dropdownSelectedValue,
                                is_select: true,
                                fullWidth: true,
                                options: this.state.treated_params.dropdownConfig.options,
                                onChange: this.onChange
                            }}
                        />
                    </div>
                ) : null}
            </React.Fragment>
        ) : (
            ''
        );
    };
    handlePopoverClose = () => {
        this.setState({
            openPopover: false
        });
    };
    getGraphData = (data) => {
        const obj = {};
        for (let key in data) {
            if (data[key] != '' && data[key] != undefined) {
                obj[key] = data[key];
            }
        }
        return obj;
    };
    handleClick = async (e) => {
        const { data, fullData, ...selectedValue } = e.points[0];
        const { legendgroup, name, type } = data ? data : {};
        const { x, y, label, value, v } = selectedValue;
        let event_payload = this.getGraphData({ legendgroup, name, type, x, y, label, value, v });
        let keyExist =
            Object.prototype.hasOwnProperty.call(event_payload, 'label') ||
            Object.prototype.hasOwnProperty.call(event_payload, 'value') ||
            (Object.prototype.hasOwnProperty.call(event_payload, 'x') &&
                Object.prototype.hasOwnProperty.call(event_payload, 'y'));
        if (Object.keys(event_payload).length <= 3 && !keyExist) {
            event_payload = selectedValue;
        }
        if (type === undefined && fullData.type === 'sankey') {
            let { value, width, y0, y1 } = selectedValue;
            event_payload = this.getGraphData({ value, width, y0, y1 });
        }
        this.props.onPlotClick && this.props.onPlotClick(event_payload);
        if (e.event.detail === 2) {
            // detecting double click
            return;
        }
        if (this.props.onDrilledData && this.state.treated_params.drill_down) {
            try {
                this.setState({
                    loading: true
                });
                const data = await this.props.onDrilledData({
                    ...e,
                    drill_down: this.state.treated_params.drill_down
                });
                this.setState({
                    treated_params: this.setupPlot(data)
                });
            } catch (err) {
                // console.error(err);
            } finally {
                this.setState({
                    loading: false
                });
            }
        }
        if (this.state.treated_params.view_popover) {
            const clickAreaData = e;
            const customdata = e.points?.[0]?.customdata;
            if (customdata?.popover_template) {
                this.setState({
                    clickAreaData: clickAreaData,
                    openPopover: true,
                    anchorPosition: {
                        left: e.event.clientX,
                        top: e.event.clientY + 5
                    },
                    popoverData: customdata?.popover_template
                });
            } else if (this.props.onFetchPopoverData) {
                this.setState({
                    clickAreaData: clickAreaData,
                    openPopover: true,
                    anchorPosition: {
                        left: e.event.clientX,
                        top: e.event.clientY + 5
                    },
                    loadingPopover: true
                });
                try {
                    const data = await this.props.onFetchPopoverData({
                        ...clickAreaData,
                        view_popover: this.state.treated_params.view_popover
                    });
                    this.setState({
                        popoverData: data
                    });
                } catch (err) {
                    // console.error(err);
                } finally {
                    this.setState({
                        loadingPopover: false
                    });
                }
            }
        }
    };

    handleDoubleClick = () => {
        if (this.props.params.drill_down) {
            this.refreshPlot();
        }
        this.props.onPlotClick && this.props.onPlotClick(null);
    };

    handleFetchFormData = async () => {
        if (this.props.onFetchDetailData) {
            const view_detail =
                this.state.popoverData?.view_detail || this.state.treated_params?.view_detail;
            try {
                this.setState({
                    openDetailPopup: true
                });
                const data = await this.props.onFetchDetailData({
                    ...this.state.clickAreaData,
                    view_detail: view_detail
                });
                return data;
            } catch (err) {
                // console.error(err);
            }
        }
    };

    dialogClickHandler = () => {
        this.setState({
            openDialog: true
        });
    };

    dialogCloseHandler = (e) => {
        e.stopPropagation();
        this.setState({
            openDialog: false
        });
    };

    render() {
        if (this.props.showDialog) {
            return (
                <div onClick={this.dialogClickHandler}>
                    {this.renderPlot()}
                    <Dialog
                        fullWidth={true}
                        maxWidth={'md'}
                        open={this.state.openDialog}
                        aria-labelledby="plotly-dialog"
                    >
                        {this.renderPlot(true)}
                        <IconButton
                            className={this.props.classes.dialogClose}
                            aria-label="close"
                            onClick={this.dialogCloseHandler}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Dialog>
                </div>
            );
        }
        return this.renderPlot();
    }
}

AppWidgetPlot.propTypes = {
    classes: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    graph_height: PropTypes.string.isRequired,
    graph_width: PropTypes.string.isRequired
    // size_nooverride: PropTypes.bool.isRequired,
    // color_nooverride: PropTypes.bool.isRequired,
    // trace_config: PropTypes.array.isRequired
};

export default withStyles(
    (theme) => ({
        ...appWidgetPlotStyle(theme)
    }),
    { useTheme: true }
)(withThemeContext(AppWidgetPlot));
