import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import StrategyRedesignStyle from './StrategyRedesignStyle';
import createPlotlyComponent from 'react-plotly.js/factory';
// import ConnSystemsContext from '../ConnectedSystemsContext';

import * as _ from 'underscore';

const useStyles = makeStyles((theme) => ({
    ...StrategyRedesignStyle(theme)
}));

const PlotlyGraph = (props) => {
    const useStyles2 = makeStyles(() => ({
        connSystemCardPlot: {
            height: props?.maxHeight || '200%',
            width: props?.maxWidth || '100%',
            marginLeft: '0rem',
            marginTop: '1rem',
            '& .js-fill': {
                fill: 'url(#graph-gradient) !important'
            }
        },
        plotlyHolder: {
            height: props?.plotHeight || '30%',
            width: props?.plotWidth || '80%',
            marginLeft: '1rem',
            position: 'relative'
        }
    }));
    const classes2 = useStyles2();
    const classes = useStyles();
    const Plot = createPlotlyComponent(window.Plotly);
    const data = props?.data;
    return (
        <div
            className={`${classes2.plotlyHolder} ${props.customPlotlyWrapperClasses}`}
            key={'plotly '}
        >
            <Typography
                className={`${classes.graphTitle} ${
                    props?.titlePosition == 'left' && classes.titleLeft
                }`}
                style={{ '--marginLeft': props?.marginLeft || 0 }}
            >
                {props?.title}
            </Typography>
            <Plot
                data={data?.data}
                layout={{
                    margin: props?.margin || { l: 0, r: 0, t: 0, b: 0 },
                    paper_bgcolor: 'rgb(0,0,0,0)',
                    plot_bgcolor: 'rgb(0,0,0,0)',
                    yaxis: data?.layout?.yaxis,
                    xaxis: data?.layout?.xaxis,
                    shapes: data?.shapes,
                    // annotations: data?.data[0].annotations,
                    grid: { rows: 1, columns: 1 },
                    showlegend: data?.showLegend || false,
                    autosize: true,
                    legend: data?.legend,
                    bargroupgap: 0.5,
                    barmode: 'stack'
                }}
                config={{
                    displayModeBar: false,
                    responsive: true,
                    staticPlot: true
                }}
                className={`${classes2.connSystemCardPlot} ${props?.customPlotlyClasses}`}
                useResizeHandler={true}
            />
            {props?.data?.legends && (
                <div className={classes.legendContainer}>
                    {props?.data?.legends.map((val, index) => (
                        <div className={classes.legend} key={`legendcontainer${index}`}>
                            <div
                                className={classes.legendBox}
                                style={{ backgroundColor: val?.color }}
                            ></div>
                            <Typography className={classes.legendText}>{val?.title}</Typography>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const Projections = ({ selectedMomentumTab, setOpenintiative, momentum }) => {
    // const connSystemData = useContext(ConnSystemsContext);

    const selectedMomentumItem = _.filter(momentum, function (momentum_item) {
        return momentum_item.tab === selectedMomentumTab;
    });
    const classes = useStyles();
    const handleClick = () => {
        setOpenintiative(true);
    };

    if (selectedMomentumItem.length === 0) {
        return '';
    }

    return (
        <div className={classes.graphContainer} onClick={handleClick}>
            <div className={classes.graphSection}>
                <PlotlyGraph
                    data={selectedMomentumItem[0]?.progress[0]?.graph}
                    margin={{ l: 90, t: 0, r: 0, b: 40 }}
                    maxWidth={'100%'}
                    plotHeight={'40%'}
                    plotWidth={'100%'}
                    layout={{ yaxis: true }}
                    title={selectedMomentumItem[0]?.progress[0]?.title}
                    titlePosition="center"
                />
                <PlotlyGraph
                    data={selectedMomentumItem[0]?.progress[1]?.graph}
                    margin={{ l: 0, t: 0, r: 0, b: 40 }}
                    maxWidth={'90%'}
                    plotHeight={'40%'}
                    layout={{ yaxis: false }}
                    title={selectedMomentumItem[0]?.progress[1]?.title}
                    titlePosition="left"
                />
            </div>
            <div className={classes.separatorVertical}></div>
            <div className={classes.graphSection}>
                <PlotlyGraph
                    data={selectedMomentumItem[0]?.projection[0]?.graph}
                    margin={{ l: 90, t: 0, r: 0, b: 40 }}
                    maxWidth={'100%'}
                    plotHeight={'40%'}
                    plotWidth={'100%'}
                    layout={{ yaxis: true }}
                    title={selectedMomentumItem[0]?.projection[0]?.title}
                    titlePosition="center"
                />
                <PlotlyGraph
                    data={selectedMomentumItem[0]?.projection[1]?.graph}
                    margin={{ l: 20, t: 0, r: 0, b: 40 }}
                    maxWidth={'80%'}
                    plotHeight={'40%'}
                    layout={{ yaxis: false }}
                    title={selectedMomentumItem[0]?.projection[1]?.title}
                    titlePosition="left"
                    marginLeft="10%"
                />
            </div>
        </div>
    );
};

export default Projections;
