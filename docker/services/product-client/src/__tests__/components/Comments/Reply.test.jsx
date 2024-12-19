import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import store from '../../../store/store';
import Reply from '../../../components/Comments/Reply';
import CustomSnackbar from '../../../components/CustomSnackbar';
import DateDisplay from '../../../components/Comments/DateDisplay';
const history = createMemoryHistory();

vi.mock('../../components/CustomSnackbar.jsx', () => ({
    __esModule: true,
    default: vi.fn(() => <div>CustomSnackbar</div>)
}));

vi.mock('./DateDisplay.jsx', () => ({
    __esModule: true,
    default: vi.fn(() => <div>DateDisplay</div>)
}));

vi.mock('./AttachmentCard', () => ({
    __esModule: true,
    default: vi.fn(({ fileUrl, fileName }) => (
        <div data-testid="attachment-card">
            {fileName} ({fileUrl})
        </div>
    ))
}));

describe('Reply Component', () => {
    const mockReply = {
        reply_text: '<b>Sample Reply</b>',
        user_name: 'John Doe',
        created_at: '2024-08-20T12:34:56Z',
        created_by: 1,
        attachments: [
            JSON.stringify({ url: 'file1.jpg', name: 'File 1', size: '2MB' }),
            JSON.stringify({ url: 'file2.jpg', name: 'File 2', size: '3MB' })
        ]
    };

    it('sanitizes reply text correctly', () => {
        const unsafeReply = {
            ...mockReply,
            reply_text: '<script>alert("XSS")</script><b>Safe Text</b>'
        };

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Reply reply={unsafeReply} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.queryByText('alert("XSS")')).not.toBeInTheDocument();
        expect(screen.getByText('Safe Text')).toBeInTheDocument();
    });

    it('does not render attachments when none are provided', () => {
        const replyWithoutAttachments = {
            ...mockReply,
            attachments: []
        };

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Reply reply={replyWithoutAttachments} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.queryByTestId('attachment-card')).not.toBeInTheDocument();
    });

    it('renders avatar with the correct initial and color', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Reply reply={mockReply} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.getByText('J')).toBeInTheDocument();
    });

    it('retrieves and sets user ID from sessionStorage', () => {
        sessionStorage.setItem('user_id', '2');
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Reply reply={mockReply} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const commentContainer = screen.getByText('John Doe').closest('div');
        expect(commentContainer).not.toHaveClass('commentHovered');
    });
});
