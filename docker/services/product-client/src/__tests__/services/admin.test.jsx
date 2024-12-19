import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import {
    createProject,
    downloadBlueprintCode,
    fileDownloadRequest,
    getAdminDetails,
    getAdminDetailsFromId,
    getAjaxProjects,
    getArtifactsData,
    getDesignData,
    getDesignModulesData,
    getIterationResultOptionsFromDeployedAppId,
    getIterationResultOptionsFromNotebookId,
    getIterationResults,
    getIterations,
    getIterationTags,
    getWidgetCode,
    getWidgetComponents,
    getWidgetData,
    saveProjectBlueprint
} from '../../services/admin';
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
vi.mock('../../services/admin', () => {
    return {
        createProject: vi.fn().mockResolvedValue({ data: 'data' }),
        downloadBlueprintCode: vi.fn().mockResolvedValue({ data: 'data' }),
        fileDownloadRequest: vi.fn().mockResolvedValue({ data: 'data' }),
        getAdminDetails: vi.fn().mockResolvedValue({ data: 'data' }),
        getAdminDetailsFromId: vi.fn().mockResolvedValue({ data: 'data' }),
        getAjaxProjects: vi.fn().mockResolvedValue({ data: 'data' }),
        getArtifactsData: vi.fn().mockResolvedValue({ data: 'data' }),
        getDesignData: vi.fn().mockResolvedValue({ data: 'data' }),
        getDesignModulesData: vi.fn().mockResolvedValue({ data: 'data' }),
        getIterationResultOptionsFromDeployedAppId: vi.fn().mockResolvedValue({ data: 'data' }),
        getIterationResultOptionsFromNotebookId: vi.fn().mockResolvedValue({ data: 'data' }),
        getIterationResults: vi.fn().mockResolvedValue({ data: 'data' }),
        getIterations: vi.fn().mockResolvedValue({ data: 'data' }),
        getIterationTags: vi.fn().mockResolvedValue({ data: 'data' }),
        getWidgetCode: vi.fn().mockResolvedValue({ data: 'data' }),
        getWidgetComponents: vi.fn().mockResolvedValue({ data: 'data' }),
        getWidgetData: vi.fn().mockResolvedValue({ data: 'data' }),
        saveProjectBlueprint: vi.fn().mockResolvedValue({ data: 'data' })
    };
});
describe('Codex Product test: src/services admin.js', () => {
    afterEach(cleanup);
    test('services: getDesignData', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getDesignData(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('services: getAjaxProjects', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getAjaxProjects(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('services: saveProjectBlueprint', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(saveProjectBlueprint(params)).resolves.toStrictEqual({
            data: 'data'
        });
    });
    test('services: createProject', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(createProject(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('services: getIterationTags', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getIterationTags(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('services: getIterations', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getIterations(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('services: getIterationResults', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getIterationResults(params)).resolves.toStrictEqual({
            data: 'data'
        });
    });
    test('services: getWidgetData', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getWidgetData(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('services: getArtifactsData', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getArtifactsData(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('services: getDesignModulesData', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getDesignModulesData(params)).resolves.toStrictEqual({
            data: 'data'
        });
    });
    test('services: getAdminDetails', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getAdminDetails(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('services: getAdminDetailsFromId', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getAdminDetailsFromId(params)).resolves.toStrictEqual({
            data: 'data'
        });
    });
    test('services: getIterationResultOptionsFromNotebookId', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(
            getIterationResultOptionsFromNotebookId(params)
        ).resolves.toStrictEqual({ data: 'data' });
    });
    test('services: getIterationResultOptionsFromDeployedAppId', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(
            getIterationResultOptionsFromDeployedAppId(params)
        ).resolves.toStrictEqual({ data: 'data' });
    });
    test('services: downloadBlueprintCode', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(downloadBlueprintCode(params)).resolves.toStrictEqual({
            data: 'data'
        });
    });
    test('services: getWidgetComponents', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getWidgetComponents(params)).resolves.toStrictEqual({
            data: 'data'
        });
    });
    test('services: getWidgetCode', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(getWidgetCode(params)).resolves.toStrictEqual({ data: 'data' });
    });
    test('services: fileDownloadRequest', async () => {
        const cb = vi.fn();
        const params = { callback: cb };
        const res = await expect(fileDownloadRequest(params)).resolves.toStrictEqual({
            data: 'data'
        });
    });
});
