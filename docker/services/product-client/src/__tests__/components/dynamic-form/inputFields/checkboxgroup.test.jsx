import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import CheckboxesGroup from '../../../../components/dynamic-form/inputFields/checkboxgroup';
import { act } from 'react-dom/test-utils';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts CheckboxesGroup Component', () => {
        const props = {
            onChange: () => {},
            params: {
                label: 'test label',
                value: { element1: 'test value' },
                options: [<p name="element 1">test el</p>]
            }
        };

        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CheckboxesGroup {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByRole('checkbox')).toBeInTheDocument();
        act(() => {
            screen.getByRole('checkbox').click();
            fireEvent.change(screen.getByRole('checkbox'), { target: { value: false } });
        });
    });

    test('Should render layouts CheckboxesGroup Component 1', () => {
        const props = {
            onChange: () => {},
            params: {
                label: 'test label',
                value: { element1: 'test value' },
                options: [<p name="element 1">test el</p>],
                multiple: true
            }
        };

        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CheckboxesGroup {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByRole('checkbox')).toBeInTheDocument();
        act(() => {
            screen.getByRole('checkbox').click();
            fireEvent.change(screen.getByRole('checkbox'), { target: { value: false } });
        });
    });
});
