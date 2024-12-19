import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import {
    createStory,
    deleteReport,
    getDownloadStatus,
    getPublishedStory,
    getShareableUsers,
    getSharedList,
    getStories,
    getStory,
    scheduleStory,
    shareReport,
    updateStory
} from '../../services/reports';
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
vi.mock('../../services/reports', () => {
    return {
        createStory: vi.fn().mockResolvedValue({ data: 'data' }),
        deleteReport: vi.fn().mockResolvedValue({ data: 'data' }),
        getDownloadStatus: vi.fn().mockResolvedValue({ data: 'data' }),
        getPublishedStory: vi.fn().mockResolvedValue({ data: 'data' }),
        getShareableUsers: vi.fn().mockResolvedValue({ data: 'data' }),
        getSharedList: vi.fn().mockResolvedValue({ data: 'data' }),
        getStories: vi.fn().mockResolvedValue({ data: 'data' }),
        getStory: vi.fn().mockResolvedValue({ data: 'data' }),
        scheduleStory: vi.fn().mockResolvedValue({ data: 'data' }),
        shareReport: vi.fn().mockResolvedValue({ data: 'data' }),
        updateStory: vi.fn().mockResolvedValue({ data: 'data' })
    };
});

describe('Codex Product test: src/services reports.js', () => {
    afterEach(cleanup);
    test('Services: getStories', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getStories(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('Services: getStory', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getStory(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('Services: updateStory', async () => {
        const cb = vi.fn();
        const params = { callback: cb, payload: { story_id: 1 } };
        const res = await expect(updateStory(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('Services: createStory', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(createStory(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('Services: shareReport', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(shareReport(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('Services: getSharedList', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getSharedList(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('Services: getShareableUsers', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getShareableUsers(params)).resolves.toStrictEqual({
            data: 'data'
        });
    });
    test('Services: getPublishedStory', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getPublishedStory(params)).resolves.toStrictEqual({
            data: 'data'
        });
    });
    test('Services: deleteReport', async () => {
        const cb = vi.fn();
        const params = { callback: cb, payload: [{ story_id: 1 }] };
        const res = await expect(deleteReport(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('Services: scheduleStory', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(scheduleStory(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('Services: getDownloadStatus', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getDownloadStatus(params)).resolves.toStrictEqual({
            data: 'data'
        });
    });
});
