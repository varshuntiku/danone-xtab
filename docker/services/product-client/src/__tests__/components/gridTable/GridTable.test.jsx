import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import GridTable from '../../../components/gridTable/GridTable';
import { act } from 'react-dom/test-utils';
import { vi } from 'vitest';
const history = createMemoryHistory();

describe('GridTable', () => {
    afterEach(cleanup);

    test('Should render layouts GridTable Component', () => {
        vi.useFakeTimers();

        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <GridTable {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByText('ProgressBar')).toBeInTheDocument();
        expect(screen.getByText('LinearProgressBar')).toBeInTheDocument();
        //Coulmn sorting
        expect(screen.getByText('Resource')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Resource'));
        fireEvent.click(screen.getByText('Resource'));
        fireEvent.click(screen.getByText('Resource'));

        //row addition
        expect(screen.getByTitle('add row')).toBeInTheDocument();
        fireEvent.click(screen.getByTitle('add row'));

        act(() => {
            vi.advanceTimersByTime(1200);
        });

        //row selection
        expect(screen.getAllByLabelText('select row')).not.toBeNull();
        const rowCheckbox = screen.getAllByLabelText('select row')[0];
        const secondCheckbox = screen.getAllByLabelText('select row')[1];

        act(() => {
            fireEvent.click(rowCheckbox);
            fireEvent.click(secondCheckbox);
            vi.advanceTimersByTime(1200);
            expect(rowCheckbox.checked).toEqual(false);
            expect(secondCheckbox.checked).toEqual(true);
        });

        //row deletion
        expect(screen.getAllByTitle('delete row')).not.toBeNull();
        const deleteRowBtn = screen.getAllByTitle('delete row')[0];
        fireEvent.click(deleteRowBtn);

        const checkboxEl = screen.getAllByRole('checkbox')[1];

        act(() => {
            checkboxEl.click();
            fireEvent.change(checkboxEl, { target: { checked: true } });
        });

        //handling the outer action click
        const resetBtn = screen.getByRole('button', { name: 'Reset' });
        fireEvent.click(resetBtn);

        //row drag and drop
        expect(screen.getByText('Dome 121', { exact: false })).toBeInTheDocument();
        const rowToDrag = screen.getByText('Dome 121', { exact: false });
        fireEvent.dragStart(rowToDrag, { dataTransfer: { setData: () => {} } });
        fireEvent.drop(rowToDrag, { dataTransfer: { getData: () => {} } });
    });

    test('Should render layouts GridTable Component 1', () => {
        vi.useFakeTimers();

        const params1 = {
            ...props.params,
            gridOptions: {
                ...props.params.gridOptions,
                addRowToTop: true,
                singleSelectRows: false,
                multiSelectRows: true
            }
        };

        const props1 = {
            ...props,
            params: { ...params1 }
        };

        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <GridTable {...props1} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByTitle('add row')).toBeInTheDocument();
        fireEvent.click(screen.getByTitle('add row'));

        act(() => {
            vi.advanceTimersByTime(1200);
        });

        const rowCheckbox = screen.getAllByLabelText('select row')[0];
        const secondCheckbox = screen.getAllByLabelText('select row')[1];

        act(() => {
            fireEvent.click(rowCheckbox);
            fireEvent.click(secondCheckbox);
            vi.advanceTimersByTime(1200);
            expect(rowCheckbox.checked).toEqual(true);
            expect(secondCheckbox.checked).toEqual(true);
        });

        expect(screen.getByLabelText('select all row')).toBeInTheDocument();
        const allrowCheckbox = screen.getByLabelText('select all row');

        act(() => {
            allrowCheckbox.click();
            fireEvent.change(allrowCheckbox, { target: { checked: true } });
        });
    });

    test('Should render layouts GridTable Component 2', () => {
        const params1 = {
            ...props.params,
            gridOptions: {
                ...props.params.gridOptions,
                enableDeleteRow: true,
                enableInRowDelete: false
            }
        };

        const props1 = {
            ...props,
            params: { ...params1 }
        };

        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <GridTable {...props1} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getAllByLabelText('select row')).not.toBeNull();
        const rowCheckbox = screen.getAllByLabelText('select row')[0];
        // fireEvent.change(rowCheckbox, { target: {checked: true}})

        act(() => {
            rowCheckbox.click();
            fireEvent.change(rowCheckbox, { target: { checked: true } });
        });

        expect(screen.getAllByTitle('delete row')).not.toBeNull();
        fireEvent.click(screen.getAllByTitle('delete row')[0]);
    });

    test('Should render layouts GridTable Component 3', () => {
        const params1 = {
            ...props.params,
            gridOptions: {
                ...props.params.gridOptions,
                enableInRowDuplicate: true
            }
        };

        const props1 = {
            ...props,
            params: { ...params1 }
        };

        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <GridTable {...props1} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getAllByTitle('duplicate row')).not.toBeNull();
        const duplicateRow = screen.getAllByTitle('duplicate row')[0];
        fireEvent.click(duplicateRow);
    });

    test('Should render layouts GridTable Component 4', () => {
        const params1 = {
            ...props.params,
            gridOptions: {
                ...props.params.gridOptions,
                enableInRowDuplicate: true,
                duplicateRowOrder: 'above'
            }
        };

        const props1 = {
            ...props,
            params: { ...params1 }
        };

        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <GridTable {...props1} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getAllByTitle('duplicate row')).not.toBeNull();
        const duplicateRow = screen.getAllByTitle('duplicate row')[0];
        fireEvent.click(duplicateRow);
    });

    test('Should render layouts GridTable Component 5', () => {
        const params1 = {
            ...props.params,
            gridOptions: {
                ...props.params.gridOptions,
                enableInRowDuplicate: true,
                duplicateRowOrder: 'top'
            }
        };

        const props1 = {
            ...props,
            params: { ...params1 }
        };

        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <GridTable {...props1} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getAllByTitle('duplicate row')).not.toBeNull();
        const duplicateRow = screen.getAllByTitle('duplicate row')[0];
        fireEvent.click(duplicateRow);
    });

    test('Should render layouts GridTable Component 6', () => {
        const params1 = {
            ...props.params,
            gridOptions: {
                ...props.params.gridOptions,
                enableInRowDuplicate: true,
                duplicateRowOrder: 'bottom'
            }
        };

        const props1 = {
            ...props,
            params: { ...params1 }
        };

        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <GridTable {...props1} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getAllByTitle('duplicate row')).not.toBeNull();
        const duplicateRow = screen.getAllByTitle('duplicate row')[0];
        fireEvent.click(duplicateRow);
    });

    test('Should render layouts GridTable Component 7', () => {
        const params1 = {
            ...props.params,
            gridOptions: {
                ...props.params.gridOptions,
                enableDuplicateRow: true
            }
        };

        const props1 = {
            ...props,
            params: { ...params1 }
        };

        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <GridTable {...props1} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getAllByTitle('duplicate row')).not.toBeNull();
        const duplicateRow = screen.getAllByTitle('duplicate row')[0];
        fireEvent.click(duplicateRow);
    });

    test('Should render layouts GridTable Component 8', () => {
        const params1 = {
            ...props.params,
            gridOptions: {
                ...props.params.gridOptions,
                enableDuplicateRow: true,
                duplicateRowOrder: 'above'
            }
        };

        const props1 = {
            ...props,
            params: { ...params1 }
        };

        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <GridTable {...props1} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getAllByTitle('duplicate row')).not.toBeNull();
        const duplicateRow = screen.getAllByTitle('duplicate row')[0];
        fireEvent.click(duplicateRow);
    });

    test('Should render layouts GridTable Component 9', () => {
        const params1 = {
            ...props.params,
            gridOptions: {
                ...props.params.gridOptions,
                enableDuplicateRow: true,
                duplicateRowOrder: 'top'
            }
        };

        const props1 = {
            ...props,
            params: { ...params1 }
        };

        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <GridTable {...props1} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getAllByTitle('duplicate row')).not.toBeNull();
        const duplicateRow = screen.getAllByTitle('duplicate row')[0];
        fireEvent.click(duplicateRow);
    });

    test('Should render layouts GridTable Component 10', () => {
        const params1 = {
            ...props.params,
            gridOptions: {
                ...props.params.gridOptions,
                enableDuplicateRow: true,
                duplicateRowOrder: 'bottom',
                suppressFlash: false
            }
        };

        const props1 = {
            ...props,
            params: { ...params1 }
        };

        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <GridTable {...props1} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getAllByTitle('duplicate row')).not.toBeNull();
        const duplicateRow = screen.getAllByTitle('duplicate row')[0];
        fireEvent.click(duplicateRow);
    });

    test('Should render pop-up modal', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <GridTable {...popup_props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(
            screen.getByText(
                'ACTIVIA ARO BIEN ETRE BIFIDUS YAOURT ARO FRAMBOISE / VANILLE POT PLASTIQUE STD 16 CT 2000 GR- 3033491650178'
            )
        ).toBeInTheDocument();
        const cellLink = screen.getByText(
            'ACTIVIA ARO BIEN ETRE BIFIDUS YAOURT ARO FRAMBOISE / VANILLE POT PLASTIQUE STD 16 CT 2000 GR- 3033491650178'
        );
        fireEvent.click(cellLink);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });
});

const props = {
    params: {
        coldef: [
            {
                headerName: 'Resource',
                field: 'Resource',
                value: '',
                cellEditor: 'select',
                validator: 'resource_selection',
                asterisk: true,
                sortable: true,
                cellEditorParams: {
                    variant: 'outlined',
                    options: [
                        '4F Line - L2437',
                        '615',
                        '616',
                        '617',
                        'AS16 Line - L2103',
                        'AS26 TD Line - L2445',
                        'AS26 VII Line - L2464',
                        'DDCPP Trasfer Line - L2438',
                        'Dome 121',
                        'Dome 2215',
                        'Dome 89',
                        'Factor Line - L777',
                        'Flexibles - AS16',
                        'Flexibles - AS26 VII',
                        'Flexibles - Cryo KIT A',
                        'Flexibles - Cryo KIT Colorati 1',
                        'Flexibles - Factor IX/FEIBA',
                        'Flexibles - Kit 4F',
                        'Flexibles - Kit Colonna',
                        'Flexibles - Kit DDCPP',
                        'Flexibles - Kit Eluato',
                        'Flexibles - Kit Lavaggio',
                        'Flexibles - Kit Manifold',
                        'Flexibles - Kit Ripr',
                        'Flexibles - Kit UF/DF',
                        'Flexibles - Mass Capture 1/2',
                        'Flexibles - Mass Capture 3/4',
                        'Gauthier Filter',
                        'I/N 1554',
                        'I/N 1619',
                        'I/N 2224',
                        'I/N 2315',
                        'I/N 2316',
                        'I/N 2667',
                        'I/N 2668',
                        'I/N 97',
                        'Long Transfer Line - L717L',
                        'P1',
                        'P2',
                        'P3',
                        'P4',
                        'P5 - Cutting&Loading',
                        'P6 - Cutting&Loading',
                        'SA',
                        'SB',
                        'SC',
                        'SD',
                        'Short Line - L717S',
                        'T50',
                        'T51',
                        'T52',
                        'T54',
                        'T55',
                        'T58',
                        'T58 Trasnfer Line - L2439',
                        'T59',
                        'T60',
                        'T61',
                        'T62',
                        'T63',
                        'T64',
                        'T65',
                        'T78',
                        'T79',
                        'T80',
                        'T81',
                        'T82'
                    ],
                    fullWidth: true
                },
                editable: true,
                cellParamsField: 'resource_params'
            },
            {
                headerName: 'Start Usage Time',
                field: 'Usage_Start',
                value: '2022-01-04T16:01:54.901084',
                width: 210,
                cellEditor: 'dateTime',
                editable: true,
                cellEditorParams: {
                    suppressUTC: true,
                    variant: 'outlined',
                    fullWidth: true,
                    value: null,
                    inputprops: {
                        variant: 'dialog',
                        ampm: false,
                        format: 'DD/MM/YY HH:mm'
                    }
                }
            },
            {
                headerName: 'ProgressBar',
                field: 'ProgressBar',
                value: { currentProgress: 80, jobs: { task1: 40, task2: 40 } },
                width: 210,
                cellRenderer: 'progressloader',
                cellRendererParams: {
                    type: 'stepper',
                    id_field: 'Resource'
                }
            },
            {
                headerName: 'LinearProgressBar',
                field: 'LinearProgressBar',
                value: { currentProgress: 80, jobs: { task1: 40, task2: 40 } },
                width: 210,
                cellRenderer: 'progressloader',
                cellRendererParams: {
                    type: 'linear',
                    id_field: 'Resource'
                }
            },
            {
                headerName: 'End Usage Time',
                field: 'Usage_End',
                value: '2022-01-04T16:02:54.901102',
                validator: 'eut_selection',
                width: 210,
                cellEditor: 'dateTime',
                editable: true,
                sortable: true,
                cellEditorParams: {
                    suppressUTC: true,
                    variant: 'outlined',
                    fullWidth: true,
                    value: null,
                    inputprops: {
                        variant: 'dialog',
                        ampm: false,
                        format: 'DD/MM/YY HH:mm'
                    }
                }
            },
            {
                headerName: 'End DHT Time',
                field: 'End DHT Time',
                value: '',
                sortable: true,
                cellRenderer: 'date',
                cellRendererParams: {
                    format: 'DD/MM/YY HH:mm'
                }
            },
            {
                headerName: 'CIP',
                field: 'Group',
                value: '',
                asterisk: true,
                cellEditor: 'select',
                validator: 'cip_selection',
                cellEditorParams: {
                    variant: 'outlined',
                    options: ['MC1', 'MC2', 'MC3', 'MC4'],
                    fullWidth: true
                },
                cellParamsField: 'cip_params',
                editable: true
            },
            {
                headerName: 'Cleaning Start Time',
                field: 'Clean_Start_Time',
                validator: 'cst_selection',
                value: null,
                asterisk: true,
                width: 210,
                cellEditor: 'dateTime',
                editable: true,
                sortable: true,
                cellEditorParams: {
                    suppressUTC: true,
                    variant: 'outlined',
                    fullWidth: true,
                    value: null,
                    inputprops: {
                        variant: 'dialog',
                        ampm: false,
                        format: 'DD/MM/YY HH:mm'
                    }
                },
                cellParamsField: 'clean_start_params'
            },
            {
                headerName: 'Cleaning End Time',
                field: 'Clean_End_Time',
                value: null,
                width: 210,
                cellEditor: 'dateTime',
                editable: true,
                cellEditorParams: {
                    suppressUTC: true,
                    fullWidth: true,
                    variant: 'outlined',
                    value: null,
                    inputprops: {
                        ampm: false,
                        format: 'DD/MM/YY HH:mm'
                    }
                }
            },
            {
                headerName: 'End CHT Time',
                field: 'End CHT Time',
                value: '',
                cellRenderer: 'date',
                cellRendererParams: {
                    format: 'DD/MM/YY HH:mm'
                }
            },
            {
                headerName: 'Next Usage Time',
                field: 'Next Usage',
                value: '',
                width: 210,
                cellEditor: 'dateTime',
                editable: true,
                cellEditorParams: {
                    suppressUTC: true,
                    variant: 'outlined',
                    fullWidth: true,
                    value: null,
                    inputprops: {
                        variant: 'dialog',
                        ampm: false,
                        format: 'DD/MM/YY HH:mm'
                    }
                }
            },
            {
                headerName: 'Constraint',
                field: 'Constraint',
                value: '',
                cellEditor: 'select',
                draggableCell: true,
                cellEditorParams: {
                    variant: 'outlined',
                    options: [
                        'A',
                        'B',
                        'C',
                        'D',
                        'E',
                        'F',
                        'H',
                        'I',
                        'L',
                        'M',
                        'N',
                        'O',
                        'P',
                        'Q',
                        'R',
                        'S',
                        'T',
                        'U',
                        'V',
                        'X',
                        'Y'
                    ],
                    fullWidth: true
                },
                cellParamsField: 'constParams',
                editable: true
            },
            {
                headerName: 'Remarks',
                field: 'Remarks',
                value: '',
                width: 170
            },
            {
                headerName: 'Recleaning',
                field: 'Recleaning',
                cellEditor: 'checkbox',
                cellEditorParams: {
                    singleSelect: true
                },
                editable: true
            }
        ],
        gridOptions: {
            tableSize: 'small',
            editorMode: true,
            tableMaxHeight: '55vh',
            quickSearch: true,
            outerActions: [
                null,
                {
                    text: 'Reset',
                    name: 'reset_action',
                    variant: 'outlined'
                },
                {
                    text: 'Save as Draft',
                    name: 'save_as_draft',
                    variant: 'outlined'
                },
                {
                    name: 'Submit',
                    variant: 'contained'
                }
            ],
            rowParamsField: 'rowParams',
            editedRowDefaultValue: {
                edited: true
            },
            enableAddRow: true,
            enableInRowDelete: true,
            enableInRowDuplicate: true,
            enableRearrange: true,
            multiSelectRows: false,
            enablePagination: true,
            singleSelectRows: true,
            newRowDefaultValue: {
                Resource: null,
                Remarks: '',
                Constraint: '',
                'End CHT Time': '',
                'Next Usage': '',
                Clean_End_Time: '',
                'End DHT Time': '',
                Usage_Start: '2022-01-04T16:01:54.901122',
                Usage_End: '2022-01-04T16:02:54.901126',
                Clean_Start_Time: null,
                Group: null,
                cip_params: {},
                clean_start_params: {},
                Recleaning: false,
                resource_params: {}
            }
        },
        rowData: [
            {
                'CHT Violation Dur': null,
                Clean_End_Time: '2022-01-04T13:25:00',
                Clean_Start: 1641282407000,
                Clean_Start_Time: '2022-01-04T12:07:00',
                'Cleaning Duration': 1.3,
                Const_overlap_viol: 0,
                Constraint: 'E',
                'DHT Violation Dur': -11.7833333333,
                'End CHT Time': '2022-01-05T09:25:00',
                'End DHT Time': '2022-01-04T13:36:47',
                Group: 'MC1',
                'Last Clean End': null,
                Last_pos_preclean: 1641277067000,
                MC_Clean_violation: 0,
                'Max CHT': 20,
                'Max CHT Time': 1641374700000,
                'Max DHT': 6,
                'Next Clean Start': null,
                'Next Usage': 'NaT',
                'Next Util Overlap Dur': null,
                'Parallel Clean Flag': null,
                Recleaning: false,
                Remarks: null,
                Resource: '615',
                Shift: '3,1',
                'Start Cleaning_CHT': null,
                Unutilized_gap: null,
                Usage_End: '2022-01-04T07:36:47',
                Usage_Start: '2022-01-04T07:35:47',
                Utilized: 0.0166666667,
                cip_params: {},
                clean_en_ov_dur: 349.2166666667,
                clean_st_ov_dur: -270.2166666667,
                const_av_time: null,
                const_params: '{}',
                edited: null,
                f_CHT_Violation: 0,
                f_DHT_Violation: 0,
                f_Incorrect_Mapping: 0,
                f_Reclean: 0,
                f_Reclean_next_rec: 0,
                f_cl_en_ov: 0,
                f_cl_st_ov: 0,
                f_const_overlap: 0,
                f_mc_overlap: 0,
                f_next_usage_violation: 0,
                idle_time: null,
                mc_av_time: null,
                poss_recl_end: 'NaT',
                poss_recl_st: 'NaT',
                rowParams: '{}',
                clean_start_params: null,
                constParams: null,
                resource_params: null
            },
            {
                'CHT Violation Dur': null,
                Clean_End_Time: '2022-01-04T14:54:00',
                Clean_Start: 1641295046000,
                Clean_Start_Time: '2022-01-04T13:36:00',
                'Cleaning Duration': 1.3,
                Const_overlap_viol: 0,
                Constraint: 'F',
                'DHT Violation Dur': 106.5666666667,
                'End CHT Time': '2022-01-04T22:54:00',
                'End DHT Time': '2022-01-04T15:07:26',
                Group: 'MC2',
                'Last Clean End': null,
                Last_pos_preclean: 1641289706000,
                MC_Clean_violation: 0,
                'Max CHT': 8,
                'Max CHT Time': 1641344040000,
                'Max DHT': 4,
                'Next Clean Start': null,
                'Next Usage': 'NaT',
                'Next Util Overlap Dur': null,
                'Parallel Clean Flag': null,
                Recleaning: false,
                Remarks: null,
                Resource: 'Dome 121',
                Shift: '1',
                'Start Cleaning_CHT': null,
                Unutilized_gap: null,
                Usage_End: '2022-01-04T11:07:26',
                Usage_Start: '2022-01-04T11:06:26',
                Utilized: 0.0166666667,
                cip_params: {},
                clean_en_ov_dur: 347.5666666667,
                clean_st_ov_dur: -268.5666666667,
                const_av_time: null,
                const_params: '{}',
                edited: true,
                f_CHT_Violation: 0,
                f_DHT_Violation: 1,
                f_Incorrect_Mapping: 0,
                f_Reclean: 0,
                f_Reclean_next_rec: 0,
                f_cl_en_ov: 0,
                f_cl_st_ov: 0,
                f_const_overlap: 0,
                f_mc_overlap: 0,
                f_next_usage_violation: 0,
                idle_time: null,
                mc_av_time: null,
                poss_recl_end: 'NaT',
                poss_recl_st: 'NaT',
                rowParams: "{'error': True}",
                clean_start_params: null,
                constParams: null,
                resource_params: null
            },
            {
                'CHT Violation Dur': null,
                Clean_End_Time: '2022-01-04T15:45:00',
                Clean_Start: 1641295046000,
                Clean_Start_Time: '2022-01-04T14:00:00',
                'Cleaning Duration': 1.75,
                Const_overlap_viol: 0,
                Constraint: 'D',
                'DHT Violation Dur': -22.4333333333,
                'End CHT Time': '2022-01-05T19:45:00',
                'End DHT Time': '2022-01-04T16:07:26',
                Group: 'MC3',
                'Last Clean End': null,
                Last_pos_preclean: 1641288086000,
                MC_Clean_violation: 0,
                'Max CHT': 28,
                'Max CHT Time': 1641411900000,
                'Max DHT': 5,
                'Next Clean Start': null,
                'Next Usage': 'NaT',
                'Next Util Overlap Dur': null,
                'Parallel Clean Flag': null,
                Recleaning: false,
                Remarks: null,
                Resource: 'Factor Line - L777',
                Shift: '1',
                'Start Cleaning_CHT': null,
                Unutilized_gap: null,
                Usage_End: '2022-01-04T11:07:26',
                Usage_Start: '2022-01-04T11:06:26',
                Utilized: 0.0166666667,
                cip_params: {},
                clean_en_ov_dur: 278.5666666667,
                clean_st_ov_dur: -172.5666666667,
                const_av_time: null,
                const_params: '{}',
                edited: null,
                f_CHT_Violation: 0,
                f_DHT_Violation: 0,
                f_Incorrect_Mapping: 0,
                f_Reclean: 0,
                f_Reclean_next_rec: 0,
                f_cl_en_ov: 0,
                f_cl_st_ov: 0,
                f_const_overlap: 0,
                f_mc_overlap: 0,
                f_next_usage_violation: 0,
                idle_time: null,
                mc_av_time: null,
                poss_recl_end: 'NaT',
                poss_recl_st: 'NaT',
                rowParams: '{}',
                clean_start_params: null,
                constParams: null,
                resource_params: null
            },
            {
                'CHT Violation Dur': null,
                Clean_End_Time: '2022-01-04T18:20:00',
                Clean_Start: null,
                Clean_Start_Time: '2022-01-04T17:02:00',
                'Cleaning Duration': null,
                Const_overlap_viol: null,
                Constraint: 'F',
                'DHT Violation Dur': null,
                'End CHT Time': '2022-01-06T18:20:00',
                'End DHT Time': '2022-01-05T00:31:59',
                Group: 'MC2',
                'Last Clean End': null,
                Last_pos_preclean: null,
                MC_Clean_violation: null,
                'Max CHT': null,
                'Max CHT Time': null,
                'Max DHT': null,
                'Next Clean Start': null,
                'Next Usage': null,
                'Next Util Overlap Dur': null,
                'Parallel Clean Flag': null,
                Recleaning: false,
                Remarks: null,
                Resource: 'Flexibles - Kit Colonna',
                Shift: null,
                'Start Cleaning_CHT': null,
                Unutilized_gap: null,
                Usage_End: '2022-01-04T12:31:59',
                Usage_Start: '2022-01-04T12:30:59',
                Utilized: null,
                cip_params: {
                    coldefOverride: {
                        cellEditorParams: {
                            options: ['MC1', 'MC2', 'MC3', 'MC4', 'MC5', 'MC6']
                        }
                    }
                },
                clean_en_ov_dur: null,
                clean_st_ov_dur: null,
                const_av_time: null,
                const_params: null,
                edited: true,
                f_CHT_Violation: null,
                f_DHT_Violation: null,
                f_Incorrect_Mapping: null,
                f_Reclean: null,
                f_Reclean_next_rec: null,
                f_cl_en_ov: null,
                f_cl_st_ov: null,
                f_const_overlap: null,
                f_mc_overlap: null,
                f_next_usage_violation: null,
                idle_time: null,
                mc_av_time: null,
                poss_recl_end: null,
                poss_recl_st: null,
                rowParams: null,
                clean_start_params: '{}',
                constParams: "{'coldefOverride': {'cellEditorParams': {'options': ['F']}}}",
                resource_params: '{}'
            }
        ]
    },
    onRowDataChange: () => {},
    onValueChange: () => {},
    onOuterAction: () => {},
    validateValueChange: () => {},
    onRowChange: () => {}
};

const popup_props = {
    params: {
        coldef: [
            {
                headerName: 'SKU',
                field: 'SKU_Link',
                editable: true,
                cellEditor: 'rowEditorPopup',
                validator: 'skuValidtor',
                textDecoration: 'underline',
                tooltip: 'click',
                cellEditorParams: {
                    form_config: {
                        fields: [
                            {
                                type: 'checkbox',
                                label: 'Hero SKU',
                                name: 'Hero_SKU',
                                grid: 3
                            },
                            {
                                type: 'datepicker',
                                label: 'Start Date',
                                name: 'Hero_Start_date',
                                grid: 4
                            },
                            {
                                type: 'datepicker',
                                label: 'End Date',
                                name: 'Hero_End_date',
                                grid: 4
                            },
                            {
                                type: 'checkbox',
                                label: 'Promo SKU',
                                name: 'Promo_SKU',
                                grid: 3
                            },
                            {
                                type: 'datepicker',
                                label: 'Start Date',
                                name: 'Promo_Start_date',
                                grid: 4
                            },
                            {
                                type: 'datepicker',
                                label: 'End Date',
                                name: 'Promo_End_date',
                                grid: 4
                            },
                            {
                                type: 'checkbox',
                                label: 'Mandatory Assortment',
                                name: 'Mandatory_Assortment',
                                grid: 3
                            },
                            {
                                type: 'datepicker',
                                label: 'Start Date',
                                name: 'Assortment_Start_date',
                                grid: 4
                            },
                            {
                                type: 'datepicker',
                                label: 'End Date',
                                name: 'Assortment_End_date',
                                grid: 4
                            },
                            {
                                type: 'checkbox',
                                label: 'Strategic Segments',
                                name: 'Strategic_Segments',
                                grid: 3
                            },
                            {
                                type: 'datepicker',
                                label: 'Start Date',
                                name: 'Strategic_Start_date',
                                grid: 4
                            },
                            {
                                type: 'datepicker',
                                label: 'End Date',
                                name: 'Strategic_End_date',
                                grid: 4
                            },
                            {
                                type: 'checkbox',
                                label: 'Priority Channels',
                                name: 'Priority_Channels',
                                grid: 3
                            },
                            {
                                type: 'datepicker',
                                label: 'Start Date',
                                name: 'Priority_Start_date',
                                grid: 4
                            },
                            {
                                type: 'datepicker',
                                label: 'End Date',
                                name: 'Priority_End_date',
                                grid: 4
                            },
                            {
                                type: 'select',
                                label: 'Inno/Reno/Core SKUs',
                                name: 'SKU_Type',
                                options: [
                                    {
                                        value: '',
                                        label: 'None'
                                    },
                                    {
                                        value: 'inno',
                                        label: 'Inno'
                                    },
                                    {
                                        value: 'reno',
                                        label: 'Reno'
                                    },
                                    {
                                        value: 'core',
                                        label: 'Core'
                                    }
                                ],
                                fullWidth: true,
                                grid: 3,
                                optionValueKey: 'value',
                                optionLabelKey: 'label'
                            },
                            {
                                type: 'datepicker',
                                label: 'Start Date',
                                name: 'SKU_Type_Start_date',
                                grid: 4
                            },
                            {
                                type: 'datepicker',
                                label: 'End Date',
                                name: 'SKU_Type_End_date',
                                grid: 4
                            },
                            {
                                type: 'select',
                                label: 'Inno Archetype',
                                name: 'Inno_Archetype',
                                options: [
                                    {
                                        value: '',
                                        label: 'None'
                                    },
                                    {
                                        value: 'game_changing',
                                        label: 'Game Changing'
                                    },
                                    {
                                        value: 'game_evolving',
                                        label: 'Game Evolving'
                                    },
                                    {
                                        value: 'game_playing',
                                        label: 'Game Playing'
                                    }
                                ],
                                fullWidth: true,
                                grid: 3,
                                optionValueKey: 'value',
                                optionLabelKey: 'label'
                            },
                            {
                                type: 'datepicker',
                                label: 'Start Date',
                                name: 'Archetype_Start_date',
                                grid: 4
                            },
                            {
                                type: 'datepicker',
                                label: 'End Date',
                                name: 'Archetype_End_date',
                                grid: 4
                            },
                            {
                                type: 'text',
                                label: 'WD Targets by brands',
                                name: 'WD_targets',
                                fullWidth: true,
                                placeholder: 'Enter text',
                                grid: 3
                            },
                            {
                                type: 'datepicker',
                                label: 'Start Date',
                                name: 'WD_Targets_Start_date',
                                grid: 4
                            },
                            {
                                type: 'datepicker',
                                label: 'End Date',
                                name: 'WD_Targets_End_date',
                                grid: 4
                            }
                        ]
                    },
                    trigger_button: {
                        variant: 'text',
                        class_name: 'classes.linkBtn'
                    },
                    dialog_actions: [
                        {
                            name: 'Submit',
                            variant: 'contained'
                        },
                        {
                            name: 'Cancel',
                            variant: 'outlined',
                            is_cancel: true
                        }
                    ]
                }
            },
            {
                headerName: 'Hero SKU Y/N',
                field: 'is_hero_sku',
                cellParamsField: 'hero_sku_params'
            },
            {
                headerName: 'Promo SKU Y/N',
                field: 'is_promo_sku'
            },
            {
                headerName: 'Mandatory Assortment Y/N',
                field: 'is_mandatory_assortment'
            },
            {
                headerName: 'Strategic Segments Y/N',
                field: 'is_strategic_segment'
            },
            {
                headerName: 'Priority Channels Y/N',
                field: 'is_priority_channels'
            },
            {
                headerName: 'Inno Archetype',
                field: 'selected_inno_archetype'
            },
            {
                headerName: 'Inno/Reno/Core SKUs',
                field: 'selected_SKU_Type'
            },
            {
                headerName: 'WD Targets',
                field: 'WD_targets'
            }
        ],
        gridOptions: {
            tableSize: 'small',
            editorMode: true
        },
        rowData: [
            {
                SKU_Link:
                    'ACTIVIA ARO BIEN ETRE BIFIDUS YAOURT ARO FRAMBOISE / VANILLE POT PLASTIQUE STD 16 CT 2000 GR- 3033491650178',
                Hero_SKU: true,
                is_hero_sku: 'Yes',
                Hero_Start_date: '2022-06-22T18:30:00.000Z',
                Hero_End_date: '2022-08-23T18:30:00.000Z',
                Promo_SKU: true,
                is_promo_sku: 'Yes',
                Promo_Start_date: '2022-06-24T18:30:00.000Z',
                Promo_End_date: '2022-08-24T18:30:00.000Z',
                Mandatory_Assortment: true,
                is_mandatory_assortment: 'Yes',
                Assortment_Start_date: '2022-06-25T18:30:00.000Z',
                Assortment_End_date: '2022-09-25T18:30:00.000Z',
                Strategic_Segments: true,
                is_strategic_segment: 'Yes',
                Strategic_Start_date: '2022-06-26T18:30:00.000Z',
                Strategic_End_date: '2022-07-26T18:30:00.000Z',
                Priority_Channels: true,
                is_priority_channels: 'Yes',
                Priority_Start_date: '2022-06-27T18:30:00.000Z',
                Priority_End_date: '2022-08-27T18:30:00.000Z',
                SKU_Type: '',
                selected_SKU_Type: '-',
                SKU_Type_Start_date: '',
                SKU_Type_End_date: '',
                Inno_Archetype: '',
                selected_inno_archetype: '-',
                Archetype_Start_date: '',
                Archetype_End_date: '',
                WD_targets: '',
                WD_Targets_Start_date: '',
                WD_Targets_End_date: '',
                Due_days: '0',
                hero_sku_params: {
                    color: '#6DF0C2'
                }
            },
            {
                SKU_Link:
                    'ACTIVIA FRUITS  MIXES BIEN ETRE BIFIDUS YAOURT FRUITS ASSORTIS POT PLASTIQUE STD 16 CT 2000 GR- 3033498212185',
                Hero_SKU: true,
                is_hero_sku: 'Yes',
                Hero_Start_date: '2022-06-03T18:30:00.000Z',
                Hero_End_date: '2022-07-06T18:30:00.000Z',
                Promo_SKU: true,
                is_promo_sku: 'Yes',
                Promo_Start_date: '2022-06-04T18:30:00.000Z',
                Promo_End_date: '2022-08-07T18:30:00.000Z',
                Mandatory_Assortment: true,
                is_mandatory_assortment: 'Yes',
                Assortment_Start_date: '2022-06-05T18:30:00.000Z',
                Assortment_End_date: '2022-08-08T18:30:00.000Z',
                Strategic_Segments: true,
                is_strategic_segment: 'Yes',
                Strategic_Start_date: '2022-06-06T18:30:00.000Z',
                Strategic_End_date: '2022-08-09T18:30:00.000Z',
                Priority_Channels: true,
                is_priority_channels: 'Yes',
                Priority_Start_date: '2022-06-07T18:30:00.000Z',
                Priority_End_date: '2022-08-10T18:30:00.000Z',
                SKU_Type: 'inno',
                selected_SKU_Type: 'Inno',
                SKU_Type_Start_date: '2022-06-08T18:30:00.000Z',
                SKU_Type_End_date: '2022-08-11T18:30:00.000Z',
                Inno_Archetype: '',
                selected_inno_archetype: '-',
                Archetype_Start_date: '',
                Archetype_End_date: '',
                WD_targets: '',
                WD_Targets_Start_date: '',
                WD_Targets_End_date: '',
                Due_days: '3',
                hero_sku_params: {
                    color: '#6DF0C2'
                }
            },
            {
                SKU_Link:
                    'ACTIVIA FRUITS ETRE BIFIDUS YAOURT FRUITS ASSORTIS POT PLASTIQUE STD 16 CT 2000 GR- 3033491812705',
                Hero_SKU: true,
                is_hero_sku: 'Yes',
                Hero_Start_date: '2022-06-03T18:30:00.000Z',
                Hero_End_date: '2022-07-09T18:30:00.000Z',
                Promo_SKU: true,
                is_promo_sku: 'Yes',
                Promo_Start_date: '2022-06-04T18:30:00.000Z',
                Promo_End_date: '2022-07-10T18:30:00.000Z',
                Mandatory_Assortment: true,
                is_mandatory_assortment: 'Yes',
                Assortment_Start_date: '2022-06-05T18:30:00.000Z',
                Assortment_End_date: '2022-08-11T18:30:00.000Z',
                Strategic_Segments: true,
                is_strategic_segment: 'Yes',
                Strategic_Start_date: '2022-06-06T18:30:00.000Z',
                Strategic_End_date: '2022-08-12T18:30:00.000Z',
                Priority_Channels: true,
                is_priority_channels: 'Yes',
                Priority_Start_date: '2022-06-07T18:30:00.000Z',
                Priority_End_date: '2022-08-13T18:30:00.000Z',
                SKU_Type: '',
                selected_SKU_Type: '-',
                SKU_Type_Start_date: '',
                SKU_Type_End_date: '',
                Inno_Archetype: 'game_changing',
                selected_inno_archetype: 'Game Changing',
                Archetype_Start_date: '2022/06/08',
                Archetype_End_date: '2022/08/14',
                WD_targets: '',
                WD_Targets_Start_date: '',
                WD_Targets_End_date: '',
                Due_days: '4',
                hero_sku_params: {
                    color: '#6DF0C2'
                }
            },
            {
                SKU_Link:
                    'ACTIVIA FRUITS ETRE BIFIDUS YAOURT FRUITS ASSORTIS POT PLASTIQUE STD 16 CT 2000 GR- 3033491812705',
                Hero_SKU: true,
                is_hero_sku: 'Yes',
                Hero_Start_date: '2022-06-03T18:30:00.000Z',
                Hero_End_date: '2022-07-05T18:30:00.000Z',
                Promo_SKU: true,
                is_promo_sku: 'Yes',
                Promo_Start_date: '2022-06-04T18:30:00.000Z',
                Promo_End_date: '2022-08-06T18:30:00.000Z',
                Mandatory_Assortment: true,
                is_mandatory_assortment: 'Yes',
                Assortment_Start_date: '2022-06-05T18:30:00.000Z',
                Assortment_End_date: '2022-08-08T18:30:00.000Z',
                Strategic_Segments: true,
                is_strategic_segment: 'Yes',
                Strategic_Start_date: '2022-06-06T18:30:00.000Z',
                Strategic_End_date: '2022-08-09T18:30:00.000Z',
                Priority_Channels: true,
                is_priority_channels: 'Yes',
                Priority_Start_date: '2022-06-07T18:30:00.000Z',
                Priority_End_date: '2022-08-10T18:30:00.000Z',
                SKU_Type: '',
                selected_SKU_Type: '-',
                SKU_Type_Start_date: '',
                SKU_Type_End_date: '',
                Inno_Archetype: '',
                selected_inno_archetype: '-',
                Archetype_Start_date: '',
                Archetype_End_date: '',
                WD_targets: 'Test WD targets',
                WD_Targets_Start_date: '2022/06/08',
                WD_Targets_End_date: '2022/08/11',
                Due_days: '2',
                hero_sku_params: {
                    color: '#6DF0C2'
                }
            },
            {
                SKU_Link:
                    'ACTIVIA FRUITS ETRE BIFIDUS YAOURT FRUITS ASSORTIS POT PLASTIQUE STD 16 CT 2000 GR- 3033491812705',
                Hero_SKU: false,
                is_hero_sku: 'No',
                Hero_Start_date: '',
                Hero_End_date: '',
                Promo_SKU: true,
                is_promo_sku: 'Yes',
                Promo_Start_date: '2022/06/04',
                Promo_End_date: '2022/08/07',
                Mandatory_Assortment: true,
                is_mandatory_assortment: 'Yes',
                Assortment_Start_date: '2022/06/05',
                Assortment_End_date: '2022/08/08',
                Strategic_Segments: false,
                is_strategic_segment: 'No',
                Strategic_Start_date: '',
                Strategic_End_date: '',
                Priority_Channels: false,
                is_priority_channels: 'No',
                Priority_Start_date: '',
                Priority_End_date: '',
                SKU_Type: '',
                selected_SKU_Type: '-',
                SKU_Type_Start_date: '',
                SKU_Type_End_date: '',
                Inno_Archetype: '',
                selected_inno_archetype: '-',
                Archetype_Start_date: '',
                Archetype_End_date: '',
                WD_targets: '',
                WD_Targets_Start_date: '',
                WD_Targets_End_date: '',
                Due_days: '',
                hero_sku_params: {
                    color: '#FE6A9C'
                }
            }
        ]
    },
    onRowDataChange: () => {},
    onValueChange: () => {},
    onOuterAction: () => {},
    validateValueChange: () => {},
    onRowChange: () => {}
};
