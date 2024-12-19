import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import AlertDialog from '../../../components/alert-dialog/AlertDialog';
import { getAlertsByWidget, createAlert, updateAlert, deleteAlert } from '../../../services/alerts';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import store from 'store/store';
import { vi } from 'vitest';

vi.mock('../../../services/alerts', () => ({
    getAlertsByWidget: vi.fn(),
    createAlert: vi.fn(),
    updateAlert: vi.fn(),
    deleteAlert: vi.fn()
}));

vi.mock('../../../components/alert-dialog/CreateAlertForm', () => {
    return {
        default: (props) => (
            <>
                Mock component 1<div>{props.widget_name}</div>
                <button
                    onClick={() => {
                        props.setCreateAlert({
                            category: 'trace-pie-1',
                            condition: 'above',
                            threshold: '10',
                            title: 'pie alert 9',
                            users: []
                        });
                    }}
                    aria-label="add-alert-details"
                >
                    Set Alert Data
                </button>
                <button
                    onClick={() => {
                        props.setCreateAlert({
                            category: 'trace-pie-1',
                            condition: 'above',
                            threshold: '10',
                            title: '',
                            users: []
                        });
                    }}
                    aria-label="update-alert-details"
                >
                    Update Alert Data
                </button>
            </>
        )
    };
});
vi.mock('../../../components/alert-dialog/Alerts', () => {
    return {
        default: (props) => (
            <>
                Mock component 2
                <button
                    onClick={() =>
                        props.alertClicked({
                            app_id: 26,
                            app_screen_id: 103,
                            app_screen_widget_id: 488,
                            category: 'Market Share',
                            condition: 'above',
                            id: 13,
                            receive_notification: true,
                            threshold: 90,
                            title: 'pie alert 8'
                        })
                    }
                    aria-label="clicked-alert"
                >
                    Alert Clicked
                </button>
                <button onClick={() => props.deleteAlert(13)} aria-label="delete-alert">
                    Delete Alert
                </button>
            </>
        )
    };
});
const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render AlertDialog Component', () => {
        getAlertsByWidget.mockImplementation(({ callback }) =>
            callback([
                {
                    active: false,
                    app_id: 26,
                    app_screen_id: 103,
                    app_screen_widget_id: 484,
                    category: 'extra_value',
                    condition: 'above',
                    id: 474,
                    receive_notification: true,
                    threshold: 10,
                    title: 'test alert 1',
                    users: []
                }
            ])
        );

        const { getByText, debug, getByLabelText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AlertDialog {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const button = screen.getByLabelText('alert');
        fireEvent.click(button);
        expect(screen.getByText('Mock component', { exact: false })).toBeInTheDocument();
    });

    test('should NOT render AlertDialog Component if the alert button is NOT clicked', () => {
        const { getByText, debug, getByLabelText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AlertDialog {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.queryByText('Mock component', { exact: false })).toBeNull();
    });

    test('should hide AlertDialog Component if the close button is clicked', async () => {
        const { getByText, debug, getByLabelText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AlertDialog {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const button = screen.getByLabelText('alert');
        fireEvent.click(button);
        const closeButton = screen.getByLabelText('close');
        fireEvent.click(closeButton);
        waitFor(() => expect(screen.queryByText('Mock component', { exact: false })).toBeNull());
    });
    test('should not hide AlertDialog Component if the backdrop is clicked', () => {
        const clickCloseHandler = vi.fn();
        const { getByText, debug, getByLabelText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AlertDialog {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const button = screen.getByLabelText('alert');
        fireEvent.click(button);
        expect(screen.getByText('Mock component', { exact: false })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('presentation').firstChild);
        expect(screen.getByText('Mock component', { exact: false })).toBeInTheDocument();
    });
    test('should create alert when alert data is filled', () => {
        createAlert.mockImplementation(({ callback }) => callback());

        const { getByText, debug, getByLabelText, container } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AlertDialog {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const button = screen.getByLabelText('alert');
        fireEvent.click(button);
        expect(screen.getByText('Create Alert')).toBeInTheDocument();

        expect(screen.getByRole('button', { name: 'add-alert-details' })).toBeInTheDocument();
        const setAlertDataBtn = screen.getByRole('button', { name: 'add-alert-details' });
        fireEvent.click(setAlertDataBtn);

        expect(screen.getByRole('button', { name: 'Create Alert' })).toBeInTheDocument();
        const createBtn = screen.getByRole('button', { name: 'Create Alert' });
        fireEvent.click(createBtn);
    });
    test('should not create alert when required alert data is not filled', () => {
        createAlert.mockImplementation(({ callback }) => callback());

        const { getByText, debug, getByLabelText, container } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AlertDialog {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const button = screen.getByLabelText('alert');
        fireEvent.click(button);
        expect(screen.getByText('Create Alert')).toBeInTheDocument();

        expect(screen.getByRole('button', { name: 'Create Alert' })).toBeInTheDocument();
        const createBtn = screen.getByRole('button', { name: 'Create Alert' });
        fireEvent.click(createBtn);
    });
    test('should update alert when required data is filled and update alert button is clicked', () => {
        vi.useFakeTimers();
        updateAlert.mockImplementation(({ callback }) => callback());
        const { getByText, debug, getByLabelText, container } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AlertDialog {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const button = screen.getByLabelText('alert');
        fireEvent.click(button);
        expect(screen.getByLabelText('clicked-alert')).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('clicked-alert'));

        expect(screen.getByText('Update Alert')).toBeInTheDocument();
        const updateBtn = screen.getByText('Update Alert');
        fireEvent.click(updateBtn);

        act(() => {
            vi.advanceTimersByTime(6000);
        });
    });
    test('should not update alert when required data is not filled and update alert button is clicked', () => {
        const { getByText, debug, getByLabelText, container } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AlertDialog {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const button = screen.getByLabelText('alert');
        fireEvent.click(button);
        expect(screen.getByLabelText('clicked-alert')).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('clicked-alert'));

        expect(screen.getByRole('button', { name: 'update-alert-details' })).toBeInTheDocument();
        const updateAlertBtn = screen.getByRole('button', { name: 'update-alert-details' });
        fireEvent.click(updateAlertBtn);

        expect(screen.getByText('Update Alert')).toBeInTheDocument();
        const updateBtn = screen.getByText('Update Alert');
        fireEvent.click(updateBtn);
    });

    test('should delete the selected alert when delete button is clicked', () => {
        deleteAlert.mockImplementation(({ callback }) => callback());
        const { getByText, debug, getByLabelText, container } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AlertDialog {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const button = screen.getByLabelText('alert');
        fireEvent.click(button);
        expect(screen.getByLabelText('clicked-alert')).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('clicked-alert'));

        expect(screen.getByLabelText('delete-alert')).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('delete-alert'));
    });
});

const Props = {
    app_screen_widget_id: 484,
    app_id: 26,
    app_screen_id: 103,
    category: ['Extra Value, Value'],
    alert_widget_type: 'KPI',
    source: 'Integrated Demand Forecasting >> Demand Sizing >> INDUSTRY VOLUME 2019',
    widget_value: {
        extra_dir: 'down',
        extra_value: '-2.2% YoY',
        value: '424K Units',
        alert_config: {
            categories: {
                extra_value: { id: 'extra_value', name: 'Extra Value', value: 200 },
                main_value: { id: 'main_value', name: 'Main Value', value: 300 }
            }
        }
    },
    widget_name: 'INDUSTRY VOLUME 2019'
};
