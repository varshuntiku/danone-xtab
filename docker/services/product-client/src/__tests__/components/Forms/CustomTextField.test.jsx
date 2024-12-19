import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import CustomTextField from '../../../components/Forms/CustomTextField.jsx';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts CustomTextField Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CustomTextField {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByTestId('test-select-label')).toBeInTheDocument();
        const selectEl = screen.getByTestId('test-select-label').querySelector('input');
        fireEvent.change(selectEl, { target: { value: 'option 3' } });
    });
    // test('Should render layouts CustomTextField Component', () => {
    //     const props = {
    //         ...Props,
    //         field_info: {
    //             ...Props.field_info,
    //             onChange: 'testFn'
    //         }
    //     };
    //     const { getByText, debug } = render(
    //         <CustomThemeContextProvider>
    //             <Router history={history}>
    //                 <CustomTextField {...props} />
    //             </Router>
    //         </CustomThemeContextProvider>
    //     );
    //     expect(screen.getByTestId('test-select-label')).toBeInTheDocument();
    //     const selectEl = screen.getByTestId('test-select-label').querySelector('input');
    //     fireEvent.change(selectEl, { target: { value: 'option 3' } });
    // });
});

const Props = {
    classes: {},
    field_info: {
        label: 'Test label',
        is_select: true,
        options: [
            { is_group_label: true, value: 'option 1', label: 'Option 1' },
            { is_group_label: true, value: 'option 2', label: 'Option 2' },
            { is_group_label: false, value: 'option 3', label: 'Option 3' },
            { is_group_label: false, value: 'option 4', label: 'Option 4' }
        ],
        value: 'option 1',
        inputProps: { 'data-testid': 'test-select-label' },
        autoComplete: false,
        id: 'test-select',
        fullWidth: true
    },
    parent_obj: {
        onHandleFieldChange: () => {},
        testFn: () => {}
    }
};
