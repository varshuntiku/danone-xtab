import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { getDynamicfilters, getFilters } from '../../services/filters';
import { vi } from 'vitest';

vi.mock('../../services/filters', async () => {
    const functions = await vi.importActual('../../services/filters');
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
vi.mock('../../services/filters', () => {
    return {
        getDynamicfilters: vi.fn().mockResolvedValue({ data: 'data' }),
        getFilters: vi.fn().mockResolvedValue({ data: 'data' })
    };
});

describe('Codex Product test: src/services filters.js', () => {
    afterEach(cleanup);
    test('Services: getFilters', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getFilters(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('Services: getDynamicfilters', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getDynamicfilters(params)).resolves.toStrictEqual({
            data: 'data'
        });
    });
});
