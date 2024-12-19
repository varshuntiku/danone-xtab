import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { Provider, useSelector } from 'react-redux';
import store from '../../../store/store';
import ReplyAdd from '../../../components/Comments/ReplyAdd';
import { upload_file } from '../../../common/utils';
import { addReply } from '../../../services/comments';

const history = createMemoryHistory();

vi.mock('../../../common/utils', () => ({
    upload_file: vi.fn()
}));

vi.mock('../../../services/comments', () => ({
    addReply: vi.fn()
}));

vi.mock('react-redux', async () => {
    const actual = await vi.importActual('react-redux');
    return {
        ...actual,
        useSelector: vi.fn()
    };
});

const mockComment = { id: 1 };
const mockUsers = [{ id: 1, name: 'John Doe' }];
const mockScreenLevelFilterState = {};

describe('ReplyAdd Component', () => {
    beforeEach(() => {
        useSelector.mockReturnValue(mockScreenLevelFilterState);
    });

    afterEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    test('renders ReplyAdd component', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ReplyAdd comment={mockComment} users={mockUsers} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByPlaceholderText('Add a reply')).toBeInTheDocument();
    });

    test('handles file upload correctly', async () => {
        const mockFile = new File(['file content'], 'test-file.txt', {
            type: 'text/plain'
        });

        upload_file.mockResolvedValue({ data: { path: '/path/to/file' } });

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ReplyAdd comment={mockComment} users={mockUsers} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const fileInput = screen.getByTestId('file-upload');
        fireEvent.change(fileInput, { target: { files: [mockFile] } });

        await waitFor(() => {
            expect(upload_file).toHaveBeenCalledWith(mockFile);
            expect(screen.getByText('test-file.txt')).toBeInTheDocument();
        });
    });
});
