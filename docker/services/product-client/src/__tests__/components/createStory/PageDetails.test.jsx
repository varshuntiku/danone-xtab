import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import PageDetails from '../../../components/createStory/PageDetails.jsx';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts PageDetails Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <PageDetails page={story.pages[0]} classNames={{}} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
});

const story = {
    story_id: 98,
    id_token:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjEwMjc1NTE1MjYyLCJpYXQiOjE2MzU1MTUyNjIsInN1YiI6ImRhdGFfc3RvcnlfaWRfdG9rZW4iLCJzdG9yeV9pZCI6OTh9.JZiuTzwUSpBRm8PCx-iDnuVhyzWfVmJBhwUVmtmhJ-w',
    name: ' test story 26/10/2021',
    description: 'testing the stories',
    app_id: [26],
    created_by: {
        first_name: 'system',
        last_name: 'appplication'
    },
    content: {
        396: {
            content_id: 396,
            name: ' sales across top products',
            metadata: {},
            value: '{"data": {"values": [["14.75M"]], "columns": ["sum_volume"]}, "layout": {}}',
            app_screen_id: null,
            app_screen_widget_id: null,
            is_label: false,
            app_screen_widget_value_id: null
        },
        397: {
            content_id: 397,
            name: 'actual volume across countries',
            metadata: {},
            value: '{"data": [{"type": "choropleth", "locations": ["GBR", "POL", "SGS", "DEU", "HRV", "AUT", "DNK", "FRA", "NLD", "ITA", "GRC", "BEL"], "z": [4228754, 3335119, 1840363, 1483562, 1259386, 970171, 674349, 316906, 302769, 273929, 51981, 12031], "text": ["GBR", "POL", "SGS", "DEU", "HRV", "AUT", "DNK", "FRA", "NLD", "ITA", "GRC", "BEL"], "colorbar": {"title": "sum_volume", "thickness": 25, "len": 0.7, "x": 0.92}, "marker": {"line": {"color": "rgb(255,255,255)", "width": 2}}, "colorscale": "YlGnBu", "reversescale": true}], "layout": {"autosize": true, "showlegend": false, "title": {"text": "ACTUAL VOLUME ACROSS COUNTRIES", "font": {"color": "#FFFFFF", "family": "Roboto"}}, "geo": {"bgcolor": "rgba(0,0,0,0)", "coastlinecolor": "#404E5E", "showland": true, "landcolor": "#rgb(150 154 154)", "scope": "europe"}, "margin": {"t": 100, "b": 0, "l": 0, "r": 0}, "hoverlabel": {"font": {"size": 17}}, "font": {"family": "Roboto", "color": "#FFFFFF"}, "paper_bgcolor": "rgba(0,0,0,0)", "plot_bgcolor": "rgba(0,0,0,0)"}}',
            app_screen_id: null,
            app_screen_widget_id: null,
            is_label: false,
            app_screen_widget_value_id: null
        },
        398: {
            content_id: 398,
            name: 'revenue performance across years',
            metadata: {},
            value: '{"data": [{"type": "scatter", "mode": "lines", "x": ["2017", "2018", "2019", "2020"], "y": [410041695.1720619, 365709078.7968445, 343765095.8091965, 212581390.10663986], "name": "sum_net_revenue", "marker": {"color": "#8A8AF28d", "line": {"color": "#8A8AF2", "width": 1.5}}}], "layout": {"autosize": true, "automargin": true, "hovermode": "closest", "xaxis": {"title": {"text": "POSTING_DATE", "font": {"color": "#FFFFFF", "family": "Roboto"}}, "autorange": true, "showticklabels": true, "tickmode": "auto", "showgrid": false, "tickangle": 0, "type": "category"}, "yaxis": {"title": {"text": "SUM_NET_REVENUE", "font": {"color": "#FFFFFF", "family": "Roboto"}}, "autorange": true, "gridwidth": 1, "gridcolor": "#213244"}, "showlegend": false, "legend": {"orientation": "h", "traceorder": "normal", "x": 1, "y": 1.1, "yanchor": "auto", "xanchor": "auto", "valign": "top"}, "title": {"text": "REVENUE PERFORMANCE ACROSS YEARS", "font": {"color": "#FFFFFF", "family": "Roboto"}}, "hoverlabel": {"font": {"size": 17}}, "font": {"family": "Roboto", "color": "#FFFFFF"}, "paper_bgcolor": "rgba(0,0,0,0)", "colorway": ["#8A8AF2", "#F5956B", "#65D7C5", "#F2D862", "#5BBAE5", "#BBE673", "#de577b", "#D3C6F7", "#3C90A9"], "plot_bgcolor": "rgba(0,0,0,0)"}}',
            app_screen_id: null,
            app_screen_widget_id: null,
            is_label: false,
            app_screen_widget_value_id: null
        },
        399: {
            content_id: 399,
            name: 'sales across brands',
            metadata: {},
            value: '{"data": [{"type": "bar", "x": ["waterhut", "drinksjet", "icex", "sodax", "softella"], "y": [7173200, 4793450, 1595160, 961670, 225840], "name": "brand", "marker": {"color": "#8A8AF28d", "line": {"color": "#8A8AF2", "width": 1.5}}}], "layout": {"barmode": "bar", "autosize": true, "automargin": true, "hovermode": "closest", "xaxis": {"title": {"text": "BRAND", "font": {"color": "#FFFFFF", "family": "Roboto"}}, "autorange": true, "showgrid": false, "gridwidth": 0.1}, "yaxis": {"title": {"text": "SUM_VOLUME", "font": {"color": "#FFFFFF", "family": "Roboto"}}, "autorange": true, "gridwidth": 0.1, "showgrid": true, "gridcolor": "#213244"}, "legend": {"orientation": "h", "traceorder\\t": "normal", "x": 1, "y": 1.1, "yanchor": "auto", "xanchor": "auto", "valign": "top", "title": {"text": "brand", "font": {"color": "#FFFFFF", "family": "Roboto"}}}, "showlegend": true, "title": {"text": "SALES ACROSS BRANDS", "font": {"color": "#FFFFFF", "family": "Roboto"}}, "hoverlabel": {"font": {"size": 17}}, "font": {"family": "Roboto", "color": "#FFFFFF"}, "paper_bgcolor": "rgba(0,0,0,0)", "colorway": ["#8A8AF2", "#F5956B", "#65D7C5", "#F2D862", "#5BBAE5", "#BBE673", "#de577b", "#D3C6F7", "#3C90A9"], "plot_bgcolor": "rgba(0,0,0,0)"}}',
            app_screen_id: null,
            app_screen_widget_id: null,
            is_label: false,
            app_screen_widget_value_id: null
        },
        400: {
            content_id: 400,
            name: 'revenue performance across years',
            metadata: {},
            value: '{"data": [{"type": "bar", "x": ["2017-01-01", "2018-01-12", "2019-01-12", "2020-01-12"], "y": [410041695.1720619, 365709078.7968445, 343765095.8091965, 212581390.10663986], "name": "posting_date", "marker": {"color": "#8A8AF28d", "line": {"color": "#8A8AF2", "width": 1.5}}}], "layout": {"barmode": "bar", "autosize": true, "automargin": true, "hovermode": "closest", "xaxis": {"title": {"text": "POSTING_DATE", "font": {"color": "#FFFFFF", "family": "Roboto"}}, "autorange": true, "showgrid": false, "gridwidth": 0.1}, "yaxis": {"title": {"text": "SUM_NET_REVENUE", "font": {"color": "#FFFFFF", "family": "Roboto"}}, "autorange": true, "gridwidth": 0.1, "showgrid": true, "gridcolor": "#213244"}, "legend": {"orientation": "h", "traceorder\\t": "normal", "x": 1, "y": 1.1, "yanchor": "auto", "xanchor": "auto", "valign": "top", "title": {"text": "posting_date", "font": {"color": "#FFFFFF", "family": "Roboto"}}}, "showlegend": true, "title": {"text": "REVENUE PERFORMANCE ACROSS YEARS", "font": {"color": "#FFFFFF", "family": "Roboto"}}, "hoverlabel": {"font": {"size": 17}}, "font": {"family": "Roboto", "color": "#FFFFFF"}, "paper_bgcolor": "rgba(0,0,0,0)", "colorway": ["#8A8AF2", "#F5956B", "#65D7C5", "#F2D862", "#5BBAE5", "#BBE673", "#de577b", "#D3C6F7", "#3C90A9"], "plot_bgcolor": "rgba(0,0,0,0)"}}',
            app_screen_id: null,
            app_screen_widget_id: null,
            is_label: false,
            app_screen_widget_value_id: null
        },
        401: {
            content_id: 401,
            name: 'sales across channels for sodax',
            metadata: {},
            value: '{"data": [{"type": "bar", "x": ["small retailers", "large format stores", "restaurants"], "y": [344660, 311190, 305820], "name": "channel", "marker": {"color": "#8A8AF28d", "line": {"color": "#8A8AF2", "width": 1.5}}}], "layout": {"barmode": "bar", "autosize": true, "automargin": true, "hovermode": "closest", "xaxis": {"title": {"text": "CHANNEL", "font": {"color": "#FFFFFF", "family": "Roboto"}}, "autorange": true, "showgrid": false, "gridwidth": 0.1}, "yaxis": {"title": {"text": "SUM_VOLUME", "font": {"color": "#FFFFFF", "family": "Roboto"}}, "autorange": true, "gridwidth": 0.1, "showgrid": true, "gridcolor": "#213244"}, "legend": {"orientation": "h", "traceorder\\t": "normal", "x": 1, "y": 1.1, "yanchor": "auto", "xanchor": "auto", "valign": "top", "title": {"text": "channel", "font": {"color": "#FFFFFF", "family": "Roboto"}}}, "showlegend": true, "title": {"text": "SALES ACROSS CHANNELS FOR SODAX", "font": {"color": "#FFFFFF", "family": "Roboto"}}, "hoverlabel": {"font": {"size": 17}}, "font": {"family": "Roboto", "color": "#FFFFFF"}, "paper_bgcolor": "rgba(0,0,0,0)", "colorway": ["#8A8AF2", "#F5956B", "#65D7C5", "#F2D862", "#5BBAE5", "#BBE673", "#de577b", "#D3C6F7", "#3C90A9"], "plot_bgcolor": "rgba(0,0,0,0)"}}',
            app_screen_id: null,
            app_screen_widget_id: null,
            is_label: false,
            app_screen_widget_value_id: null
        },
        419: {
            content_id: 419,
            name: 'sales across brands',
            metadata: {},
            value: '{"data": [{"type": "bar", "x": ["waterhut", "drinksjet", "icex", "sodax", "softella"], "y": [642249869.8570938, 304865418.4946289, 236043426.3100586, 115761280.9508667, 33177264.272094727], "name": "brand", "marker": {"color": "#8A8AF28d", "line": {"color": "#8A8AF2", "width": 1.5}}}], "layout": {"barmode": "bar", "autosize": true, "automargin": true, "hovermode": "closest", "xaxis": {"title": {"text": "BRAND", "font": {"color": "#FFFFFF", "family": "Roboto"}}, "autorange": true, "showgrid": false, "gridwidth": 0.1}, "yaxis": {"title": {"text": "SUM_NET_REVENUE", "font": {"color": "#FFFFFF", "family": "Roboto"}}, "autorange": true, "gridwidth": 0.1, "showgrid": true, "gridcolor": "#213244"}, "legend": {"orientation": "h", "traceorder\\t": "normal", "x": 1, "y": 1.1, "yanchor": "auto", "xanchor": "auto", "valign": "top", "title": {"text": "brand", "font": {"color": "#FFFFFF", "family": "Roboto"}}}, "showlegend": true, "title": {"text": "SALES ACROSS BRANDS", "font": {"color": "#FFFFFF", "family": "Roboto"}}, "hoverlabel": {"font": {"size": 17}}, "font": {"family": "Roboto", "color": "#FFFFFF"}, "paper_bgcolor": "rgba(0,0,0,0)", "colorway": ["#8A8AF2", "#F5956B", "#65D7C5", "#F2D862", "#5BBAE5", "#BBE673", "#de577b", "#D3C6F7", "#3C90A9"], "plot_bgcolor": "rgba(0,0,0,0)"}}',
            app_screen_id: null,
            app_screen_widget_id: null,
            is_label: false,
            app_screen_widget_value_id: null
        },
        420: {
            content_id: 420,
            name: 'volume across brand',
            metadata: {},
            value: '{"data": [{"type": "bar", "x": ["waterhut", "drinksjet", "icex", "sodax", "softella"], "y": [7173200, 4793450, 1595160, 961670, 225840], "name": "brand", "marker": {"color": "#8A8AF28d", "line": {"color": "#8A8AF2", "width": 1.5}}}], "layout": {"barmode": "bar", "autosize": true, "automargin": true, "hovermode": "closest", "xaxis": {"title": {"text": "BRAND", "font": {"color": "#FFFFFF", "family": "Roboto"}}, "autorange": true, "showgrid": false, "gridwidth": 0.1}, "yaxis": {"title": {"text": "SUM_VOLUME", "font": {"color": "#FFFFFF", "family": "Roboto"}}, "autorange": true, "gridwidth": 0.1, "showgrid": true, "gridcolor": "#213244"}, "legend": {"orientation": "h", "traceorder\\t": "normal", "x": 1, "y": 1.1, "yanchor": "auto", "xanchor": "auto", "valign": "top", "title": {"text": "brand", "font": {"color": "#FFFFFF", "family": "Roboto"}}}, "showlegend": true, "title": {"text": "VOLUME ACROSS BRAND", "font": {"color": "#FFFFFF", "family": "Roboto"}}, "hoverlabel": {"font": {"size": 17}}, "font": {"family": "Roboto", "color": "#FFFFFF"}, "paper_bgcolor": "rgba(0,0,0,0)", "colorway": ["#8A8AF2", "#F5956B", "#65D7C5", "#F2D862", "#5BBAE5", "#BBE673", "#de577b", "#D3C6F7", "#3C90A9"], "plot_bgcolor": "rgba(0,0,0,0)"}}',
            app_screen_id: null,
            app_screen_widget_id: null,
            is_label: false,
            app_screen_widget_value_id: null
        },
        421: {
            content_id: 421,
            name: 'revenue across channel for icex',
            metadata: {},
            value: '{"data": [{"type": "bar", "x": ["large format stores", "small retailers", "restaurants"], "y": [87136088.60217285, 81465743.9185791, 67441593.78930664], "name": "channel", "marker": {"color": "#8A8AF28d", "line": {"color": "#8A8AF2", "width": 1.5}}}], "layout": {"barmode": "bar", "autosize": true, "automargin": true, "hovermode": "closest", "xaxis": {"title": {"text": "CHANNEL", "font": {"color": "#FFFFFF", "family": "Roboto"}}, "autorange": true, "showgrid": false, "gridwidth": 0.1}, "yaxis": {"title": {"text": "SUM_NET_REVENUE", "font": {"color": "#FFFFFF", "family": "Roboto"}}, "autorange": true, "gridwidth": 0.1, "showgrid": true, "gridcolor": "#213244"}, "legend": {"orientation": "h", "traceorder\\t": "normal", "x": 1, "y": 1.1, "yanchor": "auto", "xanchor": "auto", "valign": "top", "title": {"text": "channel", "font": {"color": "#FFFFFF", "family": "Roboto"}}}, "showlegend": true, "title": {"text": "REVENUE ACROSS CHANNEL FOR ICEX", "font": {"color": "#FFFFFF", "family": "Roboto"}}, "hoverlabel": {"font": {"size": 17}}, "font": {"family": "Roboto", "color": "#FFFFFF"}, "paper_bgcolor": "rgba(0,0,0,0)", "colorway": ["#8A8AF2", "#F5956B", "#65D7C5", "#F2D862", "#5BBAE5", "#BBE673", "#de577b", "#D3C6F7", "#3C90A9"], "plot_bgcolor": "rgba(0,0,0,0)"}}',
            app_screen_id: null,
            app_screen_widget_id: null,
            is_label: false,
            app_screen_widget_value_id: null
        }
    },
    layouts: [
        {
            id: 3,
            style: {
                gridTemplateAreas:
                    "\n                    'h h h h'\n                    '. v v .'\n                    '. v v .'\n                    '. v v .'\n                    't t t t'\n                "
            },
            layoutProps: {
                sections: [
                    {
                        component: 'header',
                        gridArea: 'h',
                        dataKey: 'h1',
                        rowCount: 1,
                        colCount: 4,
                        top: 0.2,
                        left: 0.2,
                        height: 1.48,
                        width: 15.6
                    },
                    {
                        component: 'visualContent',
                        gridArea: 'v',
                        dataKey: 'v1',
                        rowCount: 3,
                        colCount: 2,
                        top: 1.88,
                        left: 4.15,
                        height: 4.84,
                        width: 7.7
                    },
                    {
                        component: 'text',
                        gridArea: 't',
                        dataKey: 't1',
                        rowCount: 1,
                        colCount: 4,
                        top: 6.92,
                        left: 0.2,
                        height: 1.48,
                        width: 15.6
                    }
                ]
            },
            thumbnail: false
        },
        {
            id: 5,
            style: {
                gridTemplateAreas:
                    "\n                    'h h h h'\n                    'k k v v'\n                    'k k v v'\n                    'k k v v'\n                    't t t t'\n                "
            },
            layoutProps: {
                sections: [
                    {
                        component: 'header',
                        gridArea: 'h',
                        dataKey: 'h1',
                        rowCount: 1,
                        colCount: 4,
                        top: 0.2,
                        left: 0.2,
                        height: 1.48,
                        width: 15.6
                    },
                    {
                        component: 'keyFinding',
                        gridArea: 'k',
                        dataKey: 'k1',
                        rowCount: 2,
                        colCount: 2,
                        top: 1.88,
                        left: 0.2,
                        height: 4.84,
                        width: 7.7
                    },
                    {
                        component: 'visualContent',
                        gridArea: 'v',
                        dataKey: 'v1',
                        rowCount: 2,
                        colCount: 2,
                        top: 1.88,
                        left: 8.1,
                        height: 4.84,
                        width: 7.7
                    },
                    {
                        component: 'text',
                        gridArea: 't',
                        dataKey: 't1',
                        rowCount: 2,
                        colCount: 4,
                        top: 6.92,
                        left: 0.2,
                        height: 1.48,
                        width: 15.6
                    }
                ]
            },
            thumbnail: false
        },
        {
            id: 6,
            style: {
                gridTemplateAreas:
                    "\n                    'h h h h'\n                    't t v v'\n                    't t v v'\n                    't t v v'\n                    'k k k k'\n                "
            },
            layoutProps: {
                sections: [
                    {
                        component: 'header',
                        gridArea: 'h',
                        dataKey: 'h1',
                        rowCount: 1,
                        colCount: 4,
                        top: 0.2,
                        left: 0.2,
                        height: 1.48,
                        width: 15.6
                    },
                    {
                        component: 'text',
                        gridArea: 't',
                        dataKey: 't1',
                        rowCount: 3,
                        colCount: 2,
                        top: 1.88,
                        left: 0.2,
                        height: 4.84,
                        width: 7.7
                    },
                    {
                        component: 'visualContent',
                        gridArea: 'v',
                        dataKey: 'v1',
                        rowCount: 3,
                        colCount: 2,
                        top: 1.88,
                        left: 8.1,
                        height: 4.84,
                        width: 7.7
                    },
                    {
                        component: 'keyFinding',
                        gridArea: 'k',
                        dataKey: 'k1',
                        rowCount: 1,
                        colCount: 4,
                        top: 6.92,
                        left: 0.2,
                        height: 1.48,
                        width: 15.6
                    }
                ]
            },
            thumbnail: false
        },
        {
            id: 8,
            style: {
                gridTemplateAreas:
                    "\n                    'h h v1 v1'\n                    't1 t1 v1 v1'\n                    't1 t1 v1 v1'\n                    't1 t1 v1 v1'\n                    't2 t2 t2 t2'\n                "
            },
            layoutProps: {
                sections: [
                    {
                        component: 'header',
                        gridArea: 'h',
                        dataKey: 'h1',
                        rowCount: 1,
                        colCount: 2,
                        top: 0.2,
                        left: 0.2,
                        height: 1.48,
                        width: 7.7
                    },
                    {
                        component: 'visualContent',
                        gridArea: 'v1',
                        dataKey: 'v1',
                        rowCount: 3,
                        colCount: 2,
                        top: 0.2,
                        left: 8.1,
                        height: 6.52,
                        width: 7.7
                    },
                    {
                        component: 'text',
                        gridArea: 't1',
                        dataKey: 't1',
                        rowCount: 3,
                        colCount: 2,
                        top: 1.88,
                        left: 0.2,
                        height: 4.84,
                        width: 7.7
                    },
                    {
                        component: 'text',
                        gridArea: 't2',
                        dataKey: 't2',
                        rowCount: 1,
                        colCount: 4,
                        top: 6.92,
                        left: 8.1,
                        height: 1.48,
                        width: 7.7
                    }
                ]
            },
            thumbnail: false
        },
        {
            id: 9,
            style: {
                gridTemplateAreas:
                    "\n                    'v1 v1 h h'\n                    'v1 v1 t1 t1'\n                    'v1 v1 t1 t1'\n                    'v1 v1 t1 t1'\n                    't2 t2 t2 t2'\n                "
            },
            layoutProps: {
                sections: [
                    {
                        component: 'visualContent',
                        gridArea: 'v1',
                        dataKey: 'v1',
                        rowCount: 3,
                        colCount: 2,
                        top: 0.2,
                        left: 0.2,
                        height: 6.52,
                        width: 7.7
                    },
                    {
                        component: 'header',
                        gridArea: 'h',
                        dataKey: 'h1',
                        rowCount: 1,
                        colCount: 2,
                        top: 0.2,
                        left: 8.1,
                        height: 1.48,
                        width: 7.7
                    },
                    {
                        component: 'text',
                        gridArea: 't1',
                        dataKey: 't1',
                        rowCount: 3,
                        colCount: 2,
                        top: 1.88,
                        left: 8.1,
                        height: 4.84,
                        width: 7.7
                    },
                    {
                        component: 'text',
                        gridArea: 't2',
                        dataKey: 't2',
                        rowCount: 1,
                        colCount: 4,
                        top: 6.92,
                        left: 0.2,
                        height: 1.48,
                        width: 15.6
                    }
                ]
            },
            thumbnail: false
        },
        {
            id: 10,
            style: {
                gridTemplateAreas:
                    "\n                    'h h h h'\n                    'v v v v'\n                    'v v v v'\n                    'v v v v'\n                    't t t t'\n                "
            },
            layoutProps: {
                sections: [
                    {
                        component: 'header',
                        gridArea: 'h',
                        dataKey: 'h1',
                        rowCount: 1,
                        colCount: 4,
                        top: 0.2,
                        left: 0.2,
                        height: 1.48,
                        width: 15.6
                    },
                    {
                        component: 'visualContent',
                        gridArea: 'v',
                        dataKey: 'v1',
                        rowCount: 2,
                        colCount: 4,
                        top: 1.88,
                        left: 0.2,
                        height: 4.84,
                        width: 15.6
                    },
                    {
                        component: 'text',
                        gridArea: 't',
                        dataKey: 't1',
                        rowCount: 1,
                        colCount: 4,
                        top: 6.92,
                        left: 0.2,
                        height: 1.48,
                        width: 15.6
                    }
                ]
            },
            thumbnail: false
        },
        {
            id: 12,
            style: {
                gridTemplateAreas:
                    "\n                    'h h h h'\n                    't t t t'\n                    't t t t'\n                    't t t t'\n                    't t t t'\n                "
            },
            layoutProps: {
                sections: [
                    {
                        component: 'header',
                        gridArea: 'h',
                        dataKey: 'h1',
                        rowCount: 1,
                        colCount: 4,
                        top: 0.2,
                        left: 0.2,
                        height: 1.48,
                        width: 15.6
                    },
                    {
                        component: 'text',
                        gridArea: 't',
                        dataKey: 't1',
                        rowCount: 4,
                        colCount: 4,
                        top: 1.88,
                        left: 0.2,
                        height: 6.52,
                        width: 15.6
                    }
                ]
            },
            thumbnail: false
        },
        {
            id: 13,
            style: {
                gridTemplateAreas:
                    "\n                    't t t t'\n                    't t t t'\n                    't t t t'\n                    't t t t'\n                    't t t t'\n                "
            },
            layoutProps: {
                sections: [
                    {
                        component: 'text',
                        gridArea: 't',
                        dataKey: 't1',
                        rowCount: 5,
                        colCount: 4,
                        top: 0.2,
                        left: 0.2,
                        height: 8.2,
                        width: 15.6
                    }
                ]
            },
            thumbnail: false
        },
        {
            id: 2,
            style: {
                gridTemplateAreas:
                    "\n                    'h h h h'\n                    'v v t t'\n                    'v v t t'\n                    'v v t t'\n                    'k k k k'\n                "
            },
            layoutProps: {
                sections: [
                    {
                        component: 'header',
                        gridArea: 'h',
                        dataKey: 'h1',
                        rowCount: 1,
                        colCount: 4,
                        top: 0.2,
                        left: 0.2,
                        height: 1.48,
                        width: 15.6
                    },
                    {
                        component: 'visualContent',
                        gridArea: 'v',
                        dataKey: 'v1',
                        rowCount: 3,
                        colCount: 2,
                        top: 1.88,
                        left: 0.2,
                        height: 4.84,
                        width: 7.7
                    },
                    {
                        component: 'text',
                        gridArea: 't',
                        dataKey: 't1',
                        rowCount: 3,
                        colCount: 2,
                        top: 1.88,
                        left: 8.1,
                        height: 4.84,
                        width: 7.7
                    },
                    {
                        component: 'keyFinding',
                        gridArea: 'k',
                        dataKey: 'k1',
                        rowCount: 1,
                        colCount: 4,
                        top: 6.92,
                        left: 0.2,
                        height: 1.48,
                        width: 15.6
                    }
                ]
            },
            thumbnail: false
        },
        {
            id: 1,
            style: {
                gridTemplateAreas:
                    "\n                    'h h h h'\n                    'v v k k'\n                    'v v k k'\n                    'v v k k'\n                    't t t t'\n                "
            },
            layoutProps: {
                sections: [
                    {
                        component: 'header',
                        gridArea: 'h',
                        dataKey: 'h1',
                        rowCount: 1,
                        colCount: 4,
                        top: 0.2,
                        left: 0.2,
                        height: 1.48,
                        width: 15.6
                    },
                    {
                        component: 'visualContent',
                        gridArea: 'v',
                        dataKey: 'v1',
                        rowCount: 3,
                        colCount: 2,
                        top: 1.88,
                        left: 0.2,
                        height: 4.84,
                        width: 7.7
                    },
                    {
                        component: 'keyFinding',
                        gridArea: 'k',
                        dataKey: 'k1',
                        rowCount: 3,
                        colCount: 2,
                        top: 1.88,
                        left: 8.1,
                        height: 4.84,
                        width: 7.7
                    },
                    {
                        component: 'text',
                        gridArea: 't',
                        dataKey: 't1',
                        rowCount: 1,
                        colCount: 4,
                        top: 6.92,
                        left: 0.2,
                        height: 1.48,
                        width: 15.6
                    }
                ]
            },
            thumbnail: false
        },
        {
            id: 4,
            style: {
                gridTemplateAreas:
                    "\n                    'h h h h'\n                    'v1 v1 v2 v2'\n                    'v1 v1 v2 v2'\n                    'v1 v1 v2 v2'\n                    't t t t'\n                "
            },
            layoutProps: {
                sections: [
                    {
                        component: 'header',
                        gridArea: 'h',
                        dataKey: 'h1',
                        rowCount: 1,
                        colCount: 4,
                        top: 0.2,
                        left: 0.2,
                        height: 1.48,
                        width: 15.6
                    },
                    {
                        component: 'visualContent',
                        gridArea: 'v1',
                        dataKey: 'v1',
                        rowCount: 2,
                        colCount: 3,
                        top: 1.88,
                        left: 0.2,
                        height: 4.84,
                        width: 7.7
                    },
                    {
                        component: 'visualContent',
                        gridArea: 'v2',
                        dataKey: 'v2',
                        rowCount: 2,
                        colCount: 3,
                        top: 1.88,
                        left: 8.1,
                        height: 4.84,
                        width: 7.7
                    },
                    {
                        component: 'text',
                        gridArea: 't',
                        dataKey: 't1',
                        rowCount: 1,
                        colCount: 4,
                        top: 6.92,
                        left: 0.2,
                        height: 1.48,
                        width: 15.6
                    }
                ]
            },
            thumbnail: false
        },
        {
            id: 7,
            style: {
                gridTemplateAreas:
                    "\n                    'h h h h'\n                    'v1 v1 v2 v2'\n                    'v1 v1 v2 v2'\n                    'v1 v1 v2 v2'\n                    't1 t1 t2 t2'\n                "
            },
            layoutProps: {
                sections: [
                    {
                        component: 'header',
                        gridArea: 'h',
                        dataKey: 'h1',
                        rowCount: 1,
                        colCount: 4,
                        top: 0.2,
                        left: 0.2,
                        height: 1.48,
                        width: 15.6
                    },
                    {
                        component: 'visualContent',
                        gridArea: 'v1',
                        dataKey: 'v1',
                        rowCount: 2,
                        colCount: 3,
                        top: 1.88,
                        left: 0.2,
                        height: 4.84,
                        width: 7.7
                    },
                    {
                        component: 'visualContent',
                        gridArea: 'v2',
                        dataKey: 'v2',
                        rowCount: 2,
                        colCount: 3,
                        top: 1.88,
                        left: 8.1,
                        height: 4.84,
                        width: 7.7
                    },
                    {
                        component: 'text',
                        gridArea: 't1',
                        dataKey: 't1',
                        rowCount: 1,
                        colCount: 2,
                        top: 6.92,
                        left: 0.2,
                        height: 1.48,
                        width: 7.7
                    },
                    {
                        component: 'text',
                        gridArea: 't2',
                        dataKey: 't2',
                        rowCount: 1,
                        colCount: 2,
                        top: 6.92,
                        left: 8.1,
                        height: 1.48,
                        width: 7.7
                    }
                ]
            },
            thumbnail: false
        },
        {
            id: 11,
            style: {
                gridTemplateAreas:
                    "\n                    't1 t1 h h'\n                    't1 t1 t2 t2'\n                    't1 t1 v1 v1'\n                    't1 t1 v1 v1'\n                    't1 t1 v1 v1'\n                "
            },
            layoutProps: {
                sections: [
                    {
                        component: 'text',
                        gridArea: 't1',
                        dataKey: 't1',
                        rowCount: 5,
                        colCount: 2,
                        top: 0.2,
                        left: 0.2,
                        height: 8.2,
                        width: 7.7
                    },
                    {
                        component: 'header',
                        gridArea: 'h',
                        dataKey: 'h1',
                        rowCount: 1,
                        colCount: 2,
                        top: 0.2,
                        left: 8.1,
                        height: 1.48,
                        width: 7.7
                    },
                    {
                        component: 'text',
                        gridArea: 't2',
                        dataKey: 't2',
                        rowCount: 1,
                        colCount: 2,
                        top: 1.88,
                        left: 8.1,
                        height: 1.48,
                        width: 7.7
                    },
                    {
                        component: 'visualContent',
                        gridArea: 'v1',
                        dataKey: 'v1',
                        rowCount: 3,
                        colCount: 2,
                        top: 3.56,
                        left: 8.1,
                        height: 4.84,
                        width: 7.7
                    }
                ]
            },
            thumbnail: false
        }
    ],
    pages: [
        {
            pIndex: 0,
            id: 274,
            layoutId: 4,
            style: {
                gridTemplateAreas:
                    "\n                    'h h h h'\n                    'v1 v1 v2 v2'\n                    'v1 v1 v2 v2'\n                    'v1 v1 v2 v2'\n                    't t t t'\n                "
            },
            layoutProps: {
                sections: [
                    {
                        component: 'header',
                        gridArea: 'h',
                        dataKey: 'h1',
                        rowCount: 1,
                        colCount: 4,
                        top: 0.2,
                        left: 0.2,
                        height: 1.48,
                        width: 15.6
                    },
                    {
                        component: 'visualContent',
                        gridArea: 'v1',
                        dataKey: 'v1',
                        rowCount: 2,
                        colCount: 3,
                        top: 1.88,
                        left: 0.2,
                        height: 4.84,
                        width: 7.7
                    },
                    {
                        component: 'visualContent',
                        gridArea: 'v2',
                        dataKey: 'v2',
                        rowCount: 2,
                        colCount: 3,
                        top: 1.88,
                        left: 8.1,
                        height: 4.84,
                        width: 7.7
                    },
                    {
                        component: 'text',
                        gridArea: 't',
                        dataKey: 't1',
                        rowCount: 1,
                        colCount: 4,
                        top: 6.92,
                        left: 0.2,
                        height: 1.48,
                        width: 15.6
                    }
                ]
            },
            data: {
                v1: 397,
                v2: 399
            }
        },
        {
            pIndex: 1,
            id: 275,
            layoutId: 7,
            style: {
                gridTemplateAreas:
                    "\n                    'h h h h'\n                    'v1 v1 v2 v2'\n                    'v1 v1 v2 v2'\n                    'v1 v1 v2 v2'\n                    't1 t1 t2 t2'\n                "
            },
            layoutProps: {
                sections: [
                    {
                        component: 'header',
                        gridArea: 'h',
                        dataKey: 'h1',
                        rowCount: 1,
                        colCount: 4,
                        top: 0.2,
                        left: 0.2,
                        height: 1.48,
                        width: 15.6
                    },
                    {
                        component: 'visualContent',
                        gridArea: 'v1',
                        dataKey: 'v1',
                        rowCount: 2,
                        colCount: 3,
                        top: 1.88,
                        left: 0.2,
                        height: 4.84,
                        width: 7.7
                    },
                    {
                        component: 'visualContent',
                        gridArea: 'v2',
                        dataKey: 'v2',
                        rowCount: 2,
                        colCount: 3,
                        top: 1.88,
                        left: 8.1,
                        height: 4.84,
                        width: 7.7
                    },
                    {
                        component: 'text',
                        gridArea: 't1',
                        dataKey: 't1',
                        rowCount: 1,
                        colCount: 2,
                        top: 6.92,
                        left: 0.2,
                        height: 1.48,
                        width: 7.7
                    },
                    {
                        component: 'text',
                        gridArea: 't2',
                        dataKey: 't2',
                        rowCount: 1,
                        colCount: 2,
                        top: 6.92,
                        left: 8.1,
                        height: 1.48,
                        width: 7.7
                    }
                ]
            },
            data: {
                v1: 398,
                v2: 400
            }
        }
    ]
};
