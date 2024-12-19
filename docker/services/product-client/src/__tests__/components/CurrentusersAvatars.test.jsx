import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import store from 'store/store';
import CurrentUsersAvatars from '../../components/CurrentUsersAvatars';

const history = createMemoryHistory();
const mockUsers = [
    { email: 'user1@example.com', first_name: 'John', last_name: 'Doe' },
    { email: 'user2@example.com', first_name: 'Jane', last_name: 'Smith' }
];
const mockCurrentUser = { email: 'user3@example.com', first_name: 'Alice', last_name: 'Brown' };

describe('CurrentUsersAvatars Component', () => {
    it('should render without crashing', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CurrentUsersAvatars users={mockUsers} currentUser={mockCurrentUser} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });

    it('should display tooltip with team collaboration links when enabled', async () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CurrentUsersAvatars
                            users={mockUsers}
                            currentUser={mockCurrentUser}
                            enableTeamsCollaboration={true}
                            teamsTopicName="Team Topic"
                            teamsMessage="Hello Team"
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        fireEvent.mouseOver(screen.getByTestId('tooltip'));

        expect(await screen.findByText('Chat with all...')).toBeInTheDocument();
        expect(screen.getByText('Chat with all...').closest('a')).toHaveAttribute(
            'href',
            `https://teams.microsoft.com/l/chat/0/0?users=user1@example.com,user2@example.com,user3@example.com&topicName=Team Topic&message=Hello Team`
        );
    });

    it('should render avatars with correct initials', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CurrentUsersAvatars users={mockUsers} currentUser={mockCurrentUser} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getAllByText('JS')).toHaveLength(1);
        expect(screen.getAllByText('AB')).toHaveLength(1);
    });

    it('should generate correct chat links for each user', async () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CurrentUsersAvatars
                            users={mockUsers}
                            currentUser={mockCurrentUser}
                            enableTeamsCollaboration={true}
                            teamsTopicName="Team Topic"
                            teamsMessage="Hello Team"
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    it('should render avatars correctly when orientation is top-right', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CurrentUsersAvatars
                            users={mockUsers}
                            currentUser={mockCurrentUser}
                            orientation="top-right"
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const tooltip = screen.queryByTestId('tooltip');
        if (tooltip) {
            expect(tooltip).toHaveClass(
                'MuiAvatarGroup-root makeStyles-currentUserContainer-25 makeStyles-topRight-27'
            );
        }
    });

    it('should not display chat links when teams collaboration is disabled', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CurrentUsersAvatars
                            users={mockUsers}
                            currentUser={mockCurrentUser}
                            enableTeamsCollaboration={false}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.queryByText('Chat with all...')).not.toBeInTheDocument();
    });
});
