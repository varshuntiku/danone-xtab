import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import NotebookActions from '../../../components/Admin/NotebookActions';
import { Provider } from 'react-redux';
import store from 'store/store';
import { vi } from 'vitest';
import {
    getExecEnvs,
    createNotebook,
    updateExecEnv,
    startExecEnv,
    stopExecEnv
} from '../../../services/admin_execution';

const history = createMemoryHistory();

vi.mock('../../../services/admin_execution', () => ({
    getExecEnvs: vi.fn(),
    createNotebook: vi.fn(),
    updateExecEnv: vi.fn(),
    startExecEnv: vi.fn(),
    stopExecEnv: vi.fn()
}));

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts ObjectivesDashboard Component', () => {
        getExecEnvs.mockImplementation(({ callback }) => callback([{ id: 1, name: 'test1' }]));
        updateExecEnv.mockImplementation(({ callback }) => callback());

        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <NotebookActions
                            screen_id={1}
                            app_id={1}
                            params={{}}
                            app_info={{ id: 1 }}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        fireEvent.click(screen.getByTitle('Manage User Role'));
        fireEvent.click(screen.getByTitle('Close'));
        fireEvent.click(screen.getByTitle('Manage User Role'));
        fireEvent.click(screen.getByText('Cancel'));
        fireEvent.click(screen.getByTitle('Manage User Role'));
        fireEvent.click(screen.getByRole('presentation').firstChild);
        fireEvent.click(screen.getByTitle('Manage User Role'));
        fireEvent.click(screen.getByText('Save'));
    });

    test('Should render layouts ObjectivesDashboard Component', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <NotebookActions
                            screen_id={1}
                            app_id={1}
                            params={{}}
                            project_id={1}
                            app_info={{ id: 1 }}
                            designExecEnv={'test'}
                            createNewExecEnv={'test'}
                            execution={{ project_id: 1, name: 'test1', exec_env_id: 1, id: 1 }}
                            createNotebook
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        fireEvent.click(screen.getByText('Create New'));
        fireEvent.click(screen.getByText('Save'));
        // expect(screen.getByLabelText('add-alert')).toBeInTheDocument()
    });

    test('Should render layouts ObjectivesDashboard Component', () => {
        updateExecEnv.mockImplementation(({ callback }) => {
            throw 'error';
        });
        createNotebook.mockImplementation(({ callback }) => {
            throw 'error';
        });

        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <NotebookActions
                            screen_id={1}
                            app_id={1}
                            params={{}}
                            project_id={1}
                            app_info={{ id: 1 }}
                            designExecEnv={'test'}
                            createNewExecEnv={'test'}
                            execution={{ project_id: 1, name: 'test1', exec_env_id: 1, id: 1 }}
                            createNotebook
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        fireEvent.click(screen.getByText('Create New'));
        fireEvent.change(screen.getByLabelText('Notebook Name'), {
            target: { value: 'testiung the handle change' }
        });
        fireEvent.click(screen.getByText('Save'));
        // expect(screen.getByLabelText('add-alert')).toBeInTheDocument()
    });
});
