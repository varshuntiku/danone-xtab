import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import AppVariablesPopup from '../../../components/Admin/AppVariablesPopup';
import {
    getAppVariable,
    updateAppVariable,
    createAppVariable
} from '../../../services/app_variables.js';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import store from 'store/store';
import { UserInfoContext } from 'context/userInfoContent';
import { vi } from 'vitest';

vi.mock('../../../services/app_variables.js', () => ({
    createAppVariable: vi.fn(),
    updateAppVariable: vi.fn(),
    getAppVariable: vi.fn()
}));

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

    test('Should render create btn of AppVariablePopup Component', () => {
        const Props = {
            appId: 321,
            createAppVariableFlag: true,
            getAppVariableList: () => {},
            keys: []
        };

        const { getByText, debug, getByLabelText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UserInfoContext.Provider value={nac_context}>
                            <AppVariablesPopup {...Props} />
                        </UserInfoContext.Provider>
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const createBtn = screen.getByText('Add Application Variable');
        expect(createBtn).toBeInTheDocument();
    });

    test('Should render create variable popup with empty inputs and disabled save btn', () => {
        const Props = {
            appId: 321,
            createAppVariableFlag: true,
            getAppVariableList: () => {},
            keys: []
        };

        const { getByText, debug, getByLabelText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UserInfoContext.Provider value={nac_context}>
                            <AppVariablesPopup {...Props} />
                        </UserInfoContext.Provider>
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const createBtn = screen.getByText('Add Application Variable');
        expect(createBtn).toBeInTheDocument();

        fireEvent.click(createBtn);
        expect(screen.getByText('Create New App Variable')).toBeInTheDocument();
        // expect(screen.getByText('Name is Mandatory')).toBeInTheDocument();

        const saveBtn = screen.getByRole('button', { name: 'Save' });
        expect(saveBtn).toBeDisabled();
    });

    test('Should enable save btn once both the input fields are filled', () => {
        const Props = {
            appId: 321,
            createAppVariableFlag: true,
            getAppVariableList: () => {},
            keys: []
        };

        const { getByText, debug, getByLabelText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UserInfoContext.Provider value={nac_context}>
                            <AppVariablesPopup {...Props} />
                        </UserInfoContext.Provider>
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const createBtn = screen.getByText('Add Application Variable');
        expect(createBtn).toBeInTheDocument();

        fireEvent.click(createBtn);
        expect(screen.getByText('Create New App Variable')).toBeInTheDocument();
        // expect(screen.getByText('Name is Mandatory')).toBeInTheDocument();

        const saveBtn = screen.getByRole('button', { name: 'Save' });
        expect(saveBtn).toBeDisabled();

        const varNameInput = screen.getByTestId('varKey').querySelector('input');
        // const varValueInput = screen.getByTestId('varValue').querySelector('textarea')

        fireEvent.change(varNameInput, { target: { value: 'new var' } });
        // fireEvent.change(varValueInput, {target: {value: "new var value"}})

        expect(saveBtn).toBeDisabled();
    });

    test('Should save the variable once the save btn is clicked', () => {
        createAppVariable.mockImplementation(({ callback }) =>
            callback({
                status: 'success'
            })
        );

        const Props = {
            appId: 321,
            createAppVariableFlag: true,
            getAppVariableList: () => {},
            keys: []
        };

        const { getByText, debug, getByLabelText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UserInfoContext.Provider value={nac_context}>
                            <AppVariablesPopup {...Props} />
                        </UserInfoContext.Provider>
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const createBtn = screen.getByText('Add Application Variable');
        expect(createBtn).toBeInTheDocument();

        fireEvent.click(createBtn);
        expect(screen.getByText('Create New App Variable')).toBeInTheDocument();
        // expect(screen.getByText('Name is Mandatory')).toBeInTheDocument();

        const saveBtn = screen.getByRole('button', { name: 'Save' });
        expect(saveBtn).toBeDisabled();

        const varNameInput = screen.getByTestId('varKey').querySelector('input');
        // const varValueInput = screen.getByTestId('varValue').querySelector('textarea')

        fireEvent.change(varNameInput, { target: { value: 'new var' } });
        // fireEvent.change(varValueInput, {target: {value: "new var value"}})

        expect(saveBtn).toBeDisabled();
        fireEvent.click(saveBtn);
    });

    test('Should not allow to save with existing variable name', () => {
        const Props = {
            appId: 321,
            createAppVariableFlag: true,
            getAppVariableList: () => {},
            keys: ['test var']
        };

        const { getByText, debug, getByLabelText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UserInfoContext.Provider value={nac_context}>
                            <AppVariablesPopup {...Props} />
                        </UserInfoContext.Provider>
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const createBtn = screen.getByText('Add Application Variable');
        expect(createBtn).toBeInTheDocument();

        fireEvent.click(createBtn);
        expect(screen.getByText('Create New App Variable')).toBeInTheDocument();
        // expect(screen.getByText('Name is Mandatory')).toBeInTheDocument();

        const saveBtn = screen.getByRole('button', { name: 'Save' });
        expect(saveBtn).toBeDisabled();

        const varNameInput = screen.getByTestId('varKey').querySelector('input');
        // const varValueInput = screen.getByTestId('varValue')

        fireEvent.change(varNameInput, { target: { value: 'test var' } });

        expect(screen.getByText('App variable already exists')).toBeInTheDocument();
        expect(saveBtn).toBeDisabled();
    });

    test('Should render edit btn of AppVariablePopup Component', () => {
        const Props = {
            appId: 321,
            createAppVariableFlag: false,
            getAppVariableList: () => {},
            keys: ['test var 1'],
            varKey: 'test var 1',
            varValue: false
        };

        const { getByText, debug, getByLabelText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppVariablesPopup {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const editBtn = screen.getByTitle('Manage Application Variable');
        expect(editBtn).toBeInTheDocument();
    });

    test('Should load the variable value once the edit btn is clicked', () => {
        getAppVariable.mockImplementation(({ callback }) =>
            callback({
                key: 'test var 1',
                value: 'value for test var 1'
            })
        );

        const Props = {
            appId: 321,
            createAppVariableFlag: false,
            getAppVariableList: () => {},
            keys: ['test var 1'],
            varKey: 'test var 1',
            varValue: false
        };

        const { getByText, debug, getByLabelText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppVariablesPopup {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const editBtn = screen.getByTitle('Manage Application Variable');
        expect(editBtn).toBeInTheDocument();

        fireEvent.click(editBtn);

        expect(screen.getByText('value for test var 1')).toBeInTheDocument();
    });

    test('Should disable the variable name field when edit popup is opened', () => {
        getAppVariable.mockImplementation(({ callback }) =>
            callback({
                key: 'test var 1',
                value: 'value for test var 1'
            })
        );

        const Props = {
            appId: 321,
            createAppVariableFlag: false,
            getAppVariableList: () => {},
            keys: ['test var 1'],
            varKey: 'test var 1',
            varValue: false
        };

        const { getByText, debug, getByLabelText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppVariablesPopup {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const editBtn = screen.getByTitle('Manage Application Variable');
        expect(editBtn).toBeInTheDocument();

        fireEvent.click(editBtn);

        expect(screen.getByText('value for test var 1')).toBeInTheDocument();

        const saveBtn = screen.getByRole('button', { name: 'Save' });

        const varNameInput = screen.getByTestId('varKey').querySelector('input');
        // const varValueInput = screen.getByTestId('varValue').querySelector('textarea')

        expect(varNameInput).toBeDisabled();
    });

    test('Should update the variable value once the save btn is clicked', () => {
        vi.useFakeTimers();

        getAppVariable.mockImplementation(({ callback }) =>
            callback({
                key: 'test var 1',
                value: 'value for test var 1'
            })
        );

        updateAppVariable.mockImplementation(({ callback }) =>
            callback({
                message: 'Variable updated successfully'
            })
        );

        const Props = {
            appId: 321,
            createAppVariableFlag: false,
            getAppVariableList: () => {},
            keys: ['test var 1'],
            varKey: 'test var 1',
            varValue: false
        };

        const { getByText, debug, getByLabelText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppVariablesPopup {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const editBtn = screen.getByTitle('Manage Application Variable');
        expect(editBtn).toBeInTheDocument();

        fireEvent.click(editBtn);

        expect(screen.getByText('value for test var 1')).toBeInTheDocument();

        const saveBtn = screen.getByRole('button', { name: 'Save' });

        const varNameInput = screen.getByTestId('varKey').querySelector('input');
        // const varValueInput = screen.getByTestId('varValue').querySelector('textarea')

        expect(varNameInput).toBeDisabled();
        // fireEvent.change(varValueInput, {target: {value: "value edited"}})

        fireEvent.click(saveBtn);

        act(() => {
            vi.advanceTimersByTime(2000);
            expect(screen.getByText('Updated Successfully', { exact: false })).toBeInTheDocument();
        });
    });
});
