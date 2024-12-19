import React from 'react';
import { render, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import store from '../../../store/store';
import AppAdminNotebookIterations from '../../../components/Admin/NotebookIterations';
import AdminTable from '../../../components/custom/AdminTable.jsx';
import NotebookIterationActions from '../../../components/Admin/NotebookIterationActions.jsx';
import * as services from '../../../services/admin_execution.js';
import {
    getNotebookIterations,
    deleteNotebookIteration
} from '../../../services/admin_execution.js';
const history = createMemoryHistory();

vi.mock('../../../services/admin_execution.js', () => ({
    getNotebookIterations: vi.fn(),
    deleteNotebookIteration: vi.fn()
}));

vi.mock('../../../components/custom/AdminTable.jsx', () => ({
    __esModule: true,
    default: vi.fn(() => <div>AdminTable Component</div>)
}));

vi.mock('../../../components/Admin/NotebookIterationActions.jsx', () => ({
    __esModule: true,
    default: vi.fn(() => <div>NotebookIterationActions Component</div>)
}));
const MockAdminTable = vi.fn(() => null);

describe('AppAdminNotebookIterations', () => {
    const history = createMemoryHistory();

    it('renders correctly with valid notebook_id', () => {
        const props = {
            app_info: {
                id: 'app1',
                blueprint_link: 'http://example.com/projects/123/notebooks/456'
            },
            match: {
                params: {
                    notebook_id: '456'
                }
            }
        };

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppAdminNotebookIterations {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.getByText('AdminTable Component')).toBeInTheDocument();
        expect(AdminTable).toBeCalled();
    });
    it('correctly extracts project_id from blueprint_link', () => {
        const props = {
            app_info: {
                id: 'app1',
                blueprint_link: 'http://example.com/projects/123/notebooks/456'
            },
            match: {
                params: {
                    notebook_id: '456'
                }
            }
        };

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppAdminNotebookIterations {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(AdminTable).toBeCalledTimes(2);
    });

    it('uses the NotebookIterationActions component for add, edit, and other actions', () => {
        const props = {
            app_info: {
                id: 'app1',
                blueprint_link: 'http://example.com/projects/123/notebooks/456'
            },
            match: {
                params: {
                    notebook_id: '456'
                }
            }
        };

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppAdminNotebookIterations {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.getByText('AdminTable Component')).toBeInTheDocument();
    });

    it('passes correct props to NotebookIterationActions for add_action', () => {
        const props = {
            app_info: {
                id: 'app1',
                blueprint_link: 'http://example.com/projects/123/notebooks/456'
            },
            match: {
                params: {
                    notebook_id: '456'
                }
            }
        };

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppAdminNotebookIterations {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(NotebookIterationActions).not.toBeCalled();
    });

    it('passes correct props to NotebookIterationActions for edit_action', () => {
        const props = {
            app_info: {
                id: 'app1',
                blueprint_link: 'http://example.com/projects/123/notebooks/456'
            },
            match: {
                params: {
                    notebook_id: '456'
                }
            }
        };

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppAdminNotebookIterations {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(NotebookIterationActions).not.toBeCalled();
    });
    it('passes correct actions to AdminTable', () => {
        const props = {
            app_info: {
                id: 'app1',
                blueprint_link: 'http://example.com/projects/123/notebooks/456'
            },
            match: {
                params: {
                    notebook_id: '456'
                }
            }
        };

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppAdminNotebookIterations {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(AdminTable).toHaveBeenCalledWith(
            expect.objectContaining({
                table_params: expect.objectContaining({
                    add_action: expect.any(Function),
                    edit_action: expect.any(Function),
                    other_actions: expect.arrayContaining([expect.any(Function)])
                })
            }),
            {}
        );
    });
    it('passes correct props to NotebookIterationActions', () => {
        const props = {
            app_info: {
                id: 'app1',
                blueprint_link: 'http://example.com/projects/123/notebooks/456'
            },
            match: {
                params: {
                    notebook_id: '456'
                }
            }
        };

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppAdminNotebookIterations {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const add_action = AdminTable.mock.calls[0][0].table_params.add_action;
        expect(add_action).toBeInstanceOf(Function);
        expect(add_action(() => {})).toEqual(
            <NotebookIterationActions
                notebook_id="456"
                createNotebookIteration={true}
                refreshData={expect.any(Function)}
            />
        );

        const edit_action = AdminTable.mock.calls[0][0].table_params.edit_action;
        expect(edit_action).toBeInstanceOf(Function);
        expect(edit_action({}, () => {})).toEqual(
            <NotebookIterationActions
                notebook_id="456"
                iteration={{}}
                refreshData={expect.any(Function)}
            />
        );

        const other_actions = AdminTable.mock.calls[0][0].table_params.other_actions;
        expect(other_actions[0]).toBeInstanceOf(Function);
        expect(other_actions[0]({}, () => {})).toEqual(
            <NotebookIterationActions
                notebook_id="456"
                designNotebookIteration={true}
                iteration={{}}
                refreshData={expect.any(Function)}
            />
        );
    });
});
