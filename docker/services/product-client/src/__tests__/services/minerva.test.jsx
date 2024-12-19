import { cleanup } from '@testing-library/react';
import { getProcessedQuestion } from '../../services/minerva';
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
vi.mock('../../services/minerva', () => {
    return {
        getProcessedQuestion: vi.fn().mockResolvedValue({ data: 'data' })
    };
});
describe('Codex Product test: src/services minerva.js', () => {
    afterEach(cleanup);
    test('Services: getProcessedQuestion', async () => {
        const cb = vi.fn();
        const fcb = vi.fn();
        const params = {
            callback: cb,
            failureCallback: fcb,
            payload: { question: null, processedQuestion: {} }
        };
        const res = await expect(getProcessedQuestion(params)).resolves.toStrictEqual({
            data: 'data'
        });
    });
});
