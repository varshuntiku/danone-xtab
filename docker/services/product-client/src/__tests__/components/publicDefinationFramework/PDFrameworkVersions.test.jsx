import React from 'react';
import PDFrameworkVersions from '../../../components/porblemDefinitionFramework/PDFrameworkVersions';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { render, screen, cleanup, fireEvent, within, waitFor } from '@testing-library/react';
import store from '../../../store/store';
import { getVersions } from '../../../services/project';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import '@testing-library/jest-dom/extend-expect';
import { jssPreset } from '@material-ui/core';
import { vi } from 'vitest';

vi.mock('../../../services/project', () => ({
    getVersions: vi.fn()
}));
vi.mock('components/gridTable/GridTable', () => {
    return {
        default: (props) => {
            const mockRowData = {
                data: [
                    {
                        version_id: '558f442b-ccbf-4e7a-b63d-4c9c88d4d670',
                        version_name: 'version one',
                        is_current: false,
                        created_by_user: 'Vaishnavi K',
                        created_at: 1686816318.174523,
                        updated_by_user: '--'
                    },
                    {
                        version_id: '5192c9f3-b438-418c-9c78-b5bfc11cccc2',
                        version_name: 'project 60 (auto-generated)',
                        is_current: true,
                        created_by_user: 'Vaishnavi K',
                        created_at: 1686806375.417172,
                        updated_by_user: 'Vaishnavi K'
                    }
                ],
                hasNext: false,
                page: 0,
                pageSize: 2,
                pages: 1
            };
            props.params.gridOptions.serverSideDataSource.getRowData = mockRowData;
            return (
                <>
                    Mock grid table component
                    <table>
                        <tr>
                            {props.params.coldef?.map((el) => {
                                return <th>{el.headerName}</th>;
                            })}
                        </tr>
                        <tr>
                            <td>Test data</td>
                        </tr>
                        <tr>
                            {props.params.gridOptions.serverSideDataSource.getRowData?.data?.map(
                                (rowEl) => {
                                    return props.params.coldef?.map((colEl) => {
                                        if (colEl.headerName === 'Actions') {
                                            return (
                                                <td>
                                                    <button>{rowEl.version_name + ' Edit'}</button>
                                                    <button>
                                                        {rowEl.version_name + ' Delete'}{' '}
                                                    </button>
                                                </td>
                                            );
                                        } else {
                                            return <td>{rowEl[colEl.field]}</td>;
                                        }
                                    });
                                }
                            )}
                        </tr>
                    </table>
                </>
            );
        }
    };
});

const history = createMemoryHistory();

describe('Codex product test for PDFramework version component', () => {
    beforeEach(() => vi.clearAllMocks());
    test('Should component render PDFrameworkVersion component', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <PDFrameworkVersions {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const element = screen.getByText('Current version');
        expect(element).toBeInTheDocument();
    });
    test('Does component has table', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <PDFrameworkVersions {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const element = screen.getByRole('table', { name: '' });
        expect(element).toBeInTheDocument();
    });
    test('Does component load data', async () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <PDFrameworkVersions {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const row = await screen.getByRole('row', {
            name: 'version one Vaishnavi K 1686816318.174523 -- version one Edit version one Delete project 60 (auto-generated) Vaishnavi K 1686806375.417172 Vaishnavi K project 60 (auto-generated) Edit project 60 (auto-generated) Delete'
        });
        expect(row).toBeInTheDocument();
    });
    test('Does component has Edit Icon', async () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <PDFrameworkVersions {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const editIcon = screen.getByRole('button', { name: 'version one Edit' });
        expect(editIcon).toBeInTheDocument();
    });
    test('Does component has Delete Icon', async () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <PDFrameworkVersions {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const deleteIcon = screen.getByRole('button', { name: 'version one Delete' });
        expect(deleteIcon).toBeInTheDocument();
    });
});
const props = {
    user_access: {
        edit: 'true'
    },
    setHistoryPopup: 'true',
    projectId: '1'
};
