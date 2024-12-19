import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor, act } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import AlertsWorkspace from '../../../components/alert-dialog/AlertsWorkspace';
import { MuiThemeProvider, ThemeProvider } from '@material-ui/core';
import { createTheme } from '@material-ui/core';
import {
    getAlerts,
    deleteAlert,
    updateAlert,
    updateAlertNotification
} from '../../../services/alerts';
import { vi } from 'vitest';

vi.mock('../../../services/alerts', () => ({
    getAlerts: vi.fn(),
    deleteAlert: vi.fn(),
    updateAlert: vi.fn(),
    updateAlertNotification: vi.fn()
}));

vi.mock('../../../components/dynamic-form/inputFields/textInput', () => ({
    textCompTheme: () => {}
}));
vi.mock('../../../components/dynamic-form/inputFields/select', () => ({
    selectCompTheme: () => {}
}));

vi.mock('../../../components/custom/CodxPoupDialog', () => {
    return {
        default: (props) => (
            <div>
                Mocked CodxPopupDialog component
                {props.dialogContent && props.dialogContent}
                {props.open && props.dialogActions}
            </div>
        )
    };
});

const history = createMemoryHistory();

describe('Codex AlertsWorkspace test', () => {
    afterEach(cleanup);

    test('Should render AlertsWorkspace Component', () => {
        const app_info = {};

        getAlerts.mockImplementation(({ callback }) =>
            callback([
                {
                    alert_source_type:
                        'Integrated Demand Forecasting >> Demand Sizing >> DEMAND GROWTH ACROSS REGIONS',
                    alert_widget_type: 'choropleth',
                    app_id: 26,
                    app_screen_id: 103,
                    app_screen_widget_id: 490,
                    category: 'Below Industry growth',
                    condition: 'above',
                    id: 2,
                    receive_notification: true,
                    threshold: 90,
                    title: 'choropleth alert 1',
                    users: []
                }
            ])
        );
        updateAlertNotification.mockImplementation(({ callback }) => callback());

        const { getByText, debug, getByTestId } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AlertsWorkspace app_info={app_info} width={'md'} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByTestId('notification-toggle')).toHaveProperty('checked', true);
        act(() => {
            getByTestId('notification-toggle').click();
            fireEvent.change(screen.getByTestId('notification-toggle'), {
                target: { checked: false }
            });
        });
        // fireEvent.click(screen.getByLabelText('Edit alert'))
        // fireEvent.click(screen.getByLabelText('edit-cancel'))
        // fireEvent.click(screen.getByLabelText('confirm'))
    });

    test('Should render AlertsWorkspace Component 1', () => {
        const app_info = {};

        getAlerts.mockImplementation(({ callback }) =>
            callback([
                {
                    alert_source_type:
                        'Integrated Demand Forecasting >> Demand Sizing >> DEMAND GROWTH ACROSS REGIONS',
                    alert_widget_type: 'choropleth',
                    app_id: 26,
                    app_screen_id: 103,
                    app_screen_widget_id: 490,
                    category: 'Below Industry growth',
                    condition: 'above',
                    id: 2,
                    receive_notification: true,
                    threshold: 90,
                    title: 'choropleth alert 1',
                    users: []
                }
            ])
        );
        updateAlert.mockImplementation(({ callback }) => callback());
        const { getByText, debug, getByTestId } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AlertsWorkspace app_info={app_info} width={'md'} />
                </Router>
            </CustomThemeContextProvider>
        );

        // fireEvent.click(screen.getByLabelText('Edit alert'))
        // fireEvent.click(screen.getByLabelText('edit-cancel'))
        // fireEvent.click(screen.getByLabelText('back'))
        // fireEvent.change(screen.getByPlaceholderText('Title'),{ target: { name: 'title', value: ''}})
        // fireEvent.change(screen.getByPlaceholderText('Title'),{ target: { name: 'title', value: 'title changed'}})
        // fireEvent.change(screen.getByPlaceholderText('Threshold'),{ target: { name: 'threshold', value: ''}})
        // fireEvent.change(screen.getByPlaceholderText('Threshold'),{ target: { name: 'threshold', value: '80'}})
        // fireEvent.change(screen.getByTestId('condition'),{target: { name: 'condition', value: ' '}})
        // fireEvent.change(screen.getByTestId('condition'),{target: { name: 'condition', value: 'above'}})
        // fireEvent.click(screen.getByLabelText('edit-alert'))
        // fireEvent.click(screen.getByLabelText('Delete Alert'))
        // fireEvent.click(screen.getByLabelText('delete-cancel'))
        // fireEvent.click(screen.getByLabelText('Delete Alert'))
        // fireEvent.click(screen.getByLabelText('delete-confirm'))
    });

    test('Should render AlertsWorkspace Component 2', () => {
        const app_info = {};

        getAlerts.mockImplementation(({ callback }) =>
            callback([
                {
                    alert_source_type:
                        'Integrated Demand Forecasting >> Demand Sizing >> DEMAND GROWTH ACROSS REGIONS',
                    alert_widget_type: 'choropleth',
                    app_id: 26,
                    app_screen_id: 103,
                    app_screen_widget_id: 490,
                    category: 'Below Industry growth',
                    condition: 'above',
                    id: 2,
                    receive_notification: true,
                    threshold: 90,
                    title: 'choropleth alert 1'
                }
            ])
        );
        deleteAlert.mockImplementation(({ callback }) => callback());
        const { getByText, debug, getByTestId } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AlertsWorkspace app_info={app_info} width={'md'} />
                </Router>
            </CustomThemeContextProvider>
        );

        fireEvent.click(screen.getByLabelText('Delete Alert'));
        fireEvent.click(screen.getByLabelText('delete-cancel'));
        fireEvent.click(screen.getByLabelText('Delete Alert'));
        fireEvent.click(screen.getByLabelText('delete-confirm'));
    });
});
