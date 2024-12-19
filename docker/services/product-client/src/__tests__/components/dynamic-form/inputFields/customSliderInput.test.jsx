import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import CustomSliderInput from '../../../../components/dynamic-form/inputFields/CustomSliderInput';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts CustomLabel Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CustomSliderInput {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
});

const props = {
    id: 3,
    name: 'Start Date',
    suppressUTC: true,
    label: 'Plan Start Date',
    type: 'slider',
    variant: 'outlined',
    margin: 'none',
    value: '7',
    min: 0,
    max: 50,
    placeholder: 'Enter StartDate',
    fullWidth: true
};
