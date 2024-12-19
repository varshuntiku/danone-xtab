import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import DiagnosemeHome from '../../../components/Diagnoseme-clone/home';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import store from 'store/store';
import '@testing-library/jest-dom';

import { vi } from 'vitest';

const history = createMemoryHistory();
describe('DiagnosemeHome', () => {
    it('renders DiagnosemeSideBar component', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <DiagnosemeHome />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.getByTestId('diagnoseme-sidebar')).toBeInTheDocument();
    });
});
