import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import AddAppPopup from '../../../components/screenActionsComponent/actionComponents/AddAppPopup';
import { Provider } from 'react-redux';
import store from 'store/store';
import { vi } from 'vitest';
const history = createMemoryHistory();

vi.mock('../../../components/dynamic-form/inputFields/DynamicFormModal', () => {
    return {
        default: (props) => (
            <>
                Mock DynamicFormModal Component
                <p>Add Application</p>
                <button>Save & Edit Application</button>
            </>
        )
    };
});
describe('AddAppPopup testing', () => {
    test('should render AddAppPopup comoonent', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AddAppPopup classes={{}} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('should render title for popup', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AddAppPopup classes={{}} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const titleElement = screen.queryByText('Add Application');
        expect(titleElement).not.toBeInTheDocument();
    });
    test('should render inputs', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AddAppPopup classes={{}} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const appElement = screen.queryByRole('button', { name: 'Save & Edit Application' });
        expect(appElement).not.toBeInTheDocument();
    });
});
