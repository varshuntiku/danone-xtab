import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import DatePicker from '../../../../components/dynamic-form/inputFields/datepicker';
import { act } from 'react-dom/test-utils';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts DatePicker Component', () => {
        const props = {
            onChange: () => {},
            onBlur: () => {},
            fieldInfo: {
                suppressUTC: false,
                allowInvalid: true,
                value: '01/21/2022',
                label: 'pickerTest'
            },
            validateChange: () => {}
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DatePicker {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        //expect(screen.getByRole('checkbox')).toBeInTheDocument()
        act(() => {
            screen.getByLabelText('pickerTest').click();
            fireEvent.change(screen.getByLabelText('pickerTest'), {
                target: { value: '01/22/2022' }
            });
        });
    });

    test('Should render layouts DatePicker 1 Component', () => {
        const props = {
            onChange: () => {},
            onBlur: () => {},
            fieldInfo: {
                suppressUTC: false,
                allowInvalid: true,
                value: '01/21/2022',
                label: 'pickerTest'
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DatePicker {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        //expect(screen.getByRole('checkbox')).toBeInTheDocument()
        act(() => {
            screen.getByLabelText('pickerTest').click();
            fireEvent.change(screen.getByLabelText('pickerTest'), {
                target: { value: '01/22/2022' }
            });
        });
    });
});
