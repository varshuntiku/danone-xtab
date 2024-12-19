import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import FormDialog from '../../../components/dynamic-form/dialog.jsx';
import { vi } from 'vitest';

vi.mock('../../../components/dynamic-form/inputFields/customButton', () => {
    return {
        default: (props) => (
            <button aria-label="close" onClick={props.onClose}>
                Mock Custom Button
            </button>
        )
    };
});

vi.mock('../../../components/dynamic-form/dynamic-form', () => {
    return { default: (props) => <div>Mock Dynamic Form Component</div> };
});

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts FormDialog Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <FormDialog />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByRole('button', { name: 'Open Form' }));
        fireEvent.click(screen.getAllByLabelText('close')[0]);
    });
});
