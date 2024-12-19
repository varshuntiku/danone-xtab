import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import {
    createFunction,
    createIndustry,
    deleteFunction,
    deleteIndustry,
    getAllApps,
    getApps,
    getFunctionsList,
    getIndustriesList,
    updateFunction,
    updateIndustry,
    getDashboardByIndustryId
} from '../../services/dashboard';
import { vi } from 'vitest';
import { createFactory } from 'react';

vi.mock('../../services/httpClient', async () => {
    const functions = await vi.importActual('../../services/httpClient');
    return {
        ...functions,
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
    };
});
vi.mock('../../services/dashboard', () => {
    return {
        createFunction: vi.fn().mockResolvedValue({ data: 'data' }),
        createIndustry: vi.fn().mockResolvedValue({ data: 'data' }),
        deleteFunction: vi.fn().mockResolvedValue({ data: 'data' }),
        deleteIndustry: vi.fn().mockResolvedValue({ data: 'data' }),
        getAllApps: vi.fn().mockResolvedValue({ data: 'data' }),
        getApps: vi.fn().mockResolvedValue({ data: 'data' }),
        getFunctionsList: vi.fn().mockResolvedValue({ data: 'data' }),
        getIndustriesList: vi.fn().mockResolvedValue({ data: 'data' }),
        updateFunction: vi.fn().mockResolvedValue({ data: 'data' }),
        updateIndustry: vi.fn().mockResolvedValue({ data: 'data' }),
        getDashboardByIndustryId: vi.fn().mockResolvedValue({ data: 'data' })
    };
});
describe('Codex Product test: src/services dashboard.js', () => {
    afterEach(cleanup);
    test('Services: getApps', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getApps(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('Services: getAllApps', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getAllApps(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('Services: getFunctionsList', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getFunctionsList(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('Services: getIndustriesList', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getIndustriesList(params)).resolves.toStrictEqual({
            data: 'data'
        });
    });
    test('Services: createIndustry', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(createIndustry(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('Services: updateIndustry', async () => {
        const cb = vi.fn();
        const params = { callback: cb, payload: { id: 1 } };
        const res = await expect(updateIndustry(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('Services: deleteIndustry', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(deleteIndustry(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('Services: createFunction', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(createFunction(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('Services: updateFunction', async () => {
        const cb = vi.fn();
        const params = { callback: cb, payload: { function_id: 1 } };
        const res = await expect(updateFunction(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('Services: deleteFunction', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(deleteFunction(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('Services: getDashboardByIndustryId', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getDashboardByIndustryId(params)).resolves.toStrictEqual({
            data: 'data'
        });
    });
});
