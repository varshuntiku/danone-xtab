import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import AppVariables from '../../../components/Admin/AppVariables';
import {
    getAllAppVariables,
    deleteAppVariable,
    getAppVariable
} from '../../../services/app_variables.js';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import store from 'store/store';
import { UserInfoContext } from 'context/userInfoContent';
import { vi } from 'vitest';

vi.mock('../../../services/app_variables.js', () => ({
    getAllAppVariables: vi.fn(),
    deleteAppVariable: vi.fn(),
    getAppVariable: vi.fn()
}));

vi.mock('../../../components/Admin/AppVariablesPopup', () => {
    return {
        default: (props) => (
            <>
                Mock AppVariablesPopup Component
                {props.createAppVariableFlag && <button>Add Application Variable</button>}
                {!props.createAppVariableFlag && <button>Edit</button>}
            </>
        )
    };
});

const history = createMemoryHistory();

const nac_context = {
    nac_roles: [
        {
            name: 'app-admin',
            id: 2,
            permissions: [
                {
                    name: 'CREATE_VARIABLE',
                    id: 1
                }
            ]
        }
    ]
};

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render AppVariable Component', () => {
        getAllAppVariables.mockImplementation(({ callback }) =>
            callback({
                keys: []
            })
        );

        const Props = {
            appId: 321
        };

        const { getByText, debug, getByLabelText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppVariables {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const table = screen.getByLabelText('app-variable-table');
        expect(table).toBeInTheDocument();
    });

    test('Should render rows for each variable in AppVariable table', () => {
        getAllAppVariables.mockImplementation(({ callback }) =>
            callback({
                keys: ['test var 1']
            })
        );

        const Props = {
            appId: 321
        };

        const { getByText, debug, getByLabelText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppVariables {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const varRow = screen.getByText('test var 1');
        expect(varRow).toBeInTheDocument();
    });

    test('Should render "Hidden Value. Click to show value." initially for value column', () => {
        getAllAppVariables.mockImplementation(({ callback }) =>
            callback({
                keys: ['test var 1']
            })
        );

        const Props = {
            appId: 321
        };

        const { getByText, debug, getByLabelText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppVariables {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const valBtn = screen.getByRole('button', { name: 'Hidden Value. Click to show value.' });
        expect(valBtn).toBeInTheDocument();
    });

    test('Should render AppVariablePopup', () => {
        getAllAppVariables.mockImplementation(({ callback }) =>
            callback({
                keys: []
            })
        );

        const Props = {
            appId: 321
        };

        const { getByText, debug, getByLabelText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppVariables {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const mockComponent = screen.getByText('Mock AppVariablesPopup Component');
        expect(mockComponent).toBeInTheDocument();
    });

    test('Should render add variable button', () => {
        getAllAppVariables.mockImplementation(({ callback }) =>
            callback({
                keys: []
            })
        );

        const Props = {
            appId: 321
        };

        const { getByText, debug, getByLabelText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppVariables {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const popupBtn = screen.getByRole('button', {
            name: 'Add Application Variable',
            exact: false
        });
        expect(popupBtn).toBeInTheDocument();
    });

    test('Should render edit variable button', () => {
        getAllAppVariables.mockImplementation(({ callback }) =>
            callback({
                keys: ['test var 1']
            })
        );

        const Props = {
            appId: 321
        };

        const { getByText, debug, getByLabelText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UserInfoContext.Provider value={nac_context}>
                            <AppVariables {...Props} />
                        </UserInfoContext.Provider>
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const popupBtn = screen.getByRole('button', { name: 'Edit', exact: false });
        expect(popupBtn).toBeInTheDocument();
    });

    test('Should render delete variable btn', () => {
        getAllAppVariables.mockImplementation(({ callback }) =>
            callback({
                keys: ['test var 1']
            })
        );

        const Props = {
            appId: 321
        };

        const { getByText, debug, getByLabelText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UserInfoContext.Provider value={nac_context}>
                            <AppVariables {...Props} />
                        </UserInfoContext.Provider>
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const deleteBtn = screen.getByTitle('Delete Application Variable');
        expect(deleteBtn).toBeInTheDocument();
    });

    test('Should not render "hidden value. click to show value" btn once button is clicked', () => {
        getAllAppVariables.mockImplementation(({ callback }) =>
            callback({
                keys: ['test var 1']
            })
        );

        getAppVariable.mockImplementation(({ callback }) =>
            callback({
                key: 'test var 1',
                value: 'test var 1 value'
            })
        );

        const Props = {
            appId: 321
        };

        const { getByText, debug, getByLabelText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppVariables {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const valBtn = screen.getByRole('button', { name: 'Hidden Value. Click to show value.' });
        expect(valBtn).toBeInTheDocument();
        fireEvent.click(valBtn);
        const varValue = screen.getByText('test var 1 value');
        expect(varValue).toBeInTheDocument();
    });

    test('Should render variable value when btn is clicked', () => {
        getAllAppVariables.mockImplementation(({ callback }) =>
            callback({
                keys: ['test var 1']
            })
        );

        getAppVariable.mockImplementation(({ callback }) =>
            callback({
                key: 'test var 1',
                value: 'test var 1 value'
            })
        );

        const Props = {
            appId: 321
        };

        const { getByText, debug, getByLabelText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppVariables {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const valBtn = screen.getByRole('button', { name: 'Hidden Value. Click to show value.' });
        expect(valBtn).toBeInTheDocument();
        fireEvent.click(valBtn);
        expect(valBtn).not.toBeInTheDocument();
    });

    test('Should render search bar', () => {
        getAllAppVariables.mockImplementation(({ callback }) =>
            callback({
                keys: ['test var 1']
            })
        );

        getAppVariable.mockImplementation(({ callback }) =>
            callback({
                key: 'test var 1',
                value: 'test var 1 value'
            })
        );

        const Props = {
            appId: 321
        };

        const { getByText, debug, getByLabelText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppVariables {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const searchBar = screen.getByPlaceholderText('Search');
        expect(searchBar).toBeInTheDocument();
    });

    test('Should not render edit button when searched keyword not found', () => {
        vi.useFakeTimers();

        getAllAppVariables.mockImplementation(({ callback }) =>
            callback({
                keys: ['test var 1']
            })
        );

        getAppVariable.mockImplementation(({ callback }) =>
            callback({
                key: 'test var 1',
                value: 'test var 1 value'
            })
        );

        const Props = {
            appId: 321
        };

        const { getByText, debug, getByLabelText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UserInfoContext.Provider value={nac_context}>
                            <AppVariables {...Props} />
                        </UserInfoContext.Provider>
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const searchBar = screen.getByPlaceholderText('Search', { exact: false });
        const popupBtn = screen.getByRole('button', { name: 'Edit', exact: false });
        expect(searchBar).toBeInTheDocument();
        fireEvent.change(searchBar, { target: { value: 'new' } });
        act(() => {
            vi.advanceTimersByTime(1200);
        });

        expect(popupBtn).not.toBeInTheDocument();
    });

    test('Should not render edit button when searched keyword not found', () => {
        vi.useFakeTimers();

        getAllAppVariables.mockImplementation(({ callback }) =>
            callback({
                keys: ['test var 1', 'test var 2', 'new var 3']
            })
        );

        const Props = {
            appId: 321
        };

        const { getByText, debug, getByLabelText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppVariables {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const searchBar = screen.getByPlaceholderText('Search', { exact: false });
        const newVarRow = screen.getByText('new', { exact: false });
        expect(newVarRow).toBeInTheDocument();
        expect(searchBar).toBeInTheDocument();
        fireEvent.change(searchBar, { target: { value: 'test ' } });
        act(() => {
            vi.advanceTimersByTime(1200);
        });

        expect(newVarRow).not.toBeInTheDocument();
    });

    test('Should remove deleted variable', () => {
        vi.useFakeTimers();

        getAllAppVariables.mockImplementation(({ callback }) =>
            callback({
                keys: ['test var 1']
            })
        );

        deleteAppVariable.mockImplementation(({ callback }) =>
            callback({
                message: 'Variable deleted successfully'
            })
        );

        const Props = {
            appId: 321
        };

        const { getByText, debug, getByLabelText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UserInfoContext.Provider value={nac_context}>
                            <AppVariables {...Props} />
                        </UserInfoContext.Provider>
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const deleteBtn = screen.getByTitle('Delete Application Variable');
        expect(deleteBtn).toBeInTheDocument();

        const varRow = screen.getByText('test var 1');
        expect(varRow).toBeInTheDocument();

        fireEvent.click(deleteBtn);

        const confirmBtn = screen.getByRole('button', { name: 'Delete' });
        expect(confirmBtn).toBeInTheDocument();

        fireEvent.click(confirmBtn);
        act(() => {
            vi.advanceTimersByTime(2000);
            expect(
                screen.getByText('Application Variable deleted successfully', { exact: false })
            ).toBeInTheDocument();
        });
    });
});
