export class PlotlyUtils {
    props: any;
    state: any;

    constructor(theme) {
        const html_fontsize: string = window.document.getElementsByTagName('html')[0].style.fontSize;
        const chartColors= theme.chartColors;

        const defaultProps = {
            themeContext: {
                    chartDefaultColors: chartColors.reduce((acc: any, color, i) => {
                        acc['range-' + (i + 1)] = chartColors.slice(0, i + 1);
                        return acc;
                    }, {}),
                    chartMapColors: [
                        [0, chartColors[0]],
                        [1, chartColors[2]]
                    ],
                    CodxTextColor: theme.textColor,
                    CodxBkgdColor: 'transparent',
                    CodxBkgdLightColor: theme.bgLight,
                    CodxContrastColor: theme.contrastColor,
                    CodxFontFamily: theme.fontFamily
            }
        }

        this.props = {...defaultProps};
        this.state = {
            usable_fontSize: (+html_fontsize.replace('%', '') * 24) / 100,
        };
    }

    setupAxisStyling = (axis_details: any) => {
        const { CodxTextColor, CodxFontFamily } = this.props.themeContext;
        const { /*size_nooverride, */ color_nooverride } = this.props;

        if (axis_details) {
            axis_details.tickfont = {
                family: CodxFontFamily,
                color: CodxTextColor,
                size: this.state.usable_fontSize
            };

            if (axis_details?.title) {
                axis_details.title.font = {
                    family: CodxFontFamily,
                    color: CodxTextColor,
                    size: this.state.usable_fontSize
                };
                axis_details.title.standoff = 25;
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
                    standoff: 25
                },
                automargin: true,
                line: {
                    color: CodxTextColor
                },
                zerolinecolor: CodxTextColor
            };
        }
    };

    setupLegend = (params: any) => {
        const { CodxTextColor, CodxBkgdLightColor, CodxFontFamily } = this.props.themeContext;
        let is_scatter = false;
        let is_pie = false;
        let is_yaxis2 = false;
        params.data?.forEach(function (data_item: any) {
            if (data_item.type === 'scatter' || data_item.type === 'bar') {
                is_scatter = true;
            }

            if (data_item.type === 'pie') {
                is_pie = true;
            }

            if (data_item.yaxis === 'y2') {
                is_yaxis2 = true;
            }
        });

        const { graph_height } = this.props;

        if (graph_height === 'half') {
            if (is_yaxis2) {
                if (!params.layout.legend) {
                    params.layout.legend = {
                        orientation: 'h',
                        yanchor: 'top',
                        xanchor: 'center',
                        y: 1.25,
                        x: 0.5,
                        font: {
                            family: CodxFontFamily,
                            color: CodxTextColor,
                            size: this.state.usable_fontSize
                        }
                    };
                }
                params.layout.margin = {
                    t: 20,
                    r: 0,
                    b: 0,
                    l: 0
                };
            } else if (is_scatter && is_pie) {
                if (!params.layout.legend) {
                    params.layout.legend = {
                        orientation: 'h',
                        yanchor: 'top',
                        xanchor: 'center',
                        y: -0.25,
                        x: 0.5,
                        font: {
                            family: CodxFontFamily,
                            color: CodxTextColor,
                            size: this.state.usable_fontSize
                        },
                        bgColor: CodxBkgdLightColor
                    };
                }
                params.layout.margin = {
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
                        y: 0.5,
                        x: 1,
                        font: {
                            family: CodxFontFamily,
                            color: CodxTextColor,
                            size: this.state.usable_fontSize
                        }
                    };
                }
            }
        } else {
            if (!params.layout.legend) {
                params.layout.legend = {
                    orientation: 'h',
                    yanchor: 'top',
                    xanchor: 'center',
                    y: -0.25,
                    x: 0.5,
                    font: {
                        family: CodxFontFamily,
                        color: CodxTextColor,
                        size: this.state.usable_fontSize
                    },
                    bgColor: CodxBkgdLightColor
                };
            }

            if (is_yaxis2) {
                params.layout.margin = {
                    t: 20,
                    r: 0,
                    b: 0,
                    l: 0
                };
            }
        }

        return params;
    };

    // setupMargin = () => {};

    public setupPlot = (plotData: any) => {
        const { CodxBkgdColor, CodxTextColor, CodxBkgdLightColor, CodxContrastColor, CodxFontFamily } =
            this.props.themeContext;
        const { size_nooverride, color_nooverride /*graph_height*/ } = this.props;

        let params = plotData
        // var params = this.props.params;

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
        // this.setupMargin();
        delete params.layout.margin;
        params.layout.margin = {
            t: 10,
            r: 1,
            l: 1,
            b: 30
        };

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
            params.layout.xaxis.rangeselector.bordercolor = CodxContrastColor;
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
            params.layout.shapes = params.layout?.shapes?.map((shape_item: any) => {
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

            params.layout.annotations = params.layout?.annotations?.map((annotation: any) => {
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

        return params;
    };

    setupPercentDonutCharts = (params: any) => {
        const { chartDefaultColors, CodxBkgdColor } = this.props.themeContext;
        params.data = params.data?.map((data_item: any, data_index: any) => {
            if (data_item.type === 'pie' && data_item.hole && data_item.direction) {
                if (data_item.marker) {
                    if (data_item.marker.colors) {
                        data_item.marker.colors = data_item?.marker?.colors?.map((color_item: any) => {
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
                data_item.hole = '0.65';
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
                        data_item.marker.colors = data_item?.marker?.colors?.map((color_item: any, color_item_index: any) => {
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

    setupLineAreaCharts = (params: any) => {
        const { chartDefaultColors } = this.props.themeContext;
        let is_scatter = true;
        params.data = params.data?.map((data_item: any) => {
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

        if (is_scatter) {
            params.layout.colorway =
                chartDefaultColors['range-' + (params.data.length > 10 ? 10 : params.data.length)];
        }
    };

    setupTreemapCharts = (params: any) => {
        const { chartDefaultColors } = this.props.themeContext;
        params.data?.map((data_item: any) => {
            if (data_item.type === 'treemap') {
                params.layout.colorway = chartDefaultColors['range-10'];
            }
        });
    };

    setupWaterfallCharts = (params: any) => {
        params.data = params.data?.map((data_item: any) => {
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

    setupGeoCharts = (params: any) => {
        const { chartDefaultColors, chartMapColors, CodxTextColor } =
            this.props.themeContext;
        const geo_traces = params.data?.filter((data_item: any) => {
            return data_item.type === 'choropleth' || data_item.type === 'scattergeo';
        });
        const multiple_geo = geo_traces && geo_traces.length > 1 ? true : false;

        if (!multiple_geo && geo_traces.length === 1) {
            if (params.layout.coloraxis) {
                params.layout.coloraxis.colorscale = chartMapColors;
            }
        } else {
            params.data = params.data?.map((data_item: any, data_index: any) => {
                const default_colors =
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
                                color: CodxTextColor,
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

    setupSunburstCharts = (params: any) => {
        const { chartDefaultColors } = this.props.themeContext;
        const sunburst_traces = params.data?.filter((data_item: any) => {
            return data_item.type === 'sunburst';
        });

        if (sunburst_traces.length > 0) {
            const trace_count = params.data?.[0]?.['ids']?.filter((id_item: any) => {
                return id_item.split('/').length === 2;
            }).length;
            params.layout.colorway =
                chartDefaultColors['range-' + (trace_count > 10 ? 10 : trace_count)];
        }
    };

    setupHeatmapCharts = (params: any) => {
        const { chartMapColors } = this.props.themeContext;
        const heatmap_traces = params.data?.filter((data_item: any) => {
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

}