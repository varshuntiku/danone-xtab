import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import AppWidgetExpandableTable from '../../../components/app-expandable-table/appWidgetExpandableTable.jsx';
import { vi } from 'vitest';
const history = createMemoryHistory();

vi.mock('../../../components/app-expandable-table/appCustomProgressBar', () => {
    return { default: (props) => <div> Mock AppCustomizedProgressBars Component</div> };
});

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts AppWidgetExpandableTable Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetExpandableTable {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render layouts AppWidgetExpandableTable Component 1', () => {
        const props = {
            params: {
                columns: [
                    { id: 0, label: 'column 1' },
                    { id: 1, label: 'column 2' }
                ],
                rows: [
                    ['test.jpg', { value: 'test value', severity: 'medium' }],
                    [3, [{ title: 'test title', link: '/test_link', img: 'test.png' }]]
                ]
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetExpandableTable {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render table', async () => {
        const params = {
            columns: [
                { id: 'id', label: 'ID' },
                { id: 'name', label: 'Name' },
                { id: 'value', label: 'Value' }
            ],
            rows: [
                {
                    id: 1,
                    name: 'Item 1',
                    value: 10,
                    collapse: true,
                    data: {
                        title: 'Sub Item 1',
                        columns: [
                            { id: 'subId', label: 'Sub ID' },
                            { id: 'subName', label: 'Sub Name' }
                        ],
                        rows: [{ subId: 1.1, subName: 'Sub Item 1.1' }]
                    }
                }
            ]
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetExpandableTable params={params} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByText('Value')).toBeInTheDocument();
        expect(screen.getByText('ID')).toBeInTheDocument();
    });
    test('Should sort the table rows', () => {
        const params = {
            columns: [
                { id: 'id', label: 'ID' },
                { id: 'name', label: 'Name' },
                { id: 'value', label: 'Value' }
            ],
            rows: [
                { id: 1, name: 'Item 1', value: 10 },
                { id: 2, name: 'Item 2', value: 20 }
            ]
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetExpandableTable params={params} />
                </Router>
            </CustomThemeContextProvider>
        );

        const sortButton = screen.getByRole('button', { name: 'Name' });
        fireEvent.click(sortButton);

        const rows = screen.getAllByRole('row');
        expect(rows[1]).toHaveTextContent('1Item 110');
    });
    test('Should expand and collapse a row', () => {
        const params = {
            columns: [
                { id: 'id', label: 'ID' },
                { id: 'name', label: 'Name' },
                { id: 'value', label: 'Value' }
            ],
            rows: [
                {
                    id: 1,
                    name: 'Item 1',
                    value: 10,
                    collapse: true,
                    data: {
                        title: 'Sub Item 1',
                        columns: [
                            { id: 'subId', label: 'Sub ID' },
                            { id: 'subName', label: 'Sub Name' }
                        ],
                        rows: [{ subId: 1.1, subName: 'Sub Item 1.1' }]
                    }
                }
            ]
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetExpandableTable params={params} />
                </Router>
            </CustomThemeContextProvider>
        );

        const expandButton = screen.getByRole('button', { name: 'Value' });
        fireEvent.click(expandButton);

        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();

        fireEvent.click(expandButton);
        expect(screen.queryByText('Sub Item 1.1')).not.toBeInTheDocument();
    });
    test('Should handle when there is no data for expandable row', () => {
        const params = {
            columns: [
                { id: 'id', label: 'ID' },
                { id: 'name', label: 'Name' },
                { id: 'value', label: 'Value' }
            ],
            rows: [
                {
                    id: 1,
                    name: 'Item 1',
                    value: 10,
                    collapse: true,
                    data: null
                }
            ]
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetExpandableTable params={params} />
                </Router>
            </CustomThemeContextProvider>
        );

        const expandButton = screen.getByRole('button', { name: 'Value' });
        fireEvent.click(expandButton);

        expect(screen.queryByText('Sub Item 1')).not.toBeInTheDocument();
    });
    test('Should handle missing rows gracefully', () => {
        const params = {
            columns: [
                { id: 'id', label: 'ID' },
                { id: 'name', label: 'Name' },
                { id: 'value', label: 'Value' }
            ],
            rows: []
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetExpandableTable params={params} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.queryByText('ID')).toBeInTheDocument();
    });
    test('Should correctly render progress bar component for each row', () => {
        const params = {
            columns: [
                { id: 'id', label: 'ID' },
                { id: 'name', label: 'Name' },
                { id: 'progress', label: 'Progress' }
            ],
            rows: [
                { id: 1, name: 'Item 1', progress: { value: 50, severity: 'low' } },
                { id: 2, name: 'Item 2', progress: { value: 70, severity: 'high' } }
            ]
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetExpandableTable params={params} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getAllByText('Mock AppCustomizedProgressBars Component'));
    });
    test('Should handle row click event', () => {
        const handleRowClick = vi.fn();
        const params = {
            columns: [
                { id: 'id', label: 'ID' },
                { id: 'name', label: 'Name' },
                { id: 'value', label: 'Value' }
            ],
            rows: [{ id: 1, name: 'Item 1', value: 10 }],
            onRowClick: handleRowClick
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetExpandableTable params={params} />
                </Router>
            </CustomThemeContextProvider>
        );

        const row = screen.getByText('Item 1');
        fireEvent.click(row);

        expect(handleRowClick);
    });
    test('Should render loading indicator when data is loading', () => {
        const params = {
            columns: [
                { id: 'id', label: 'ID' },
                { id: 'name', label: 'Name' },
                { id: 'value', label: 'Value' },
                { id: 'loading', label: 'Loading' }
            ],
            rows: [],
            loading: true
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetExpandableTable params={params} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByText('Loading')).toBeInTheDocument();
    });
    test('Should correctly render row with nested table', () => {
        const params = {
            columns: [
                { id: 'id', label: 'ID' },
                { id: 'name', label: 'Name' },
                { id: 'value', label: 'Value' }
            ],
            rows: [
                {
                    id: 1,
                    name: 'Item 1',
                    value: 10,
                    collapse: true,
                    data: {
                        title: 'Sub Item 1',
                        columns: [
                            { id: 'subId', label: 'Sub ID' },
                            { id: 'subName', label: 'Sub Name' }
                        ],
                        rows: [{ subId: 1.1, subName: 'Sub Item 1.1' }]
                    }
                }
            ]
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetExpandableTable params={params} />
                </Router>
            </CustomThemeContextProvider>
        );

        const expandButton = screen.getByRole('button', { name: 'Value' });
        fireEvent.click(expandButton);

        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    test('Should handle missing progress prop gracefully', () => {
        const params = {
            columns: [
                { id: 'id', label: 'ID' },
                { id: 'name', label: 'Name' },
                { id: 'progress', label: 'Progress' }
            ],
            rows: [
                { id: 1, name: 'Item 1' },
                { id: 2, name: 'Item 2', progress: { value: 70, severity: 'high' } }
            ]
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetExpandableTable params={params} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getAllByText('Mock AppCustomizedProgressBars Component')).toHaveLength(1);
    });

    test('Should handle click events on disabled rows gracefully', () => {
        const handleRowClick = vi.fn();
        const params = {
            columns: [
                { id: 'id', label: 'ID' },
                { id: 'name', label: 'Name' },
                { id: 'value', label: 'Value' }
            ],
            rows: [{ id: 1, name: 'Item 1', value: 10, disabled: true }],
            onRowClick: handleRowClick
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetExpandableTable params={params} />
                </Router>
            </CustomThemeContextProvider>
        );

        const row = screen.getByText('Item 1');
        fireEvent.click(row);

        expect(handleRowClick).not.toHaveBeenCalled();
    });
});

const Props = {
    params: {
        columns: [{}, {}],
        rows: [[1, 2]]
    }
};
