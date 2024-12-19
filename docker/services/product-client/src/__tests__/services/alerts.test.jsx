import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import {
    createAlert,
    deleteAlert,
    getAlerts,
    getAlertsByWidget,
    updateAlert,
    updateAlertNotification,
    getNotifications,
    updateNotificationRead,
    markAllNotificationRead,
    getFilteredNotifications,
    getJwtTokenByUser,
    deleteUserToken
} from '../../services/alerts';
import { vi } from 'vitest';

vi.mock('../../services/httpClient', () => ({
    get: (url) => {
        const objectives = { data: 'data' };
        return objectives;
    },
    post: (url) => {
        const objectives = { data: 'data' };
        return objectives;
    },
    put: (url) => {
        const objectives = { data: 'data' };
        return objectives;
    },
    delete: (url) => {
        const objectives = { data: 'data' };
        return objectives;
    }
}));

vi.mock('../../services/alerts', () => {
    return {
        createAlert: vi.fn().mockResolvedValue({ data: 'data' }),
        deleteAlert: vi.fn().mockResolvedValue({ data: 'data' }),
        getAlerts: vi.fn().mockResolvedValue({ data: 'data' }),
        getAlertsByWidget: vi.fn().mockResolvedValue({ data: 'data' }),
        updateAlert: vi.fn().mockResolvedValue({ data: 'data' }),
        updateAlertNotification: vi.fn().mockResolvedValue({ data: 'data' }),
        getNotifications: vi.fn().mockResolvedValue({ data: 'data' }),
        updateNotificationRead: vi.fn().mockResolvedValue({ data: 'data' }),
        markAllNotificationRead: vi.fn().mockResolvedValue({ data: 'data' }),
        getFilteredNotifications: vi.fn().mockResolvedValue({ data: 'data' }),
        getJwtTokenByUser: vi.fn().mockResolvedValue({ data: 'data' }),
        deleteUserToken: vi.fn().mockResolvedValue({ data: 'data' })
    };
});

describe('Codex Product test: src/services alerts.js', () => {
    afterEach(cleanup);
    test('Services: createAlert', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(createAlert(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('Services: getAlerts', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getAlerts(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('Services: getAlertsByWidget', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getAlertsByWidget(params)).resolves.toStrictEqual({
            data: 'data'
        });
    });
    test('Services: updateAlert', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(updateAlert(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('Services: deleteAlert', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(deleteAlert(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('Services: updateAlertNotification', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(updateAlertNotification(params)).resolves.toStrictEqual({
            data: 'data'
        });
    });
    test('Services: getNotifications', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getNotifications(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('Services: updateNotificationRead', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(updateNotificationRead(params)).resolves.toStrictEqual({
            data: 'data'
        });
    });
    test('Services: markAllNotificationRead', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(markAllNotificationRead(params)).resolves.toStrictEqual({
            data: 'data'
        });
    });
    test('Services: getFilteredNotifications', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getFilteredNotifications(params)).resolves.toStrictEqual({
            data: 'data'
        });
    });
    test('Services: getJwtTokenByUser', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getJwtTokenByUser(params)).resolves.toStrictEqual({
            data: 'data'
        });
    });

    test('Services: deleteUserToken', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(deleteUserToken(params)).resolves.toStrictEqual({ data: 'data' });
    });
});
