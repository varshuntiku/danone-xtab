import { createSlice } from '@reduxjs/toolkit';
import {
    getDeployedLLMs,
    getBaseModels,
    getFinetunedModels,
    getDeployedLLMById,
    getLLMApprovalRequests,
    getFinetuningApprovalRequests,
    getFinetunedModelById,
    getAllExperiments
} from 'store';
import { getHuggingFaceModels, getTasks } from 'store/thunks/llmWorkbenchThunk';

const initialState = {
    deployedLLM: {
        data: [],
        total: 0,
        headers: null,
        activeModel: null
    },
    baseModel: {
        data: [],
        total: 0,
        headers: null
    },
    fineTunedModel: {
        data: [],
        total: null,
        headers: null
    },
    approveModel: {
        data: [],
        total: 0,
        headers: null,
        activeModel: null
    },
    experiments: {
        data: [],
        total: 0,
        headers: null
    },
    importedModel: {
        huggingFace: {
            tasks: null,
            models: null,
            total: 0
        },
        filters: {
            task: ''
        },
        loadingModels: false
    },
    loading: true
};

const formatData = (items) =>
    items.map((item) => ({
        ...item,
        created_at: new Date(item.created_at).toLocaleDateString()
    }));

const llmWorkbenchSlice = createSlice({
    name: 'llmWorkbench',
    initialState: initialState,
    reducers: {
        updateSingleDeployedLLMInList: (state, action) => {
            state.deployedLLM.data = state.deployedLLM.data.map((llm) =>
                llm.id === action.payload.id ? action.payload : llm
            );
        },
        resetDeployedLLMList: (state) => {
            state.deployedLLM.data = [];
        },
        resetApprovalList: (state) => {
            state.approveModel.data = [];
        },
        resetBaseModelList: (state) => {
            state.baseModel.data = [];
        },
        resetFinetunedModelList: (state) => {
            state.fineTunedModel.data = [];
        },
        setDeployedLLMHeaders: (state, action) => {
            state.deployedLLM.headers = action.payload;
        },
        setBaseModelsHeaders: (state, action) => {
            state.baseModel.headers = action.payload;
        },
        setFineTunedModelsHeaders: (state, action) => {
            state.fineTunedModel.headers = action.payload;
        },
        setApproveModelHeaders: (state, action) => {
            state.approveModel.headers = action.payload;
        },
        setActiveDeployedModel: (state, action) => {
            state.deployedLLM.activeModel = action.payload;
        },
        resetActiveDeployedModel: (state) => {
            state.deployedLLM.activeModel = null;
        },
        addDeployedModelIdAndJobId: (state, action) => {
            state.deployedLLM.activeModel.id = action.payload.id;
            state.deployedLLM.activeModel.job_id = action.payload.job_id;
            state.deployedLLM.activeModel.job_status = action.payload.job_status;
            state.deployedLLM.activeModel.approval_status = action.payload.approval_status;
        },
        updateDeploymentJobStatus: (state, action) => {
            state.deployedLLM.activeModel.status = action.payload;
        },
        updateFinetuningJobStatus: (state, action) => {
            state.fineTunedModel.activeModel.job_status = action.payload;
        },
        setActiveFinetunedModel: (state, action) => {
            state.fineTunedModel.activeModel = action.payload;
        },
        resetActiveFinetunedModel: (state) => {
            state.fineTunedModel.activeModel = null;
        },
        addFinetunedModelIdAndJobId: (state, action) => {
            state.fineTunedModel.activeModel.id = action.payload.id;
            state.fineTunedModel.activeModel.job_id = action.payload.job_id;
            state.fineTunedModel.activeModel.job_status = action.payload.job_status;
        },
        updateFinetuneJobStatus: (state, action) => {
            state.fineTunedModel.activeModel.job_status = action.payload;
        },
        updateTaskFilter: (state, action) => {
            state.importedModel.filters.task = action.payload;
        },
        setCustomizedModelsTableHeader: (state, action) => {
            state.experiments.headers = action.payload;
        },
        updateExperimentsDataWithNewStatus: (state, action) => {
            // state.experiments.data = action.payload;
            const { data } = state.experiments;
            action.payload?.forEach((item) => {
                const index = data?.findIndex((obj) => obj.id === item.id);
                if (index !== -1) {
                    data[index].status = item.status;
                    state.experiments.data = data;
                }
            });
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getLLMApprovalRequests.pending, (state) => {
                state.loading = true;
            })
            .addCase(getLLMApprovalRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.approveModel.data = formatData(action.payload.data.items);
                state.approveModel.total = action.payload.data.total;
            })
            .addCase(getLLMApprovalRequests.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getFinetuningApprovalRequests.pending, (state) => {
                state.loading = true;
            })
            .addCase(getFinetuningApprovalRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.approveModel.data = formatData(action.payload.data.items);
                state.approveModel.total = action.payload.data.total;
            })
            .addCase(getFinetuningApprovalRequests.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getDeployedLLMs.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDeployedLLMs.fulfilled, (state, action) => {
                state.loading = false;
                state.deployedLLM.data = formatData(action.payload.data.items);
                state.deployedLLM.total = action.payload.data.total;
            })
            .addCase(getDeployedLLMs.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getBaseModels.pending, (state) => {
                state.loading = true;
            })
            .addCase(getBaseModels.fulfilled, (state, action) => {
                try {
                    state.loading = false;
                    state.baseModel.data = formatData(action.payload.data.items);
                    state.baseModel.total = action.payload.data.total;
                } catch (error) {
                    // console.error({ error });
                }
            })
            .addCase(getBaseModels.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getFinetunedModels.pending, (state) => {
                state.loading = true;
            })
            .addCase(getFinetunedModels.fulfilled, (state, action) => {
                state.loading = false;
                state.fineTunedModel.data = formatData(action.payload.data.items);
                state.fineTunedModel.total = action.payload.data.total;
            })
            .addCase(getFinetunedModels.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getDeployedLLMById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDeployedLLMById.fulfilled, (state, action) => {
                state.loading = false;
                state.deployedLLM.activeModel = action.payload.data;
            })
            .addCase(getDeployedLLMById.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getFinetunedModelById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getFinetunedModelById.fulfilled, (state, action) => {
                state.loading = false;
                state.fineTunedModel.activeModel = action.payload.data;
            })
            .addCase(getFinetunedModelById.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getAllExperiments.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllExperiments.fulfilled, (state, action) => {
                state.loading = false;
                state.experiments.data = formatData(action.payload.data.items);
                state.experiments.total = action.payload.data.total;
            })
            .addCase(getAllExperiments.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getHuggingFaceModels.pending, (state) => {
                state.importedModel.loadingModels = true;
            })
            .addCase(getHuggingFaceModels.fulfilled, (state, action) => {
                state.importedModel.loadingModels = false;
                const { data } = action.payload;
                state.importedModel.huggingFace.models = data.models;
                state.importedModel.huggingFace.total = data.numTotalItems;
            })
            .addCase(getHuggingFaceModels.rejected, (state) => {
                state.importedModel.loadingModels = false;
            })
            .addCase(getTasks.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTasks.fulfilled, (state, action) => {
                state.loading = false;
                const { data } = action.payload;
                state.importedModel.huggingFace.tasks = data.tasks;
            })
            .addCase(getTasks.rejected, (state) => {
                state.loading = false;
            });
    }
});

export const {
    setDeployedLLMHeaders,
    setBaseModelsHeaders,
    setFineTunedModelsHeaders,
    resetActiveDeployedModel,
    setActiveDeployedModel,
    addDeployedModelIdAndJobId,
    updateDeploymentJobStatus,
    updateFinetuningJobStatus,
    resetBaseModelList,
    resetDeployedLLMList,
    resetFinetunedModelList,
    setActiveFinetunedModel,
    resetActiveFinetunedModel,
    addFinetunedModelIdAndJobId,
    updateFinetuneJobStatus,
    updateSingleDeployedLLMInList,
    setApproveModelHeaders,
    updateTaskFilter,
    resetApprovalList,
    setCustomizedModelsTableHeader,
    updateExperimentsDataWithNewStatus
} = llmWorkbenchSlice.actions;

export default llmWorkbenchSlice.reducer;
