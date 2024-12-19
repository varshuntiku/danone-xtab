import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import ForgotPasswordEmailForm from '../../../components/Forms/ForgotPasswordEmailForm';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render ForgotPasswordEmailForm Component', () => {
        const { getByText, getByTestId } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ForgotPasswordEmailForm />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByText('Forgot Password')).toBeInTheDocument();
    });
});
