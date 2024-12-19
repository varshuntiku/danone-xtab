import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import store from '../../../store/store';
import CommentsList from '../../../components/Comments/CommentsList';
import CustomSnackbar from '../../../components/CustomSnackbar.jsx';
import Comment from '../../../components/Comments/Comment';

const history = createMemoryHistory();

vi.mock('../../../components/CustomSnackbar.jsx', () => ({
    __esModule: true,
    default: ({ open, message, severity }) =>
        open ? (
            <div data-testid="snackbar">
                {message} - {severity}
            </div>
        ) : null
}));

vi.mock('./Comment', () => ({
    __esModule: true,
    default: ({ comment }) => <div data-testid={`comment-${comment.id}`}>{comment.text}</div>
}));

describe('CommentsList Component', () => {
    const mockOnRemoveComment = vi.fn();
    const mockRefreshComments = vi.fn();

    const comments = [
        { id: 1, text: 'First Comment' },
        { id: 2, text: 'Second Comment' }
    ];

    const users = [];

    it('renders comments', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CommentsList
                            comments={comments}
                            users={users}
                            onRemoveComment={mockOnRemoveComment}
                            refreshComments={mockRefreshComments}
                            shouldOpen={false}
                            filterWidgetId={null}
                            filterCommentId={null}
                            filterScreenId={null}
                            linkType={null}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    it(' show notification if filterCommentId does not match any comment id', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CommentsList
                            comments={comments}
                            users={users}
                            onRemoveComment={mockOnRemoveComment}
                            refreshComments={mockRefreshComments}
                            shouldOpen={true}
                            filterWidgetId={null}
                            filterCommentId={3}
                            filterScreenId={null}
                            linkType={null}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.queryByTestId('snackbar')).toBeInTheDocument();
    });

    it('calls onRemoveComment when a comment is removed', () => {
        const commentId = 1;

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CommentsList
                            comments={comments}
                            users={users}
                            onRemoveComment={mockOnRemoveComment}
                            refreshComments={mockRefreshComments}
                            shouldOpen={false}
                            filterWidgetId={null}
                            filterCommentId={null}
                            filterScreenId={null}
                            linkType={null}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        mockOnRemoveComment(commentId);

        expect(mockOnRemoveComment).toHaveBeenCalledWith(commentId);
    });
});
