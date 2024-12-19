import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import NumberInput from '../../../../components/dynamic-form/inputFields/numberInput';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts TextInput Component', () => {
        const props = {
            onChange: () => {},
            onBlur: () => {},
            fieldInfo: {
                inputprops: {
                    step: 1,
                    min: 1,
                    max: 100,
                    type: 'number'
                }
            },
            validateChange: () => {}
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <NumberInput fieldInfo={{}} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
});
