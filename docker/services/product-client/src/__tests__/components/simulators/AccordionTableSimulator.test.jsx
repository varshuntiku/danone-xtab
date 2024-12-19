import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import AccordionTableSimultor from '../../../components/simulators/AccordionTableSimulator';
import { act } from 'react-dom/test-utils';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    // checking for buttons
    test('Should render layouts AccordionTableSimulator Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AccordionTableSimultor
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
                    <AccordionTableSimultor
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
                    <AccordionTableSimultor
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

    // checks for nested accordion content
    test('Should render layouts AccordionTableSimulator Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AccordionTableSimultor
                        params={params1}
                        onFetchTableData={() => {}}
                        onAction={() => {}}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        for (const accordion of params1.sections[0].accordions) {
            expect(screen.getByText(accordion.name)).toBeInTheDocument();
        }
    });

    //check for nested accordion content dynamically
    test('Should render layouts AccordionTableSimulator Component', async () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AccordionTableSimultor
                        params={params}
                        onFetchTableData={() => {
                            return [{ month: 'Jan' }, { month: 'Feb' }];
                        }}
                        onAction={() => {}}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        const ExpandMoreIcon = screen.getByText('Macro Factor');
        expect(ExpandMoreIcon).toBeInTheDocument();

        act(() => {
            fireEvent.click(ExpandMoreIcon);
        });
        expect(screen.getByText('2022')).toBeInTheDocument();
        act(() => {
            fireEvent.click(screen.getByText('2022'));
        });
    });
});

const params = {
    isAccordionTableSimulator: true,
    sections: [
        {
            name: 'Primary Inputs',
            accordionHeaderName: 'Category/SubCategory/PPG',
            accordions: [
                {
                    name: 'Mayonies',
                    accordions: [
                        {
                            name: 'Mayonies 500ml PET',
                            id: 1,
                            lazyLoadTableData: 'load-table-primary-input',
                            tableData: null
                        },
                        {
                            name: 'HEINZ AFL Mayonies H2H',
                            id: 2,
                            lazyLoadTableData: 'load-table-primary-input',
                            tableData: null
                        }
                    ]
                },
                {
                    name: 'Ketchup',
                    accordions: [
                        {
                            name: 'KETCHUP 500ml PET',
                            id: 3,
                            lazyLoadTableData: 'load-table-primary-input',
                            tableData: null
                        },
                        {
                            name: 'HEINZ AFL KETCHUP H2H',
                            id: 4,
                            lazyLoadTableData: 'load-table-primary-input',
                            tableData: null
                        }
                    ]
                }
            ],
            tableConfig: {
                coldef: [
                    { headerName: 'Week', field: 'week' },
                    {
                        headerName: 'Tactic',
                        field: 'tactic',
                        cellEditor: 'select',
                        cellEditorParams: {
                            options: ['TPC', 'Multibuy', 'TMD'],
                            variant: 'outlined',
                            fullWidth: true
                        },
                        editable: true
                    },
                    {
                        headerName: 'Mechanic',
                        field: 'mechanic',
                        cellEditor: 'select',
                        cellEditorParams: {
                            options: ['0.45', '2.0', '1.5', '0.6'],
                            variant: 'outlined',
                            fullWidth: true
                        },
                        editable: true
                    },
                    {
                        headerName: 'Display',
                        field: 'display',
                        cellEditor: 'select',
                        cellEditorParams: {
                            options: ['Shelf', 'Gondola', 'Aisle'],
                            variant: 'outlined',
                            fullWidth: true
                        },
                        editable: true
                    },
                    {
                        headerName: 'TDP',
                        field: 'tdp',
                        cellEditor: 'number',
                        cellEditorParams: { variant: 'outlined', fullWidth: true },
                        editable: true
                    }
                ],
                gridOptions: {
                    editorMode: true,
                    tableSize: 'small',
                    lazyRow: true,
                    tableMaxHeight: '30vh'
                }
            }
        },
        {
            name: 'Competitor Canabils',
            accordionHeaderName: 'PPG/Cannibals',
            accordions: [
                {
                    name: 'Competitor Canabils 1',
                    id: 1,
                    lazyLoadTableData: 'load-table-copetitor-cananbils',
                    tableData: null
                },
                {
                    name: 'Competitor Canabils 2',
                    id: 2,
                    lazyLoadTableData: 'load-table-copetitor-cananbils',
                    tableData: null
                },
                {
                    name: 'Competitor Canabils 3',
                    id: 3,
                    lazyLoadTableData: 'load-table-copetitor-cananbils',
                    tableData: null
                }
            ],
            tableConfig: {
                coldef: [
                    { headerName: 'Week', field: 'week' },
                    {
                        headerName: 'Price/Kg',
                        field: 'price',
                        cellEditor: 'number',
                        cellEditorParams: { variant: 'outlined', fullWidth: false },
                        editable: true
                    }
                ],
                gridOptions: {
                    editorMode: true,
                    tableSize: 'small',
                    lazyRow: true,
                    tableMaxHeight: '30vh'
                }
            }
        },
        {
            name: 'Macro Factor',
            accordionHeaderName: 'Year',
            accordions: [
                {
                    name: '2022',
                    id: 1,
                    lazyLoadTableData: 'load-table-macro-factor',
                    tableData: null
                },
                {
                    name: '2023',
                    id: 2,
                    lazyLoadTableData: 'load-table-macro-factor',
                    tableData: null
                }
            ],
            tableConfig: {
                coldef: [
                    { headerName: 'Month', field: 'month' },
                    {
                        headerName: 'GDP',
                        field: 'gdp',
                        cellEditor: 'number',
                        cellEditorParams: { variant: 'outlined', fullWidth: false },
                        editable: true
                    },
                    {
                        headerName: 'Inflation',
                        field: 'inflation',
                        cellEditor: 'number',
                        cellEditorParams: { variant: 'outlined', fullWidth: false },
                        editable: true
                    }
                ],
                gridOptions: {
                    editorMode: true,
                    tableSize: 'small',
                    lazyRow: true,
                    tableMaxHeight: '30vh'
                }
            }
        }
    ],
    actions: [
        {
            name: 'Reset'
        },
        {
            name: 'Run & Save Scenario',
            customAction: 'saveScenarioName',
            variant: 'contained'
        }
    ],
    extraParams: {
        maxHeight: '65vh'
    }
};

const params1 = {
    isAccordionTableSimulator: true,
    sections: [
        {
            name: 'Primary Inputs',
            accordionHeaderName: 'Category/SubCategory/PPG',
            accordions: [
                {
                    name: 'Mayonies',
                    accordions: [
                        {
                            name: 'Mayonies 500ml PET',
                            id: 1,
                            lazyLoadTableData: 'load-table-primary-input',
                            tableData: null
                        },
                        {
                            name: 'HEINZ AFL Mayonies H2H',
                            id: 2,
                            lazyLoadTableData: 'load-table-primary-input',
                            tableData: null
                        }
                    ]
                },
                {
                    name: 'Ketchup',
                    accordions: [
                        {
                            name: 'KETCHUP 500ml PET',
                            id: 3,
                            lazyLoadTableData: 'load-table-primary-input',
                            tableData: null
                        },
                        {
                            name: 'HEINZ AFL KETCHUP H2H',
                            id: 4,
                            lazyLoadTableData: 'load-table-primary-input',
                            tableData: null
                        }
                    ]
                }
            ],
            tableConfig: {
                coldef: [
                    { headerName: 'Week', field: 'week' },
                    {
                        headerName: 'Tactic',
                        field: 'tactic',
                        cellEditor: 'select',
                        cellEditorParams: {
                            options: ['TPC', 'Multibuy', 'TMD'],
                            variant: 'outlined',
                            fullWidth: true
                        },
                        editable: true
                    },
                    {
                        headerName: 'Mechanic',
                        field: 'mechanic',
                        cellEditor: 'select',
                        cellEditorParams: {
                            options: ['0.45', '2.0', '1.5', '0.6'],
                            variant: 'outlined',
                            fullWidth: true
                        },
                        editable: true
                    },
                    {
                        headerName: 'Display',
                        field: 'display',
                        cellEditor: 'select',
                        cellEditorParams: {
                            options: ['Shelf', 'Gondola', 'Aisle'],
                            variant: 'outlined',
                            fullWidth: true
                        },
                        editable: true
                    },
                    {
                        headerName: 'TDP',
                        field: 'tdp',
                        cellEditor: 'number',
                        cellEditorParams: { variant: 'outlined', fullWidth: true },
                        editable: true
                    }
                ],
                gridOptions: {
                    editorMode: true,
                    tableSize: 'small',
                    lazyRow: true,
                    tableMaxHeight: '30vh'
                }
            }
        },
        {
            name: 'Competitor Canabils',
            accordionHeaderName: 'PPG/Cannibals',
            accordions: [
                {
                    name: 'Competitor Canabils 1',
                    id: 1,
                    lazyLoadTableData: 'load-table-copetitor-cananbils',
                    tableData: null
                },
                {
                    name: 'Competitor Canabils 2',
                    id: 2,
                    lazyLoadTableData: 'load-table-copetitor-cananbils',
                    tableData: null
                },
                {
                    name: 'Competitor Canabils 3',
                    id: 3,
                    lazyLoadTableData: 'load-table-copetitor-cananbils',
                    tableData: null
                }
            ],
            tableConfig: {
                coldef: [
                    { headerName: 'Week', field: 'week' },
                    {
                        headerName: 'Price/Kg',
                        field: 'price',
                        cellEditor: 'number',
                        cellEditorParams: { variant: 'outlined', fullWidth: false },
                        editable: true
                    }
                ],
                gridOptions: {
                    editorMode: true,
                    tableSize: 'small',
                    lazyRow: true,
                    tableMaxHeight: '30vh'
                }
            }
        },
        {
            name: 'Macro Factor',
            accordionHeaderName: 'Year',
            accordions: [
                {
                    name: '2022',
                    id: 1,
                    lazyLoadTableData: 'load-table-macro-factor',
                    tableData: null
                },
                {
                    name: '2023',
                    id: 2,
                    lazyLoadTableData: 'load-table-macro-factor',
                    tableData: null
                }
            ],
            tableConfig: {
                coldef: [
                    { headerName: 'Month', field: 'month' },
                    {
                        headerName: 'GDP',
                        field: 'gdp',
                        cellEditor: 'number',
                        cellEditorParams: { variant: 'outlined', fullWidth: false },
                        editable: true
                    },
                    {
                        headerName: 'Inflation',
                        field: 'inflation',
                        cellEditor: 'number',
                        cellEditorParams: { variant: 'outlined', fullWidth: false },
                        editable: true
                    }
                ],
                gridOptions: {
                    editorMode: true,
                    tableSize: 'small',
                    lazyRow: true,
                    tableMaxHeight: '30vh'
                }
            }
        }
    ],
    actions: [
        {
            name: 'Reset'
        },
        {
            name: 'Run & Save Scenario',
            customAction: 'saveScenarioName',
            variant: 'contained'
        }
    ],
    extraParams: {
        maxHeight: '65vh'
    },
    expanded: 'Primary Inputs'
};
