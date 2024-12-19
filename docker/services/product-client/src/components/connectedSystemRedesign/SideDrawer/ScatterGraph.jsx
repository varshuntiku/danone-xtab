import React from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core';
import connectedSystemSideDrawerStyle from 'assets/jss/connectedSystemSideDrawerStyle.jsx';

const createGraphData = (x = [], y = []) => [
    {
        fill: 'tozeroy',
        marker: { symbol: 'circle', size: 0.1, color: 'rgba(63, 85, 182, 1)' },
        opacity: '1',
        x,
        y,
        type: 'scatter'
    }
];

const ScatterGraph = ({ classes, graphLabel, graphData }) => {
    const Plot = createPlotlyComponent(window.Plotly);

    return (
        <div style={{ position: 'relative' }}>
            <Typography className={classes.connSystemCardPlotHeader}>{graphLabel}</Typography>
            <Plot
                data={createGraphData(graphData.x, graphData.y)}
                layout={{
                    margin: { l: 0, r: 0, t: 0, b: 0 },
                    paper_bgcolor: 'rgb(0,0,0,0)',
                    plot_bgcolor: 'rgb(0,0,0,0)',
                    yaxis: { visible: false },
                    xaxis: { visible: false }
                }}
                config={{
                    displayModeBar: false,
                    responsive: true
                }}
                className={classes.connSystemCardPlot}
                useResizeHandler={true}
            />
        </div>
    );
};

export default withStyles(connectedSystemSideDrawerStyle, { withTheme: true })(ScatterGraph);
