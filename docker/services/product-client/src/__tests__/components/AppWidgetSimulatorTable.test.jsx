import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import AppWidgetTableSimulator from '../../components/AppWidgetTableSimulator';
import CustomThemeContextProvider from '../../themes/customThemeContext';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);
    test('Should render AppWidgetPlot Component', () => {
        const props = {
            params: {
                aux_table: {
                    name: 'Scenario Planner',
                    columns: [
                        '~',
                        'NPD SKUs',
                        'Power SKUs',
                        'Non-Core SKUs',
                        'Product Range',
                        'GMI Revenue($ Mn)'
                    ],
                    rows: [
                        [
                            {
                                value: 'As is Scenario',
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: 3,
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: 10,
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: 58,
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: '82%',
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: 48,
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            }
                        ],
                        [
                            {
                                value: 'Recommended',
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: 5,
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: 8,
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: 56,
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: '90%',
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: 50,
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            }
                        ],
                        [
                            {
                                value: 'Modified',
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: 5,
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: 8,
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: 56,
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: '90%',
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: 50,
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            }
                        ]
                    ],
                    buttons: [
                        {
                            name: 'Download Scenario Sheet',
                            variant: 'contained',
                            type: 'primary',
                            action: 'download',
                            action_flag_type: false
                        },
                        {
                            name: 'Download',
                            variant: 'contained',
                            type: 'primary',
                            action: 'download',
                            action_flag_type: true
                        }
                    ]
                },
                is_table_simulator: true,
                main_table: {
                    name: '',
                    columns: [
                        'SKU ID',
                        'Item Desc/Brand',
                        'SKU Type',
                        'Current Status',
                        'Algo Recomm.',
                        'Estimated Range (%) Impact',
                        'Estimated Revenue Impact ($ Mn)',
                        'User Input(Confirm?)',
                        'User Input Forecasts',
                        'Delete Icon'
                    ],
                    rows: [
                        [
                            {
                                value: 'OEP AAA',
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: 'Old El Passo',
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: 'Non-Core',
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: 'Listed',
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: 'Delist',
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: '87% (-3%)',
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: -1.2,
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: 'Confirm',
                                indicator: 'neutral',
                                select_values: ['Confirm', 'List', 'De-List']
                            },
                            { value: 0, indicator: 'input' },
                            {
                                indicator: 'action-icon',
                                type: 'delete',
                                icon_color: '#FFFFFF',
                                action_flag_type: 'flag_delete'
                            }
                        ],
                        [
                            {
                                value: 'OEP XYZ',
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: 'Old El Passo',
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: 'Non-Core',
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: 'Listed',
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: 'Delist',
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: '84% (-3%)',
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: -1.2,
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: 'Confirm',
                                indicator: 'down',
                                select_values: ['Confirm', 'List', 'De-List']
                            },
                            { value: 0, indicator: 'input' },
                            {
                                indicator: 'action-icon',
                                type: 'delete',
                                icon_color: '#FFFFFF',
                                action_flag_type: 'flag_delete'
                            }
                        ],
                        [
                            {
                                value: 'OEP ZZZ',
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: 'Old El Passo',
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: 'NPD',
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: 'Not Listed',
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: 'Add',
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: '85% (+1%)',
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: 2,
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: 'Confirm',
                                indicator: 'up',
                                select_values: ['Confirm', 'List', 'De-List']
                            },
                            { value: 0, indicator: 'input' },
                            {
                                indicator: 'action-icon',
                                type: 'delete',
                                icon_color: '#FFFFFF',
                                action_flag_type: 'flag_delete'
                            }
                        ],
                        [
                            {
                                value: 'OEP BBB',
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: 'Old El Passo',
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: 'NPD',
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: 'Not Listed',
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: 'Add',
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: '86% (+1%)',
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: 3,
                                indicator: '',
                                alt_behaviour: false,
                                suffix: '',
                                prefix: '',
                                formatted: false
                            },
                            {
                                value: 'Confirm',
                                indicator: 'dropdown',
                                select_values: ['Confirm', 'List', 'De-List']
                            },
                            { value: 0, indicator: 'input' },
                            {
                                indicator: 'action-icon',
                                type: 'delete',
                                icon_color: '#FFFFFF',
                                action_flag_type: false
                            }
                        ]
                    ],
                    buttons: [
                        {
                            name: 'Analyze Changes',
                            variant: 'contained',
                            type: 'primary',
                            action: 'change',
                            action_flag_type: false
                        },
                        {
                            name: 'Reset to Defalut',
                            variant: 'outlined',
                            type: 'reset',
                            action: 'reset',
                            action_flag_type: false
                        },
                        {
                            name: 'Submit    ',
                            variant: 'outlined',
                            type: 'submit',
                            action: 'submit',
                            action_flag_type: false
                        },
                        {
                            name: 'Upload Latest Constraints',
                            variant: 'outlined',
                            type: 'upload',
                            action: 'upload',
                            action_flag_type: false
                        }
                    ]
                },
                form_info: {
                    dialog: { title: 'Enter New SKU Details (Form)' },
                    trigger_button: { text: '+ Add SKU' },
                    dialog_actions: [
                        { is_cancel: true, text: 'Cancel' },
                        { name: 'Submit', text: 'Submit', variant: 'contained' }
                    ],
                    form_config: {
                        title: '',
                        fields: [
                            {
                                id: 1,
                                name: 'Product ID',
                                label: 'Product ID',
                                type: 'text',
                                value: '',
                                variant: 'outlined',
                                fullWidth: true,
                                placeholder: 'Enter your Input',
                                grid: 6
                            },
                            {
                                id: 2,
                                name: 'Product Desc',
                                label: 'Product Desc',
                                type: 'text',
                                value: '',
                                variant: 'outlined',
                                fullWidth: true,
                                placeholder: 'Enter your Input',
                                grid: 6
                            },
                            {
                                id: 3,
                                name: 'SKU Type',
                                label: 'SKU Type',
                                type: 'select',
                                value: '',
                                variant: 'outlined',
                                options: ['NPD', 'NCD'],
                                fullWidth: true,
                                placeholder: 'Enter your Input',
                                grid: 6
                            },
                            {
                                id: 4,
                                name: 'Launch Date',
                                label: 'Launch Date',
                                type: 'datepicker',
                                variant: 'outlined',
                                inputprops: { format: 'DD/MM/yyyy', variant: 'inline' },
                                InputLabelProps: { disableAnimation: true, shrink: true },
                                placeholder: 'Enter Launch Date',
                                fullWidth: true,
                                grid: 6
                            },
                            {
                                id: 5,
                                name: 'TDP Forecast/Actuals',
                                label: 'TDP Forecast/Actuals',
                                type: 'text',
                                value: '',
                                variant: 'outlined',
                                fullWidth: true,
                                inputprops: { type: 'number' },
                                placeholder: 'Enter your Input',
                                grid: 6
                            },
                            { id: 7, type: 'hr', grid: 12 },
                            {
                                id: 8,
                                name: 'Upload',
                                label: 'Upload',
                                type: 'upload',
                                value: '',
                                variant: 'outlined',
                                inputprops: { accept: '', multiple: false, type: 'file' },
                                fullWidth: true,
                                grid: 12
                            }
                        ]
                    }
                },
                graph_info: {
                    grid_config: '6-3-12',
                    graph_list: [
                        {
                            data: [
                                {
                                    type: 'scatter',
                                    x: [
                                        '2015-02-17',
                                        '2015-02-18',
                                        '2015-02-19',
                                        '2015-02-20',
                                        '2015-02-23',
                                        '2015-02-24',
                                        '2015-02-25',
                                        '2015-02-26',
                                        '2015-02-27',
                                        '2015-03-02',
                                        '2015-03-03',
                                        '2015-03-04',
                                        '2015-03-05',
                                        '2015-03-06',
                                        '2015-03-09',
                                        '2015-03-10',
                                        '2015-03-11',
                                        '2015-03-12',
                                        '2015-03-13',
                                        '2015-03-16',
                                        '2015-03-17',
                                        '2015-03-18',
                                        '2015-03-19',
                                        '2015-03-20',
                                        '2015-03-23',
                                        '2015-03-24',
                                        '2015-03-25',
                                        '2015-03-26',
                                        '2015-03-27',
                                        '2015-03-30',
                                        '2015-03-31',
                                        '2015-04-01',
                                        '2015-04-02',
                                        '2015-04-06',
                                        '2015-04-07',
                                        '2015-04-08',
                                        '2015-04-09',
                                        '2015-04-10',
                                        '2015-04-13',
                                        '2015-04-14',
                                        '2015-04-15',
                                        '2015-04-16',
                                        '2015-04-17',
                                        '2015-04-20',
                                        '2015-04-21',
                                        '2015-04-22',
                                        '2015-04-23',
                                        '2015-04-24',
                                        '2015-04-27',
                                        '2015-04-28',
                                        '2015-04-29',
                                        '2015-04-30',
                                        '2015-05-01',
                                        '2015-05-04',
                                        '2015-05-05',
                                        '2015-05-06',
                                        '2015-05-07',
                                        '2015-05-08',
                                        '2015-05-11',
                                        '2015-05-12',
                                        '2015-05-13',
                                        '2015-05-14',
                                        '2015-05-15',
                                        '2015-05-18',
                                        '2015-05-19',
                                        '2015-05-20',
                                        '2015-05-21',
                                        '2015-05-22',
                                        '2015-05-26',
                                        '2015-05-27',
                                        '2015-05-28',
                                        '2015-05-29',
                                        '2015-06-01',
                                        '2015-06-02',
                                        '2015-06-03',
                                        '2015-06-04',
                                        '2015-06-05',
                                        '2015-06-08',
                                        '2015-06-09',
                                        '2015-06-10',
                                        '2015-06-11',
                                        '2015-06-12',
                                        '2015-06-15',
                                        '2015-06-16',
                                        '2015-06-17',
                                        '2015-06-18',
                                        '2015-06-19',
                                        '2015-06-22',
                                        '2015-06-23',
                                        '2015-06-24',
                                        '2015-06-25',
                                        '2015-06-26',
                                        '2015-06-29',
                                        '2015-06-30',
                                        '2015-07-01',
                                        '2015-07-02',
                                        '2015-07-06',
                                        '2015-07-07',
                                        '2015-07-08',
                                        '2015-07-09',
                                        '2015-07-10',
                                        '2015-07-13',
                                        '2015-07-14',
                                        '2015-07-15',
                                        '2015-07-16',
                                        '2015-07-17',
                                        '2015-07-20',
                                        '2015-07-21',
                                        '2015-07-22',
                                        '2015-07-23',
                                        '2015-07-24',
                                        '2015-07-27',
                                        '2015-07-28',
                                        '2015-07-29',
                                        '2015-07-30',
                                        '2015-07-31',
                                        '2015-08-03',
                                        '2015-08-04',
                                        '2015-08-05',
                                        '2015-08-06',
                                        '2015-08-07',
                                        '2015-08-10',
                                        '2015-08-11',
                                        '2015-08-12',
                                        '2015-08-13',
                                        '2015-08-14',
                                        '2015-08-17',
                                        '2015-08-18',
                                        '2015-08-19',
                                        '2015-08-20',
                                        '2015-08-21',
                                        '2015-08-24',
                                        '2015-08-25',
                                        '2015-08-26',
                                        '2015-08-27',
                                        '2015-08-28',
                                        '2015-08-31',
                                        '2015-09-01',
                                        '2015-09-02',
                                        '2015-09-03',
                                        '2015-09-04',
                                        '2015-09-08',
                                        '2015-09-09',
                                        '2015-09-10',
                                        '2015-09-11',
                                        '2015-09-14',
                                        '2015-09-15',
                                        '2015-09-16',
                                        '2015-09-17',
                                        '2015-09-18',
                                        '2015-09-21',
                                        '2015-09-22',
                                        '2015-09-23',
                                        '2015-09-24',
                                        '2015-09-25',
                                        '2015-09-28',
                                        '2015-09-29',
                                        '2015-09-30',
                                        '2015-10-01',
                                        '2015-10-02',
                                        '2015-10-05',
                                        '2015-10-06',
                                        '2015-10-07',
                                        '2015-10-08',
                                        '2015-10-09',
                                        '2015-10-12',
                                        '2015-10-13',
                                        '2015-10-14',
                                        '2015-10-15',
                                        '2015-10-16',
                                        '2015-10-19',
                                        '2015-10-20',
                                        '2015-10-21',
                                        '2015-10-22',
                                        '2015-10-23',
                                        '2015-10-26',
                                        '2015-10-27',
                                        '2015-10-28',
                                        '2015-10-29',
                                        '2015-10-30',
                                        '2015-11-02',
                                        '2015-11-03',
                                        '2015-11-04',
                                        '2015-11-05',
                                        '2015-11-06',
                                        '2015-11-09',
                                        '2015-11-10',
                                        '2015-11-11',
                                        '2015-11-12',
                                        '2015-11-13',
                                        '2015-11-16',
                                        '2015-11-17',
                                        '2015-11-18',
                                        '2015-11-19',
                                        '2015-11-20',
                                        '2015-11-23',
                                        '2015-11-24',
                                        '2015-11-25',
                                        '2015-11-27',
                                        '2015-11-30',
                                        '2015-12-01',
                                        '2015-12-02',
                                        '2015-12-03',
                                        '2015-12-04',
                                        '2015-12-07',
                                        '2015-12-08',
                                        '2015-12-09',
                                        '2015-12-10',
                                        '2015-12-11',
                                        '2015-12-14',
                                        '2015-12-15',
                                        '2015-12-16',
                                        '2015-12-17',
                                        '2015-12-18',
                                        '2015-12-21',
                                        '2015-12-22',
                                        '2015-12-23',
                                        '2015-12-24',
                                        '2015-12-28',
                                        '2015-12-29',
                                        '2015-12-30',
                                        '2015-12-31',
                                        '2016-01-04',
                                        '2016-01-05',
                                        '2016-01-06',
                                        '2016-01-07',
                                        '2016-01-08',
                                        '2016-01-11',
                                        '2016-01-12',
                                        '2016-01-13',
                                        '2016-01-14',
                                        '2016-01-15',
                                        '2016-01-19',
                                        '2016-01-20',
                                        '2016-01-21',
                                        '2016-01-22',
                                        '2016-01-25',
                                        '2016-01-26',
                                        '2016-01-27',
                                        '2016-01-28',
                                        '2016-01-29',
                                        '2016-02-01',
                                        '2016-02-02',
                                        '2016-02-03',
                                        '2016-02-04',
                                        '2016-02-05',
                                        '2016-02-08',
                                        '2016-02-09',
                                        '2016-02-10',
                                        '2016-02-11',
                                        '2016-02-12',
                                        '2016-02-16',
                                        '2016-02-17',
                                        '2016-02-18',
                                        '2016-02-19',
                                        '2016-02-22',
                                        '2016-02-23',
                                        '2016-02-24',
                                        '2016-02-25',
                                        '2016-02-26',
                                        '2016-02-29',
                                        '2016-03-01',
                                        '2016-03-02',
                                        '2016-03-03',
                                        '2016-03-04',
                                        '2016-03-07',
                                        '2016-03-08',
                                        '2016-03-09',
                                        '2016-03-10',
                                        '2016-03-11',
                                        '2016-03-14',
                                        '2016-03-15',
                                        '2016-03-16',
                                        '2016-03-17',
                                        '2016-03-18',
                                        '2016-03-21',
                                        '2016-03-22',
                                        '2016-03-23',
                                        '2016-03-24',
                                        '2016-03-28',
                                        '2016-03-29',
                                        '2016-03-30',
                                        '2016-03-31',
                                        '2016-04-01',
                                        '2016-04-04',
                                        '2016-04-05',
                                        '2016-04-06',
                                        '2016-04-07',
                                        '2016-04-08',
                                        '2016-04-11',
                                        '2016-04-12',
                                        '2016-04-13',
                                        '2016-04-14',
                                        '2016-04-15',
                                        '2016-04-18',
                                        '2016-04-19',
                                        '2016-04-20',
                                        '2016-04-21',
                                        '2016-04-22',
                                        '2016-04-25',
                                        '2016-04-26',
                                        '2016-04-27',
                                        '2016-04-28',
                                        '2016-04-29',
                                        '2016-05-02',
                                        '2016-05-03',
                                        '2016-05-04',
                                        '2016-05-05',
                                        '2016-05-06',
                                        '2016-05-09',
                                        '2016-05-10',
                                        '2016-05-11',
                                        '2016-05-12',
                                        '2016-05-13',
                                        '2016-05-16',
                                        '2016-05-17',
                                        '2016-05-18',
                                        '2016-05-19',
                                        '2016-05-20',
                                        '2016-05-23',
                                        '2016-05-24',
                                        '2016-05-25',
                                        '2016-05-26',
                                        '2016-05-27',
                                        '2016-05-31',
                                        '2016-06-01',
                                        '2016-06-02',
                                        '2016-06-03',
                                        '2016-06-06',
                                        '2016-06-07',
                                        '2016-06-08',
                                        '2016-06-09',
                                        '2016-06-10',
                                        '2016-06-13',
                                        '2016-06-14',
                                        '2016-06-15',
                                        '2016-06-16',
                                        '2016-06-17',
                                        '2016-06-20',
                                        '2016-06-21',
                                        '2016-06-22',
                                        '2016-06-23',
                                        '2016-06-24',
                                        '2016-06-27',
                                        '2016-06-28',
                                        '2016-06-29',
                                        '2016-06-30',
                                        '2016-07-01',
                                        '2016-07-05',
                                        '2016-07-06',
                                        '2016-07-07',
                                        '2016-07-08',
                                        '2016-07-11',
                                        '2016-07-12',
                                        '2016-07-13',
                                        '2016-07-14',
                                        '2016-07-15',
                                        '2016-07-18',
                                        '2016-07-19',
                                        '2016-07-20',
                                        '2016-07-21',
                                        '2016-07-22',
                                        '2016-07-25',
                                        '2016-07-26',
                                        '2016-07-27',
                                        '2016-07-28',
                                        '2016-07-29',
                                        '2016-08-01',
                                        '2016-08-02',
                                        '2016-08-03',
                                        '2016-08-04',
                                        '2016-08-05',
                                        '2016-08-08',
                                        '2016-08-09',
                                        '2016-08-10',
                                        '2016-08-11',
                                        '2016-08-12',
                                        '2016-08-15',
                                        '2016-08-16',
                                        '2016-08-17',
                                        '2016-08-18',
                                        '2016-08-19',
                                        '2016-08-22',
                                        '2016-08-23',
                                        '2016-08-24',
                                        '2016-08-25',
                                        '2016-08-26',
                                        '2016-08-29',
                                        '2016-08-30',
                                        '2016-08-31',
                                        '2016-09-01',
                                        '2016-09-02',
                                        '2016-09-06',
                                        '2016-09-07',
                                        '2016-09-08',
                                        '2016-09-09',
                                        '2016-09-12',
                                        '2016-09-13',
                                        '2016-09-14',
                                        '2016-09-15',
                                        '2016-09-16',
                                        '2016-09-19',
                                        '2016-09-20',
                                        '2016-09-21',
                                        '2016-09-22',
                                        '2016-09-23',
                                        '2016-09-26',
                                        '2016-09-27',
                                        '2016-09-28',
                                        '2016-09-29',
                                        '2016-09-30',
                                        '2016-10-03',
                                        '2016-10-04',
                                        '2016-10-05',
                                        '2016-10-06',
                                        '2016-10-07',
                                        '2016-10-10',
                                        '2016-10-11',
                                        '2016-10-12',
                                        '2016-10-13',
                                        '2016-10-14',
                                        '2016-10-17',
                                        '2016-10-18',
                                        '2016-10-19',
                                        '2016-10-20',
                                        '2016-10-21',
                                        '2016-10-24',
                                        '2016-10-25',
                                        '2016-10-26',
                                        '2016-10-27',
                                        '2016-10-28',
                                        '2016-10-31',
                                        '2016-11-01',
                                        '2016-11-02',
                                        '2016-11-03',
                                        '2016-11-04',
                                        '2016-11-07',
                                        '2016-11-08',
                                        '2016-11-09',
                                        '2016-11-10',
                                        '2016-11-11',
                                        '2016-11-14',
                                        '2016-11-15',
                                        '2016-11-16',
                                        '2016-11-17',
                                        '2016-11-18',
                                        '2016-11-21',
                                        '2016-11-22',
                                        '2016-11-23',
                                        '2016-11-25',
                                        '2016-11-28',
                                        '2016-11-29',
                                        '2016-11-30',
                                        '2016-12-01',
                                        '2016-12-02',
                                        '2016-12-05',
                                        '2016-12-06',
                                        '2016-12-07',
                                        '2016-12-08',
                                        '2016-12-09',
                                        '2016-12-12',
                                        '2016-12-13',
                                        '2016-12-14',
                                        '2016-12-15',
                                        '2016-12-16',
                                        '2016-12-19',
                                        '2016-12-20',
                                        '2016-12-21',
                                        '2016-12-22',
                                        '2016-12-23',
                                        '2016-12-27',
                                        '2016-12-28',
                                        '2016-12-29',
                                        '2016-12-30',
                                        '2017-01-03',
                                        '2017-01-04',
                                        '2017-01-05',
                                        '2017-01-06',
                                        '2017-01-09',
                                        '2017-01-10',
                                        '2017-01-11',
                                        '2017-01-12',
                                        '2017-01-13',
                                        '2017-01-17',
                                        '2017-01-18',
                                        '2017-01-19',
                                        '2017-01-20',
                                        '2017-01-23',
                                        '2017-01-24',
                                        '2017-01-25',
                                        '2017-01-26',
                                        '2017-01-27',
                                        '2017-01-30',
                                        '2017-01-31',
                                        '2017-02-01',
                                        '2017-02-02',
                                        '2017-02-03',
                                        '2017-02-06',
                                        '2017-02-07',
                                        '2017-02-08',
                                        '2017-02-09',
                                        '2017-02-10',
                                        '2017-02-13',
                                        '2017-02-14',
                                        '2017-02-15',
                                        '2017-02-16'
                                    ],
                                    y: [
                                        128.880005, 128.779999, 129.029999, 129.5, 133, 133.600006,
                                        131.600006, 130.869995, 130.570007, 130.279999, 129.520004,
                                        129.559998, 128.75, 129.369995, 129.570007, 127.220001,
                                        124.769997, 124.900002, 125.400002, 124.949997, 127.32,
                                        129.16000400000001, 129.25, 128.399994, 127.849998,
                                        128.03999299999998, 126.82, 124.879997, 124.699997,
                                        126.400002, 126.489998, 125.120003, 125.559998, 127.510002,
                                        128.119995, 126.400002, 126.58000200000001, 127.209999,
                                        128.570007, 127.290001, 127.129997, 127.099998, 126.139999,
                                        128.119995, 128.199997, 128.869995, 130.419998, 130.630005,
                                        133.130005, 134.53999299999998, 131.58999599999999,
                                        128.639999, 130.130005, 130.570007, 128.449997, 126.75,
                                        126.08000200000001, 127.620003, 127.559998, 126.879997,
                                        127.190002, 128.949997, 129.490005, 130.720001, 130.880005,
                                        130.979996, 131.630005, 132.970001, 132.91000400000001,
                                        132.259995, 131.949997, 131.449997, 131.389999,
                                        130.66000400000001, 130.940002, 130.580002, 129.690002,
                                        129.21000700000002, 128.080002, 129.33999599999999,
                                        130.179993, 128.330002, 127.239998, 127.849998, 127.879997,
                                        128.309998, 127.82, 128.059998, 127.610001, 129.800003,
                                        129.199997, 127.989998, 126.470001, 126.120003, 126.940002,
                                        126.690002, 126.230003, 126.150002, 124.639999, 124.059998,
                                        123.849998, 125.760002, 126.370003, 127.150002, 128.570007,
                                        129.619995, 132.970001, 132.919998, 125.5, 127.089996,
                                        125.739998, 123.610001, 123.910004, 123.5, 122.57,
                                        122.639999, 122.57, 117.699997, 117.440002, 116.5, 116.25,
                                        119.989998, 118.18, 115.41999799999999, 116.400002,
                                        116.309998, 117.650002, 117.440002, 116.519997, 114.349998,
                                        111.900002, 108.800003, 111.110001, 109.889999, 113.239998,
                                        113.309998, 114.529999, 111.879997, 112.339996, 112.779999,
                                        110.449997, 112.559998, 114.019997, 113.279999, 114.209999,
                                        116.889999, 116.529999, 116.540001, 116.489998, 114.300003,
                                        115.370003, 114.18, 114.720001, 115.5, 116.690002, 114.57,
                                        113.510002, 111.540001, 109.620003, 111.010002, 111.370003,
                                        111.739998, 111.769997, 110.190002, 112.279999, 112.75,
                                        112.449997, 111.519997, 112.099998, 112, 111.75,
                                        114.16999799999999, 115.58000200000001, 115.5, 119.230003,
                                        118.129997, 116.540001, 119.300003, 120.690002, 121.220001,
                                        121.360001, 123.489998, 123.82, 122.690002, 121.809998,
                                        121.809998, 118.07, 117.41999799999999, 116.82, 115.57,
                                        114.239998, 115.050003, 117.489998, 119.75,
                                        119.91999799999999, 119.730003, 119.349998, 119.230003,
                                        118.410004, 119.410004, 118.809998, 118.110001, 116.790001,
                                        119.25, 119.860001, 118.599998, 117.690002, 116.940002,
                                        115.389999, 112.68, 112.800003, 111.989998, 112.25,
                                        109.519997, 107.370003, 107.720001, 108.849998, 109,
                                        107.690002, 109.43, 108.699997, 107.029999, 105.370003,
                                        105.849998, 102.370003, 100.129997, 99.110001, 99.059998,
                                        100.690002, 101.190002, 100.480003, 97.709999, 98.650002,
                                        98.190002, 97.879997, 101.459999, 101.529999, 100.879997,
                                        96.629997, 94.519997, 97.339996, 96.709999, 96.040001,
                                        96.839996, 97.33000200000001, 96.91999799999999, 95.699997,
                                        95.940002, 96.349998, 94.720001, 94.5, 96.849998, 98.209999,
                                        98.889999, 96.760002, 96.900002, 96.5, 96.379997, 96.760002,
                                        98.019997, 98.230003, 100.769997, 100.889999, 101.709999,
                                        103.75, 102.83000200000001, 101.760002, 101.58000200000001,
                                        102.239998, 102.279999, 102.910004, 105.18, 106.309998,
                                        106.470001, 106.5, 107.650002, 107.290001, 107.07, 106.25,
                                        106.190002, 107.790001, 110.41999799999999, 109.900002, 110,
                                        112.190002, 110.730003, 110.980003, 110.41999799999999,
                                        109.769997, 110.610001, 110.5, 112.339996, 112.389999,
                                        112.300003, 108.949997, 108, 108.089996, 106.93, 106.480003,
                                        105.650002, 105.300003, 98.709999, 97.879997, 94.720001,
                                        94.08000200000001, 95.739998, 95.900002, 94.07, 93.449997,
                                        93.769997, 93.57, 93.57, 92.779999, 91.66999799999999,
                                        94.389999, 94.699997, 95.209999, 94.639999, 95.43,
                                        97.190002, 98.089996, 99.739998, 100.730003, 100.470001,
                                        100.400002, 99.540001, 97.839996, 98.269997, 101.889999,
                                        99.870003, 99.559998, 99.989998, 99.349998, 99.120003,
                                        98.480003, 98.410004, 97.75, 96.650002, 96.57, 96.349998,
                                        96.889999, 96.290001, 94.660004, 93.050003, 93.660004,
                                        94.550003, 95.769997, 96.470001, 95.400002, 95.660004, 96.5,
                                        96.889999, 97.650002, 97.699997, 97.66999799999999,
                                        98.989998, 99.300003, 100.129997, 100, 100.459999, 101,
                                        99.300003, 98.839996, 97.970001, 104.349998, 104.449997,
                                        104.550003, 106.150002, 106.07, 105.839996, 106, 107.650002,
                                        108.370003, 108.940002, 108.900002, 108.93, 108.440002,
                                        109.540001, 110.230003, 109.370003, 109.599998, 109.690002,
                                        109.099998, 109.32, 108.75, 107.879997, 107.949997,
                                        107.440002, 106.5, 106.57, 106.800003, 108, 108.300003,
                                        108.760002, 107.269997, 105.720001, 105.720001, 108.790001,
                                        113.029999, 115.730003, 116.129997, 116.18, 114.120003,
                                        113.989998, 114.940002, 114.790001, 113.389999, 113.18,
                                        114.639999, 113.800003, 113.370003, 113.050003, 114.309998,
                                        113.660004, 114.339996, 114.559998, 116.75, 118.690002,
                                        117.980003, 117.440002, 118.16999799999999, 117.839996,
                                        118.209999, 117.760002, 117.379997, 116.910004, 117.739998,
                                        118.360001, 115.699997, 115.860001, 115.209999, 114.230003,
                                        113.769997, 112.349998, 111.459999, 110.25, 110.510002,
                                        111.720001, 111.32, 111.089996, 108.870003, 107.809998,
                                        107.68, 110.230003, 110.349998, 110.540001, 111.989998,
                                        112.41999799999999, 111.510002, 111.870003, 112.470001,
                                        112.029999, 112.199997, 110.940002, 110.089996, 110.029999,
                                        110.360001, 111.190002, 112.43, 114.699997, 115,
                                        115.91999799999999, 116.199997, 116.730003, 116.5,
                                        117.379997, 117.5, 117.400002, 116.510002, 116.519997,
                                        117.800003, 118.019997, 117.110001, 117.199997,
                                        116.33000200000001, 116.510002, 116.860001, 118.160004,
                                        119.43, 119.379997, 119.93, 119.300003, 119.620003,
                                        120.239998, 120.5, 120.089996, 120.449997, 120.809998,
                                        120.099998, 122.099998, 122.440002, 122.349998, 121.629997,
                                        121.389999, 130.490005, 129.389999, 129.190002, 130.5,
                                        132.08999599999999, 132.220001, 132.449997, 132.940002,
                                        133.820007, 135.08999599999999, 136.270004, 135.899994
                                    ]
                                }
                            ],
                            layout: {
                                template: {
                                    data: {
                                        bar: [
                                            {
                                                error_x: { color: '#2a3f5f' },
                                                error_y: { color: '#2a3f5f' },
                                                marker: { line: { color: '#E5ECF6', width: 0.5 } },
                                                type: 'bar'
                                            }
                                        ],
                                        barpolar: [
                                            {
                                                marker: { line: { color: '#E5ECF6', width: 0.5 } },
                                                type: 'barpolar'
                                            }
                                        ],
                                        carpet: [
                                            {
                                                aaxis: {
                                                    endlinecolor: '#2a3f5f',
                                                    gridcolor: 'white',
                                                    linecolor: 'white',
                                                    minorgridcolor: 'white',
                                                    startlinecolor: '#2a3f5f'
                                                },
                                                baxis: {
                                                    endlinecolor: '#2a3f5f',
                                                    gridcolor: 'white',
                                                    linecolor: 'white',
                                                    minorgridcolor: 'white',
                                                    startlinecolor: '#2a3f5f'
                                                },
                                                type: 'carpet'
                                            }
                                        ],
                                        choropleth: [
                                            {
                                                colorbar: { outlinewidth: 0, ticks: '' },
                                                type: 'choropleth'
                                            }
                                        ],
                                        contour: [
                                            {
                                                colorbar: { outlinewidth: 0, ticks: '' },
                                                colorscale: [
                                                    [0, '#0d0887'],
                                                    [0.1111111111111111, '#46039f'],
                                                    [0.2222222222222222, '#7201a8'],
                                                    [0.3333333333333333, '#9c179e'],
                                                    [0.4444444444444444, '#bd3786'],
                                                    [0.5555555555555556, '#d8576b'],
                                                    [0.6666666666666666, '#ed7953'],
                                                    [0.7777777777777778, '#fb9f3a'],
                                                    [0.8888888888888888, '#fdca26'],
                                                    [1, '#f0f921']
                                                ],
                                                type: 'contour'
                                            }
                                        ],
                                        contourcarpet: [
                                            {
                                                colorbar: { outlinewidth: 0, ticks: '' },
                                                type: 'contourcarpet'
                                            }
                                        ],
                                        heatmap: [
                                            {
                                                colorbar: { outlinewidth: 0, ticks: '' },
                                                colorscale: [
                                                    [0, '#0d0887'],
                                                    [0.1111111111111111, '#46039f'],
                                                    [0.2222222222222222, '#7201a8'],
                                                    [0.3333333333333333, '#9c179e'],
                                                    [0.4444444444444444, '#bd3786'],
                                                    [0.5555555555555556, '#d8576b'],
                                                    [0.6666666666666666, '#ed7953'],
                                                    [0.7777777777777778, '#fb9f3a'],
                                                    [0.8888888888888888, '#fdca26'],
                                                    [1, '#f0f921']
                                                ],
                                                type: 'heatmap'
                                            }
                                        ],
                                        heatmapgl: [
                                            {
                                                colorbar: { outlinewidth: 0, ticks: '' },
                                                colorscale: [
                                                    [0, '#0d0887'],
                                                    [0.1111111111111111, '#46039f'],
                                                    [0.2222222222222222, '#7201a8'],
                                                    [0.3333333333333333, '#9c179e'],
                                                    [0.4444444444444444, '#bd3786'],
                                                    [0.5555555555555556, '#d8576b'],
                                                    [0.6666666666666666, '#ed7953'],
                                                    [0.7777777777777778, '#fb9f3a'],
                                                    [0.8888888888888888, '#fdca26'],
                                                    [1, '#f0f921']
                                                ],
                                                type: 'heatmapgl'
                                            }
                                        ],
                                        histogram: [
                                            {
                                                marker: {
                                                    colorbar: { outlinewidth: 0, ticks: '' }
                                                },
                                                type: 'histogram'
                                            }
                                        ],
                                        histogram2d: [
                                            {
                                                colorbar: { outlinewidth: 0, ticks: '' },
                                                colorscale: [
                                                    [0, '#0d0887'],
                                                    [0.1111111111111111, '#46039f'],
                                                    [0.2222222222222222, '#7201a8'],
                                                    [0.3333333333333333, '#9c179e'],
                                                    [0.4444444444444444, '#bd3786'],
                                                    [0.5555555555555556, '#d8576b'],
                                                    [0.6666666666666666, '#ed7953'],
                                                    [0.7777777777777778, '#fb9f3a'],
                                                    [0.8888888888888888, '#fdca26'],
                                                    [1, '#f0f921']
                                                ],
                                                type: 'histogram2d'
                                            }
                                        ],
                                        histogram2dcontour: [
                                            {
                                                colorbar: { outlinewidth: 0, ticks: '' },
                                                colorscale: [
                                                    [0, '#0d0887'],
                                                    [0.1111111111111111, '#46039f'],
                                                    [0.2222222222222222, '#7201a8'],
                                                    [0.3333333333333333, '#9c179e'],
                                                    [0.4444444444444444, '#bd3786'],
                                                    [0.5555555555555556, '#d8576b'],
                                                    [0.6666666666666666, '#ed7953'],
                                                    [0.7777777777777778, '#fb9f3a'],
                                                    [0.8888888888888888, '#fdca26'],
                                                    [1, '#f0f921']
                                                ],
                                                type: 'histogram2dcontour'
                                            }
                                        ],
                                        mesh3d: [
                                            {
                                                colorbar: { outlinewidth: 0, ticks: '' },
                                                type: 'mesh3d'
                                            }
                                        ],
                                        parcoords: [
                                            {
                                                line: { colorbar: { outlinewidth: 0, ticks: '' } },
                                                type: 'parcoords'
                                            }
                                        ],
                                        pie: [{ automargin: true, type: 'pie' }],
                                        scatter: [
                                            {
                                                marker: {
                                                    colorbar: { outlinewidth: 0, ticks: '' }
                                                },
                                                type: 'scatter'
                                            }
                                        ],
                                        scatter3d: [
                                            {
                                                line: { colorbar: { outlinewidth: 0, ticks: '' } },
                                                marker: {
                                                    colorbar: { outlinewidth: 0, ticks: '' }
                                                },
                                                type: 'scatter3d'
                                            }
                                        ],
                                        scattercarpet: [
                                            {
                                                marker: {
                                                    colorbar: { outlinewidth: 0, ticks: '' }
                                                },
                                                type: 'scattercarpet'
                                            }
                                        ],
                                        scattergeo: [
                                            {
                                                marker: {
                                                    colorbar: { outlinewidth: 0, ticks: '' }
                                                },
                                                type: 'scattergeo'
                                            }
                                        ],
                                        scattergl: [
                                            {
                                                marker: {
                                                    colorbar: { outlinewidth: 0, ticks: '' }
                                                },
                                                type: 'scattergl'
                                            }
                                        ],
                                        scattermapbox: [
                                            {
                                                marker: {
                                                    colorbar: { outlinewidth: 0, ticks: '' }
                                                },
                                                type: 'scattermapbox'
                                            }
                                        ],
                                        scatterpolar: [
                                            {
                                                marker: {
                                                    colorbar: { outlinewidth: 0, ticks: '' }
                                                },
                                                type: 'scatterpolar'
                                            }
                                        ],
                                        scatterpolargl: [
                                            {
                                                marker: {
                                                    colorbar: { outlinewidth: 0, ticks: '' }
                                                },
                                                type: 'scatterpolargl'
                                            }
                                        ],
                                        scatterternary: [
                                            {
                                                marker: {
                                                    colorbar: { outlinewidth: 0, ticks: '' }
                                                },
                                                type: 'scatterternary'
                                            }
                                        ],
                                        surface: [
                                            {
                                                colorbar: { outlinewidth: 0, ticks: '' },
                                                colorscale: [
                                                    [0, '#0d0887'],
                                                    [0.1111111111111111, '#46039f'],
                                                    [0.2222222222222222, '#7201a8'],
                                                    [0.3333333333333333, '#9c179e'],
                                                    [0.4444444444444444, '#bd3786'],
                                                    [0.5555555555555556, '#d8576b'],
                                                    [0.6666666666666666, '#ed7953'],
                                                    [0.7777777777777778, '#fb9f3a'],
                                                    [0.8888888888888888, '#fdca26'],
                                                    [1, '#f0f921']
                                                ],
                                                type: 'surface'
                                            }
                                        ],
                                        table: [
                                            {
                                                cells: {
                                                    fill: { color: '#EBF0F8' },
                                                    line: { color: 'white' }
                                                },
                                                header: {
                                                    fill: { color: '#C8D4E3' },
                                                    line: { color: 'white' }
                                                },
                                                type: 'table'
                                            }
                                        ]
                                    },
                                    layout: {
                                        annotationdefaults: {
                                            arrowcolor: '#2a3f5f',
                                            arrowhead: 0,
                                            arrowwidth: 1
                                        },
                                        coloraxis: { colorbar: { outlinewidth: 0, ticks: '' } },
                                        colorscale: {
                                            diverging: [
                                                [0, '#8e0152'],
                                                [0.1, '#c51b7d'],
                                                [0.2, '#de77ae'],
                                                [0.3, '#f1b6da'],
                                                [0.4, '#fde0ef'],
                                                [0.5, '#f7f7f7'],
                                                [0.6, '#e6f5d0'],
                                                [0.7, '#b8e186'],
                                                [0.8, '#7fbc41'],
                                                [0.9, '#4d9221'],
                                                [1, '#276419']
                                            ],
                                            sequential: [
                                                [0, '#0d0887'],
                                                [0.1111111111111111, '#46039f'],
                                                [0.2222222222222222, '#7201a8'],
                                                [0.3333333333333333, '#9c179e'],
                                                [0.4444444444444444, '#bd3786'],
                                                [0.5555555555555556, '#d8576b'],
                                                [0.6666666666666666, '#ed7953'],
                                                [0.7777777777777778, '#fb9f3a'],
                                                [0.8888888888888888, '#fdca26'],
                                                [1, '#f0f921']
                                            ],
                                            sequentialminus: [
                                                [0, '#0d0887'],
                                                [0.1111111111111111, '#46039f'],
                                                [0.2222222222222222, '#7201a8'],
                                                [0.3333333333333333, '#9c179e'],
                                                [0.4444444444444444, '#bd3786'],
                                                [0.5555555555555556, '#d8576b'],
                                                [0.6666666666666666, '#ed7953'],
                                                [0.7777777777777778, '#fb9f3a'],
                                                [0.8888888888888888, '#fdca26'],
                                                [1, '#f0f921']
                                            ]
                                        },
                                        colorway: [
                                            '#636efa',
                                            '#EF553B',
                                            '#00cc96',
                                            '#ab63fa',
                                            '#FFA15A',
                                            '#19d3f3',
                                            '#FF6692',
                                            '#B6E880',
                                            '#FF97FF',
                                            '#FECB52'
                                        ],
                                        font: { color: '#2a3f5f' },
                                        geo: {
                                            bgcolor: 'white',
                                            lakecolor: 'white',
                                            landcolor: '#E5ECF6',
                                            showlakes: true,
                                            showland: true,
                                            subunitcolor: 'white'
                                        },
                                        hoverlabel: { align: 'left' },
                                        hovermode: 'closest',
                                        mapbox: { style: 'light' },
                                        paper_bgcolor: 'white',
                                        plot_bgcolor: '#E5ECF6',
                                        polar: {
                                            angularaxis: {
                                                gridcolor: 'white',
                                                linecolor: 'white',
                                                ticks: ''
                                            },
                                            bgcolor: '#E5ECF6',
                                            radialaxis: {
                                                gridcolor: 'white',
                                                linecolor: 'white',
                                                ticks: ''
                                            }
                                        },
                                        scene: {
                                            xaxis: {
                                                backgroundcolor: '#E5ECF6',
                                                gridcolor: 'white',
                                                gridwidth: 2,
                                                linecolor: 'white',
                                                showbackground: true,
                                                ticks: '',
                                                zerolinecolor: 'white'
                                            },
                                            yaxis: {
                                                backgroundcolor: '#E5ECF6',
                                                gridcolor: 'white',
                                                gridwidth: 2,
                                                linecolor: 'white',
                                                showbackground: true,
                                                ticks: '',
                                                zerolinecolor: 'white'
                                            },
                                            zaxis: {
                                                backgroundcolor: '#E5ECF6',
                                                gridcolor: 'white',
                                                gridwidth: 2,
                                                linecolor: 'white',
                                                showbackground: true,
                                                ticks: '',
                                                zerolinecolor: 'white'
                                            }
                                        },
                                        shapedefaults: { line: { color: '#2a3f5f' } },
                                        ternary: {
                                            aaxis: {
                                                gridcolor: 'white',
                                                linecolor: 'white',
                                                ticks: ''
                                            },
                                            baxis: {
                                                gridcolor: 'white',
                                                linecolor: 'white',
                                                ticks: ''
                                            },
                                            bgcolor: '#E5ECF6',
                                            caxis: {
                                                gridcolor: 'white',
                                                linecolor: 'white',
                                                ticks: ''
                                            }
                                        },
                                        title: { x: 0.05 },
                                        xaxis: {
                                            automargin: true,
                                            gridcolor: 'white',
                                            linecolor: 'white',
                                            ticks: '',
                                            title: { standoff: 15 },
                                            zerolinecolor: 'white',
                                            zerolinewidth: 2
                                        },
                                        yaxis: {
                                            automargin: true,
                                            gridcolor: 'white',
                                            linecolor: 'white',
                                            ticks: '',
                                            title: { standoff: 15 },
                                            zerolinecolor: 'white',
                                            zerolinewidth: 2
                                        }
                                    }
                                }
                            }
                        },
                        {
                            data: [
                                {
                                    hovertemplate: 'Date=%{x}<br>AAPL.High=%{y}<extra></extra>',
                                    legendgroup: '',
                                    line: { color: '#636efa', dash: 'solid' },
                                    mode: 'lines',
                                    name: '',
                                    orientation: 'v',
                                    showlegend: false,
                                    type: 'scatter',
                                    x: [
                                        '2015-02-17',
                                        '2015-02-18',
                                        '2015-02-19',
                                        '2015-02-20',
                                        '2015-02-23',
                                        '2015-02-24',
                                        '2015-02-25',
                                        '2015-02-26',
                                        '2015-02-27',
                                        '2015-03-02',
                                        '2015-03-03',
                                        '2015-03-04',
                                        '2015-03-05',
                                        '2015-03-06',
                                        '2015-03-09',
                                        '2015-03-10',
                                        '2015-03-11',
                                        '2015-03-12',
                                        '2015-03-13',
                                        '2015-03-16',
                                        '2015-03-17',
                                        '2015-03-18',
                                        '2015-03-19',
                                        '2015-03-20',
                                        '2015-03-23',
                                        '2015-03-24',
                                        '2015-03-25',
                                        '2015-03-26',
                                        '2015-03-27',
                                        '2015-03-30',
                                        '2015-03-31',
                                        '2015-04-01',
                                        '2015-04-02',
                                        '2015-04-06',
                                        '2015-04-07',
                                        '2015-04-08',
                                        '2015-04-09',
                                        '2015-04-10',
                                        '2015-04-13',
                                        '2015-04-14',
                                        '2015-04-15',
                                        '2015-04-16',
                                        '2015-04-17',
                                        '2015-04-20',
                                        '2015-04-21',
                                        '2015-04-22',
                                        '2015-04-23',
                                        '2015-04-24',
                                        '2015-04-27',
                                        '2015-04-28',
                                        '2015-04-29',
                                        '2015-04-30',
                                        '2015-05-01',
                                        '2015-05-04',
                                        '2015-05-05',
                                        '2015-05-06',
                                        '2015-05-07',
                                        '2015-05-08',
                                        '2015-05-11',
                                        '2015-05-12',
                                        '2015-05-13',
                                        '2015-05-14',
                                        '2015-05-15',
                                        '2015-05-18',
                                        '2015-05-19',
                                        '2015-05-20',
                                        '2015-05-21',
                                        '2015-05-22',
                                        '2015-05-26',
                                        '2015-05-27',
                                        '2015-05-28',
                                        '2015-05-29',
                                        '2015-06-01',
                                        '2015-06-02',
                                        '2015-06-03',
                                        '2015-06-04',
                                        '2015-06-05',
                                        '2015-06-08',
                                        '2015-06-09',
                                        '2015-06-10',
                                        '2015-06-11',
                                        '2015-06-12',
                                        '2015-06-15',
                                        '2015-06-16',
                                        '2015-06-17',
                                        '2015-06-18',
                                        '2015-06-19',
                                        '2015-06-22',
                                        '2015-06-23',
                                        '2015-06-24',
                                        '2015-06-25',
                                        '2015-06-26',
                                        '2015-06-29',
                                        '2015-06-30',
                                        '2015-07-01',
                                        '2015-07-02',
                                        '2015-07-06',
                                        '2015-07-07',
                                        '2015-07-08',
                                        '2015-07-09',
                                        '2015-07-10',
                                        '2015-07-13',
                                        '2015-07-14',
                                        '2015-07-15',
                                        '2015-07-16',
                                        '2015-07-17',
                                        '2015-07-20',
                                        '2015-07-21',
                                        '2015-07-22',
                                        '2015-07-23',
                                        '2015-07-24',
                                        '2015-07-27',
                                        '2015-07-28',
                                        '2015-07-29',
                                        '2015-07-30',
                                        '2015-07-31',
                                        '2015-08-03',
                                        '2015-08-04',
                                        '2015-08-05',
                                        '2015-08-06',
                                        '2015-08-07',
                                        '2015-08-10',
                                        '2015-08-11',
                                        '2015-08-12',
                                        '2015-08-13',
                                        '2015-08-14',
                                        '2015-08-17',
                                        '2015-08-18',
                                        '2015-08-19',
                                        '2015-08-20',
                                        '2015-08-21',
                                        '2015-08-24',
                                        '2015-08-25',
                                        '2015-08-26',
                                        '2015-08-27',
                                        '2015-08-28',
                                        '2015-08-31',
                                        '2015-09-01',
                                        '2015-09-02',
                                        '2015-09-03',
                                        '2015-09-04',
                                        '2015-09-08',
                                        '2015-09-09',
                                        '2015-09-10',
                                        '2015-09-11',
                                        '2015-09-14',
                                        '2015-09-15',
                                        '2015-09-16',
                                        '2015-09-17',
                                        '2015-09-18',
                                        '2015-09-21',
                                        '2015-09-22',
                                        '2015-09-23',
                                        '2015-09-24',
                                        '2015-09-25',
                                        '2015-09-28',
                                        '2015-09-29',
                                        '2015-09-30',
                                        '2015-10-01',
                                        '2015-10-02',
                                        '2015-10-05',
                                        '2015-10-06',
                                        '2015-10-07',
                                        '2015-10-08',
                                        '2015-10-09',
                                        '2015-10-12',
                                        '2015-10-13',
                                        '2015-10-14',
                                        '2015-10-15',
                                        '2015-10-16',
                                        '2015-10-19',
                                        '2015-10-20',
                                        '2015-10-21',
                                        '2015-10-22',
                                        '2015-10-23',
                                        '2015-10-26',
                                        '2015-10-27',
                                        '2015-10-28',
                                        '2015-10-29',
                                        '2015-10-30',
                                        '2015-11-02',
                                        '2015-11-03',
                                        '2015-11-04',
                                        '2015-11-05',
                                        '2015-11-06',
                                        '2015-11-09',
                                        '2015-11-10',
                                        '2015-11-11',
                                        '2015-11-12',
                                        '2015-11-13',
                                        '2015-11-16',
                                        '2015-11-17',
                                        '2015-11-18',
                                        '2015-11-19',
                                        '2015-11-20',
                                        '2015-11-23',
                                        '2015-11-24',
                                        '2015-11-25',
                                        '2015-11-27',
                                        '2015-11-30',
                                        '2015-12-01',
                                        '2015-12-02',
                                        '2015-12-03',
                                        '2015-12-04',
                                        '2015-12-07',
                                        '2015-12-08',
                                        '2015-12-09',
                                        '2015-12-10',
                                        '2015-12-11',
                                        '2015-12-14',
                                        '2015-12-15',
                                        '2015-12-16',
                                        '2015-12-17',
                                        '2015-12-18',
                                        '2015-12-21',
                                        '2015-12-22',
                                        '2015-12-23',
                                        '2015-12-24',
                                        '2015-12-28',
                                        '2015-12-29',
                                        '2015-12-30',
                                        '2015-12-31',
                                        '2016-01-04',
                                        '2016-01-05',
                                        '2016-01-06',
                                        '2016-01-07',
                                        '2016-01-08',
                                        '2016-01-11',
                                        '2016-01-12',
                                        '2016-01-13',
                                        '2016-01-14',
                                        '2016-01-15',
                                        '2016-01-19',
                                        '2016-01-20',
                                        '2016-01-21',
                                        '2016-01-22',
                                        '2016-01-25',
                                        '2016-01-26',
                                        '2016-01-27',
                                        '2016-01-28',
                                        '2016-01-29',
                                        '2016-02-01',
                                        '2016-02-02',
                                        '2016-02-03',
                                        '2016-02-04',
                                        '2016-02-05',
                                        '2016-02-08',
                                        '2016-02-09',
                                        '2016-02-10',
                                        '2016-02-11',
                                        '2016-02-12',
                                        '2016-02-16',
                                        '2016-02-17',
                                        '2016-02-18',
                                        '2016-02-19',
                                        '2016-02-22',
                                        '2016-02-23',
                                        '2016-02-24',
                                        '2016-02-25',
                                        '2016-02-26',
                                        '2016-02-29',
                                        '2016-03-01',
                                        '2016-03-02',
                                        '2016-03-03',
                                        '2016-03-04',
                                        '2016-03-07',
                                        '2016-03-08',
                                        '2016-03-09',
                                        '2016-03-10',
                                        '2016-03-11',
                                        '2016-03-14',
                                        '2016-03-15',
                                        '2016-03-16',
                                        '2016-03-17',
                                        '2016-03-18',
                                        '2016-03-21',
                                        '2016-03-22',
                                        '2016-03-23',
                                        '2016-03-24',
                                        '2016-03-28',
                                        '2016-03-29',
                                        '2016-03-30',
                                        '2016-03-31',
                                        '2016-04-01',
                                        '2016-04-04',
                                        '2016-04-05',
                                        '2016-04-06',
                                        '2016-04-07',
                                        '2016-04-08',
                                        '2016-04-11',
                                        '2016-04-12',
                                        '2016-04-13',
                                        '2016-04-14',
                                        '2016-04-15',
                                        '2016-04-18',
                                        '2016-04-19',
                                        '2016-04-20',
                                        '2016-04-21',
                                        '2016-04-22',
                                        '2016-04-25',
                                        '2016-04-26',
                                        '2016-04-27',
                                        '2016-04-28',
                                        '2016-04-29',
                                        '2016-05-02',
                                        '2016-05-03',
                                        '2016-05-04',
                                        '2016-05-05',
                                        '2016-05-06',
                                        '2016-05-09',
                                        '2016-05-10',
                                        '2016-05-11',
                                        '2016-05-12',
                                        '2016-05-13',
                                        '2016-05-16',
                                        '2016-05-17',
                                        '2016-05-18',
                                        '2016-05-19',
                                        '2016-05-20',
                                        '2016-05-23',
                                        '2016-05-24',
                                        '2016-05-25',
                                        '2016-05-26',
                                        '2016-05-27',
                                        '2016-05-31',
                                        '2016-06-01',
                                        '2016-06-02',
                                        '2016-06-03',
                                        '2016-06-06',
                                        '2016-06-07',
                                        '2016-06-08',
                                        '2016-06-09',
                                        '2016-06-10',
                                        '2016-06-13',
                                        '2016-06-14',
                                        '2016-06-15',
                                        '2016-06-16',
                                        '2016-06-17',
                                        '2016-06-20',
                                        '2016-06-21',
                                        '2016-06-22',
                                        '2016-06-23',
                                        '2016-06-24',
                                        '2016-06-27',
                                        '2016-06-28',
                                        '2016-06-29',
                                        '2016-06-30',
                                        '2016-07-01',
                                        '2016-07-05',
                                        '2016-07-06',
                                        '2016-07-07',
                                        '2016-07-08',
                                        '2016-07-11',
                                        '2016-07-12',
                                        '2016-07-13',
                                        '2016-07-14',
                                        '2016-07-15',
                                        '2016-07-18',
                                        '2016-07-19',
                                        '2016-07-20',
                                        '2016-07-21',
                                        '2016-07-22',
                                        '2016-07-25',
                                        '2016-07-26',
                                        '2016-07-27',
                                        '2016-07-28',
                                        '2016-07-29',
                                        '2016-08-01',
                                        '2016-08-02',
                                        '2016-08-03',
                                        '2016-08-04',
                                        '2016-08-05',
                                        '2016-08-08',
                                        '2016-08-09',
                                        '2016-08-10',
                                        '2016-08-11',
                                        '2016-08-12',
                                        '2016-08-15',
                                        '2016-08-16',
                                        '2016-08-17',
                                        '2016-08-18',
                                        '2016-08-19',
                                        '2016-08-22',
                                        '2016-08-23',
                                        '2016-08-24',
                                        '2016-08-25',
                                        '2016-08-26',
                                        '2016-08-29',
                                        '2016-08-30',
                                        '2016-08-31',
                                        '2016-09-01',
                                        '2016-09-02',
                                        '2016-09-06',
                                        '2016-09-07',
                                        '2016-09-08',
                                        '2016-09-09',
                                        '2016-09-12',
                                        '2016-09-13',
                                        '2016-09-14',
                                        '2016-09-15',
                                        '2016-09-16',
                                        '2016-09-19',
                                        '2016-09-20',
                                        '2016-09-21',
                                        '2016-09-22',
                                        '2016-09-23',
                                        '2016-09-26',
                                        '2016-09-27',
                                        '2016-09-28',
                                        '2016-09-29',
                                        '2016-09-30',
                                        '2016-10-03',
                                        '2016-10-04',
                                        '2016-10-05',
                                        '2016-10-06',
                                        '2016-10-07',
                                        '2016-10-10',
                                        '2016-10-11',
                                        '2016-10-12',
                                        '2016-10-13',
                                        '2016-10-14',
                                        '2016-10-17',
                                        '2016-10-18',
                                        '2016-10-19',
                                        '2016-10-20',
                                        '2016-10-21',
                                        '2016-10-24',
                                        '2016-10-25',
                                        '2016-10-26',
                                        '2016-10-27',
                                        '2016-10-28',
                                        '2016-10-31',
                                        '2016-11-01',
                                        '2016-11-02',
                                        '2016-11-03',
                                        '2016-11-04',
                                        '2016-11-07',
                                        '2016-11-08',
                                        '2016-11-09',
                                        '2016-11-10',
                                        '2016-11-11',
                                        '2016-11-14',
                                        '2016-11-15',
                                        '2016-11-16',
                                        '2016-11-17',
                                        '2016-11-18',
                                        '2016-11-21',
                                        '2016-11-22',
                                        '2016-11-23',
                                        '2016-11-25',
                                        '2016-11-28',
                                        '2016-11-29',
                                        '2016-11-30',
                                        '2016-12-01',
                                        '2016-12-02',
                                        '2016-12-05',
                                        '2016-12-06',
                                        '2016-12-07',
                                        '2016-12-08',
                                        '2016-12-09',
                                        '2016-12-12',
                                        '2016-12-13',
                                        '2016-12-14',
                                        '2016-12-15',
                                        '2016-12-16',
                                        '2016-12-19',
                                        '2016-12-20',
                                        '2016-12-21',
                                        '2016-12-22',
                                        '2016-12-23',
                                        '2016-12-27',
                                        '2016-12-28',
                                        '2016-12-29',
                                        '2016-12-30',
                                        '2017-01-03',
                                        '2017-01-04',
                                        '2017-01-05',
                                        '2017-01-06',
                                        '2017-01-09',
                                        '2017-01-10',
                                        '2017-01-11',
                                        '2017-01-12',
                                        '2017-01-13',
                                        '2017-01-17',
                                        '2017-01-18',
                                        '2017-01-19',
                                        '2017-01-20',
                                        '2017-01-23',
                                        '2017-01-24',
                                        '2017-01-25',
                                        '2017-01-26',
                                        '2017-01-27',
                                        '2017-01-30',
                                        '2017-01-31',
                                        '2017-02-01',
                                        '2017-02-02',
                                        '2017-02-03',
                                        '2017-02-06',
                                        '2017-02-07',
                                        '2017-02-08',
                                        '2017-02-09',
                                        '2017-02-10',
                                        '2017-02-13',
                                        '2017-02-14',
                                        '2017-02-15',
                                        '2017-02-16'
                                    ],
                                    xaxis: 'x',
                                    y: [
                                        128.880005, 128.779999, 129.029999, 129.5, 133, 133.600006,
                                        131.600006, 130.869995, 130.570007, 130.279999, 129.520004,
                                        129.559998, 128.75, 129.369995, 129.570007, 127.220001,
                                        124.769997, 124.900002, 125.400002, 124.949997, 127.32,
                                        129.16000400000001, 129.25, 128.399994, 127.849998,
                                        128.03999299999998, 126.82, 124.879997, 124.699997,
                                        126.400002, 126.489998, 125.120003, 125.559998, 127.510002,
                                        128.119995, 126.400002, 126.58000200000001, 127.209999,
                                        128.570007, 127.290001, 127.129997, 127.099998, 126.139999,
                                        128.119995, 128.199997, 128.869995, 130.419998, 130.630005,
                                        133.130005, 134.53999299999998, 131.58999599999999,
                                        128.639999, 130.130005, 130.570007, 128.449997, 126.75,
                                        126.08000200000001, 127.620003, 127.559998, 126.879997,
                                        127.190002, 128.949997, 129.490005, 130.720001, 130.880005,
                                        130.979996, 131.630005, 132.970001, 132.91000400000001,
                                        132.259995, 131.949997, 131.449997, 131.389999,
                                        130.66000400000001, 130.940002, 130.580002, 129.690002,
                                        129.21000700000002, 128.080002, 129.33999599999999,
                                        130.179993, 128.330002, 127.239998, 127.849998, 127.879997,
                                        128.309998, 127.82, 128.059998, 127.610001, 129.800003,
                                        129.199997, 127.989998, 126.470001, 126.120003, 126.940002,
                                        126.690002, 126.230003, 126.150002, 124.639999, 124.059998,
                                        123.849998, 125.760002, 126.370003, 127.150002, 128.570007,
                                        129.619995, 132.970001, 132.919998, 125.5, 127.089996,
                                        125.739998, 123.610001, 123.910004, 123.5, 122.57,
                                        122.639999, 122.57, 117.699997, 117.440002, 116.5, 116.25,
                                        119.989998, 118.18, 115.41999799999999, 116.400002,
                                        116.309998, 117.650002, 117.440002, 116.519997, 114.349998,
                                        111.900002, 108.800003, 111.110001, 109.889999, 113.239998,
                                        113.309998, 114.529999, 111.879997, 112.339996, 112.779999,
                                        110.449997, 112.559998, 114.019997, 113.279999, 114.209999,
                                        116.889999, 116.529999, 116.540001, 116.489998, 114.300003,
                                        115.370003, 114.18, 114.720001, 115.5, 116.690002, 114.57,
                                        113.510002, 111.540001, 109.620003, 111.010002, 111.370003,
                                        111.739998, 111.769997, 110.190002, 112.279999, 112.75,
                                        112.449997, 111.519997, 112.099998, 112, 111.75,
                                        114.16999799999999, 115.58000200000001, 115.5, 119.230003,
                                        118.129997, 116.540001, 119.300003, 120.690002, 121.220001,
                                        121.360001, 123.489998, 123.82, 122.690002, 121.809998,
                                        121.809998, 118.07, 117.41999799999999, 116.82, 115.57,
                                        114.239998, 115.050003, 117.489998, 119.75,
                                        119.91999799999999, 119.730003, 119.349998, 119.230003,
                                        118.410004, 119.410004, 118.809998, 118.110001, 116.790001,
                                        119.25, 119.860001, 118.599998, 117.690002, 116.940002,
                                        115.389999, 112.68, 112.800003, 111.989998, 112.25,
                                        109.519997, 107.370003, 107.720001, 108.849998, 109,
                                        107.690002, 109.43, 108.699997, 107.029999, 105.370003,
                                        105.849998, 102.370003, 100.129997, 99.110001, 99.059998,
                                        100.690002, 101.190002, 100.480003, 97.709999, 98.650002,
                                        98.190002, 97.879997, 101.459999, 101.529999, 100.879997,
                                        96.629997, 94.519997, 97.339996, 96.709999, 96.040001,
                                        96.839996, 97.33000200000001, 96.91999799999999, 95.699997,
                                        95.940002, 96.349998, 94.720001, 94.5, 96.849998, 98.209999,
                                        98.889999, 96.760002, 96.900002, 96.5, 96.379997, 96.760002,
                                        98.019997, 98.230003, 100.769997, 100.889999, 101.709999,
                                        103.75, 102.83000200000001, 101.760002, 101.58000200000001,
                                        102.239998, 102.279999, 102.910004, 105.18, 106.309998,
                                        106.470001, 106.5, 107.650002, 107.290001, 107.07, 106.25,
                                        106.190002, 107.790001, 110.41999799999999, 109.900002, 110,
                                        112.190002, 110.730003, 110.980003, 110.41999799999999,
                                        109.769997, 110.610001, 110.5, 112.339996, 112.389999,
                                        112.300003, 108.949997, 108, 108.089996, 106.93, 106.480003,
                                        105.650002, 105.300003, 98.709999, 97.879997, 94.720001,
                                        94.08000200000001, 95.739998, 95.900002, 94.07, 93.449997,
                                        93.769997, 93.57, 93.57, 92.779999, 91.66999799999999,
                                        94.389999, 94.699997, 95.209999, 94.639999, 95.43,
                                        97.190002, 98.089996, 99.739998, 100.730003, 100.470001,
                                        100.400002, 99.540001, 97.839996, 98.269997, 101.889999,
                                        99.870003, 99.559998, 99.989998, 99.349998, 99.120003,
                                        98.480003, 98.410004, 97.75, 96.650002, 96.57, 96.349998,
                                        96.889999, 96.290001, 94.660004, 93.050003, 93.660004,
                                        94.550003, 95.769997, 96.470001, 95.400002, 95.660004, 96.5,
                                        96.889999, 97.650002, 97.699997, 97.66999799999999,
                                        98.989998, 99.300003, 100.129997, 100, 100.459999, 101,
                                        99.300003, 98.839996, 97.970001, 104.349998, 104.449997,
                                        104.550003, 106.150002, 106.07, 105.839996, 106, 107.650002,
                                        108.370003, 108.940002, 108.900002, 108.93, 108.440002,
                                        109.540001, 110.230003, 109.370003, 109.599998, 109.690002,
                                        109.099998, 109.32, 108.75, 107.879997, 107.949997,
                                        107.440002, 106.5, 106.57, 106.800003, 108, 108.300003,
                                        108.760002, 107.269997, 105.720001, 105.720001, 108.790001,
                                        113.029999, 115.730003, 116.129997, 116.18, 114.120003,
                                        113.989998, 114.940002, 114.790001, 113.389999, 113.18,
                                        114.639999, 113.800003, 113.370003, 113.050003, 114.309998,
                                        113.660004, 114.339996, 114.559998, 116.75, 118.690002,
                                        117.980003, 117.440002, 118.16999799999999, 117.839996,
                                        118.209999, 117.760002, 117.379997, 116.910004, 117.739998,
                                        118.360001, 115.699997, 115.860001, 115.209999, 114.230003,
                                        113.769997, 112.349998, 111.459999, 110.25, 110.510002,
                                        111.720001, 111.32, 111.089996, 108.870003, 107.809998,
                                        107.68, 110.230003, 110.349998, 110.540001, 111.989998,
                                        112.41999799999999, 111.510002, 111.870003, 112.470001,
                                        112.029999, 112.199997, 110.940002, 110.089996, 110.029999,
                                        110.360001, 111.190002, 112.43, 114.699997, 115,
                                        115.91999799999999, 116.199997, 116.730003, 116.5,
                                        117.379997, 117.5, 117.400002, 116.510002, 116.519997,
                                        117.800003, 118.019997, 117.110001, 117.199997,
                                        116.33000200000001, 116.510002, 116.860001, 118.160004,
                                        119.43, 119.379997, 119.93, 119.300003, 119.620003,
                                        120.239998, 120.5, 120.089996, 120.449997, 120.809998,
                                        120.099998, 122.099998, 122.440002, 122.349998, 121.629997,
                                        121.389999, 130.490005, 129.389999, 129.190002, 130.5,
                                        132.08999599999999, 132.220001, 132.449997, 132.940002,
                                        133.820007, 135.08999599999999, 136.270004, 135.899994
                                    ],
                                    yaxis: 'y'
                                }
                            ],
                            layout: {
                                legend: { tracegroupgap: 0 },
                                template: {
                                    data: {
                                        bar: [
                                            {
                                                error_x: { color: '#2a3f5f' },
                                                error_y: { color: '#2a3f5f' },
                                                marker: { line: { color: '#E5ECF6', width: 0.5 } },
                                                type: 'bar'
                                            }
                                        ],
                                        barpolar: [
                                            {
                                                marker: { line: { color: '#E5ECF6', width: 0.5 } },
                                                type: 'barpolar'
                                            }
                                        ],
                                        carpet: [
                                            {
                                                aaxis: {
                                                    endlinecolor: '#2a3f5f',
                                                    gridcolor: 'white',
                                                    linecolor: 'white',
                                                    minorgridcolor: 'white',
                                                    startlinecolor: '#2a3f5f'
                                                },
                                                baxis: {
                                                    endlinecolor: '#2a3f5f',
                                                    gridcolor: 'white',
                                                    linecolor: 'white',
                                                    minorgridcolor: 'white',
                                                    startlinecolor: '#2a3f5f'
                                                },
                                                type: 'carpet'
                                            }
                                        ],
                                        choropleth: [
                                            {
                                                colorbar: { outlinewidth: 0, ticks: '' },
                                                type: 'choropleth'
                                            }
                                        ],
                                        contour: [
                                            {
                                                colorbar: { outlinewidth: 0, ticks: '' },
                                                colorscale: [
                                                    [0, '#0d0887'],
                                                    [0.1111111111111111, '#46039f'],
                                                    [0.2222222222222222, '#7201a8'],
                                                    [0.3333333333333333, '#9c179e'],
                                                    [0.4444444444444444, '#bd3786'],
                                                    [0.5555555555555556, '#d8576b'],
                                                    [0.6666666666666666, '#ed7953'],
                                                    [0.7777777777777778, '#fb9f3a'],
                                                    [0.8888888888888888, '#fdca26'],
                                                    [1, '#f0f921']
                                                ],
                                                type: 'contour'
                                            }
                                        ],
                                        contourcarpet: [
                                            {
                                                colorbar: { outlinewidth: 0, ticks: '' },
                                                type: 'contourcarpet'
                                            }
                                        ],
                                        heatmap: [
                                            {
                                                colorbar: { outlinewidth: 0, ticks: '' },
                                                colorscale: [
                                                    [0, '#0d0887'],
                                                    [0.1111111111111111, '#46039f'],
                                                    [0.2222222222222222, '#7201a8'],
                                                    [0.3333333333333333, '#9c179e'],
                                                    [0.4444444444444444, '#bd3786'],
                                                    [0.5555555555555556, '#d8576b'],
                                                    [0.6666666666666666, '#ed7953'],
                                                    [0.7777777777777778, '#fb9f3a'],
                                                    [0.8888888888888888, '#fdca26'],
                                                    [1, '#f0f921']
                                                ],
                                                type: 'heatmap'
                                            }
                                        ],
                                        heatmapgl: [
                                            {
                                                colorbar: { outlinewidth: 0, ticks: '' },
                                                colorscale: [
                                                    [0, '#0d0887'],
                                                    [0.1111111111111111, '#46039f'],
                                                    [0.2222222222222222, '#7201a8'],
                                                    [0.3333333333333333, '#9c179e'],
                                                    [0.4444444444444444, '#bd3786'],
                                                    [0.5555555555555556, '#d8576b'],
                                                    [0.6666666666666666, '#ed7953'],
                                                    [0.7777777777777778, '#fb9f3a'],
                                                    [0.8888888888888888, '#fdca26'],
                                                    [1, '#f0f921']
                                                ],
                                                type: 'heatmapgl'
                                            }
                                        ],
                                        histogram: [
                                            {
                                                marker: {
                                                    colorbar: { outlinewidth: 0, ticks: '' }
                                                },
                                                type: 'histogram'
                                            }
                                        ],
                                        histogram2d: [
                                            {
                                                colorbar: { outlinewidth: 0, ticks: '' },
                                                colorscale: [
                                                    [0, '#0d0887'],
                                                    [0.1111111111111111, '#46039f'],
                                                    [0.2222222222222222, '#7201a8'],
                                                    [0.3333333333333333, '#9c179e'],
                                                    [0.4444444444444444, '#bd3786'],
                                                    [0.5555555555555556, '#d8576b'],
                                                    [0.6666666666666666, '#ed7953'],
                                                    [0.7777777777777778, '#fb9f3a'],
                                                    [0.8888888888888888, '#fdca26'],
                                                    [1, '#f0f921']
                                                ],
                                                type: 'histogram2d'
                                            }
                                        ],
                                        histogram2dcontour: [
                                            {
                                                colorbar: { outlinewidth: 0, ticks: '' },
                                                colorscale: [
                                                    [0, '#0d0887'],
                                                    [0.1111111111111111, '#46039f'],
                                                    [0.2222222222222222, '#7201a8'],
                                                    [0.3333333333333333, '#9c179e'],
                                                    [0.4444444444444444, '#bd3786'],
                                                    [0.5555555555555556, '#d8576b'],
                                                    [0.6666666666666666, '#ed7953'],
                                                    [0.7777777777777778, '#fb9f3a'],
                                                    [0.8888888888888888, '#fdca26'],
                                                    [1, '#f0f921']
                                                ],
                                                type: 'histogram2dcontour'
                                            }
                                        ],
                                        mesh3d: [
                                            {
                                                colorbar: { outlinewidth: 0, ticks: '' },
                                                type: 'mesh3d'
                                            }
                                        ],
                                        parcoords: [
                                            {
                                                line: { colorbar: { outlinewidth: 0, ticks: '' } },
                                                type: 'parcoords'
                                            }
                                        ],
                                        pie: [{ automargin: true, type: 'pie' }],
                                        scatter: [
                                            {
                                                marker: {
                                                    colorbar: { outlinewidth: 0, ticks: '' }
                                                },
                                                type: 'scatter'
                                            }
                                        ],
                                        scatter3d: [
                                            {
                                                line: { colorbar: { outlinewidth: 0, ticks: '' } },
                                                marker: {
                                                    colorbar: { outlinewidth: 0, ticks: '' }
                                                },
                                                type: 'scatter3d'
                                            }
                                        ],
                                        scattercarpet: [
                                            {
                                                marker: {
                                                    colorbar: { outlinewidth: 0, ticks: '' }
                                                },
                                                type: 'scattercarpet'
                                            }
                                        ],
                                        scattergeo: [
                                            {
                                                marker: {
                                                    colorbar: { outlinewidth: 0, ticks: '' }
                                                },
                                                type: 'scattergeo'
                                            }
                                        ],
                                        scattergl: [
                                            {
                                                marker: {
                                                    colorbar: { outlinewidth: 0, ticks: '' }
                                                },
                                                type: 'scattergl'
                                            }
                                        ],
                                        scattermapbox: [
                                            {
                                                marker: {
                                                    colorbar: { outlinewidth: 0, ticks: '' }
                                                },
                                                type: 'scattermapbox'
                                            }
                                        ],
                                        scatterpolar: [
                                            {
                                                marker: {
                                                    colorbar: { outlinewidth: 0, ticks: '' }
                                                },
                                                type: 'scatterpolar'
                                            }
                                        ],
                                        scatterpolargl: [
                                            {
                                                marker: {
                                                    colorbar: { outlinewidth: 0, ticks: '' }
                                                },
                                                type: 'scatterpolargl'
                                            }
                                        ],
                                        scatterternary: [
                                            {
                                                marker: {
                                                    colorbar: { outlinewidth: 0, ticks: '' }
                                                },
                                                type: 'scatterternary'
                                            }
                                        ],
                                        surface: [
                                            {
                                                colorbar: { outlinewidth: 0, ticks: '' },
                                                colorscale: [
                                                    [0, '#0d0887'],
                                                    [0.1111111111111111, '#46039f'],
                                                    [0.2222222222222222, '#7201a8'],
                                                    [0.3333333333333333, '#9c179e'],
                                                    [0.4444444444444444, '#bd3786'],
                                                    [0.5555555555555556, '#d8576b'],
                                                    [0.6666666666666666, '#ed7953'],
                                                    [0.7777777777777778, '#fb9f3a'],
                                                    [0.8888888888888888, '#fdca26'],
                                                    [1, '#f0f921']
                                                ],
                                                type: 'surface'
                                            }
                                        ],
                                        table: [
                                            {
                                                cells: {
                                                    fill: { color: '#EBF0F8' },
                                                    line: { color: 'white' }
                                                },
                                                header: {
                                                    fill: { color: '#C8D4E3' },
                                                    line: { color: 'white' }
                                                },
                                                type: 'table'
                                            }
                                        ]
                                    },
                                    layout: {
                                        annotationdefaults: {
                                            arrowcolor: '#2a3f5f',
                                            arrowhead: 0,
                                            arrowwidth: 1
                                        },
                                        coloraxis: { colorbar: { outlinewidth: 0, ticks: '' } },
                                        colorscale: {
                                            diverging: [
                                                [0, '#8e0152'],
                                                [0.1, '#c51b7d'],
                                                [0.2, '#de77ae'],
                                                [0.3, '#f1b6da'],
                                                [0.4, '#fde0ef'],
                                                [0.5, '#f7f7f7'],
                                                [0.6, '#e6f5d0'],
                                                [0.7, '#b8e186'],
                                                [0.8, '#7fbc41'],
                                                [0.9, '#4d9221'],
                                                [1, '#276419']
                                            ],
                                            sequential: [
                                                [0, '#0d0887'],
                                                [0.1111111111111111, '#46039f'],
                                                [0.2222222222222222, '#7201a8'],
                                                [0.3333333333333333, '#9c179e'],
                                                [0.4444444444444444, '#bd3786'],
                                                [0.5555555555555556, '#d8576b'],
                                                [0.6666666666666666, '#ed7953'],
                                                [0.7777777777777778, '#fb9f3a'],
                                                [0.8888888888888888, '#fdca26'],
                                                [1, '#f0f921']
                                            ],
                                            sequentialminus: [
                                                [0, '#0d0887'],
                                                [0.1111111111111111, '#46039f'],
                                                [0.2222222222222222, '#7201a8'],
                                                [0.3333333333333333, '#9c179e'],
                                                [0.4444444444444444, '#bd3786'],
                                                [0.5555555555555556, '#d8576b'],
                                                [0.6666666666666666, '#ed7953'],
                                                [0.7777777777777778, '#fb9f3a'],
                                                [0.8888888888888888, '#fdca26'],
                                                [1, '#f0f921']
                                            ]
                                        },
                                        colorway: [
                                            '#636efa',
                                            '#EF553B',
                                            '#00cc96',
                                            '#ab63fa',
                                            '#FFA15A',
                                            '#19d3f3',
                                            '#FF6692',
                                            '#B6E880',
                                            '#FF97FF',
                                            '#FECB52'
                                        ],
                                        font: { color: '#2a3f5f' },
                                        geo: {
                                            bgcolor: 'white',
                                            lakecolor: 'white',
                                            landcolor: '#E5ECF6',
                                            showlakes: true,
                                            showland: true,
                                            subunitcolor: 'white'
                                        },
                                        hoverlabel: { align: 'left' },
                                        hovermode: 'closest',
                                        mapbox: { style: 'light' },
                                        paper_bgcolor: 'white',
                                        plot_bgcolor: '#E5ECF6',
                                        polar: {
                                            angularaxis: {
                                                gridcolor: 'white',
                                                linecolor: 'white',
                                                ticks: ''
                                            },
                                            bgcolor: '#E5ECF6',
                                            radialaxis: {
                                                gridcolor: 'white',
                                                linecolor: 'white',
                                                ticks: ''
                                            }
                                        },
                                        scene: {
                                            xaxis: {
                                                backgroundcolor: '#E5ECF6',
                                                gridcolor: 'white',
                                                gridwidth: 2,
                                                linecolor: 'white',
                                                showbackground: true,
                                                ticks: '',
                                                zerolinecolor: 'white'
                                            },
                                            yaxis: {
                                                backgroundcolor: '#E5ECF6',
                                                gridcolor: 'white',
                                                gridwidth: 2,
                                                linecolor: 'white',
                                                showbackground: true,
                                                ticks: '',
                                                zerolinecolor: 'white'
                                            },
                                            zaxis: {
                                                backgroundcolor: '#E5ECF6',
                                                gridcolor: 'white',
                                                gridwidth: 2,
                                                linecolor: 'white',
                                                showbackground: true,
                                                ticks: '',
                                                zerolinecolor: 'white'
                                            }
                                        },
                                        shapedefaults: { line: { color: '#2a3f5f' } },
                                        ternary: {
                                            aaxis: {
                                                gridcolor: 'white',
                                                linecolor: 'white',
                                                ticks: ''
                                            },
                                            baxis: {
                                                gridcolor: 'white',
                                                linecolor: 'white',
                                                ticks: ''
                                            },
                                            bgcolor: '#E5ECF6',
                                            caxis: {
                                                gridcolor: 'white',
                                                linecolor: 'white',
                                                ticks: ''
                                            }
                                        },
                                        title: { x: 0.05 },
                                        xaxis: {
                                            automargin: true,
                                            gridcolor: 'white',
                                            linecolor: 'white',
                                            ticks: '',
                                            title: { standoff: 15 },
                                            zerolinecolor: 'white',
                                            zerolinewidth: 2
                                        },
                                        yaxis: {
                                            automargin: true,
                                            gridcolor: 'white',
                                            linecolor: 'white',
                                            ticks: '',
                                            title: { standoff: 15 },
                                            zerolinecolor: 'white',
                                            zerolinewidth: 2
                                        }
                                    }
                                },
                                title: { text: 'Time Series with Rangeslider' },
                                xaxis: {
                                    anchor: 'y',
                                    domain: [0, 1],
                                    rangeslider: { visible: true },
                                    title: { text: 'Date' }
                                },
                                yaxis: { anchor: 'x', domain: [0, 1], title: { text: 'AAPL.High' } }
                            }
                        },
                        {
                            data: [
                                {
                                    alignmentgroup: 'True',
                                    hovertemplate: 'date=%{x}<br>GOOG=%{y}<extra></extra>',
                                    legendgroup: '',
                                    marker: { color: '#636efa' },
                                    name: '',
                                    offsetgroup: '',
                                    orientation: 'v',
                                    showlegend: false,
                                    textposition: 'auto',
                                    type: 'bar',
                                    x: [
                                        '2018-01-01',
                                        '2018-01-08',
                                        '2018-01-15',
                                        '2018-01-22',
                                        '2018-01-29',
                                        '2018-02-05',
                                        '2018-02-12',
                                        '2018-02-19',
                                        '2018-02-26',
                                        '2018-03-05',
                                        '2018-03-12',
                                        '2018-03-19',
                                        '2018-03-26',
                                        '2018-04-02',
                                        '2018-04-09',
                                        '2018-04-16',
                                        '2018-04-23',
                                        '2018-04-30',
                                        '2018-05-07',
                                        '2018-05-14',
                                        '2018-05-21',
                                        '2018-05-28',
                                        '2018-06-04',
                                        '2018-06-11',
                                        '2018-06-18',
                                        '2018-06-25',
                                        '2018-07-02',
                                        '2018-07-09',
                                        '2018-07-16',
                                        '2018-07-23',
                                        '2018-07-30',
                                        '2018-08-06',
                                        '2018-08-13',
                                        '2018-08-20',
                                        '2018-08-27',
                                        '2018-09-03',
                                        '2018-09-10',
                                        '2018-09-17',
                                        '2018-09-24',
                                        '2018-10-01',
                                        '2018-10-08',
                                        '2018-10-15',
                                        '2018-10-22',
                                        '2018-10-29',
                                        '2018-11-05',
                                        '2018-11-12',
                                        '2018-11-19',
                                        '2018-11-26',
                                        '2018-12-03',
                                        '2018-12-10',
                                        '2018-12-17',
                                        '2018-12-24',
                                        '2018-12-31',
                                        '2019-01-07',
                                        '2019-01-14',
                                        '2019-01-21',
                                        '2019-01-28',
                                        '2019-02-04',
                                        '2019-02-11',
                                        '2019-02-18',
                                        '2019-02-25',
                                        '2019-03-04',
                                        '2019-03-11',
                                        '2019-03-18',
                                        '2019-03-25',
                                        '2019-04-01',
                                        '2019-04-08',
                                        '2019-04-15',
                                        '2019-04-22',
                                        '2019-04-29',
                                        '2019-05-06',
                                        '2019-05-13',
                                        '2019-05-20',
                                        '2019-05-27',
                                        '2019-06-03',
                                        '2019-06-10',
                                        '2019-06-17',
                                        '2019-06-24',
                                        '2019-07-01',
                                        '2019-07-08',
                                        '2019-07-15',
                                        '2019-07-22',
                                        '2019-07-29',
                                        '2019-08-05',
                                        '2019-08-12',
                                        '2019-08-19',
                                        '2019-08-26',
                                        '2019-09-02',
                                        '2019-09-09',
                                        '2019-09-16',
                                        '2019-09-23',
                                        '2019-09-30',
                                        '2019-10-07',
                                        '2019-10-14',
                                        '2019-10-21',
                                        '2019-10-28',
                                        '2019-11-04',
                                        '2019-11-11',
                                        '2019-11-18',
                                        '2019-11-25',
                                        '2019-12-02',
                                        '2019-12-09',
                                        '2019-12-16',
                                        '2019-12-23',
                                        '2019-12-30'
                                    ],
                                    xaxis: 'x',
                                    y: [
                                        0, 0.01817227834793611, 0.03200786645269793,
                                        0.0667827833897241, 0.008773163655011684,
                                        -0.058472326256268414, -0.006740817374609964,
                                        0.02228215476410833, -0.021147978573400783,
                                        0.05244827309088418, 0.03039293124652631,
                                        -0.073178895932408, -0.06390675474096619,
                                        -0.08636128913858798, -0.06619304620983002,
                                        -0.026555273882134744, -0.06548536358991075,
                                        -0.049009752937404394, -0.0036017619480828156,
                                        -0.03254311318949976, -0.024105628119460376,
                                        0.01566825464137711, 0.01691118490534982,
                                        0.04538982871795949, 0.048311151906791805,
                                        0.012175357451264412, 0.03442118676539718,
                                        0.07855889203812083, 0.07501161781137511,
                                        0.12363120444247033, 0.11021291672723321,
                                        0.1228237368393843, 0.08957294102996549,
                                        0.10743678374634658, 0.10520486931411543,
                                        0.0567939333314087, 0.06377983748908722,
                                        0.05793707951946647, 0.08277763502676638,
                                        0.05000770891751638, 0.007121903906116112,
                                        -0.005234859425616412, -0.027907069811329177,
                                        -0.040318211086946, -0.03273360065927444,
                                        -0.03696142432997518, -0.07108314636841939,
                                        -0.007076495959582041, -0.05956109450044178,
                                        -0.054553047087324, -0.11131071031110962,
                                        -0.05910746866094141, -0.028596590159886803,
                                        -0.04086265100501085, -0.0036017619480828156,
                                        -0.010197499799451948, 0.007729802450120227,
                                        -0.006504922865553153, 0.010360854093262706,
                                        0.007385042275841691, 0.035165084150587056,
                                        0.036371688964584425, 0.07460328832645247,
                                        0.0936918990354445, 0.0644875210162581, 0.095188886079836,
                                        0.10491459776842582, 0.12169875382994033,
                                        0.1541874899828073, 0.07545616206156902,
                                        0.056285930455275635, 0.054498670957942696,
                                        0.02834253428671918, 0.0012701750318928617,
                                        -0.032833384735189375, -0.015314411970539954,
                                        0.017827518173657353, -0.01934255680470598,
                                        0.02663689659393942, 0.03871246906203729,
                                        0.025285100664744986, 0.13443660278592673,
                                        0.08324942313762862, 0.07782407624223753,
                                        0.06837955541728191, 0.04450982089962752,
                                        0.07790569804679048, 0.09317481457000465, 0.12459294475006,
                                        0.11585610654502432, 0.11146492858051271,
                                        0.09686727991194721, 0.1027190087861698,
                                        0.12997288460616896, 0.14779132119051952,
                                        0.15560274453794087, 0.1897426297549989,
                                        0.21106304421151711, 0.1751993590303178,
                                        0.18392711564604713, 0.216279741365772, 0.2228209905885521,
                                        0.2244177626161099, 0.2265044859331442, 0.21301365800266092
                                    ],
                                    yaxis: 'y'
                                }
                            ],
                            layout: {
                                barmode: 'relative',
                                legend: { tracegroupgap: 0 },
                                margin: { t: 60 },
                                template: {
                                    data: {
                                        bar: [
                                            {
                                                error_x: { color: '#2a3f5f' },
                                                error_y: { color: '#2a3f5f' },
                                                marker: { line: { color: '#E5ECF6', width: 0.5 } },
                                                type: 'bar'
                                            }
                                        ],
                                        barpolar: [
                                            {
                                                marker: { line: { color: '#E5ECF6', width: 0.5 } },
                                                type: 'barpolar'
                                            }
                                        ],
                                        carpet: [
                                            {
                                                aaxis: {
                                                    endlinecolor: '#2a3f5f',
                                                    gridcolor: 'white',
                                                    linecolor: 'white',
                                                    minorgridcolor: 'white',
                                                    startlinecolor: '#2a3f5f'
                                                },
                                                baxis: {
                                                    endlinecolor: '#2a3f5f',
                                                    gridcolor: 'white',
                                                    linecolor: 'white',
                                                    minorgridcolor: 'white',
                                                    startlinecolor: '#2a3f5f'
                                                },
                                                type: 'carpet'
                                            }
                                        ],
                                        choropleth: [
                                            {
                                                colorbar: { outlinewidth: 0, ticks: '' },
                                                type: 'choropleth'
                                            }
                                        ],
                                        contour: [
                                            {
                                                colorbar: { outlinewidth: 0, ticks: '' },
                                                colorscale: [
                                                    [0, '#0d0887'],
                                                    [0.1111111111111111, '#46039f'],
                                                    [0.2222222222222222, '#7201a8'],
                                                    [0.3333333333333333, '#9c179e'],
                                                    [0.4444444444444444, '#bd3786'],
                                                    [0.5555555555555556, '#d8576b'],
                                                    [0.6666666666666666, '#ed7953'],
                                                    [0.7777777777777778, '#fb9f3a'],
                                                    [0.8888888888888888, '#fdca26'],
                                                    [1, '#f0f921']
                                                ],
                                                type: 'contour'
                                            }
                                        ],
                                        contourcarpet: [
                                            {
                                                colorbar: { outlinewidth: 0, ticks: '' },
                                                type: 'contourcarpet'
                                            }
                                        ],
                                        heatmap: [
                                            {
                                                colorbar: { outlinewidth: 0, ticks: '' },
                                                colorscale: [
                                                    [0, '#0d0887'],
                                                    [0.1111111111111111, '#46039f'],
                                                    [0.2222222222222222, '#7201a8'],
                                                    [0.3333333333333333, '#9c179e'],
                                                    [0.4444444444444444, '#bd3786'],
                                                    [0.5555555555555556, '#d8576b'],
                                                    [0.6666666666666666, '#ed7953'],
                                                    [0.7777777777777778, '#fb9f3a'],
                                                    [0.8888888888888888, '#fdca26'],
                                                    [1, '#f0f921']
                                                ],
                                                type: 'heatmap'
                                            }
                                        ],
                                        heatmapgl: [
                                            {
                                                colorbar: { outlinewidth: 0, ticks: '' },
                                                colorscale: [
                                                    [0, '#0d0887'],
                                                    [0.1111111111111111, '#46039f'],
                                                    [0.2222222222222222, '#7201a8'],
                                                    [0.3333333333333333, '#9c179e'],
                                                    [0.4444444444444444, '#bd3786'],
                                                    [0.5555555555555556, '#d8576b'],
                                                    [0.6666666666666666, '#ed7953'],
                                                    [0.7777777777777778, '#fb9f3a'],
                                                    [0.8888888888888888, '#fdca26'],
                                                    [1, '#f0f921']
                                                ],
                                                type: 'heatmapgl'
                                            }
                                        ],
                                        histogram: [
                                            {
                                                marker: {
                                                    colorbar: { outlinewidth: 0, ticks: '' }
                                                },
                                                type: 'histogram'
                                            }
                                        ],
                                        histogram2d: [
                                            {
                                                colorbar: { outlinewidth: 0, ticks: '' },
                                                colorscale: [
                                                    [0, '#0d0887'],
                                                    [0.1111111111111111, '#46039f'],
                                                    [0.2222222222222222, '#7201a8'],
                                                    [0.3333333333333333, '#9c179e'],
                                                    [0.4444444444444444, '#bd3786'],
                                                    [0.5555555555555556, '#d8576b'],
                                                    [0.6666666666666666, '#ed7953'],
                                                    [0.7777777777777778, '#fb9f3a'],
                                                    [0.8888888888888888, '#fdca26'],
                                                    [1, '#f0f921']
                                                ],
                                                type: 'histogram2d'
                                            }
                                        ],
                                        histogram2dcontour: [
                                            {
                                                colorbar: { outlinewidth: 0, ticks: '' },
                                                colorscale: [
                                                    [0, '#0d0887'],
                                                    [0.1111111111111111, '#46039f'],
                                                    [0.2222222222222222, '#7201a8'],
                                                    [0.3333333333333333, '#9c179e'],
                                                    [0.4444444444444444, '#bd3786'],
                                                    [0.5555555555555556, '#d8576b'],
                                                    [0.6666666666666666, '#ed7953'],
                                                    [0.7777777777777778, '#fb9f3a'],
                                                    [0.8888888888888888, '#fdca26'],
                                                    [1, '#f0f921']
                                                ],
                                                type: 'histogram2dcontour'
                                            }
                                        ],
                                        mesh3d: [
                                            {
                                                colorbar: { outlinewidth: 0, ticks: '' },
                                                type: 'mesh3d'
                                            }
                                        ],
                                        parcoords: [
                                            {
                                                line: { colorbar: { outlinewidth: 0, ticks: '' } },
                                                type: 'parcoords'
                                            }
                                        ],
                                        pie: [{ automargin: true, type: 'pie' }],
                                        scatter: [
                                            {
                                                marker: {
                                                    colorbar: { outlinewidth: 0, ticks: '' }
                                                },
                                                type: 'scatter'
                                            }
                                        ],
                                        scatter3d: [
                                            {
                                                line: { colorbar: { outlinewidth: 0, ticks: '' } },
                                                marker: {
                                                    colorbar: { outlinewidth: 0, ticks: '' }
                                                },
                                                type: 'scatter3d'
                                            }
                                        ],
                                        scattercarpet: [
                                            {
                                                marker: {
                                                    colorbar: { outlinewidth: 0, ticks: '' }
                                                },
                                                type: 'scattercarpet'
                                            }
                                        ],
                                        scattergeo: [
                                            {
                                                marker: {
                                                    colorbar: { outlinewidth: 0, ticks: '' }
                                                },
                                                type: 'scattergeo'
                                            }
                                        ],
                                        scattergl: [
                                            {
                                                marker: {
                                                    colorbar: { outlinewidth: 0, ticks: '' }
                                                },
                                                type: 'scattergl'
                                            }
                                        ],
                                        scattermapbox: [
                                            {
                                                marker: {
                                                    colorbar: { outlinewidth: 0, ticks: '' }
                                                },
                                                type: 'scattermapbox'
                                            }
                                        ],
                                        scatterpolar: [
                                            {
                                                marker: {
                                                    colorbar: { outlinewidth: 0, ticks: '' }
                                                },
                                                type: 'scatterpolar'
                                            }
                                        ],
                                        scatterpolargl: [
                                            {
                                                marker: {
                                                    colorbar: { outlinewidth: 0, ticks: '' }
                                                },
                                                type: 'scatterpolargl'
                                            }
                                        ],
                                        scatterternary: [
                                            {
                                                marker: {
                                                    colorbar: { outlinewidth: 0, ticks: '' }
                                                },
                                                type: 'scatterternary'
                                            }
                                        ],
                                        surface: [
                                            {
                                                colorbar: { outlinewidth: 0, ticks: '' },
                                                colorscale: [
                                                    [0, '#0d0887'],
                                                    [0.1111111111111111, '#46039f'],
                                                    [0.2222222222222222, '#7201a8'],
                                                    [0.3333333333333333, '#9c179e'],
                                                    [0.4444444444444444, '#bd3786'],
                                                    [0.5555555555555556, '#d8576b'],
                                                    [0.6666666666666666, '#ed7953'],
                                                    [0.7777777777777778, '#fb9f3a'],
                                                    [0.8888888888888888, '#fdca26'],
                                                    [1, '#f0f921']
                                                ],
                                                type: 'surface'
                                            }
                                        ],
                                        table: [
                                            {
                                                cells: {
                                                    fill: { color: '#EBF0F8' },
                                                    line: { color: 'white' }
                                                },
                                                header: {
                                                    fill: { color: '#C8D4E3' },
                                                    line: { color: 'white' }
                                                },
                                                type: 'table'
                                            }
                                        ]
                                    },
                                    layout: {
                                        annotationdefaults: {
                                            arrowcolor: '#2a3f5f',
                                            arrowhead: 0,
                                            arrowwidth: 1
                                        },
                                        coloraxis: { colorbar: { outlinewidth: 0, ticks: '' } },
                                        colorscale: {
                                            diverging: [
                                                [0, '#8e0152'],
                                                [0.1, '#c51b7d'],
                                                [0.2, '#de77ae'],
                                                [0.3, '#f1b6da'],
                                                [0.4, '#fde0ef'],
                                                [0.5, '#f7f7f7'],
                                                [0.6, '#e6f5d0'],
                                                [0.7, '#b8e186'],
                                                [0.8, '#7fbc41'],
                                                [0.9, '#4d9221'],
                                                [1, '#276419']
                                            ],
                                            sequential: [
                                                [0, '#0d0887'],
                                                [0.1111111111111111, '#46039f'],
                                                [0.2222222222222222, '#7201a8'],
                                                [0.3333333333333333, '#9c179e'],
                                                [0.4444444444444444, '#bd3786'],
                                                [0.5555555555555556, '#d8576b'],
                                                [0.6666666666666666, '#ed7953'],
                                                [0.7777777777777778, '#fb9f3a'],
                                                [0.8888888888888888, '#fdca26'],
                                                [1, '#f0f921']
                                            ],
                                            sequentialminus: [
                                                [0, '#0d0887'],
                                                [0.1111111111111111, '#46039f'],
                                                [0.2222222222222222, '#7201a8'],
                                                [0.3333333333333333, '#9c179e'],
                                                [0.4444444444444444, '#bd3786'],
                                                [0.5555555555555556, '#d8576b'],
                                                [0.6666666666666666, '#ed7953'],
                                                [0.7777777777777778, '#fb9f3a'],
                                                [0.8888888888888888, '#fdca26'],
                                                [1, '#f0f921']
                                            ]
                                        },
                                        colorway: [
                                            '#636efa',
                                            '#EF553B',
                                            '#00cc96',
                                            '#ab63fa',
                                            '#FFA15A',
                                            '#19d3f3',
                                            '#FF6692',
                                            '#B6E880',
                                            '#FF97FF',
                                            '#FECB52'
                                        ],
                                        font: { color: '#2a3f5f' },
                                        geo: {
                                            bgcolor: 'white',
                                            lakecolor: 'white',
                                            landcolor: '#E5ECF6',
                                            showlakes: true,
                                            showland: true,
                                            subunitcolor: 'white'
                                        },
                                        hoverlabel: { align: 'left' },
                                        hovermode: 'closest',
                                        mapbox: { style: 'light' },
                                        paper_bgcolor: 'white',
                                        plot_bgcolor: '#E5ECF6',
                                        polar: {
                                            angularaxis: {
                                                gridcolor: 'white',
                                                linecolor: 'white',
                                                ticks: ''
                                            },
                                            bgcolor: '#E5ECF6',
                                            radialaxis: {
                                                gridcolor: 'white',
                                                linecolor: 'white',
                                                ticks: ''
                                            }
                                        },
                                        scene: {
                                            xaxis: {
                                                backgroundcolor: '#E5ECF6',
                                                gridcolor: 'white',
                                                gridwidth: 2,
                                                linecolor: 'white',
                                                showbackground: true,
                                                ticks: '',
                                                zerolinecolor: 'white'
                                            },
                                            yaxis: {
                                                backgroundcolor: '#E5ECF6',
                                                gridcolor: 'white',
                                                gridwidth: 2,
                                                linecolor: 'white',
                                                showbackground: true,
                                                ticks: '',
                                                zerolinecolor: 'white'
                                            },
                                            zaxis: {
                                                backgroundcolor: '#E5ECF6',
                                                gridcolor: 'white',
                                                gridwidth: 2,
                                                linecolor: 'white',
                                                showbackground: true,
                                                ticks: '',
                                                zerolinecolor: 'white'
                                            }
                                        },
                                        shapedefaults: { line: { color: '#2a3f5f' } },
                                        ternary: {
                                            aaxis: {
                                                gridcolor: 'white',
                                                linecolor: 'white',
                                                ticks: ''
                                            },
                                            baxis: {
                                                gridcolor: 'white',
                                                linecolor: 'white',
                                                ticks: ''
                                            },
                                            bgcolor: '#E5ECF6',
                                            caxis: {
                                                gridcolor: 'white',
                                                linecolor: 'white',
                                                ticks: ''
                                            }
                                        },
                                        title: { x: 0.05 },
                                        xaxis: {
                                            automargin: true,
                                            gridcolor: 'white',
                                            linecolor: 'white',
                                            ticks: '',
                                            title: { standoff: 15 },
                                            zerolinecolor: 'white',
                                            zerolinewidth: 2
                                        },
                                        yaxis: {
                                            automargin: true,
                                            gridcolor: 'white',
                                            linecolor: 'white',
                                            ticks: '',
                                            title: { standoff: 15 },
                                            zerolinecolor: 'white',
                                            zerolinewidth: 2
                                        }
                                    }
                                },
                                xaxis: { anchor: 'y', domain: [0, 1], title: { text: 'date' } },
                                yaxis: { anchor: 'x', domain: [0, 1], title: { text: 'GOOG' } }
                            }
                        }
                    ]
                }
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetTableSimulator {...props} parent_obj={{}} size_nooverride={true} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
});
