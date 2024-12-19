import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import {
    getWidgets,
    triggerActionHandler,
    getScreenUserGuide,
    saveScreenUserGuide,
    updateScreenUserGuide
} from '../../services/screen';
import { vi } from 'vitest';
import { test } from 'vitest';
vi.mock('../../services/httpClient', async () => {
    return {
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
vi.mock('../../services/screen', async () => {
    return {
        triggerActionHandler: vi.fn().mockResolvedValue({ data: 'data' }),
        getWidgets: vi.fn().mockResolvedValue({ data: 'data' }),
        getScreenUserGuide: vi.fn().mockResolvedValue({ data: 'data' }),
        saveScreenUserGuide: vi.fn().mockResolvedValue({ data: 'data' }),
        updateScreenUserGuide: vi.fn().mockResolvedValue({ data: 'data' })
    };
});

describe('Codex Product test: src/services screen.js', () => {
    afterEach(cleanup);
    test('Services: getWidgets', async () => {
        const cb = vi.fn((data) => {});
        const params = { callback: cb };
        const res = await expect(getWidgets(params)).resolves.toStrictEqual({ data: 'data' });
    });

    test('Services: triggerActionHandler', async () => {
        const cb = vi.fn((data) => {});
        const params = { callback: cb };
        const res = await expect(triggerActionHandler(params)).resolves.toStrictEqual({
            data: 'data'
        });
    });

    test('Services: getScreenUSerGuide', async () => {
        const cb = vi.fn((data) => {});
        const params = { callback: cb };
        const res = await expect(getScreenUserGuide(params)).resolves.toStrictEqual({
            data: 'data'
        });
    });

    test('Services: saveScreenUserGuide', async () => {
        const cb = vi.fn((data) => {});
        const params = { callback: cb };
        const res = await expect(saveScreenUserGuide(params)).resolves.toStrictEqual({
            data: 'data'
        });
    });

    test('Services: updateScreenUserGuide', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(updateScreenUserGuide(params)).resolves.toStrictEqual({
            data: 'data'
        });
    });
});
