import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import AppWidgetTestLearn from '../../components/AppWidgetTestLearn';
import CustomThemeContextProvider from '../../themes/customThemeContext';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);
    test('Should render AppWidgetTestLearn Component', () => {
        const props = {
            params: {
                assumptions: false,
                test_learn_data: {
                    goto: '/campaign-lift/model-output',
                    compare: {
                        fields: [
                            {
                                name: 'Measure Select',
                                options: [
                                    'Actual VS Expected',
                                    'Same Market Last Year',
                                    'Same Year Different Market'
                                ],
                                value: 'Same Market Last Year'
                            }
                        ],
                        name: 'Control Select'
                    },
                    compare1: {
                        fields: [
                            {
                                name: 'Country',
                                options: ['US', 'UK', 'Europe', 'not applicable'],
                                value: 'US'
                            },
                            {
                                name: 'Region',
                                options: ['Region 1', 'Region 2', 'All', 'not applicable'],
                                value: 'All'
                            },
                            {
                                name: 'DMA',
                                options: ['DMA 1', 'DMA 2', 'DMA 3', 'not applicable'],
                                value: 'DMA 1'
                            },
                            {
                                name: 'City',
                                options: ['City 1', 'City 2', 'All', 'not applicable'],
                                value: 'All'
                            }
                        ],
                        name: 'Most Impacted Geography Before Campaign '
                    },
                    compare2: {
                        fields: [
                            {
                                name: 'Paid/Free',
                                options: ['All', 'Paid', 'Free'],
                                value: 'All'
                            },
                            {
                                name: 'Channel Funnel',
                                options: [
                                    'Channel Funnel 1',
                                    'Channel Funnel 2',
                                    'Channel Funnel 3',
                                    'All'
                                ],
                                value: 'All'
                            },
                            {
                                name: 'Channel Type',
                                options: ['Websites', 'Email', 'Digital advertising', 'All'],
                                value: 'All'
                            },
                            {
                                name: 'Date Range',
                                type: 'date_range',
                                start_date: null,
                                end_date: null
                            }
                        ],
                        name: 'Specific Channels'
                    },
                    compare3: {
                        fields: [
                            {
                                name: 'Measure',
                                options: ['Sales', 'Customers', 'Visits', 'Orders'],
                                value: 'Visits'
                            }
                        ],
                        name: 'Measure Performance'
                    },
                    name: 'Incremental Tool Lift',
                    sample: {
                        fields: [
                            {
                                name: 'Business Channel',
                                options: ['Total', 'Retail Chain', 'E-Commerse', 'not applicable'],
                                value: 'Total',
                                multiple: true
                            },
                            {
                                name: 'Web Visiter',
                                options: ['All', 'New', 'Returning', 'not applicable'],
                                value: 'All'
                            },
                            {
                                name: 'Customer',
                                options: ['All', 'New', 'Returning', 'not applicable'],
                                value: 'All'
                            },
                            {
                                name: 'Product Category ',
                                options: [
                                    'Product Category 1',
                                    'Product Category 2',
                                    'Product Category 3',
                                    'not applicable'
                                ],
                                value: 'Product Category 1'
                            },
                            {
                                name: 'Product Sub Category',
                                options: [
                                    'Product Sub Category 1',
                                    'Product Sub Categor 2',
                                    'Product Sub Category 3',
                                    'not applicable'
                                ],
                                value: 'Product Sub Category 1'
                            }
                        ],
                        name: 'Narrow Measurement'
                    },
                    test: {
                        fields: [
                            {
                                name: 'Country',
                                options: ['US', 'UK', 'Europe', 'not applicable'],
                                value: 'US'
                            },
                            {
                                name: 'Region',
                                options: ['Region 1', 'Region 2', 'All', 'not applicable'],
                                value: 'All'
                            },
                            {
                                name: 'DMA',
                                options: ['DMA 1', 'DMA 2', 'DMA 3', 'not applicable'],
                                value: 'DMA 1'
                            },
                            {
                                name: 'City',
                                options: ['City 1', 'City 2', 'All', 'not applicable'],
                                value: 'All'
                            }
                        ],
                        name: 'Most Impacted Geography'
                    }
                }
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetTestLearn {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getAllByLabelText('graph-option')).not.toBeNull();
        const firstGraphOption = screen.getAllByLabelText('graph-option')[0];
        fireEvent.click(firstGraphOption);
        expect(screen.getByText('Retail Chain')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Retail Chain'));
        expect(screen.getByText('Business Channel')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Business Channel'));
    });
});
