import { render, screen, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { expect, vi } from 'vitest';
import Analysis from '../../../components/DigitalTwin/Analysis';
import { Provider } from 'react-redux';
import store from 'store/store';
import '@testing-library/jest-dom/extend-expect';

const history = createMemoryHistory();

describe('Analysis Component', () => {
    const mockData = {
        displayKPI: 'metric1',
        actionOpen: 'action1',
        digitaltwin_data: {
            action1: {
                extra_filters: [
                    {
                        name: 'Filter 1',
                        options: [
                            { value: 'opt1', label: 'Option 1' },
                            { value: 'opt2', label: 'Option 2' }
                        ],
                        multiselect: false
                    }
                ]
            }
        },
        analysis_filters: {
            'Filter 1': 'opt1'
        },
        actionPlot: 'Plot Content',
        actionLoading: false
    };

    const mockOptions = [
        { value: 'metric1', label: 'Metric 1' },
        { value: 'metric2', label: 'Metric 2' }
    ];

    const mockOnChangeDropDown = vi.fn();

    const renderComponent = (props = {}) =>
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Analysis
                            data={mockData}
                            classes={{}}
                            display_kpi_options={mockOptions}
                            onChangeDropDown={mockOnChangeDropDown}
                            {...props}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

    it('renders correctly with default props', () => {
        renderComponent();

        expect(screen.getByText('Filters')).toBeInTheDocument();
        expect(screen.getByText('Plot Content')).toBeInTheDocument();
    });

    it('displays loader when actionLoading is true', () => {
        const loadingData = { ...mockData, actionLoading: true };
        renderComponent({ data: loadingData });
        const loader = screen.getByTestId('loader');
        expect(loader).toBeInTheDocument();
    });

    it('displays selected options in the dropdown', () => {
        renderComponent();

        expect(screen.getByText('Metric 1')).toBeInTheDocument();
    });

    it('handles multiple selections', () => {
        const multiSelectData = {
            ...mockData,
            actionOpen: 'action1',
            digitaltwin_data: {
                action1: {
                    extra_filters: [
                        {
                            name: 'Filter 2',
                            options: [
                                { value: 'opt3', label: 'Option 3' },
                                { value: 'opt4', label: 'Option 4' }
                            ],
                            multiselect: true
                        }
                    ]
                }
            },
            analysis_filters: {
                'Filter 2': ['opt3', 'opt4']
            }
        };

        renderComponent({ data: multiSelectData });

        expect(screen.getByText('Filter 2')).toBeInTheDocument();
    });
});
