import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { expect, vi } from 'vitest';
import DeleteApplications from '../../../../components/dsWorkbench/Applications/DeleteApplications';
import { Provider } from 'react-redux';
import store from 'store/store';
import '@testing-library/jest-dom/extend-expect';
import { deleteApp } from '../../../../services/app';

const history = createMemoryHistory();

vi.mock('../../../../services/app', () => ({
    deleteApp: vi.fn()
}));

describe('DeleteApplications Component', () => {
    const mockSetNotification = vi.fn();
    const mockSetNotificationOpen = vi.fn();
    const mockFetchApplicationsList = vi.fn();

    const defaultProps = {
        dsAppConfig: { projectDetailsState: { projectId: '123' } },
        row: { id: '456', name: 'Test App' },
        setNotification: mockSetNotification,
        setNotificationOpen: mockSetNotificationOpen,
        fetchApplicationsList: mockFetchApplicationsList
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders delete icon button', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <DeleteApplications {...defaultProps} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const deleteButton = screen.getByLabelText('delete');
        expect(deleteButton).toBeInTheDocument();
    });

    test('opens confirm popup on delete button click', async () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <DeleteApplications {...defaultProps} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const deleteButton = screen.getByLabelText('delete');
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(screen.getByText('Delete App')).toBeInTheDocument();
            expect(screen.getByText(/Are you sure you want to Delete/i)).toBeInTheDocument();
        });
    });

    test('calls deleteApp and shows success notification on successful deletion', async () => {
        deleteApp.mockImplementation(({ callback }) => callback('success'));

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <DeleteApplications {...defaultProps} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const deleteButton = screen.getByLabelText('delete');
        fireEvent.click(deleteButton);

        const confirmButton = screen.getByText('Yes');
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(deleteApp).toHaveBeenCalledWith({
                appId: '456',
                callback: expect.any(Function)
            });
            expect(mockSetNotificationOpen).toHaveBeenCalledWith(true);
            expect(mockSetNotification).toHaveBeenCalledWith({
                message: 'Application deleted successfully',
                severity: 'success'
            });

            expect(mockFetchApplicationsList).toHaveBeenCalledWith({
                project_id: '123'
            });
        });
    });

    test('shows error notification on deletion failure', async () => {
        deleteApp.mockImplementation(({ callback }) => callback('error'));

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <DeleteApplications {...defaultProps} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const deleteButton = screen.getByLabelText('delete');
        fireEvent.click(deleteButton);

        const confirmButton = screen.getByText('Yes');
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(deleteApp).toHaveBeenCalledWith({
                appId: '456',
                callback: expect.any(Function)
            });
            expect(mockSetNotificationOpen).toHaveBeenCalledWith(true);
            expect(mockSetNotification).toHaveBeenCalledWith({
                message: 'Failed to delete Application',
                severity: 'error'
            });
        });
    });

    test('calls cancel callback on cancel button click', async () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <DeleteApplications {...defaultProps} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const deleteButton = screen.getByLabelText('delete');
        fireEvent.click(deleteButton);

        const cancelButton = screen.getByText('No');
        fireEvent.click(cancelButton);

        await waitFor(() => {
            expect(screen.queryByText('Delete App')).not.toBeInTheDocument();
        });
    });
});
