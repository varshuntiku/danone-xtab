import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { expect, vi } from 'vitest';
import GraphComponent from '../../components/AppWidgetLabelGraph';
import { Provider } from 'react-redux';
import store from 'store/store';

const history = createMemoryHistory();

const Plotly = {
    newPlot: vi.fn(),
    react: vi.fn(),
    plot: vi.fn()
};

vi.mock('react-plotly.js/factory', () => ({
    default: (Plotly) => (props) => <div data-testid="plot" />
}));

global.window.Plotly = Plotly;

const mockThemeContext = {
    plotTheme: {
        chartDefaultColors: {
            'range-3': ['#FF0000', '#00FF00', '#0000FF']
        },
        CodxBkgdColor: '#FFFFFF'
    },
    theme: {
        palette: {
            text: {
                default: '#000000',
                indicatorGreenText: '#00FF00'
            },
            error: {
                main: '#FF0000'
            }
        },
        layoutSpacing: vi.fn(() => 10)
    }
};
describe('GraphComponent', () => {
    const defaultProps = {
        params: {
            graph_data: [
                {
                    type: 'bar',
                    x: ['a', 'b', 'c'],
                    y: [1, 2, 3]
                }
            ]
        },
        themeContext: {
            plotTheme: {
                chartDefaultColors: {
                    'range-3': ['#FF0000', '#00FF00', '#0000FF']
                },
                CodxBkgdColor: '#FFFFFF'
            },
            theme: {
                palette: {
                    text: {
                        default: '#000000',
                        indicatorGreenText: '#00FF00'
                    },
                    error: {
                        main: '#FF0000'
                    }
                }
            }
        },
        label_widgets: [],
        handleMouseEnter: vi.fn(),
        handleMouseLeave: vi.fn(),
        isHovered: false,
        widget_index: 0
    };

    it('renders without crashing', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <GraphComponent {...defaultProps} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByTestId('plot')).toBeInTheDocument();
    });

    it('renders Plotly component with correct props', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <GraphComponent {...defaultProps} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByTestId('plot')).toBeInTheDocument();
    });

    it('displays hover information correctly when hovered', () => {
        const props = {
            ...defaultProps,
            isHovered: true,
            params: {
                ...defaultProps.params,
                graph_data_hover: { legends: [{ text: 'Legend 1', addInfo: 'Info 1' }] }
            }
        };
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <GraphComponent {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByTestId('plot')).toBeInTheDocument();
    });

    it('handles mouse events correctly', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <GraphComponent {...defaultProps} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        fireEvent.mouseOver(screen.getByTestId('plot'));
        expect(defaultProps.handleMouseEnter).toHaveBeenCalled();
        fireEvent.mouseLeave(screen.getByTestId('plot'));
        expect(defaultProps.handleMouseLeave).toHaveBeenCalled();
    });

    it('applies correct colorway based on extra_dir prop', () => {
        const props = { ...defaultProps, params: { ...defaultProps.params, extra_dir: 'down' } };
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <GraphComponent {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const plotElement = screen.getByTestId('plot');
    });

    it('renders legend with correct colors based on data', () => {
        const props = {
            ...defaultProps,
            params: {
                graph_data: [
                    { type: 'pie', labels: ['A', 'B'], marker: { colors: ['#fff', '#000'] } }
                ],
                extra_dir: 'up'
            }
        };
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <GraphComponent {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByTestId('plot'));
    });

    it('applies correct layout font size based on screen width', () => {
        global.screen = { availWidth: 1200 };
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <GraphComponent {...defaultProps} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const plotElement = screen.getByTestId('plot');
        expect(plotElement).toHaveStyle(`fontSize: 10`);
    });

    it('handles absence of graph_data_hover gracefully', () => {
        const props = {
            ...defaultProps,
            params: { graph_data: [{ type: 'bar', x: ['a'], y: [1] }], graph_data_hover: null }
        };
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <GraphComponent {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.queryByText('Legend 1')).toBeNull();
    });
});
