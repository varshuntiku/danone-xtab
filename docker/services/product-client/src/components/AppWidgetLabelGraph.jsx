import React from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';
import appWidgetLabelStyle from 'assets/jss/appWidgetLabelStyle.jsx';
import { makeStyles } from '@material-ui/core/styles';
import * as _ from 'underscore';
import Typography from 'components/elements/typography/typography';

const GraphComponent = (props) => {
    const useStyles = makeStyles(appWidgetLabelStyle);
    const classes = useStyles();
    const { params } = props;
    const { chartDefaultColors, CodxBkgdColor } = props.themeContext.plotTheme;
    const { theme } = props.themeContext;
    const fontColor = theme.palette.text.default;
    let graph_data = params?.graph_data || [];
    const Plotly = window.Plotly;
    const Plot = createPlotlyComponent(Plotly);
    let layout = {
        margin: params?.graph_data_hover?.layout?.margin || { l: 40, r: 25, t: 25, b: 40 },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        yaxis: {
            visible: true,
            showgrid: false,
            title: params?.graph_data_hover?.layout?.xaxis?.title || '',
            titlefont: { size: 13, color: fontColor },
            tickfont: { color: fontColor }
        },
        xaxis: {
            visible: true,
            showgrid: false,
            title: params?.graph_data_hover?.layout?.yaxis?.title || '',
            titlefont: { size: 13, color: fontColor },
            tickfont: { color: fontColor }
        },
        shapes: graph_data[0]?.shapes,
        annotations: graph_data[0]?.annotations,
        grid: { rows: 1, columns: 2 },
        showlegend: params?.graph_data_hover?.layout?.showlegend || true,
        autosize: true,
        width: 'inherit',
        height: params?.graph_data_hover?.layout?.height || 280,
        bargap: params?.graph_data_hover?.layout?.bargap || 0.5,
        legend: {
            x: params?.graph_data_hover?.layout?.legend?.x || 0,
            y: params?.graph_data_hover?.layout?.legend?.y || -0.3,
            bgcolor: 'transparent',
            font: { color: fontColor },
            orientation: params?.graph_data_hover?.layout?.legend?.orientation || 'v'
        },
        colorway: [
            params.extra_dir === 'down'
                ? theme.palette.error.main
                : theme.palette.text.indicatorGreenText
        ],
        hoverinfo: params?.graph_data_hover?.layout?.hoverinfo || false
    };
    graph_data = _.map(graph_data, function (data_item) {
        if (data_item.type === 'pie' && data_item?.donut == true) {
            if (data_item.marker) {
                if (data_item.marker.colors) {
                    data_item.marker.colors = _.map(data_item.marker.colors, function (color_item) {
                        if (
                            color_item === '#fff' ||
                            color_item === '#ffffff' ||
                            color_item === 'white' ||
                            color_item === 'transparent'
                        ) {
                            return 'transparent';
                        } else {
                            return params.extra_dir === 'down' || data_item?.donut_dir == 'down'
                                ? theme.palette.error.main
                                : theme.palette.text.indicatorGreenText;
                        }
                    });
                }

                data_item.marker.line = {
                    color: theme.palette.text.default,
                    width: 0.2
                };
            }
        } else if (data_item.type === 'pie') {
            data_item?.hole == undefined ? (data_item.hole = 0.78) : null;
            if (data_item.labels) {
                layout.colorway =
                    chartDefaultColors[
                        'range-' + (data_item.labels.length > 10 ? 10 : data_item.labels.length)
                    ];
                if (data_item.marker) {
                    data_item.marker.colors =
                        chartDefaultColors[
                            'range-' + (data_item.labels.length > 10 ? 10 : data_item.labels.length)
                        ];
                } else {
                    data_item.marker = {
                        line: {
                            color: CodxBkgdColor,
                            width: 1
                        }
                    };
                }
            }
        }

        return data_item;
    });
    const getFontSize = () => {
        switch (true) {
            case screen.availWidth >= 1900:
                return 14;
            case screen.availWidth <= 1300:
                return 10;
            default:
                return 12;
        }
    };
    layout?.legend ? (layout.legend['tracegroupgap'] = 10) : null;
    layout?.legend?.font ? (layout.legend['font']['size'] = getFontSize()) : null;
    layout?.font ? (layout.font.family = 'Graphik') : null;

    const legendColors =
        graph_data[0]?.type == 'pie'
            ? chartDefaultColors[
                  'range-' + (graph_data[0].labels.length > 10 ? 10 : graph_data[0].labels.length)
              ]
            : chartDefaultColors['range-' + (graph_data.length > 10 ? 10 : graph_data.length)];

    return (
        <>
            {params?.graph_data && (
                <div
                    className={`${classes.plotlyHolder} ${
                        props?.label_widgets?.length < 3 ? classes.shortPlotlyHolder : ''
                    }
                    ${props?.label_widgets?.length === 1 ? classes.singlePlotlyHolder : ''}
                    `}
                    key={'plotlyKPI'}
                    onMouseOver={props.handleMouseEnter}
                    onMouseLeave={props.handleMouseLeave}
                >
                    <Plot
                        data={graph_data}
                        layout={{
                            margin: graph_data[0]?.layout?.margin || {
                                l: 0,
                                r: 0,
                                t: 0,
                                b: 0
                            },
                            paper_bgcolor: 'rgb(0,0,0,0)',
                            plot_bgcolor: 'rgb(0,0,0,0)',
                            yaxis: { visible: false },
                            xaxis: { visible: false },
                            // shapes:graph_data[0]shapes,
                            // annotations:graph_data[0]annotations,
                            grid: { rows: 1, columns: 2 },
                            showlegend: false,
                            autosize: true,
                            bargap: 0.5,
                            // legend:graph_data[0]legend,
                            coloraxis: {
                                colorscale: graph_data[0]?.colorscale,
                                cmin: graph_data[0]?.cmin,
                                cmax: graph_data[0]?.cmax,
                                colorbar: {
                                    len: 1.1,
                                    thicknessmode: 'fraction',
                                    thickness: 0.03,
                                    y: 0.65,
                                    tickfont: graph_data[0]?.tickfont,
                                    outlinewidth: 0,
                                    x: 0.49
                                }
                            },
                            colorway: [
                                params.extra_dir === 'down'
                                    ? theme.palette.error.main
                                    : theme.palette.text.indicatorGreenText
                            ]
                        }}
                        config={{
                            displayModeBar: false,
                            responsive: true,
                            staticPlot: true
                        }}
                        className={`${classes.connSystemCardPlot}`}
                        useResizeHandler={true}
                    />
                </div>
            )}
            {props.isHovered && params?.graph_data_hover ? (
                <div
                    className={`${
                        !params?.graph_data_hover?.legends
                            ? props.widget_index !== props.label_widgets.length - 1
                                ? classes.plotlyPopup
                                : classes.plotlyPopupLeft
                            : props.widget_index !== props.label_widgets.length - 1
                            ? classes.popupLegend
                            : classes.popupLegendLeft
                    }`}
                >
                    {!params?.graph_data_hover?.legends && (
                        <Plot
                            data={graph_data}
                            layout={layout}
                            config={{
                                displayModeBar: false,
                                responsive: true,
                                staticPlot: true
                            }}
                            className={`${classes.connSystemCardPlotBig}`}
                            useResizeHandler={true}
                        />
                    )}
                    {params?.graph_data_hover?.legends &&
                        graph_data[0]?.legends?.map((val, index) => (
                            <div className={classes.legendContainer} key={`legendKpiGraph${index}`}>
                                <div className={classes.legendHolder}>
                                    <span
                                        className={classes.legendColor}
                                        style={{ '--background': legendColors[index] }}
                                    ></span>
                                    <Typography className={classes.legendValue}>
                                        {val?.text}
                                    </Typography>
                                </div>
                                <Typography className={classes.infoHolder}>
                                    {' '}
                                    {val?.addInfo}{' '}
                                </Typography>
                            </div>
                        ))}
                </div>
            ) : null}
        </>
    );
};

export default GraphComponent;
