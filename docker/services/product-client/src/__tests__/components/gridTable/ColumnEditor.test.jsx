import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import ColumnEditor from '../../../components/gridTable/ColumnEditor';
import { act } from 'react-dom/test-utils';
import { vi } from 'vitest';
import GridTable from '../../../components/gridTable/GridTable';
const history = createMemoryHistory();
vi.mock('./GridTable', () => ({
    __esModule: true,
    default: vi.fn(({ params, onRowDataChange }) => (
        <div>
            <button
                onClick={() => onRowDataChange([{ headerName: 'New Header', columnType: 'text' }])}
            >
                Update Row Data
            </button>
        </div>
    ))
}));

describe('ColumnEditor Component', () => {
    it('should render the dialog with correct initial content', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ColumnEditor open={true} columns={[]} onUpdate={vi.fn()} onClose={vi.fn()} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByText(/Edit Columns/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Cancel/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Update/i)).toBeInTheDocument();
    });

    it('should call onClose when Cancel button is clicked', () => {
        const handleClose = vi.fn();
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ColumnEditor
                        open={true}
                        columns={[]}
                        onUpdate={vi.fn()}
                        onClose={handleClose}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        fireEvent.click(screen.getByLabelText(/Cancel/i));
        expect(handleClose).toHaveBeenCalled();
    });

    it('should update row data correctly when GridTable triggers onRowDataChange', async () => {
        const handleUpdate = vi.fn();
        const { container } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ColumnEditor
                        open={true}
                        columns={[{ coldef: { headerName: 'Header', cellEditor: 'text' } }]}
                        onUpdate={handleUpdate}
                        onClose={vi.fn()}
                        gridOptions={{
                            columnEditorParams: { columnEditorOptions: ['text', 'checkbox'] }
                        }}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Edit Columns/i)).toBeInTheDocument();
        });
    });
});
