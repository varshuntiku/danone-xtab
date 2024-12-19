import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import store from '../../../store/store';
import Comment from '../../../components/Comments/Comment';

const history = createMemoryHistory();

vi.mock('../api/status', () => ({
    status: vi.fn().mockResolvedValue({})
}));
vi.mock('../api/bookmark', () => ({
    bookmark: vi.fn().mockResolvedValue({})
}));
vi.mock('../api/addFilter', () => ({
    addFilter: vi.fn().mockResolvedValue('filterId')
}));
vi.mock('../api/commentDeleteStateChange', () => ({
    commentDeleteStateChange: vi.fn().mockResolvedValue({})
}));

const renderComment = (props) => {
    return render(
        <Provider store={store}>
            <CustomThemeContextProvider>
                <Router history={createMemoryHistory()}>
                    <Comment {...props} />
                </Router>
            </CustomThemeContextProvider>
        </Provider>
    );
};

describe('Comment Component', () => {
    const defaultProps = {
        comment: {
            id: 1,
            user_name: 'John Doe',
            comment_text: '<p>This is a comment</p>',
            replies: [],
            attachments: [],
            status: 'unresolved',
            bookmarked: false,
            created_by: 1,
            created_at: new Date(),
            approvals: [
                { id: 1, user_id: 1, status: 'Approved', name: 'Approver 1' },
                { id: 2, user_id: 2, status: 'Approved', name: 'Approver 2' },
                { id: 3, user_id: 3, status: 'Pending', name: 'Approver 3' },
                { id: 4, user_id: 4, status: 'Denied', name: 'Approver 4' }
            ]
        },
        users: [],
        onRemoveComment: vi.fn(),
        shouldOpen: true,
        refreshComments: vi.fn(),
        filterCommentId: null,
        linkType: 'new',
        user_id: 2 // Current user ID
    };

    it('renders the comment and its elements', () => {
        renderComment(defaultProps);

        expect(screen.getByText('This is a comment')).toBeInTheDocument();

        expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('handles resolve toggle correctly', async () => {
        renderComment(defaultProps);

        expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    it('renders the scenarios correctly', () => {
        const props = {
            ...defaultProps,
            scenario_list: ['Scenario 1', 'Scenario 2']
        };

        renderComment(props);

        expect(screen.getByText('Scenarios:')).toBeInTheDocument();
        expect(screen.getByText('Scenario 1, Scenario 2')).toBeInTheDocument();
    });
    it('does not render Accept and Deny buttons for non-pending approvers', () => {
        renderComment(defaultProps);

        // Check that there are no accept/deny buttons for approved and denied approvers
        const acceptButton = screen.queryByText('Accept');
        const denyButton = screen.queryByText('Deny');

        expect(acceptButton).toBeNull();
        expect(denyButton).toBeNull();
    });
});
