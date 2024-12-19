import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import store from '../../../store/store';
import CommentsDrawer from '../../../components/Comments/CommentsDrawer';
import { getComments } from '../../../services/comments';
import { getUsers } from '../../../services/project';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

const history = createMemoryHistory();

vi.mock('../../../services/comments');
vi.mock('../../../services/project');

getComments.mockResolvedValue({
    comments: [{ id: 1, text: 'Test Comment' }]
});
getUsers.mockResolvedValue([{ id: 1, name: 'Test User' }]);

describe('CommentsDrawer Component', () => {
    const mockOnClose = vi.fn();
    const mockShouldOpenHandler = vi.fn();
    it('should fetch users and comments on mount', async () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CommentsDrawer
                            onClose={mockOnClose}
                            appId="test-app"
                            screenId="test-screen"
                            shouldOpen={false}
                            shouldOpenHandler={mockShouldOpenHandler}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        await waitFor(() => {
            expect(getUsers).toHaveBeenCalled();
            expect(getComments).toHaveBeenCalled();
        });
    });

    it('should show no comments message when there are no comments', async () => {
        getComments.mockResolvedValue({ comments: [{ id: 1, text: 'Test Comment' }] });
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CommentsDrawer
                            onClose={mockOnClose}
                            appId="test-app"
                            screenId="test-screen"
                            shouldOpen={false}
                            shouldOpenHandler={mockShouldOpenHandler}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('0')).toBeInTheDocument();
        });
    });
    it('should render the conversation view when selected', async () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CommentsDrawer
                            onClose={mockOnClose}
                            app_info="test-app"
                            screenId="test-screen"
                            shouldOpen={true}
                            shouldOpenHandler={mockShouldOpenHandler}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const dropdown = await screen.findByLabelText('Add Text');
        expect(dropdown).toBeInTheDocument();
        fireEvent.change(dropdown, { target: { value: 'conversation' } });
        const taskElement = await screen.findByText('Conversation');
        expect(taskElement).toBeInTheDocument();
    });
    it('should render the task view when selected', async () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CommentsDrawer
                            onClose={mockOnClose}
                            appId="test-app"
                            screenId="test-screen"
                            shouldOpen={true}
                            shouldOpenHandler={mockShouldOpenHandler}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const dropdown = await screen.findByLabelText('Add Text');
        expect(dropdown).toBeInTheDocument();
        fireEvent.change(dropdown, { target: { value: 'task' } });
        const taskElement = await screen.findByText('Task');
        expect(taskElement).toBeInTheDocument();
    });
});
