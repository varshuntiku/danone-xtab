import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import AutoSuggest from '../../../../components/dynamic-form/inputFields/autoSuggest';
import { vi } from 'vitest';
const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts AutoSuggest Component', () => {
        const testAPICallback = vi.fn();
        const testMenuItem = (props) => <p>{props.params}</p>;
        const props = {
            onChange: () => {},
            onBlur: () => {},
            fieldInfo: {
                value: 'test value',
                valueLabel: 'test label',
                ajaxCallback: testAPICallback,
                menuItem: testMenuItem
            }
        };
        testAPICallback.mockImplementation(({ callback }) =>
            callback({
                data: {
                    data: 'menuItem1'
                }
            })
        );
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AutoSuggest {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        fireEvent.change(screen.getByDisplayValue('test label'), {
            target: { value: 'test search' }
        });
    });
});
