import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import CreateAlertForm from '../../../components/alert-dialog/CreateAlertForm';
import { getUsers } from '../../../services/project';
import { act } from 'react-dom/test-utils';
import { vi } from 'vitest';

vi.mock('../../../services/project', () => ({
    getUsers: vi.fn()
}));

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render CreateAlertForm Component', () => {
        getUsers.mockImplementation(() => {
            return [
                {
                    email: 'test.user1@themathcompany.com',
                    id: 1,
                    name: 'Test User 1'
                },
                {
                    email: 'test.user2@themathcompany.com',
                    id: 2,
                    name: 'Test User 2'
                },
                {
                    email: 'ira.shrivastava@themathcompany.com',
                    id: 3,
                    name: 'Ira Shrivastava'
                }
            ];
        });
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CreateAlertForm {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByText('Industry Volume 2019', { exact: false })).toBeInTheDocument();
    });
    test('Should render default empty alert form when component dialog pop-up is open', () => {
        getUsers.mockImplementation(() => {
            return [
                {
                    email: 'test.user1@themathcompany.com',
                    id: 1,
                    name: 'Test User 1'
                },
                {
                    email: 'test.user2@themathcompany.com',
                    id: 2,
                    name: 'Test User 2'
                },
                {
                    email: 'ira.shrivastava@themathcompany.com',
                    id: 3,
                    name: 'Ira Shrivastava'
                }
            ];
        });
        const props = {
            ...Props,
            categories: [
                { id: 'extra_value', name: 'Extra Value', value: 200 },
                { id: 'main_value', name: 'Main Value', value: 300 }
            ],
            widget_name: 'INDUSTRY VOLUME 2019',
            createAlert: {
                title: '',
                category: '',
                condition: '',
                threshold: '',
                users: [],
                receive_notification: true
            },
            setCreateAlert: () => {},
            isError: {
                title: false,
                category: false,
                condition: false,
                threshold: false
            },
            setIsError: () => {},
            alertSelected: false,
            resetForm: () => {}
        };
        const { getByText, debug, getByLabelText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CreateAlertForm {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByText('Create Alert', { exact: false })).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: 'Receive Notification' })).toBeInTheDocument();
        const switchBtn = screen.getByRole('checkbox', { name: 'Receive Notification' });
        act(() => {
            switchBtn.click();
            fireEvent.change(switchBtn, { target: { checked: false } });
        });
        //expect(switchBtn).to.have.property('checked', false);
    });
    test('Should render alert data when alert is clicked', () => {
        const props = {
            ...Props,
            categories: [
                { id: 'extra_value', name: 'Extra Value', value: 200 },
                { id: 'main_value', name: 'Main Value', value: 300 }
            ],
            widget_name: 'INDUSTRY VOLUME 2019',
            createAlert: {
                title: 'Test Alert',
                category: 'Extra Value',
                condition: 'above',
                threshold: 100,
                users: [],
                receive_notification: true
            },
            setCreateAlert: () => {},
            isError: {
                title: false,
                category: false,
                condition: false,
                threshold: false
            },
            setIsError: () => {},
            alertSelected: true,
            resetForm: () => {}
        };
        const { getByText, debug, getByLabelText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CreateAlertForm {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByDisplayValue('Test Alert')).toBeInTheDocument();
    });
    test('Should render error message when empty field data is changed to empty', () => {
        const props = {
            ...Props,
            categories: [
                { id: 'extra_value', name: 'Extra Value', value: 200 },
                { id: 'main_value', name: 'Main Value', value: 300 }
            ],
            widget_name: 'INDUSTRY VOLUME 2019',
            createAlert: {
                title: 'Test Alert',
                category: 'Extra Value',
                condition: 'above',
                threshold: 100,
                users: [],
                receive_notification: true
            },
            setCreateAlert: () => {},
            isError: {
                title: false,
                category: false,
                condition: false,
                threshold: false
            },
            setIsError: () => {},
            alertSelected: true,
            resetForm: () => {}
        };
        const { getByText, debug, queryAllByText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CreateAlertForm {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        // const createAlertButton = screen.getByLabelText('Create Alert')
        // fireEvent.click(createAlertButton)
        const alertTitle = screen.getByPlaceholderText('Title');
        fireEvent.change(alertTitle, { target: { name: 'title', value: 'Alert 1' } });
        fireEvent.change(alertTitle, { target: { name: 'title', value: '' } });
        expect(queryAllByText('is required', { exact: false })).not.toBeNull();
    });
    test('Should render default empty user list when dialog pop-up is open and no alert is selected', () => {
        getUsers.mockImplementation(() => {
            return [
                {
                    email: 'test.user1@themathcompany.com',
                    id: 1,
                    name: 'Test User 1'
                },
                {
                    email: 'test.user2@themathcompany.com',
                    id: 2,
                    name: 'Test User 2'
                },
                {
                    email: 'ira.shrivastava@themathcompany.com',
                    id: 3,
                    name: 'Ira Shrivastava'
                }
            ];
        });
        const props = {
            ...Props,
            categories: [
                { id: 'extra_value', name: 'Extra Value', value: 200 },
                { id: 'main_value', name: 'Main Value', value: 300 }
            ],
            widget_name: 'INDUSTRY VOLUME 2019',
            createAlert: {
                title: '',
                category: '',
                condition: '',
                threshold: '',
                users: [],
                receive_notification: true
            },
            setCreateAlert: () => {},
            isError: {
                title: false,
                category: false,
                condition: false,
                threshold: false
            },
            setIsError: () => {},
            alertSelected: false,
            resetForm: () => {}
        };
        const { getByText, debug, getByLabelText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CreateAlertForm {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByText('Create Alert', { exact: false })).toBeInTheDocument();
    });
    test('Should render user list when alert is selected', () => {
        getUsers.mockImplementation(() => {
            return [
                {
                    email: 'test.user1@themathcompany.com',
                    id: 1,
                    name: 'Test User 1'
                },
                {
                    email: 'test.user2@themathcompany.com',
                    id: 2,
                    name: 'Test User 2'
                },
                {
                    email: 'ira.shrivastava@themathcompany.com',
                    id: 3,
                    name: 'Ira Shrivastava'
                }
            ];
        });
        const props = {
            ...Props,
            categories: [
                { id: 'extra_value', name: 'Extra Value', value: 200 },
                { id: 'main_value', name: 'Main Value', value: 300 }
            ],
            widget_name: 'INDUSTRY VOLUME 2019',
            createAlert: {
                title: 'Test Alert',
                category: 'Extra Value',
                condition: 'above',
                threshold: 100,
                users: [
                    {
                        email: 'test.user2@themathcompany.com',
                        id: 2,
                        name: 'Test User 2'
                    }
                ],
                receive_notification: true
            },
            setCreateAlert: () => {},
            isError: {
                title: false,
                category: false,
                condition: false,
                threshold: false
            },
            setIsError: () => {},
            alertSelected: true,
            resetForm: () => {}
        };
        const { getByText, debug, getByLabelText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CreateAlertForm {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByText('Edit Alert', { exact: false })).toBeInTheDocument();
        // expect(screen.getAllByRole('textbox')).not.toBeNull()
        // const userDropdown = screen.getAllByRole('textbox')[1]
        // userDropdown.click()
        //fireEvent.change(userDropdown, { target: { value: "ira" } })
        expect(screen.getByRole('combobox')).toBeInTheDocument();
        const textbox = screen.getByRole('combobox');
        // act(() => {
        //     textbox.focus()
        //     fireEvent.change(textbox, { target: { value: 'ira' } })
        // })
    });
});

const Props = {
    categories: [
        { id: 'extra_value', name: 'Extra Value', value: 200 },
        { id: 'main_value', name: 'Main Value', value: 300 }
    ],
    widget_name: 'INDUSTRY VOLUME 2019',
    createAlert: {
        title: '',
        category: ' ',
        condition: ' ',
        threshold: '',
        users: [],
        receive_notification: true
    },
    setCreateAlert: () => {},
    isError: {
        title: false,
        category: false,
        condition: false,
        threshold: false
    },
    setIsError: () => {},
    alertSelected: false,
    resetForm: () => {},
    user_admin: true,
    logged_in_user_info: 'test.user1@themathcompany.com'
};
