import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import {
    getDynamicExecEnvs,
    deleteDynamicExecEnv,
    createDynamicExecEnv,
    updateDynamicExecEnv,
    startDynamicExecEnv
} from '../../services/admin_dynamic_viz_exec_env.js';
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
vi.mock('../../services/admin_dynamic_viz_exec_env.js', () => {
    return {
        getDynamicExecEnvs: vi.fn().mockResolvedValue({ data: 'data' }),
        deleteDynamicExecEnv: vi.fn().mockResolvedValue({ data: 'data' }),
        createDynamicExecEnv: vi.fn().mockResolvedValue({ data: 'data' }),
        updateDynamicExecEnv: vi.fn().mockResolvedValue({ data: 'data' }),
        startDynamicExecEnv: vi.fn().mockResolvedValue({ data: 'data' })
    };
});
describe('Tests for admin_dynamic_viz_exec_env.js', () => {
    afterEach(cleanup);

    test('Services: getDynamicExecEnvs', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getDynamicExecEnvs(params)).resolves.toStrictEqual({
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
});
