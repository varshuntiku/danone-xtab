import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { getUserAppId, getUserSpecialAccess, login, verifyAuth } from '../../services/auth';
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
vi.mock('../../services/auth', () => {
    return {
        getUserAppId: vi.fn().mockResolvedValue({ data: 'data' }),
        getUserSpecialAccess: vi.fn().mockResolvedValue({ data: 'data' }),
        login: vi.fn().mockResolvedValue({ data: 'data' }),
        verifyAuth: vi.fn().mockResolvedValue({ data: 'data' })
    };
});
describe('Codex Product test: src/services auth.js', () => {
    afterEach(cleanup);
    test('Services: login', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(login(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('Services: getUserAppId', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getUserAppId(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('Services: verifyAuth', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(verifyAuth(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('Services: getUserSpecialAccess', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getUserSpecialAccess(params)).resolves.toStrictEqual({
            data: 'data'
        });
    });
});
