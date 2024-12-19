import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import ExecEnv from '../../../components/Utils/ExecutionEnvironmentsUtils';
import {
    getExecEnvs,
    deleteExecEnv,
    getExecEnvsStatusById,
    getExecEnvsCurrentStatusById
} from '../../../services/execution_environments_utils.js';
import { vi } from 'vitest';
import { ExecutionEnvironmentContextProvider } from 'components/ExecutionEnvironment/context/ExecutionEnvironmentContext';

vi.mock('../../../components/Utils/ManageExecEnvs', () => {
    return { default: (props) => <>Mock Manage Execution Environment Component</> };
});

vi.mock('../../../services/execution_environments_utils', () => ({
    getExecEnvs: vi.fn(),
    deleteExecEnv: vi.fn(),
    getExecEnvsStatusById: vi.fn(),
    getExecEnvsCurrentStatusById: vi.fn()
}));

const history = createMemoryHistory();

describe('Execution Environment test', () => {
    afterEach(cleanup);

    test('Test rendering main component without props', () => {
        const { debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ExecutionEnvironmentContextProvider>
                        <ExecEnv />
                    </ExecutionEnvironmentContextProvider>
                </Router>
            </CustomThemeContextProvider>
        );
        const pageLoadingMask = screen.getByText(/Fetching Environments/i);
        expect(pageLoadingMask).toBeInTheDocument();
    });

    test('Test rendering main component with props', () => {
        getExecEnvs.mockImplementation(({ callback }) =>
            callback([
                {
                    id: 1,
                    name: 'nuclios-env',
                    py_version: '3.10',
                    status: 'Running',
                    packages: [
                        {
                            name: 'alembic',
                            version: '1.13.1'
                        }
                    ]
                }
            ])
        );
        const { debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ExecutionEnvironmentContextProvider>
                        <ExecEnv {...Props} />
                    </ExecutionEnvironmentContextProvider>
                </Router>
            </CustomThemeContextProvider>
        );
        const headingElement = screen.getByRole('heading', {
            name: 'Execution Environments'
        });
        expect(headingElement).toBeInTheDocument();
        const platformUtilsLinkElement = screen.getByRole('link', {
            name: 'platform-utils'
        });
        expect(platformUtilsLinkElement).toBeInTheDocument();
        const createNewEnvBtn = screen.getByRole('button', {
            name: 'Create New Environment'
        });
        expect(createNewEnvBtn).toBeInTheDocument();
        const viewStatusButton = screen.getByRole('button', {
            name: 'View Status'
        });
        expect(viewStatusButton).toBeInTheDocument();
        const deleteButton = screen.getByRole('button', {
            name: 'delete_execution_environment'
        });
        expect(deleteButton).toBeInTheDocument();
        const tableHeaderEnvNameCol = screen.getByRole('columnheader', {
            name: 'Environment Name'
        });
        expect(tableHeaderEnvNameCol).toBeInTheDocument();
        const tableHeaderPythonVersionCol = screen.getByRole('columnheader', {
            name: 'Python version'
        });
        expect(tableHeaderPythonVersionCol).toBeInTheDocument();
        const tableHeaderStatusCol = screen.getByRole('columnheader', {
            name: 'Status'
        });
        expect(tableHeaderStatusCol).toBeInTheDocument();
        const tableHeaderActionsCol = screen.getByRole('columnheader', {
            name: 'Actions'
        });
        expect(tableHeaderActionsCol).toBeInTheDocument();
        const tableData1 = screen.getByRole('cell', {
            name: 'nuclios-env'
        });
        expect(tableData1).toBeInTheDocument();
        const tableData2 = screen.getByRole('cell', {
            name: 'Running'
        });
        expect(tableData2).toBeInTheDocument();
        const rowsPage = screen.getByRole('button', {
            name: 'Rows per page: 10'
        });
        fireEvent.mouseDown(rowsPage);
        const options = screen.getAllByRole('option');
        fireEvent.click(options[0]);
    });

    test('Test Delete Environment functionality', () => {
        deleteExecEnv.mockImplementation(({ callback }) =>
            callback([
                {
                    id: 1
                }
            ])
        );
        const { debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ExecutionEnvironmentContextProvider>
                        <ExecEnv {...Props} />
                    </ExecutionEnvironmentContextProvider>
                </Router>
            </CustomThemeContextProvider>
        );
        const deleteButton = screen.getByRole('button', {
            name: 'delete_execution_environment'
        });
        fireEvent.click(deleteButton);
    });

    test('Render error scenario for getExecEnvs', () => {
        getExecEnvs.mockImplementation(({ callback }) => callback([], 'error'));
        const { debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ExecutionEnvironmentContextProvider>
                        <ExecEnv {...Props} />
                    </ExecutionEnvironmentContextProvider>
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Test View Status functionality', () => {
        getExecEnvsStatusById.mockImplementation(({ callback }) =>
            callback([
                {
                    id: 1,
                    name: 'nuclios-env',
                    py_version: '3.10',
                    status: 'Generating Artifact',
                    env_type: 'custom',
                    packages: [
                        {
                            name: 'alembic',
                            version: '1.13.1'
                        }
                    ]
                }
            ])
        );
        const { debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ExecutionEnvironmentContextProvider>
                        <ExecEnv {...Props} />
                    </ExecutionEnvironmentContextProvider>
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Test Current Status in the env-status window', () => {
        getExecEnvsCurrentStatusById.mockImplementation(({ callback }) =>
            callback([
                {
                    id: 1,
                    name: 'nuclios-env',
                    py_version: '3.10',
                    status: 'Generating Artifact',
                    env_type: 'custom',
                    packages: [
                        {
                            name: 'alembic',
                            version: '1.13.1'
                        }
                    ]
                }
            ])
        );
        const { debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ExecutionEnvironmentContextProvider>
                        <ExecEnv {...Props} />
                    </ExecutionEnvironmentContextProvider>
                </Router>
            </CustomThemeContextProvider>
        );
    });
});

const Props = {
    classes: {}
};
