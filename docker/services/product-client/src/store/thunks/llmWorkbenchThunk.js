import { createAsyncThunk } from '@reduxjs/toolkit';
import httpClient from 'services/httpClient';
import {
    debouncedGetAllBaseModels,
    debouncedGetAllDeployedModels,
    debouncedGetAllExperiments,
    debouncedGetAllFineTunedModels,
    debouncedGetFineTunedModelById
} from 'services/llmWorkbench/llm-workbench';

const BASE_URL = import.meta.env['REACT_APP_GENAI'];

export const getDeployedLLMs = createAsyncThunk(
    'llmWorkbench/getDeployedLLMs',
    async (params, { rejectWithValue }) => {
        try {
            return await debouncedGetAllDeployedModels({ ...params, approval_status: 'approved' });
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const getDeployedLLMById = createAsyncThunk(
    'llmWorkbench/getDeployedLLMById',
    async (id, { rejectWithValue }) => {
        try {
            return await httpClient.get(
                `${BASE_URL}/services/llm-workbench/deployments/${id}/details`
            );
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const getBaseModels = createAsyncThunk(
    'llmWorkbench/getBaseModels',
    async (params, { rejectWithValue }) => {
        try {
            const base = await debouncedGetAllBaseModels(params);
            return base;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const getFinetunedModels = createAsyncThunk(
    'llmWorkbench/getFinetunedModels',
    async (params, { rejectWithValue }) => {
        try {
            return await debouncedGetAllFineTunedModels(params);
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const getLLMApprovalRequests = createAsyncThunk(
    'llmWorkbench/getLLMApprovalRequests',
    async (params, { rejectWithValue }) => {
        try {
            return await debouncedGetAllDeployedModels({ ...params, approval_status: 'pending' });
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const getFinetuningApprovalRequests = createAsyncThunk(
    'llmWorkbench/getFinetuningApprovalRequests',
    async (params, { rejectWithValue }) => {
        try {
            return await debouncedGetAllFineTunedModels({ ...params, is_pending: true });
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const getFinetunedModelById = createAsyncThunk(
    'llmWorkbench/getFinetunedModelById',
    async (modelId, { rejectWithValue }) => {
        try {
            return await debouncedGetFineTunedModelById(modelId);
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const getTasks = createAsyncThunk(
    'llmworkbench/getTasks',
    async (params, { rejectWithValue }) => {
        //parms => {search: ''}
        try {
            return await httpClient.get(
                `${BASE_URL}/services/import-models/hugging-face-models/tasks`,
                {
                    params
                }
            );
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const getHuggingFaceModels = createAsyncThunk(
    'llmworkbench/getHuggingFaceModels',
    async (params, { rejectWithValue }) => {
        //params => {task: '', search: '',page: 0, sort: 'Trending'}
        try {
            return await httpClient.get(
                `${BASE_URL}/services/import-models/hugging-face-models/models`,
                {
                    params
                }
            );
        } catch (err) {
            rejectWithValue(err.response.data);
        }
    }
);

export const getAllExperiments = createAsyncThunk(
    'llmworkbench/getAllExperiments',
    async (params, { rejectWithValue }) => {
        try {
            return await debouncedGetAllExperiments(params);
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
    // async (params, { rejectWithValue }) => {
    //     // getAllExperiments(params);
    //     const data = {
    //         data: {
    //             items: [
    //                 {
    //                     id: 1,
    //                     name: 'Exp-1',
    //                     description: 'Description',
    //                     problem_type: 'OpenQA',
    //                     base_model_id: 'Mistral',
    //                     gpu: 'A100',
    //                     training_config: 'Config details',
    //                     created_at: '2023-12-06 17:01:48.125 +0530',
    //                     status: 'Completed'
    //                 }
    //             ]
    //         }
    //     };
    //     return new Promise((resolve, reject) => resolve(data));
    // }
);
