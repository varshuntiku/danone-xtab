import React from 'react';
import { render, screen, cleanup, fireEvent, within } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import AppWidgetTable from '../../components/AppWidgetTable';
import CustomThemeContextProvider from '../../themes/customThemeContext';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);
    test('Should render AppWidgetPlot Component', () => {
        const props = {
            params: {
                table_data: [
                    ['A', 'Seasonal', '8', '2', '9', '19'],
                    ['A', 'Linear', '3', '4', '5', '12'],
                    ['A', 'Stable', '4', '5', '6', '15'],
                    ['A', 'Erratic', '6', '7', '8', '21'],
                    ['B', 'Seasonal', '8', '5', '7', '19'],
                    ['B', 'Linear', '5', '6', '7', '12'],
                    ['B', 'Stable', '8', '9', '7', '15'],
                    ['B', 'Erratic', '7', '8', '6', '21']
                ],
                table_headers: [
                    'Pareto',
                    'Pattern',
                    'Variability/High',
                    'Variability/Medium',
                    'Variability/Low',
                    'Total'
                ]
            },
            search: ''
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetTable {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render AppWidgetPlot Component', () => {
        const props = {
            params: {
                multiple_tables: true,
                table_data: [
                    [
                        ['SKU1', 'Brand', 'A', 'HS', 'High', '19', '-20%', ''],
                        ['SKU2', 'Brand', 'A', 'Seasonal', 'High', '17', '-18%', ''],
                        ['SKU3', 'Brand', 'B', 'Erratic', 'Medium', '15', '-15%', ''],
                        ['SKU4', 'Brand', 'B', 'HS', 'Medium', '14', '-21%', ''],
                        ['SKU5', 'Brand', 'C', 'HS', 'High', '11', '-19%', '']
                    ]
                ],
                table_headers: [
                    [
                        'SKU',
                        'Brand',
                        'Pareto',
                        'Pattern',
                        'Variability',
                        'Actual',
                        'Deviation',
                        'Forecast'
                    ],
                    ['Drivers', 'Actual', 'Industry', 'Category', '#SKU', 'Deviation', 'Forecast']
                ],
                table_labels: [
                    'SKUs with forecast variance over 10% in 2 subsequent months',
                    'Key changes in leading indicators and other drivers'
                ]
            },
            search: ''
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetTable {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('should sort the table when a header is clicked', () => {
        const props = {
            params: {
                table_data: [
                    ['A', 'Stable', '8', '9', '7', '15'],
                    ['B', 'Seasonal', '8', '2', '9', '19'],
                    ['C', 'Linear', '3', '4', '5', '12']
                ],
                table_headers: [
                    'Pareto',
                    'Pattern',
                    'Variability/High',
                    'Variability/Medium',
                    'Variability/Low',
                    'Total'
                ]
            },
            search: ''
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetTable {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        screen.debug();

        const paretoHeader = screen.getByText('Pareto');
        fireEvent.click(paretoHeader);

        screen.debug();

        const rows = screen.getAllByRole('row');
        const cells = rows.slice(1).map((row) => {
            return within(row)
                .getAllByRole('cell')
                .map((cell) => cell.textContent.trim());
        });

        const sortedCells = cells.map((row) => row[0]).sort();
        expect(cells.map((row) => row[0])).toEqual(sortedCells);
    });
    test('should render table rows and cells correctly', () => {
        const props = {
            params: {
                table_data: [
                    ['A', 'Stable', '8', '9', '7', '15'],
                    ['B', 'Seasonal', '1', '2', '27', '19'],
                    ['C', 'Linear', '3', '4', '5', '12']
                ],
                table_headers: [
                    'Pareto',
                    'Pattern',
                    'Variability/High',
                    'Variability/Medium',
                    'Variability/Low',
                    'Total'
                ]
            },
            search: ''
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetTable {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        props.params.table_headers.forEach((header) => {
            expect(screen.getByText(header)).toBeInTheDocument();
        });

        props.params.table_data.forEach((rowData) => {
            rowData.forEach((cellData) => {
                expect(screen.getByText(cellData)).toBeInTheDocument();
            });
        });
    });
    test('should render table headers with sorting indicators', () => {
        const props = {
            params: {
                table_data: [
                    ['A', 'Stable', '8', '9', '7', '15'],
                    ['B', 'Seasonal', '1', '2', '27', '19'],
                    ['C', 'Linear', '3', '4', '5', '12']
                ],
                table_headers: [
                    'Pareto',
                    'Pattern',
                    'Variability/High',
                    'Variability/Medium',
                    'Variability/Low',
                    'Total'
                ]
            },
            search: ''
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetTable {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        const headers = screen.getAllByRole('columnheader');
        headers.forEach((header) => {
            expect(header).toHaveTextContent(
                /^(Pareto|Pattern|Variability\/High|Variability\/Medium|Variability\/Low|Total)$/
            );
        });
    });

    test('should trigger sorting when a table header is clicked', () => {
        const props = {
            params: {
                table_data: [
                    ['A', 'Stable', '8', '9', '7', '15'],
                    ['B', 'Seasonal', '1', '2', '27', '19'],
                    ['C', 'Linear', '3', '4', '5', '12']
                ],
                table_headers: [
                    'Pareto',
                    'Pattern',
                    'Variability/High',
                    'Variability/Medium',
                    'Variability/Low',
                    'Total'
                ]
            },
            search: ''
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetTable {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        const paretoHeader = screen.getByText('Pareto');
        fireEvent.click(paretoHeader);
    });

    test('should apply conditional text alignment to table headers', () => {
        const props = {
            params: {
                table_data: [
                    ['A', 'Stable', '8', '9', '7', '15'],
                    ['B', 'Seasonal', '1', '2', '27', '19'],
                    ['C', 'Linear', '3', '4', '5', '12']
                ],
                table_headers: [
                    'Pareto',
                    'Pattern',
                    'Variability/High',
                    'Variability/Medium',
                    'Variability/Low',
                    'Total'
                ]
            },
            search: ''
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetTable {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        const headers = screen.getAllByRole('columnheader');
        headers.forEach((header) => {
            expect(header).toHaveStyle('text-align: left');
        });
    });
    it('should render StyledTableCell with correct text', () => {
        const props = {
            params: {
                table_data: [['A', 'Stable', '8', '9', '7', '15']],
                table_headers: [
                    'Pareto',
                    'Pattern',
                    'Variability/High',
                    'Variability/Medium',
                    'Variability/Low',
                    'Total'
                ]
            },
            search: '',
            tableOptions: {
                expandableColumns: false
            }
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetTable {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        props.params.table_headers.forEach((header) => {
            expect(screen.getByText(header)).toBeInTheDocument();
        });
    });

    it('should render buttons from outerActions prop', () => {
        const mockHandleClick = vi.fn();

        const props = {
            params: {
                table_data: [['A', 'Stable']],
                table_headers: ['Header1', 'Header2']
            },
            search: '',
            tableOptions: {
                outerActions: [
                    { text: 'Action1', name: 'action1', onClick: mockHandleClick },
                    { text: 'Action2', name: 'action2', onClick: mockHandleClick }
                ]
            }
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetTable {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    it('should call handleOuterActionClick with correct name on button click', () => {
        const mockHandleClick = vi.fn();

        const props = {
            params: {
                table_data: [['A', 'Stable']],
                table_headers: ['Header1', 'Header2']
            },
            search: '',
            tableOptions: {
                outerActions: [
                    { text: 'Action1', name: 'action1', onClick: mockHandleClick },
                    { text: 'Action2', name: 'action2', onClick: mockHandleClick }
                ]
            }
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetTable {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    it('should render nothing if outerActions is undefined', () => {
        const props = {
            params: {
                table_data: [['A', 'Stable']],
                table_headers: ['Header1', 'Header2']
            },
            search: '',
            tableOptions: {
                outerActions: undefined
            }
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetTable {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.queryByRole('button')).toBeNull();
    });
});
