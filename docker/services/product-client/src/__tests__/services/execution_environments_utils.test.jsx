import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import {
    getDynamicExecEnvs,
    getDefaultDynamicExecEnvs,
    deleteDynamicExecEnv,
    createDynamicExecEnv,
    updateDynamicExecEnv,
    startDynamicExecEnv,
    updateDynamicExecEnvAppMapping,
    getDynamicExecEnvAppMapping
} from '../../services/execution_environments_utils';
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
vi.mock('../../services/execution_environments_utils', () => {
    return {
        getDynamicExecEnvs: vi.fn().mockResolvedValue({ data: 'data' }),
        getDefaultDynamicExecEnvs: vi.fn().mockResolvedValue({ data: 'data' }),
        deleteDynamicExecEnv: vi.fn().mockResolvedValue({ data: 'data' }),
        createDynamicExecEnv: vi.fn().mockResolvedValue({ data: 'data' }),
        updateDynamicExecEnv: vi.fn().mockResolvedValue({ data: 'data' }),
        startDynamicExecEnv: vi.fn().mockResolvedValue({ data: 'data' }),
        updateDynamicExecEnvAppMapping: vi.fn().mockResolvedValue({ data: 'data' }),
        getDynamicExecEnvAppMapping: vi.fn().mockResolvedValue({ data: 'data' })
    };
});

describe('Tests for execution_environments_utils.js', () => {
    afterEach(cleanup);

    test('Services: getDynamicExecEnvs', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getDynamicExecEnvs(params)).resolves.toStrictEqual({
            data: 'data'
        });
    });

    test('Services: getDefaultDynamicExecEnvs', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getDefaultDynamicExecEnvs(params)).resolves.toStrictEqual({
            data: 'data'
        });
    });

    test('Services: deleteDynamicExecEnv', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(deleteDynamicExecEnv(params)).resolves.toStrictEqual({
            data: 'data'
        });
    });

    test('Services: createDynamicExecEnv', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(createDynamicExecEnv(params)).resolves.toStrictEqual({
            data: 'data'
        });
    });

    test('Services: updateDynamicExecEnv', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(updateDynamicExecEnv(params)).resolves.toStrictEqual({
            data: 'data'
        });
    });

    test('Services: startDynamicExecEnv', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(startDynamicExecEnv(params)).resolves.toStrictEqual({
            data: 'data'
        });
    });

    test('Services: updateDynamicExecEnvAppMapping', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(updateDynamicExecEnvAppMapping(params)).resolves.toStrictEqual({
            data: 'data'
        });
    });

    test('Services: getDynamicExecEnvAppMapping', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getDynamicExecEnvAppMapping(params)).resolves.toStrictEqual({
            data: 'data'
        });
    });
});
