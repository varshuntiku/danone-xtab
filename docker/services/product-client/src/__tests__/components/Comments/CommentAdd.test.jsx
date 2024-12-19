import { vi } from 'vitest';
import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import store from '../../../store/store';
import CommentAdd from '../../../components/Comments/CommentAdd';

const history = createMemoryHistory();

vi.mock('../../../common/utils', () => ({
    upload_file: vi.fn()
}));

vi.mock('../../../services/comments', () => ({
    addComment: vi.fn()
}));

vi.mock('../../../components/CustomSnackbar.jsx', () => ({
    __esModule: true,
    default: vi.fn(() => null)
}));

vi.mock('../../../components/Comments/UserListItem', () => ({
    __esModule: true,
    default: vi.fn(() => <div>UserListItem</div>)
}));

describe('CommentAdd', () => {
    test('renders CommentAdd component', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CommentAdd users={[]} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByPlaceholderText('Add a comment')).toBeInTheDocument();
    });
    test('renders CommentAdd component with task mode', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={createMemoryHistory()}>
                        <CommentAdd users={[]} mode="task" />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByPlaceholderText('Add a comment')).toBeInTheDocument();
    });

    test('renders approvers container and checks if users are displayed correctly', () => {
        const users = [
            { id: 1, name: 'John Doe' },
            { id: 2, name: 'Jane Doe' }
        ];

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={createMemoryHistory()}>
                        <CommentAdd users={users} mode="task" />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByText('Add Approvers')).toBeInTheDocument();
        users.forEach((user) => {
            expect(screen.getByText(new RegExp(user.name, 'i'))).toBeInTheDocument();
        });
    });
});
