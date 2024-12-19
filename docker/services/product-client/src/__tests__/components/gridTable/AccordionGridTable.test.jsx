import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import AccordionGridTable from '../../../components/gridTable/AccordionGridTable';
import { act } from 'react-dom/test-utils';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    // checking for buttons
    test('Should render layouts AccordionTableSimulator Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AccordionGridTable
                        params={params}
                        onFetchTableData={() => {}}
                        onAction={() => {}}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: params.actions[1].name })).toBeInTheDocument();
    });

    //checking for Save Scenario popup
    test('Should render layouts AccordionTableSimulator Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AccordionGridTable
                        params={params}
                        onFetchTableData={() => {}}
                        onAction={() => {}}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        const saveBtn = screen.getByRole('button', { name: params.actions[1].name });
        fireEvent.click(saveBtn);
        expect(screen.getByText('Save Scenario')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    });

    // checks for high level section accordion content
    test('Should render layouts AccordionTableSimulator Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AccordionGridTable
                        params={params}
                        onFetchTableData={() => {}}
                        onAction={() => {}}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        for (const section of params.sections) {
            expect(screen.getByText(section.name)).toBeInTheDocument();
        }
    });
});

const params = {
    isAccordionGridTable: true,
    sections: [
        {
            name: 'Beans',
            lazyLoadTableData: 'load-table-primary-input',
            tableData: null,
            tableConfig: {
                coldef: [
                    {
                        headerName: '',
                        editable: false,
                        enableCellInsights: false,
                        field: 'Metric',
                        headerColor: 'Black',
                        cellParamsField: 'MetricParams',
                        width: '200px',
                        bgColor: 'yellow'
                    },
                    {
                        headerName: '',
                        editable: true,
                        enableCellInsights: false,
                        field: '2022 Week 39',
                        headerColor: 'Black',
                        cellParamsField: '2022 Week 39Params',
                        cellEditor: 'number',
                        cellEditorParams: {
                            fullWidth: true,
                            variant: 'outlined'
                        }
                    },
                    {
                        headerName: '',
                        editable: true,
                        enableCellInsights: false,
                        field: '2022 Week 40',
                        headerColor: 'Black',
                        cellParamsField: '2022 Week 40Params',
                        cellEditor: 'number',
                        cellEditorParams: {
                            fullWidth: true,
                            variant: 'outlined'
                        }
                    },
                    {
                        headerName: '',
                        editable: true,
                        enableCellInsights: false,
                        field: '2022 Week 41',
                        headerColor: 'Black',
                        cellParamsField: '2022 Week 41Params',
                        cellEditor: 'number',
                        cellEditorParams: {
                            fullWidth: true,
                            variant: 'outlined'
                        }
                    },
                    {
                        headerName: '',
                        editable: true,
                        enableCellInsights: false,
                        field: '2022 Week 42',
                        headerColor: 'Black',
                        cellParamsField: '2022 Week 42Params',
                        cellEditor: 'number',
                        cellEditorParams: {
                            fullWidth: true,
                            variant: 'outlined'
                        }
                    },
                    {
                        headerName: '',
                        editable: true,
                        enableCellInsights: false,
                        field: '2022 Week 43',
                        headerColor: 'Black',
                        cellParamsField: '2022 Week 43Params',
                        cellEditor: 'number',
                        cellEditorParams: {
                            fullWidth: true,
                            variant: 'outlined'
                        }
                    },
                    {
                        headerName: '',
                        editable: true,
                        enableCellInsights: false,
                        field: '2022 Week 44',
                        headerColor: 'Black',
                        cellParamsField: '2022 Week 44Params',
                        cellEditor: 'number',
                        cellEditorParams: {
                            fullWidth: true,
                            variant: 'outlined'
                        }
                    },
                    {
                        headerName: '',
                        editable: true,
                        enableCellInsights: false,
                        field: '2022 Week 45',
                        headerColor: 'Black',
                        cellParamsField: '2022 Week 45Params',
                        cellEditor: 'number',
                        cellEditorParams: {
                            fullWidth: true,
                            variant: 'outlined'
                        }
                    },
                    {
                        headerName: '',
                        editable: true,
                        enableCellInsights: false,
                        field: '2022 Week 46',
                        headerColor: 'Black',
                        cellParamsField: '2022 Week 46Params',
                        cellEditor: 'number',
                        cellEditorParams: {
                            fullWidth: true,
                            variant: 'outlined'
                        }
                    },
                    {
                        headerName: '',
                        editable: true,
                        enableCellInsights: false,
                        field: '2022 Week 47',
                        headerColor: 'Black',
                        cellParamsField: '2022 Week 47Params',
                        cellEditor: 'number',
                        cellEditorParams: {
                            fullWidth: true,
                            variant: 'outlined'
                        }
                    },
                    {
                        headerName: '',
                        editable: true,
                        enableCellInsights: false,
                        field: '2022 Week 48',
                        headerColor: 'Black',
                        cellParamsField: '2022 Week 48Params',
                        cellEditor: 'number',
                        cellEditorParams: {
                            fullWidth: true,
                            variant: 'outlined'
                        }
                    },
                    {
                        headerName: '',
                        editable: true,
                        enableCellInsights: false,
                        field: '2022 Week 49',
                        headerColor: 'Black',
                        cellParamsField: '2022 Week 49Params',
                        cellEditor: 'number',
                        cellEditorParams: {
                            fullWidth: true,
                            variant: 'outlined'
                        }
                    },
                    {
                        headerName: '',
                        editable: true,
                        enableCellInsights: false,
                        field: '2022 Week 50',
                        headerColor: 'Black',
                        cellParamsField: '2022 Week 50Params',
                        cellEditor: 'number',
                        cellEditorParams: {
                            fullWidth: true,
                            variant: 'outlined'
                        }
                    },
                    {
                        headerName: '',
                        editable: true,
                        enableCellInsights: false,
                        field: '2022 Week 51',
                        headerColor: 'Black',
                        cellParamsField: '2022 Week 51Params',
                        cellEditor: 'number',
                        cellEditorParams: {
                            fullWidth: true,
                            variant: 'outlined'
                        }
                    },
                    {
                        headerName: '',
                        editable: true,
                        enableCellInsights: false,
                        field: '2022 Week 52',
                        headerColor: 'Black',
                        cellParamsField: '2022 Week 52Params',
                        cellEditor: 'number',
                        cellEditorParams: {
                            fullWidth: true,
                            variant: 'outlined'
                        }
                    }
                ],
                gridOptions: {
                    tableSize: 'small',
                    lazyRow: true,
                    tableMaxHeight: '30vh'
                }
            }
        },
        {
            component_key: 'gridtable',
            name: 'Beans 415 gm',
            lazyLoadTableData: 'load-table-primary-input',
            tableData: null,
            tableConfig: {
                coldef: [
                    {
                        headerName: 'Competitor',
                        editable: false,
                        enableCellInsights: false,
                        field: 'Competitor',
                        headerColor: 'Black',
                        cellParamsField: 'CompetitorParams'
                    },
                    {
                        headerName: 'HEINZ',
                        editable: false,
                        enableCellInsights: false,
                        field: 'HEINZ',
                        headerColor: 'Black',
                        cellParamsField: 'HEINZParams'
                    },
                    {
                        headerName: 'HP',
                        editable: false,
                        enableCellInsights: false,
                        field: 'HP',
                        headerColor: 'Black',
                        cellParamsField: 'HPParams'
                    }
                ],
                gridOptions: {
                    tableSize: 'small',
                    editorMode: true,
                    tableMaxHeight: '55vh',
                    quickSearch: false,
                    outerActions: [null],
                    rowParamsField: 'rowParams',
                    editedRowDefaultValue: {
                        edited: true
                    }
                }
            }
        }
    ],
    groupHeaders: [
        [
            {
                colSpan: 1,
                headerName: '',
                sticky: true
            },
            {
                colSpan: 5,
                headerName: '2022 October',
                align: 'center',
                headerBgColor: '#FF0000'
            },
            {
                colSpan: 4,
                headerName: '2022 November',
                align: 'center',
                headerBgColor: '#CF9FFF'
            },
            {
                colSpan: 5,
                headerName: '2022 December',
                align: 'center',
                headerBgColor: '#00FF00'
            }
        ]
    ],
    coldef: [
        {
            headerName: 'Metric',
            editable: false,
            enableCellInsights: false,
            field: 'Metric',
            headerColor: 'Black',
            cellParamsField: 'MetricParams',
            width: '200px'
        },
        {
            headerName: '2022 Week 39',
            editable: false,
            enableCellInsights: false,
            field: '2022 Week 39',
            headerColor: 'Black',
            cellParamsField: '2022 Week 39Params'
        },
        {
            headerName: '2022 Week 40',
            editable: false,
            enableCellInsights: false,
            field: '2022 Week 40',
            headerColor: 'Black',
            cellParamsField: '2022 Week 40Params'
        },
        {
            headerName: '2022 Week 41',
            editable: false,
            enableCellInsights: false,
            field: '2022 Week 41',
            headerColor: 'Black',
            cellParamsField: '2022 Week 41Params'
        },
        {
            headerName: '2022 Week 42',
            editable: false,
            enableCellInsights: false,
            field: '2022 Week 42',
            headerColor: 'Black',
            cellParamsField: '2022 Week 42Params'
        },
        {
            headerName: '2022 Week 43',
            editable: false,
            enableCellInsights: false,
            field: '2022 Week 43',
            headerColor: 'Black',
            cellParamsField: '2022 Week 43Params'
        },
        {
            headerName: '2022 Week 44',
            editable: false,
            enableCellInsights: false,
            field: '2022 Week 44',
            headerColor: 'Black',
            cellParamsField: '2022 Week 44Params'
        },
        {
            headerName: '2022 Week 45',
            editable: false,
            enableCellInsights: false,
            field: '2022 Week 45',
            headerColor: 'Black',
            cellParamsField: '2022 Week 45Params'
        },
        {
            headerName: '2022 Week 46',
            editable: false,
            enableCellInsights: false,
            field: '2022 Week 46',
            headerColor: 'Black',
            cellParamsField: '2022 Week 46Params'
        },
        {
            headerName: '2022 Week 47',
            editable: false,
            enableCellInsights: false,
            field: '2022 Week 47',
            headerColor: 'Black',
            cellParamsField: '2022 Week 47Params'
        },
        {
            headerName: '2022 Week 48',
            editable: false,
            enableCellInsights: false,
            field: '2022 Week 48',
            headerColor: 'Black',
            cellParamsField: '2022 Week 48Params'
        },
        {
            headerName: '2022 Week 49',
            editable: false,
            enableCellInsights: false,
            field: '2022 Week 49',
            headerColor: 'Black',
            cellParamsField: '2022 Week 49Params'
        },
        {
            headerName: '2022 Week 50',
            editable: false,
            enableCellInsights: false,
            field: '2022 Week 50',
            headerColor: 'Black',
            cellParamsField: '2022 Week 50Params'
        },
        {
            headerName: '2022 Week 51',
            editable: false,
            enableCellInsights: false,
            field: '2022 Week 51',
            headerColor: 'Black',
            cellParamsField: '2022 Week 51Params'
        },
        {
            headerName: '2022 Week 52',
            editable: false,
            enableCellInsights: false,
            field: '2022 Week 52',
            headerColor: 'Black',
            cellParamsField: '2022 Week 52Params'
        }
    ],
    tableOptions: {
        tableSize: 'small',
        editorMode: true,
        tableMaxHeight: '55vh',
        quickSearch: false,
        outerActions: [null],
        rowParamsField: 'rowParams',
        editedRowDefaultValue: {
            edited: true
        }
    },
    actions: [
        {
            name: 'Reset'
        },
        {
            name: 'Run & Save Scenario',
            customAction: 'saveScenarioName',
            variant: 'contained',
            scenarioName: 'sampleScenarioName'
        }
    ],
    extraParams: {
        maxHeight: '65vh'
    },
    simulated_value: false
};
