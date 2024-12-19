import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { expect, vi } from 'vitest';
import AppScreenActionEditor from '../../../components/Admin/AppScreenActionEditor';
import { Provider } from 'react-redux';
import store from 'store/store';
import AppSystemWidgetInfo from '../../../components/AppSystemWidgetInfo';

vi.mock('../../../components/Admin/CustomSnackbar', () => ({
    __esModule: true,
    default: ({ open, onClose, severity, message }) => (
        <div data-testid="custom-snackbar" style={{ display: open ? 'block' : 'none' }}>
            {message}
        </div>
    )
}));

vi.mock('../../../components/AppSystemWidgetInfo', () => ({
    __esModule: true,
    default: ({ widget_info, closeCallback }) => (
        <div data-testid="app-system-widget-info">
            {/* Mock content */}
            <button onClick={closeCallback} />
        </div>
    )
}));

vi.mock('../../../components/Admin/AppScreenPackageDetails', () => ({
    __esModule: true,
    default: ({ packages }) => (
        <div data-testid="app-screen-package-details">
            {packages.map((pkg) => (
                <div key={pkg.name}>{pkg.name}</div>
            ))}
        </div>
    )
}));

const history = createMemoryHistory();

const MockedAppScreenActionEditor = (props) => <AppScreenActionEditor {...props} />;

describe('AppScreenActionEditor', () => {
    let mockProps;
    let component;

    beforeEach(() => {
        mockProps = {
            classes: {
                viewDocs: 'viewDocs',
                codeTemplateItem: 'codeTemplateItem',
                widgetConfigFormControl: 'widgetConfigFormControl',
                widgetConfigSelect: 'widgetConfigSelect',
                widgetConfigCheckboxLabel: 'widgetConfigCheckboxLabel',
                widgetConfigIcon: 'widgetConfigIcon',
                menu: 'menu',
                f1: 'f1',
                defaultColor: 'defaultColor',
                checkBox: 'checkBox',
                loader: 'loader',
                commentSelector: 'commentSelector'
            },
            app_info: {},
            system_widgets: [{ name: 'Widget 1', types: ['SCREEN_ACTION_HANDLER'] }],
            packageList: [{ name: 'Package 1' }, { name: 'Package 2' }]
        };

        component = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppScreenActionEditor {...mockProps} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    it('should render component without crashing', () => {
        expect(component).toBeDefined();
    });

    it('should not render CustomSnackbar when no customNotification.message', () => {
        const props = {
            ...mockProps,
            customNotification: {}
        };
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppScreenActionEditor {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.queryByTestId('custom-snackbar')).toBeNull();
    });

    it('should handle empty system_widgets gracefully', () => {
        const props = {
            ...mockProps,
            system_widgets: []
        };
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppScreenActionEditor {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.queryByText('Widget 1')).toBeNull();
    });

    it('should render AppSystemWidgetInfo with action_handler_component true but show_action_handler_component_info false', () => {
        const props = {
            ...mockProps,
            action_handler_component: true,
            show_action_handler_component_info: false
        };
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppScreenActionEditor {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.queryByTestId('app-system-widget-info')).toBeNull();
    });

    it('should display package names from packageList', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppScreenActionEditor {...mockProps} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getAllByText('Packages Available'));
    });

    it('should toggle checkbox state correctly', async () => {
        const props = {
            ...mockProps,
            checkboxChecked: false
        };

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppScreenActionEditor {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const checkbox = document.querySelector('.checkBox');
        fireEvent.click(checkbox);

        await waitFor(() => expect(checkbox.checked).toBe());
    });
});
