import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import DynamicForm from '../../../components/dynamic-form/dynamic-form.jsx';
import { act } from 'react-dom/test-utils';
import { vi } from 'vitest';

vi.mock('../../../components/dynamic-form/inputFields/select', () => {
    return {
        default: (props) => (
            <button aria-label="mock-select" onClick={props.onChange('test value')}>
                Test onChange
            </button>
        )
    };
});
vi.mock('../../../components/dynamic-form/inputFields/datepicker', () => {
    return {
        default: (props) => (
            <button aria-label="mock-date-picker" onClick={props.onChange('test value')}>
                Test onChange
            </button>
        )
    };
});
vi.mock('../../../components/dynamic-form/inputFields/datetimepicker', () => {
    return {
        default: (props) => (
            <button aria-label="mock-date-time-picker" onClick={props.onChange('test value')}>
                Test onChange
            </button>
        )
    };
});
vi.mock('../../../components/dynamic-form/inputFields/fileUpload', () => {
    return {
        default: (props) => (
            <button aria-label="mock-file-upload" onClick={props.onChange('test value')}>
                Test onChange
            </button>
        )
    };
});
vi.mock('../../../components/dynamic-form/inputFields/checkboxgroup', () => {
    return {
        default: (props) => (
            <button aria-label="mock-checkbox-group" onClick={props.onChange('test value')}>
                Test onChange
            </button>
        )
    };
});
vi.mock('../../../components/dynamic-form/inputFields/checkbox', () => {
    return {
        default: (props) => (
            <button aria-label="mock-checkbox" onClick={props.onChange('test value')}>
                Test onChange
            </button>
        )
    };
});
vi.mock('../../../components/dynamic-form/inputFields/radiogroup', () => {
    return {
        default: (props) => (
            <button aria-label="mock-radio-group" onClick={props.onChange('test value')}>
                Test onChange
            </button>
        )
    };
});
vi.mock('../../../components/dynamic-form/inputFields/autoSuggest', () => {
    return {
        default: (props) => (
            <button aria-label="mock-auto-suggest" onClick={props.onChange('test value')}>
                Test onChange
            </button>
        )
    };
});
vi.mock('../../../components/AppWidgetMultiSelect/DateRangeSelect', () => {
    return {
        default: (props) => (
            <button aria-label="mock-date-range" onClick={props.onChangeFilter('test value')}>
                Test onChange
            </button>
        )
    };
});
vi.mock('../../../components/porblemDefinitionFramework/create/InfoPopper', () => {
    return { default: (props) => <button aria-label="mock-info-popper">Test onClick</button> };
});

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts DynamicForm Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DynamicForm
                        params={formConfig}
                        onChange={() => {}}
                        extraParamsMapping={{ 'Active MC': {} }}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByDisplayValue('Input Data')).toBeInTheDocument();
        act(() => {
            screen.getByDisplayValue('Input Data').click();
            fireEvent.change(screen.getByDisplayValue('Input Data'), {
                target: { value: 'changed' }
            });
            fireEvent.click(screen.getByLabelText('mock-select'));
            fireEvent.click(screen.getAllByLabelText('mock-date-picker')[0]);
            fireEvent.click(screen.getByLabelText('mock-date-time-picker'));
            fireEvent.click(screen.getByLabelText('mock-file-upload'));
            fireEvent.click(screen.getByLabelText('mock-checkbox-group'));
            fireEvent.click(screen.getByLabelText('mock-checkbox'));
            fireEvent.click(screen.getByLabelText('mock-radio-group'));
            fireEvent.click(screen.getByLabelText('mock-auto-suggest'));
            fireEvent.click(screen.getByLabelText('mock-date-range'));
            fireEvent.click(screen.getByLabelText('mock-info-popper'));
        });
    });
});

const formConfig = {
    title: 'Title',
    fields: [
        {
            id: 1,
            name: 'Active MC',
            label: 'Active Machine',
            type: 'select',
            value: ['MC1', 'MC2', 'MC3', 'MC4'],
            variant: 'outlined',
            multiple: true,
            options: ['MC1', 'MC2', 'MC3', 'MC4', 'MC5', 'MC6'],
            margin: 'none',
            fullWidth: true,
            inputprops: {
                type: 'select'
            },
            placeholder: 'Enter your Input',
            grid: 6
        },
        {
            id: 2,
            type: 'blank',
            grid: 6
        },
        {
            id: 3,
            name: 'Start Date',
            suppressUTC: true,
            label: 'Schedule Start Date',
            type: 'datepicker',
            variant: 'outlined',
            margin: 'none',
            value: '2021-10-29T00:00:00',
            inputprops: {
                format: 'DD/MM/yyyy',
                variant: 'inline'
            },
            placeholder: 'Enter StartDate',
            fullWidth: true,
            grid: 6
        },
        {
            id: 3,
            name: 'Start Date',
            suppressUTC: true,
            label: 'Schedule Start Date',
            type: 'datetimepicker',
            variant: 'outlined',
            margin: 'none',
            value: '2021-10-29T00:00:00',
            inputprops: {
                variant: 'inline'
            },
            placeholder: 'Enter StartDate',
            fullWidth: true,
            grid: 6
        },
        {
            id: 4,
            name: 'End Date',
            suppressUTC: true,
            label: 'Schedule End Date',
            type: 'datepicker',
            variant: 'outlined',
            margin: 'none',
            value: '2021-11-04T23:59:59',
            inputprops: {
                format: 'DD/MM/yyyy',
                variant: 'inline'
            },
            placeholder: 'Enter EndDate',
            fullWidth: true,
            grid: 6
        },
        {
            id: 5,
            grid: 12,
            name: 'activeMachine',
            type: 'tabularForm',
            value: [],
            tableprops: {
                coldef: [
                    {
                        headerName: 'Active Machine',
                        field: 'activeMachine',
                        cellEditor: 'select',
                        cellEditorParams: {
                            variant: 'outlined',
                            options: ['MC1', 'MC2', 'MC3', 'MC4', 'MC5', 'MC6'],
                            fullWidth: true
                        },
                        editable: true
                    },
                    {
                        headerName: 'Start Date',
                        field: 'startDate',
                        cellEditor: 'dateTime',
                        editable: true,
                        value: '2021-10-29T00:00:00',
                        cellEditorParams: {
                            suppressUTC: true,
                            variant: 'outlined',
                            inputprops: {
                                format: 'DD/MM/YYYY LT'
                            }
                        }
                    },
                    {
                        headerName: 'End Date',
                        field: 'endDate',
                        cellEditor: 'dateTime',
                        editable: true,
                        value: '2021-11-04T23:59:59',
                        cellEditorParams: {
                            suppressUTC: true,
                            variant: 'outlined',
                            inputprops: {
                                format: 'DD/MM/YYYY LT'
                            }
                        }
                    }
                ],
                gridOptions: {
                    enableAddRow: true,
                    enableInRowDelete: true,
                    tableSize: 'small',
                    tableTitle: 'CIP Downtime Details in between the Schedule Start & End Date',
                    editorMode: true,
                    addRowToTop: true,
                    tableMaxHeight: '300px'
                }
            }
        },
        {
            id: 6,
            name: 'use_latest_schedule',
            label: 'Use Historical Schedule',
            type: 'checkbox',
            value: false,
            grid: 12,
            noGutterBottom: true
        },
        {
            id: 7,
            name: '',
            type: 'label2',
            fullWidth: true,
            value: {
                fetch_on_load: true
            },
            actionType: 'popup_schedule_period',
            grid: 12,
            noGutterTop: true
        },
        {
            id: 9,
            name: '',
            type: 'label',
            value: 'Input Data',
            fullWidth: true,
            InputLabelProps: {
                variant: 'h4'
            },
            underline: true,
            grid: 12
        },
        {
            id: 9,
            name: '',
            type: 'text',
            value: 'Input Data',
            fullWidth: true,
            underline: true,
            grid: 12
        },
        {
            id: 9,
            name: '',
            type: 'checkboxGroup',
            value: 'Input Data',
            fullWidth: true,
            underline: true,
            options: ['MC1', 'MC2', 'MC3', 'MC4', 'MC5', 'MC6'],
            grid: 12
        },
        {
            id: 9,
            name: '',
            type: 'radioGroup',
            value: 'Input Data',
            fullWidth: true,
            underline: true,
            grid: 12
        },
        {
            id: 9,
            name: '',
            type: 'downloadLink',
            value: 'Input Data',
            fullWidth: true,
            underline: true,
            grid: 12
        },
        {
            id: 9,
            name: '',
            type: 'autosuggest',
            value: 'Input Data',
            fullWidth: true,
            underline: true,
            grid: 12
        },
        {
            id: 9,
            name: '',
            type: 'hr',
            value: 'Input Data',
            fullWidth: true,
            underline: true,
            grid: 12
        },
        {
            id: 9,
            name: '',
            type: '',
            value: 'Input Data',
            fullWidth: true,
            underline: true,
            grid: 12
        },
        {
            id: 3,
            name: 'Start Date',
            suppressUTC: true,
            label: 'Plan Start Date',
            type: 'slider',
            variant: 'outlined',
            margin: 'none',
            value: '7',
            min: 0,
            max: 50,
            placeholder: 'Enter StartDate',
            fullWidth: true
        },
        {
            id: 10,
            name: 'Schedule',
            label: 'Upload Schedules',
            type: 'upload',
            value: '',
            variant: 'outlined',
            margin: 'none',
            inputprops: {
                type: 'file',
                multiple: true,
                accept: ''
            },
            InputLabelProps: {
                disableAnimation: true,
                shrink: true
            },
            placeholder: 'Enter your Input',
            grid: 12
        },
        {
            id: 3,
            name: 'Test_Date_Range',
            type: 'daterange',
            value: {
                start_date: '2021-10-29T00:00:00',
                end_date: '2021-11-04T23:59:59'
            },
            fullWidth: true,
            grid: 6,
            infoPopper: {
                desc: 'test info desc',
                minHeight: 'auto'
            }
        }
    ]
};
