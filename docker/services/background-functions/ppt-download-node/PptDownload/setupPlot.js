const DarkChartColors  = require("./themes/dark/chartColors");
const DefaultChartColors = require("./themes/default/chartColors");

const CodxFontFamily = '"Roboto", "Helvetica", "Arial", sans-serif';

function getPlotTheme(themeName) {
    let usable_chartDefaultColors = DarkChartColors.chartDefaultColors;
    let usable_chartMapColors = DarkChartColors.chartMapColors;
    let usable_CodxTextColor = DarkChartColors.CodxTextColor;
    let usable_CodxBkgdColor = DarkChartColors.CodxBkgdColor;
    let usable_CodxBkgdLightColor = DarkChartColors.CodxBkgdLightColor;

    if (themeName === 'light') {
        usable_chartDefaultColors = DefaultChartColors.chartDefaultColorsLight;
        usable_chartMapColors = DefaultChartColors.chartMapColorsLight;
        usable_CodxTextColor = DefaultChartColors.CodxTextColorLight;
        usable_CodxBkgdColor = DefaultChartColors.CodxBkgdColorLight;
        usable_CodxBkgdLightColor = DefaultChartColors.CodxBkgdLightColorLight;
    }
    return {
        usable_chartDefaultColors,
        usable_chartMapColors,
        usable_CodxTextColor,
        usable_CodxBkgdColor,
        usable_CodxBkgdLightColor
    }
  }


function setupPlot ({color_nooverride, size_nooverride, params, graph_height}) {
    const {usable_CodxBkgdColor, usable_CodxTextColor, usable_CodxBkgdLightColor} = getPlotTheme();
    // const { size_nooverride, color_nooverride, /*graph_height*/ } = props;

    // var params = JSON.parse(JSON.stringify(this.props.params));

    if (!size_nooverride) {
      //Size
      params.layout.autosize = true;
      delete params.layout.height;
      delete params.layout.width;
    }

    //Font
    params.layout.font = {
      family: CodxFontFamily,
      color: usable_CodxTextColor,
      // size: this.state.usable_fontSize
      size: 14
    };

    params.layout.hoverlabel = {
      font: {
        family: CodxFontFamily,
        // color: usable_CodxTextColor,
        // size: this.state.usable_fontSize
        size: 14
      }
    };

    //Margin
    // this.setupMargin(params);
    delete params.layout.margin;
    params.layout.margin = {
      t: 0,
      r: 0,
      l: 0,
      b: 0
    };

    params.layout.xaxis = setupAxisStyling(params.layout.xaxis, color_nooverride);

    params.layout.yaxis = setupAxisStyling(params.layout.yaxis, color_nooverride);

    params.layout.yaxis2 = setupAxisStyling(params.layout.yaxis2, color_nooverride);

    if (params.layout.polar) {
      params.layout.polar.bgcolor = usable_CodxBkgdColor;
      params.layout.polar.angularaxis = setupAxisStyling(params.layout.polar.angularaxis, color_nooverride);
      params.layout.polar.radialaxis = setupAxisStyling(params.layout.polar.radialaxis, color_nooverride);
    }

    //Legend
    params = setupLegend(params, graph_height);

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
    params.layout.paper_bgcolor = usable_CodxBkgdColor;
    params.layout.plot_bgcolor = usable_CodxBkgdColor;
    params.layout.geo = {
      ...params.layout.geo,
      bgcolor: usable_CodxBkgdColor,
      subunitcolor: usable_CodxTextColor
    };

    //General
    if (!color_nooverride) {
      params.layout.shapes = (params.layout.shapes || []).map(function(shape_item) {
        if (shape_item.type === 'line' && shape_item.line && shape_item.line.color && shape_item.line.color.toLowerCase() === 'black') {
          shape_item.line.color = usable_CodxTextColor;
        } else if(shape_item.type === 'line' && shape_item.line && !shape_item.line.color) {
          shape_item.line.color = usable_CodxTextColor;
        }

        return shape_item;
      });

      params.layout.annotations = (params.layout.annotations|| []).map(function(annotation) {
        if (annotation.font && annotation.font.color && annotation.font.color.toLowerCase() === 'black') {
          if (params.data.length > 0 && params.data[0].mode !== 'text') {
            annotation.font.color = usable_CodxTextColor;
          }
        }

        if (annotation.font) {
        //   annotation.font.size = this.state.usable_fontSize;
          annotation.font.size = 14;
        }

        if (annotation.arrowcolor && annotation.arrowcolor.toLowerCase() === 'black') {
          if (params.data.length > 0 && params.data[0].mode !== 'text') {
            annotation.arrowcolor = usable_CodxTextColor;
          }
        }

        if (annotation.bgcolor) {
          annotation.bgcolor = usable_CodxBkgdLightColor;
        }

        return annotation;
      });
    }

    delete params.layout.template;

    setupPercentDonutCharts(params);

    if (!color_nooverride) {
      setupLineAreaCharts(params);
      setupGeoCharts(params);
      setupSunburstCharts(params);
      setupHeatmapCharts(params);
      setupTreemapCharts(params);
      setupWaterfallCharts(params);
      // this.setupTableCharts(params);
    }

    // console.log(params);

    return params;
}

function setupAxisStyling (axis_details, color_nooverride, type) {
    const {usable_CodxTextColor} = getPlotTheme();
    // const { /*size_nooverride, */color_nooverride } = this.props;

    if (axis_details) {
      axis_details.tickfont = {
        family: CodxFontFamily,
        color: usable_CodxTextColor,
        // size: this.state.usable_fontSize
        size: 14
      };

      if (axis_details.title) {
        axis_details.title.font = {
          family: CodxFontFamily,
          color: usable_CodxTextColor,
        //   size: this.state.usable_fontSize
          size: 14
        };
        axis_details.title.standoff = 25;
      }

      axis_details.automargin = true;

      if (!color_nooverride) {
        if (axis_details.line) {
          axis_details.line.color = usable_CodxTextColor;
        } else {
          axis_details.line = {
            color: usable_CodxTextColor
          };
        }

        // axis_details.gridcolor = usable_CodxTextColor;
        // axis_details.gridwidth = 1;
        axis_details.zerolinecolor = usable_CodxTextColor;
      }

      return axis_details;
    } else {
      return {
        tickfont: {
          family: CodxFontFamily,
          color: usable_CodxTextColor,
        //   size: this.state.usable_fontSize
        size: 14
        },
        title: {
          font: {
            family: CodxFontFamily,
            color: usable_CodxTextColor,
            //   size: this.state.usable_fontSize
            size: 14
          },
          standoff: 25
        },
        automargin: true,
        line: {
          color: usable_CodxTextColor
        },
        zerolinecolor: usable_CodxTextColor
      };
    }
}

function setupLegend(params, graph_height) {
    const {usable_CodxTextColor, usable_CodxBkgdLightColor} = getPlotTheme();
    var is_scatter = false;
    var is_pie = false;
    var is_yaxis2 = false;
    (params.data || []).forEach(function(data_item, data_index) {
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

    if (graph_height === 'half') {
      if (is_yaxis2) {
        params.layout.legend = {
          orientation: "h",
          yanchor: "top",
          xanchor: "center",
          y: 1.25,
          x: 0.5,
          font: {
            family: CodxFontFamily,
            color: usable_CodxTextColor,
            // size: this.state.usable_fontSize
            size: 14
          }
        };
        params.layout.margin = {
          t: 20,
          r: 0,
          b: 0,
          l: 0
        }
      } else if(is_scatter && is_pie) {
        params.layout.legend = {
          orientation: "h",
          yanchor: "top",
          xanchor: "center",
          y: -0.25,
          x: 0.5,
          font: {
            family: CodxFontFamily,
            color: usable_CodxTextColor,
            // size: this.state.usable_fontSize
            size: 14
          },
          bgColor: usable_CodxBkgdLightColor
        };
        params.layout.margin = {
          t: 20,
          r: 0,
          b: 0,
          l: 0
        };
      } else {
        params.layout.legend = {
          orientation: "v",
          yanchor: "center",
          xanchor: "left",
          y: 0.5,
          x: 1,
          font: {
            family: CodxFontFamily,
            color: usable_CodxTextColor,
            // size: this.state.usable_fontSize
            size: 14
          }
        };
      }
    } else {
      params.layout.legend = {
        orientation: "h",
        yanchor: "top",
        xanchor: "center",
        y: -0.25,
        x: 0.5,
        font: {
          family: CodxFontFamily,
          color: usable_CodxTextColor,
          // size: this.state.usable_fontSize
          size: 14
        },
        bgColor: usable_CodxBkgdLightColor
      };

      if (is_yaxis2) {
        params.layout.margin = {
          t: 20,
          r: 0,
          b: 0,
          l: 0
        }
      }
    }

    return params;
}

function setupPercentDonutCharts(params) {
    const {usable_chartDefaultColors, usable_CodxBkgdColor} = getPlotTheme();
    params.data = (params.data || []).map(function(data_item, data_index) {
      if (data_item.type === 'pie' && data_item.hole && data_item.direction) {
        if (data_item.marker) {
          if (data_item.marker.colors) {
            data_item.marker.colors = (data_item.marker.colors || []).map(function(color_item, color_item_index) {
              if (color_item === '#fff' || color_item === '#ffffff' || color_item === 'white') {
                return usable_CodxBkgdColor;
              } else if (!data_item.domain) {
                return usable_chartDefaultColors['range-' + (params.data.length > 10 ? 10 : params.data.length)][data_index];
              } else {
                return color_item;
              }
            });
          }

          data_item.marker.line = {
            color: usable_CodxBkgdColor,
            width: 1
          };
        }
      } else if (data_item.type === 'pie') {
        data_item.hole = '0.65';
        if (data_item.labels) {
          params.layout.colorway = usable_chartDefaultColors['range-' + (data_item.labels.length > 10 ? 10 : data_item.labels.length)];
        }

        if (data_item.marker) {
          data_item.marker.line = {
            color: usable_CodxBkgdColor,
            width: 1
          };

          if (data_item.marker.colors) {
            data_item.marker.colors = (data_item.marker.colors || []).map(function(color_item, color_item_index) {
              if (color_item === '#fff' || color_item === '#ffffff' || color_item === 'white') {
                return usable_CodxBkgdColor;
              } else if (!data_item.domain) {
                return usable_chartDefaultColors['range-' + (data_item.marker.colors.length > 10 ? 10 : data_item.marker.colors.length)][color_item_index];
              } else {
                return color_item;
              }
            });
          }
        } else {
          data_item.marker = {
            line: {
              color: usable_CodxBkgdColor,
              width: 1
            }
          };
        }
      }

      return data_item;
    });
}

function setupLineAreaCharts(params) {
    const {usable_chartDefaultColors} = getPlotTheme();
    var is_scatter = true;
    params.data = (params.data || []).map(function(data_item, data_index) {
      if (data_item.type === 'scatter' || data_item.type === 'bar' || data_item.type === 'scatterpolar') {
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
      params.layout.colorway = usable_chartDefaultColors['range-' + (params.data.length > 10 ? 10 : params.data.length)];
    }
}

function setupGeoCharts(params) {
    const {usable_chartDefaultColors, usable_chartMapColors, usable_CodxTextColor} = getPlotTheme();
    var geo_traces = (params.data || []).filter(function(data_item) {
      return data_item.type === 'choropleth' || data_item.type === 'scattergeo';
    });
    var multiple_geo = geo_traces && geo_traces.length > 1 ? true : false;

    if (!multiple_geo && geo_traces.length === 1) {
      if (params.layout.coloraxis) {
        params.layout.coloraxis.colorscale = usable_chartMapColors;
      }
    } else {
      params.data = (params.data || []).map(function(data_item, data_index) {
        var default_colors = usable_chartDefaultColors['range-' + (geo_traces.length > 10 ? 10 : geo_traces.length)];
        if (data_item.type === 'choropleth') {
          data_item.colorscale = [[0, default_colors[data_index]], [1, default_colors[data_index]]];
          if (data_item.marker) {
            data_item.marker.color = default_colors[data_index];
            data_item.marker.line.color = usable_CodxTextColor;
          } else {
            data_item.marker = {
              color: default_colors[data_index],
              line: {
                color: usable_CodxTextColor,
                width: 0.5
              }
            };
          }
        } else if(data_item.type === 'scattergeo') {
          if (data_item.marker) {
            if (default_colors) {
              data_item.marker.color = default_colors[data_index];
            }

            if (data_item.marker.line) {
              data_item.marker.line.color = usable_CodxTextColor;
            } else {
              data_item.marker.line = {
                color: usable_CodxTextColor
              };
            }
          } else {
            data_item.marker = {
              color: default_colors[data_index],
              // line: {
              //   color: usable_CodxTextColor,
              //   width: 0.5
              // }
            };
          }
        }

        return data_item;
      });
    }
}

function setupSunburstCharts(params){
    const {usable_chartDefaultColors} = getPlotTheme();
    var sunburst_traces = (params.data || []).filter(function(data_item) {
      return data_item.type === 'sunburst';
    });

    if (sunburst_traces.length > 0) {
      var trace_count = (params.data[0]['ids'] || []).filter(function(id_item) {
        return id_item.split('/').length === 2;
      }).length;
      params.layout.colorway = usable_chartDefaultColors['range-' + (trace_count > 10 ? 10 : trace_count)];
    }
}

function setupHeatmapCharts(params) {
    const {usable_chartMapColors} = getPlotTheme();
    var heatmap_traces = (params.data || []).filter(function(data_item) {
      return data_item.type === 'heatmap';
    });

    if (heatmap_traces.length > 0) {
      if (params.layout.coloraxis) {
        params.layout.coloraxis.colorscale = usable_chartMapColors;
      } else {
        params.layout.coloraxis = {
          colorscale: usable_chartMapColors
        };
      }
    }
}

function setupTreemapCharts(params) {
    const {usable_chartDefaultColors} = getPlotTheme();
    (params.data || []).forEach(function(data_item) {
      if (data_item.type === 'treemap') {
        params.layout.colorway = usable_chartDefaultColors['range-10'];
      }
    });
}

function setupWaterfallCharts(params) {
    params.data = (params.data || []).map(function(data_item) {
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
  }


module.exports = {setupPlot}