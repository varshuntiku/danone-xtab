import { createAsyncThunk } from '@reduxjs/toolkit';
import httpClient from 'services/httpClient';
import { toPng } from 'html-to-image';
import { setPopUp } from 'store';

const SOLUTION_BP_BASE_URL = import.meta.env['REACT_APP_SOLUTION_BP_ENV_BASE_URL'];

export const getDirectoryTree = createAsyncThunk(
    'solutionBluePrint/getDirectoryTree',
    async ({ rejectWithValue }) => {
        try {
            return await httpClient.get(`${SOLUTION_BP_BASE_URL}/solution-bp/get-golden-bp`, {});
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const importBluePrints = createAsyncThunk(
    'solutionBluePrint/importBluePrints',
    async ({ projectId, payload, is_download, rejectWithValue }) => {
        const url = is_download
            ? `${SOLUTION_BP_BASE_URL}/solution-bp/import`
            : `${SOLUTION_BP_BASE_URL}/solution-bp/import?project_id=${projectId}`;
        try {
            return await httpClient.post(url, payload);
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const onLoadBlueprint = createAsyncThunk(
    'solutionBluePrint/onLoadBlueprint',
    async ({ projectId, rejectWithValue }) => {
        try {
            return await httpClient.get(`${SOLUTION_BP_BASE_URL}/solution-bp/${projectId}`, {});
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const onSaveBlueprints = createAsyncThunk(
    'solutionBluePrint/onSaveBlueprints',
    async ({ payload, rejectWithValue }) => {
        try {
            return await httpClient.post(`${SOLUTION_BP_BASE_URL}/solution-bp/save`, payload);
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const onLoadDefaultBlueprint = createAsyncThunk(
    'solutionBluePrint/onLoadDefaultBlueprint',
    async ({ projectId, payload, rejectWithValue }) => {
        try {
            return await httpClient.post(
                `${SOLUTION_BP_BASE_URL}/solution-bp/default/${projectId}`,
                payload
            );
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const getSaasZipLink = createAsyncThunk(
    'solutionBluePrint/getSaasZipLink',
    async ({ payload, callback, rejectWithValue }) => {
        try {
            await httpClient.post(`${SOLUTION_BP_BASE_URL}/solution-bp/sas-zip-link`, payload, {
                headers: {
                    Accept: 'text/event-stream'
                },
                onDownloadProgress: (evt) => {
                    let data = evt?.target?.responseText;
                    const dataSplit = data?.split('\n').filter((item) => item !== '');
                    const recentData = dataSplit?.[dataSplit?.length - 1];
                    data = JSON.parse(recentData?.substring(5));
                    callback({ data });
                }
            });
            return true;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const downloadAsZip = (callback) => async (dispatch, getState) => {
    const state = getState().solutionBluePrint;
    const element = document.querySelector('.react-flow');
    element.classList.add('download-mode');
    let visual_graph = {
        nodes: [...state.current_bp_State.react_flow_data.available_nodes],
        edges: [...state.current_bp_State.react_flow_data.initial_edges]
    };
    visual_graph = JSON.stringify(visual_graph);
    const nodes = JSON.stringify(state.import_action_list);

    try {
        const dataUrl = await toPng(element, {
            backgroundColor:
                localStorage.getItem('codx-products-theme') === 'light' ? 'white' : 'black'
        });

        element.classList.remove('download-mode');

        const response = await fetch(dataUrl);
        const blob = await response.blob();

        const formData = new FormData();
        formData.append('image', blob, 'solution_blueprint_image.png');
        formData.append('nodes', nodes);
        formData.append('visual_graph', visual_graph);
        if (callback) callback(formData);
    } catch (error) {
        dispatch(
            setPopUp({
                open: true,
                message: 'Failed to Export...!',
                severity: 'error'
            })
        );
    }
};

export const downloadAsPng = createAsyncThunk(
    'solutionBluePrint/downloadAsPng',
    async ({ payload, rejectWithValue }) => {
        try {
            return await httpClient.post(
                `${SOLUTION_BP_BASE_URL}/solution-bp/sas-zip-link`,
                payload
            );
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
