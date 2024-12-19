import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import AppWidgetSimulator from '../../components/AppWidgetSimulator';
import CustomThemeContextProvider from '../../themes/customThemeContext';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);
    test('Should render AppWidgetPlot Component', () => {
        const props = {
            simulatorInfo: {
                sections: [
                    {
                        header: 'Inputs',
                        inputs: [
                            {
                                input_type: 'number',
                                id: 'n_sku_shortlisted',
                                label: "# of SKU's to be shortlisted",
                                value: '15',
                                max: 1,
                                min: 0,
                                steps: 1
                            },
                            {
                                input_type: 'upload',
                                id: 'sku_upload',
                                label: 'SKU Inclusion/Exclusion File Upload',
                                value: []
                            },
                            {
                                input_type: 'text',
                                id: 'sku_upload',
                                label: 'SKU Inclusion/Exclusion File Upload',
                                value: []
                            },
                            {
                                input_type: 'radio',
                                id: 'negative_incrementality',
                                label: "Negative Incrementality SKU's",
                                value: 'No',
                                options: ['Yes', 'No']
                            },
                            {
                                input_type: 'dropdown',
                                id: 'negative_incrementality',
                                label: "Negative Incrementality SKU's",
                                value: 'No',
                                options: ['Yes', 'No']
                            }
                        ]
                    },
                    {
                        header: 'SKU Segment levers',
                        inputs: [
                            {
                                input_type: 'slider',
                                id: 'kits',
                                label: 'Kits',
                                value: '5',
                                max: 10,
                                min: 1,
                                steps: 1
                            },
                            {
                                input_type: 'slider',
                                id: 'components',
                                label: 'Components',
                                value: '3',
                                max: 10,
                                min: 1,
                                steps: 1
                            },
                            {
                                input_type: 'slider',
                                id: 'accompaniments',
                                label: 'Accompaniments',
                                value: '7',
                                max: 10,
                                min: 1,
                                steps: 1
                            }
                        ]
                    },
                    {
                        header: 'Metric Significance (Weights)',
                        inputs: [
                            {
                                input_type: 'slider',
                                id: 'incrementality_score',
                                label: 'Incrementality Score',
                                value: '0.6',
                                max: 1,
                                min: 0,
                                steps: 0.1
                            },
                            {
                                input_type: 'slider',
                                id: 'value',
                                label: 'Value',
                                value: '0.4',
                                max: 1,
                                min: 0,
                                steps: 0.1
                            },
                            {
                                input_type: 'slider',
                                id: 'rate_of_sales',
                                label: 'Rate of Sales',
                                value: '0.1',
                                max: 1,
                                min: 0,
                                steps: 0.1
                            },
                            {
                                input_type: 'slider',
                                id: 'value_yoy',
                                label: 'Value YoY',
                                value: '0.1',
                                max: 1,
                                min: 0,
                                steps: 0.1
                            }
                        ]
                    }
                ],
                actions: [
                    {
                        name: 'Analyze Changes',
                        variant: 'contained',
                        type: 'primary',
                        action: 'change',
                        action_flag_type: 'Slider section Analyse Changes'
                    },
                    {
                        name: 'Reset to Defalut',
                        variant: 'outlined',
                        type: 'reset',
                        action: 'reset',
                        action_flag_type: 'random'
                    }
                ]
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetSimulator {...props} size_nooverride={true} />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByRole('button', { name: 'Simulate' }));
        const numberSimulatorInput = screen.getAllByLabelText('Without label')[0];
        //fireEvent.change(numberSimulatorInput, {target: {value: '5'}})
    });
});
