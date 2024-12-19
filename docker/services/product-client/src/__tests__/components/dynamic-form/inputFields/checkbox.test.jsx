import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import CustomCheckbox from '../../../../components/dynamic-form/inputFields/checkbox';
import { act } from 'react-dom/test-utils';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts CustomCheckbox Component', () => {
        const props = {
            onChange: () => {},
            params: {
                value: false
            }
        };

        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CustomCheckbox {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByRole('checkbox')).toHaveProperty('checked', false);
        act(() => {
            screen.getByRole('checkbox').click();
            fireEvent.change(screen.getByRole('checkbox'), { target: { value: true } });
        });
    });
});
