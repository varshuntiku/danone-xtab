import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import createPlotlyComponent from 'react-plotly.js/factory';

function IntiativeRedesign({ data }) {
    const useStyles = makeStyles((theme) => ({
        section: {
            display: 'flex',
            flexDirection: 'column',
            paddingLeft: theme.layoutSpacing(22),
            width: '100%'
        },
        graphSection: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexGrow: 1
        },
        intiativeName: {
            fontSize: theme.layoutSpacing(18),
            fontFamily: theme.title.h1.fontFamily,
            color: theme.palette.text.default,
            fontWeight: '400'
        },
        recordText: {
            color: theme.palette.text.default,
            fontWeight: '300',
            fontSize: theme.layoutSpacing(36),
            fontFamily: theme.title.h1.fontFamily
        },
        connSystemCardPlot: {
            height: '100%',
            width: '200%',
            marginTop: '1rem',
            '& .js-fill': {
                fill: 'url(#graph-gradient) !important'
            }
        },
        legend: {
            display: 'flex',
            gap: theme.layoutSpacing(10),
            alignItems: 'flex-start'
        },
        legendBox: {
            width: '1.5rem',
            height: '1.5rem',
            borderRadius: '3px'
        },
        legendText: {
            color: theme.palette.text.connLegendColor,
            fontSize: theme.layoutSpacing(15),
            fontFamily: 'Roboto',
            fontWeight: '400',
            lineHeight: theme.layoutSpacing(18),
            letterSpacing: theme.layoutSpacing(0.5),
            width: theme.layoutSpacing(120)
        },
        intiativeDesign: {
            display: 'flex',
            flexDirection: 'column',
            alignSelf: 'end',
            gap: theme.layoutSpacing(3)
        },
        valueText: {
            color: theme.palette.text.default,
            fontSize: theme.layoutSpacing(14),
            fontFamily: theme.title.h1.fontFamily
        }
    }));
    const classes = useStyles();
    const Plotly = window.Plotly;
    const Plot = createPlotlyComponent(Plotly);
    const sumProgress = (values) => {
        return values.reduce((sum, el) => sum + el, 0);
    };
    return (
        <div className={classes.section}>
            <Typography className={classes.intiativeName}>{data.name}</Typography>
            {typeof data?.data === 'object' ? (
                <div className={classes.graphSection}>
                    <div className={classes.intiativeDesign}>
                        {data?.data.map((item, index) => (
                            <div className={classes.legend} key={'legend ' + index}>
                                <div
                                    className={classes.legendBox}
                                    style={{ backgroundColor: item.color }}
                                ></div>
                                <Typography className={classes.legendText}>{item.name}</Typography>
                                <Typography
                                    className={classes.valueText}
                                >{`(${item.value})`}</Typography>
                            </div>
                        ))}
                    </div>
                    <Plot
                        data={data?.progress?.data}
                        layout={{
                            margin: { l: 0, r: 0, t: 0, b: 0 },
                            paper_bgcolor: 'rgb(0,0,0,0)',
                            plot_bgcolor: 'rgb(0,0,0,0)',
                            showlegend: false,
                            autosize: true,
                            legend: false,
                            annotations: data?.progress?.data[0]?.annotationHide
                                ? []
                                : [
                                      {
                                          showarrow: false,
                                          text: sumProgress(data?.progress?.data[0]?.values),
                                          x: 0.5,
                                          y: 0.5
                                      }
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
            ) : (
                <Typography className={classes.recordText}>{data.data}</Typography>
            )}
        </div>
    );
}

export default IntiativeRedesign;
