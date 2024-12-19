import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import DownloadWorkBook from '../../../components/workbook/downloadWorkBook';

const history = createMemoryHistory();
vi.mock('html-to-image', () => ({
    toPng: vi.fn(() => Promise.resolve('data:image/png;base64,example'))
}));
vi.mock('xlsx', () => ({
    utils: {
        book_new: vi.fn(),
        json_to_sheet: vi.fn(),
        book_append_sheet: vi.fn()
    },
    writeFile: vi.fn()
}));

const mockDownload = vi.fn();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts DownloadWorkBook Component when has table data > 0', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DownloadWorkBook
                        screen_id={1}
                        app_id={1}
                        params={{}}
                        action_type="action_Type"
                        filename="excel"
                        tableData={{
                            table_headers: [{ id: 1, label: 'Test' }],
                            table_data: '{"name":" test"}'
                        }}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render layouts DownloadWorkBook Component when table data length is 0', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DownloadWorkBook
                        screen_id={1}
                        app_id={1}
                        params={{}}
                        action_type="action_Type"
                        filename="excel"
                        tableData={{ table_headers: [{ id: 1, label: 'Test' }], table_data: '[]' }}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render layouts DownloadWorkBook Component when table data length is 0', () => {
        const tableData = [
            {
                table_headers: [{ id: 1, label: 'Test' }],
                table_data: '{"name":" test"}',
                SheetName: 'Test Sheet'
            },
            { table_headers: [{ id: 2, label: 'Test 1' }], table_data: '{"name":" test 1"}' }
        ];

        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DownloadWorkBook
                        screen_id={1}
                        app_id={1}
                        params={{}}
                        action_type="action_Type"
                        filename="excel"
                        tableData={tableData}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
    });
});
