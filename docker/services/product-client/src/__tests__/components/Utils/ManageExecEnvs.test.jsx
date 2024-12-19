import React from 'react';
import {
    render,
    screen,
    cleanup,
    fireEvent,
    getByRole,
    getByLabelText,
    within
} from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import ManageExecEnvs from '../../../components/Utils/ManageExecEnvs.jsx';
import {
    createDynamicExecEnv,
    updateDynamicExecEnv,
    getDefaultDynamicExecEnvs
} from '../../../services/execution_environments_utils.js';
import { ExpansionPanelActions } from '@material-ui/core';
import { vi } from 'vitest';

vi.mock('../../../services/execution_environments_utils.js', () => ({
    createDynamicExecEnv: vi.fn(),
    updateDynamicExecEnv: vi.fn(),
    getDefaultDynamicExecEnvs: vi.fn(({ callback }) => callback([{ py_version: '3.8.2' }]))
}));

const history = createMemoryHistory();

describe('Manage Execution Environments tests', () => {
    afterEach(cleanup);

    test('Render the layout for Manage Environment Create Button', () => {
        // createDynamicExecEnv.mockImplementation(({ callback }) => callback());
        // const { getByText, debug } = render(
        //     <CustomThemeContextProvider>
        //         <Router history={history}>
        //             <ManageExecEnvs createNewDynamicExecEnv={true} {...Props} />
        //         </Router>
        //     </CustomThemeContextProvider>
        // );
        // const createButton = screen.getByRole('button', {
        //     name: 'Create New'
        // });
        // expect(createButton).toBeInTheDocument();
        // fireEvent.click(createButton);
        // const cancelButton = screen.getByRole('button', {
        //     name: 'Cancel'
        // });
        // expect(cancelButton).toBeInTheDocument();
        // const saveButton = screen.getByRole('button', {
        //     name: 'Save'
        // });
        // expect(saveButton).toBeInTheDocument();
        // const envNameArea = screen.getByRole('textbox', {
        //     name: 'Environment Name'
        // });
        // expect(envNameArea).toBeInTheDocument();
        // fireEvent.change(envNameArea, { target: { value: 'New exec env' } });
        // const libRequiredArea = screen.getByRole('textbox', {
        //     name: 'Libraries Required'
        // });
        // expect(libRequiredArea).toBeInTheDocument();
        // fireEvent.change(libRequiredArea, { target: { value: 'numpy\nrequests' } });
        // const pyVersionButton = screen.getByRole('button', {
        //     name: 'Python Version ​'
        // });
        // fireEvent.mouseDown(pyVersionButton);
        // fireEvent.click(screen.getByRole('option'));
        // const listPyVersion = screen.getByRole('listbox');
        // fireEvent.click(saveButton);
    });

    test('Render the layout for Manage Environment when data exists', () => {
        // updateDynamicExecEnv.mockImplementation(({ callback }) => callback());
        // const { debug } = render(
        //     <CustomThemeContextProvider>
        //         <Router history={history}>
        //             <ManageExecEnvs
        //                 createNewDynamicExecEnv={false}
        //                 dynamicExecEnv={{
        //                     id: 1,
        //                     name: 'Env1',
        //                     py_version: '3.8.2',
        //                     requirements: 'requests\nscikit-learn'
        //                 }}
        //                 {...Props}
        //             />
        //         </Router>
        //     </CustomThemeContextProvider>
        // );
        // const manageButton = screen.getByRole('button', {
        //     name: 'Manage Execution Environments'
        // });
        // fireEvent.click(manageButton);
        // const header = screen.getByRole('heading', {
        //     name: 'Update Dynamic Visualization Execution Environment'
        // });
        // expect(header).toBeInTheDocument();
        // const envNameArea = screen.getByRole('textbox', {
        //     name: 'Environment Name'
        // });
        // expect(envNameArea).toBeInTheDocument();
        // const saveButton = screen.getByRole('button', {
        //     name: 'Save'
        // });
        // expect(saveButton).toBeInTheDocument();
        // fireEvent.click(saveButton);
        // const cancelButton = screen.getByRole('button', {
        //     name: 'Cancel'
        // });
        // expect(cancelButton).toBeInTheDocument();
        // fireEvent.click(cancelButton);
        // const closeButton = screen.getByRole('button', {
        //     name: 'Close'
        // });
        // expect(closeButton).toBeInTheDocument();
        // fireEvent.click(closeButton);
    });

    // test('Render the layout for error fetching defauld dynamic execution environment', () => {
    //     createDynamicExecEnv.mockImplementation(({ callback }) => callback());
    //     getDefaultDynamicExecEnvs.mockImplementation(({ callback }) =>
    //         callback([{ py_version_list: '3.8.2' }], 'error')
    //     );

    //     const { getByText, debug } = render(
    //         <CustomThemeContextProvider>
    //             <Router history={history}>
    //                 <ManageExecEnvs createNewDynamicExecEnv={true} {...Props} />
    //             </Router>
    //         </CustomThemeContextProvider>
    //     );

    //     const createButton = screen.getByRole('button', {
    //         name: 'Create New'
    //     });
    //     fireEvent.click(createButton);

    //     const pyVersionButton = screen.getByRole('button', {
    //         name: 'Python Version ​'
    //     });
    //     fireEvent.mouseDown(pyVersionButton);
    //     expect(screen.queryByRole('option')).not.toBeInTheDocument();
    // });
});

const Props = {
    classes: {},
    refreshExecEnvList: () => {}
};
