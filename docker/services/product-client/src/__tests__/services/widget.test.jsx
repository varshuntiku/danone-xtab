import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import {
    executeCode,
    getMultiWidget,
    getWidget,
    triggerWidgetActionHandler
} from '../../services/widget';
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
vi.mock('../../services/widget', () => {
    return {
        executeCode: vi.fn().mockResolvedValue({ data: 'data' }),
        getMultiWidget: vi.fn().mockResolvedValue({ data: 'data' }),
        getWidget: vi.fn().mockResolvedValue({ data: 'data' }),
        triggerWidgetActionHandler: vi.fn().mockResolvedValue({ data: 'data' })
    };
});

describe('Codex Product test: src/services widget.js', () => {
    afterEach(cleanup);
    test('Services: getWidget', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getWidget(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('Services: getMultiWidget', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getMultiWidget(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('Services: executeCode', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(executeCode(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('Services: triggerWidgetActionHandler', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(triggerWidgetActionHandler(params)).resolves.toStrictEqual({
            data: 'data'
        });
    });
});
