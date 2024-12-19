import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { create_slug, editAppdetails, getApp, getAppsByName, getKpis } from '../../services/app';
import { vi } from 'vitest';

vi.mock('../../services/httpClient', () => ({
    get: (url) => {
        if (url.endsWith('/app/1')) {
            return {
                data: {}
            };
        }
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
vi.mock('../../services/app', () => {
    return {
        create_slug: vi.fn().mockResolvedValue({ data: 'data' }),
        editAppdetails: vi.fn().mockResolvedValue({ data: 'data' }),
        getApp: vi.fn().mockResolvedValue({ data: 'data' }),
        getAppsByName: vi.fn().mockResolvedValue({ data: 'data' }),
        getKpis: vi.fn().mockResolvedValue({ data: 'data' })
    };
});
describe('Codex Product test: src/services app.js', () => {
    afterEach(cleanup);
    test('Services: getApp', async () => {
        const cb = vi.fn();
        const params = { callback: cb, app_id: 1, goto_app: 1 };
        const res = await expect(getApp(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('Services: getAppsByName', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getApp(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('Services: editAppdetails', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(editAppdetails(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('Services: create_slug', async () => {
        const params = null;
        const res = await expect(create_slug(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('Services: getKpis', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getKpis(params)).resolves.toStrictEqual({ data: 'data' });
    });
});
