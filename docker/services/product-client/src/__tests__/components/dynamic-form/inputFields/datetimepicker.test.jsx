import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import DateTimePicker from '../../../../components/dynamic-form/inputFields/datetimepicker';
import { act } from 'react-dom/test-utils';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts DateTimePicker Component', () => {
        const props = {
            onChange: () => {},
            onBlur: () => {},
            fieldInfo: {
                suppressUTC: false,
                allowInvalid: true,
                value: '01/21/2022'
            },
            validateChange: () => {}
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DateTimePicker {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        //expect(screen.getByRole('checkbox')).toBeInTheDocument()
        act(() => {
            screen.getByDisplayValue('January 21st 12:00 am').click();
            fireEvent.change(screen.getByDisplayValue('January 21st 12:00 am'), {
                target: { value: '01/22/2022' }
            });
        });
    });

    test('Should render layouts DateTimePicker 1 Component', () => {
        const props = {
            onChange: () => {},
            onBlur: () => {},
            fieldInfo: {
                suppressUTC: false,
                allowInvalid: true,
                value: '01/21/2022'
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DateTimePicker {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        //expect(screen.getByRole('checkbox')).toBeInTheDocument()
        act(() => {
            screen.getByDisplayValue('January 21st 12:00 am').click();
            fireEvent.change(screen.getByDisplayValue('January 21st 12:00 am'), {
                target: { value: '01/22/2022' }
            });
        });
    });
});
