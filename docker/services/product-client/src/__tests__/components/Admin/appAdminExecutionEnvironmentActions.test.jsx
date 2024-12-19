import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import ExecutionEnvironmentActions from '../../../components/Admin/ExecutionEnvironmentActions';
import { Provider } from 'react-redux';
import store from 'store/store';
import CustomTextField from '../../../components/Forms/CustomTextField';
import { vi } from 'vitest';
import {
    createExecEnv,
    updateExecEnv,
    startExecEnv,
    stopExecEnv
} from '../../../services/admin_execution';

// vi.mock('../../../components/Forms/CustomTextField', ()=> (props)=>{
//   return(
//       <>

//               <button onClick={()=>{this.props.parent_obj.onHandleFieldChange(1,"test")}} title="handle-field-change">HandleChange</button>

//       </>
//   )
// })

const history = createMemoryHistory();
vi.mock('../../../services/admin_execution', () => ({
    createNotebook: vi.fn(),
    updateExecEnv: vi.fn(),
    startExecEnv: vi.fn(),
    stopExecEnv: vi.fn(),
    createExecEnv: vi.fn()
}));

const props = {
    refreshData: () => {}
};

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts ObjectivesDashboard Component', () => {
        startExecEnv.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ExecutionEnvironmentActions
                            createNewExecEnv={'test'}
                            screen_id={1}
                            app_id={1}
                            params={{}}
                            app_info={{ id: 1 }}
                            statusExecEnv={'test1'}
                            execution_environment={{ name: 'test', requirements: 'test', id: 1 }}
                            {...props}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        fireEvent.click(screen.getByTitle('Start'));
    });

    test('Should render layouts ObjectivesDashboard Component', () => {
        stopExecEnv.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ExecutionEnvironmentActions
                            screen_id={1}
                            app_id={1}
                            params={{}}
                            app_info={{ id: 1 }}
                            statusExecEnv={'test1'}
                            execution_environment={{
                                name: 'test',
                                requirements: 'test',
                                status: 'TERMINATED'
                            }}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        fireEvent.click(screen.getByTitle('Stop'));
    });

    test('Should render layouts ObjectivesDashboard Component', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ExecutionEnvironmentActions
                            screen_id={1}
                            app_id={1}
                            params={{}}
                            app_info={{ id: 1 }}
                            statusExecEnv={'test1'}
                            execution_environment={{
                                name: 'test',
                                requirements: 'test',
                                status: 'RUNNING'
                            }}
                            {...props}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        fireEvent.click(screen.getByTitle('Stop'));
    });

    test('Should render layouts ObjectivesDashboard Component', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ExecutionEnvironmentActions
                            screen_id={1}
                            app_id={1}
                            params={{}}
                            app_info={{ id: 1 }}
                            statusExecEnv={'test1'}
                            execution_environment={{
                                name: 'test',
                                requirements: 'test',
                                status: 'RUNN'
                            }}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('Should render layouts ObjectivesDashboard Component', () => {
        updateExecEnv.mockImplementation(async ({ callback }) => await callback({ data: 'test' }));

        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ExecutionEnvironmentActions
                            screen_id={1}
                            app_id={1}
                            params={{}}
                            app_info={{ id: 1 }}
                            execution_environment={{
                                name: 'test',
                                requirements: 'test',
                                status: 'RUNN'
                            }}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        // fireEvent.click(screen.getByTitle("Manage User Role"));
        // fireEvent.click(screen.getByText("Save"));
    });

    test('Should render layouts ObjectivesDashboard Component', () => {
        updateExecEnv.mockImplementation(() => {
            throw 'error';
        });
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ExecutionEnvironmentActions
                            screen_id={1}
                            app_id={1}
                            params={{}}
                            app_info={{ id: 1 }}
                            execution_environment={{
                                name: 'test',
                                requirements: 'test',
                                status: 'RUNN'
                            }}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        // fireEvent.click(screen.getByTitle("Manage User Role"));

        // fireEvent.click(screen.getByText("Save"));
    });

    test('Should render layouts ObjectivesDashboard Component', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ExecutionEnvironmentActions
                            createNewExecEnv={'test'}
                            screen_id={1}
                            app_id={1}
                            params={{}}
                            app_info={{ id: 1 }}
                            execution_environment={{
                                name: 'test',
                                requirements: 'test',
                                status: 'RUNN'
                            }}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        fireEvent.click(screen.getByText('Create New'));

        // fireEvent.change(screen.getByText('test'), {target: {value: 'testiung the handle change'}})
        fireEvent.click(screen.getByText('Cancel'));
        fireEvent.click(screen.getByText('Create New'));
        fireEvent.click(screen.getByRole('presentation').firstChild);
        fireEvent.click(screen.getByText('Create New'));
        fireEvent.click(screen.getByTitle('Close'));
        fireEvent.click(screen.getByText('Create New'));
        fireEvent.click(screen.getByText('Save'));
        // expect(screen.getByLabelText('clicked-alert')).toBeInTheDocument()
    });
});
