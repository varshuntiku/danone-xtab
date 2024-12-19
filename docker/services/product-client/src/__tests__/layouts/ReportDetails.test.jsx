import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import ReportDetails from '../../layouts/ReportDetails';
import { vi } from 'vitest';

vi.mock('services/reports.js', () => {
    return {
        getStory: ({ callback }) => {
            const StoryObj1 = {
                story_id: 179,
                id_token:
                    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjEwMjgyMDcxODk1LCJpYXQiOjE2NDIwNzE4OTUsInN1YiI6ImRhdGFfc3RvcnlfaWRfdG9rZW4iLCJzdG9yeV9pZCI6MTc5fQ.ZbX65rqjMCbxlbbDQg4vn1fxeQnMbBK1L20ROCmloIY',
                name: 'test 15th ',
                description: 'test',
                app_id: [26],
                created_by: {
                    first_name: 'system',
                    last_name: 'appplication'
                },
                content: {
                    0: {
                        content_id: 528,
                        name: 'sales across brands',
                        metadata: {
                            test_key: 'test_value'
                        },
                        value: '{"data": [{"type": "bar", "x": ["waterhut", "drinksjet", "icex", "sodax", "softella"], "y": [642249869.8570938, 304865418.4946289, 236043426.3100586, 115761280.9508667, 33177264.272094727], "name": "brand", "marker": {"color": "#8A8AF28d", "line": {"color": "#8A8AF2", "width": 1.5}}}], "layout": {"barmode": "bar", "autosize": true, "automargin": true, "hovermode": "closest", "xaxis": {"title": {"text": "BRAND", "font": {"color": "#FFFFFF", "family": "Roboto"}}, "autorange": true, "showgrid": false, "gridwidth": 0.1}, "yaxis": {"title": {"text": "SUM_NET_REVENUE", "font": {"color": "#FFFFFF", "family": "Roboto"}}, "autorange": true, "gridwidth": 0.1, "showgrid": true, "gridcolor": "#213244"}, "legend": {"orientation": "h", "traceorder\\t": "normal", "x": 1, "y": 1.1, "yanchor": "auto", "xanchor": "auto", "valign": "top", "title": {"text": "brand", "font": {"color": "#FFFFFF", "family": "Roboto"}}}, "showlegend": true, "title": {"text": "SALES ACROSS BRANDS", "font": {"color": "#FFFFFF", "family": "Roboto"}}, "hoverlabel": {"font": {"size": 17}}, "font": {"family": "Roboto", "color": "#FFFFFF"}, "paper_bgcolor": "rgba(0,0,0,0)", "colorway": ["#8A8AF2", "#F5956B", "#65D7C5", "#F2D862", "#5BBAE5", "#BBE673", "#de577b", "#D3C6F7", "#3C90A9"], "plot_bgcolor": "rgba(0,0,0,0)"}}',
                        app_screen_id: null,
                        app_screen_widget_id: null,
                        is_label: false,
                        app_screen_widget_value_id: null,
                        description: {}
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
                        id: 455,
                        layoutId: 3,
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
                        data: {
                            v1: 528
                        }
                    }
                ]
            };
            callback(StoryObj1);
        },
        updateStory: ({ callback }) => {
            callback({ message: 'success' });
        }
    };
});

vi.mock('../../components/AppWidgetPlot', () => {
    return { default: (props) => <div> Mock AppWidgetPlot Component</div> };
});
vi.mock('../../layouts/PreviewReports', () => ({
    default: (props) => {
        return (
            <div>
                Mock PreviewReports Component
                <button aria-label="close-preview" onClick={props.onClose}>
                    Test closeRenderedPreviewReports
                </button>
            </div>
        );
    }
}));

// const mockLocalStorage = (function () {
//     let store = {
//         'codx-products-theme': 'light'
//     };

//     return {
//         getItem: function (key) {
//             return store[key] || null;
//         },
//         setItem: function (key, value) {
//             store[key] = value.toString();
//         },
//         removeItem: function (key) {
//             delete store[key];
//         },
//         clear: function () {
//             store = {};
//         }
//     };
// })();

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts ReportDetails Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ReportDetails match={{ params: { story_id: 1 } }} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render layouts ReportDetails Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ReportDetails match={{ params: { story_id: 1 } }} />
                </Router>
            </CustomThemeContextProvider>
        );
        const button = screen.getByLabelText('Delete');
        fireEvent.click(button);
        expect(screen.getByText('Preview Story', { exact: false })).toBeInTheDocument();
    });

    test('Should render layouts ReportDetails Component 1', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ReportDetails match={{ params: { story_id: 1 } }} history={history} />
                </Router>
            </CustomThemeContextProvider>
        );
        const button = screen.getByLabelText('ArrowBackIos');
        fireEvent.click(button);
        //expect(screen.getByText('Preview Story', { exact: false })).toBeInTheDocument()
    });

    test('Should render layouts ReportDetails Component 1', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ReportDetails match={{ params: { story_id: 1 } }} history={history} />
                </Router>
            </CustomThemeContextProvider>
        );
        const button = screen.getByLabelText('save');
        fireEvent.click(button);
        //expect(screen.getByText('Preview Story', { exact: false })).toBeInTheDocument()
    });

    test('Should render layouts ReportDetails Component 1', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ReportDetails match={{ params: { story_id: 1 } }} history={history} />
                </Router>
            </CustomThemeContextProvider>
        );
        const delButton = screen.getByLabelText('Delete');
        fireEvent.click(delButton);
        const button = screen.getByLabelText('undo');
        fireEvent.click(button);
        //expect(screen.getByText('Preview Story', { exact: false })).toBeInTheDocument()
    });

    test('Should render layouts ReportDetails Component 1', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ReportDetails match={{ params: { story_id: 1 } }} history={history} />
                </Router>
            </CustomThemeContextProvider>
        );
        const button = screen.getByLabelText('preview');
        fireEvent.click(button);
        fireEvent.click(screen.getByLabelText('close-preview'));
        //expect(screen.getByText('Preview Story', { exact: false })).toBeInTheDocument()
    });

    test('Should render layouts ReportDetails Component 1', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ReportDetails match={{ params: { story_id: 1 } }} history={history} />
                </Router>
            </CustomThemeContextProvider>
        );
        const button = screen.getByLabelText('thumbnail');
        fireEvent.click(button);
    });
});
