import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import NotificationWorkspace from '../../../components/alert-dialog/NotificationWorkspace';
import { Provider } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { vi } from 'vitest';

vi.mock('store/index', () => ({
    setNotifications: vi.fn()
}));

vi.mock('store/store', () => ({
    store: vi.fn()
}));

vi.mock('../../../services/alerts', () => ({
    markAllNotificationRead: vi.fn(),
    getFilteredNotifications: vi.fn()
}));

global.structuredClone = vi.fn((val) => {
    return JSON.parse(JSON.stringify(val));
});

const history = createMemoryHistory();

const store = configureStore({
    reducer: createSlice({
        name: 'notifications',
        initialState: {
            notificationData: {
                count: 1,
                notifications: [
                    {
                        alert_id: 238,
                        app_id: 26,
                        id: 316,
                        is_read: false,
                        title: 'Notification title',
                        message: 'Custom Notification Message for industry alert 1',
                        triggered_at: { $date: 1646131909320 },
                        widget_id: 484,
                        widget_name: 'Industry Volume 2019',
                        shared_by: null
                    },
                    {
                        alert_id: 239,
                        app_id: 26,
                        id: 317,
                        is_read: true,
                        title: 'Notification title 1',
                        message: 'Custom Notification Message for industry alert 2',
                        triggered_at: { $date: 1650131909320 },
                        widget_id: 484,
                        widget_name: 'Industry Volume 2019',
                        shared_by: null
                    },
                    {
                        alert_id: 240,
                        app_id: 26,
                        id: 318,
                        is_read: true,
                        title: 'Notification title 2',
                        message: 'Custom Notification Message for industry alert 2',
                        triggered_at: { $date: 1654131909320 },
                        widget_id: 484,
                        widget_name: 'Industry Volume 2019',
                        shared_by: 'test.user@test.com'
                    }
                ],
                platformCount: 0,
                platformNotifications: []
            }
        }
    }).reducer
});

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render NotificationWorkspace Component', () => {
        const { getByText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <NotificationWorkspace {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.getByText('All Notifications')).toBeInTheDocument();
    });

    test('Should render notification rows', () => {
        const prop = {
            count: 1,
            notifications: [
                {
                    alert_id: 238,
                    app_id: 26,
                    id: 316,
                    is_read: false,
                    title: 'Notification title',
                    message: 'Custom Notification Message for industry alert 1',
                    triggered_at: { $date: 1646131909320 },
                    widget_id: 484,
                    widget_name: 'Industry Volume 2019',
                    shared_by: null
                },
                {
                    alert_id: 239,
                    app_id: 26,
                    id: 317,
                    is_read: true,
                    title: 'Notification title 1',
                    message: 'Custom Notification Message for industry alert 2',
                    triggered_at: { $date: 1650131909320 },
                    widget_id: 484,
                    widget_name: 'Industry Volume 2019',
                    shared_by: null
                },
                {
                    alert_id: 240,
                    app_id: 26,
                    id: 318,
                    is_read: true,
                    title: 'Notification title 2',
                    message: 'Custom Notification Message for industry alert 2',
                    triggered_at: { $date: 1654131909320 },
                    widget_id: 484,
                    widget_name: 'Industry Volume 2019',
                    shared_by: 'test.user@test.com'
                }
            ],
            platformCount: 0,
            platformNotifications: []
        };

        const { getByText, debug, getByLabelText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <NotificationWorkspace {...Props1} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(store.dispatch({ type: 'setNotifications', notificationData: prop }));
        expect(screen.getByText('Notification title 2')).toBeInTheDocument();
    });
});

const Props = {
    app_info: {},
    width: 'sm'
};
const Props1 = {
    app_info: {
        id: 26
    },
    width: 'xs'
};
