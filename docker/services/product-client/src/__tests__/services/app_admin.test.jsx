import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { create_slug, editAppdetails, getApp, getAppsByName, getKpis } from '../../services/app';
import { addApplication } from '../../services/app_admin';
import { vi } from 'vitest';

vi.mock('../../services/httpClient', () => ({
    get: (url) => {
        const objectives = { data: 'data' };
        return objectives;
    },
    post: (url) => {
        const objectives = { data: {} };
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

vi.mock('../../services/app_admin', () => {
    return {
        addApplication: vi.fn().mockResolvedValue({ data: 'data' })
    };
});
describe('Codex Product test: src/services app_admin.js', () => {
    afterEach(cleanup);
    test('Services: addApplication', async () => {
        const cb = vi.fn();
        const params = { callback: cb, payload: { data: {} } };
        const res = await expect(addApplication(params)).resolves.toStrictEqual({ data: 'data' });
    });
});
