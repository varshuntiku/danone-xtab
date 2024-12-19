import httpClient from 'services/httpClient.js';
import _ from 'underscore';

const BASE_URL = import.meta.env['REACT_APP_GENAI'];

export const getTableHeader = async (payload) => {
    try {
        const response = await httpClient.get(
            `${BASE_URL}/services/ml-models/table-configurations/${payload}`
        );
        return response.data;
    } catch (error) {
        return error;
    }
};

export const debouncedGetTableHeader = _.debounce(getTableHeader, 500, true);

export const getCustomTableHeader = () => {
    return [
        {
            id: 'name',
            label: 'Experiment Name',
            enableSorting: false,
            enableSearching: true,
            component: null
        },
        // {
        //     id: 'description',
        //     label: 'Experiment Description',
        //     enableSorting: false,
        //     enableSearching: false,
        //     component: null
        // },
        {
            id: 'problem_type',
            label: 'Problem Type',
            enableSorting: false,
            enableSearching: false,
            component: null
        },
        {
            id: 'base_model',
            label: 'Base Model',
            enableSorting: false,
            enableSearching: false,
            component: null
        },
        {
            id: 'gpu',
            label: 'GPU',
            enableSorting: false,
            enableSearching: false,
            component: null
        },
        {
            id: 'training_config',
            label: 'Training_config',
            enableSorting: false,
            enableSearching: false,
            component: null
        },
        {
            id: 'created_at',
            label: 'Created Time',
            enableSorting: false,
            enableSearching: false,
            component: null
        },
        {
            id: 'status',
            label: 'Status',
            enableSorting: false,
            enableSearching: false,
            component: null
        },
        {
            id: 'actions',
            label: 'Actions',
            enableSorting: false,
            enableSearching: false,
            component: null
        }
    ];
};

export const getDeployedModels = (params) =>
    httpClient.get(`${BASE_URL}/services/ml-models/deployed/models`, {
        params
    });

export const executeDeployModel = ({ id, execution_type }) =>
    httpClient.patch(`${BASE_URL}/services/llm-workbench/deployments/execute`, {
        id,
        execution_type
    });

export const deployLLMModel = async (params) => {
    return await httpClient.post(`${BASE_URL}/services/llm-workbench/deployments`, params);
};

export const updateLLMModel = async (params) => {
    return await httpClient.put(`${BASE_URL}/services/ml-models/deployed/models`, params);
};

export const deleteDeployedLLMModel = async (id) => {
    return await httpClient.delete(`${BASE_URL}/services/ml-models/deployed/${id}`);
};

export const getJobDetailsByUuid = async (job_id) => {
    return httpClient.get(`${BASE_URL}/services/ml-models/model-jobs/${job_id}/details`);
};

export const checkIfUniqueDeploymentName = async (params) => {
    return httpClient.post(`${BASE_URL}/services/ml-models/deployed/validate-form`, params);
};

export const getAllBaseModels = (params) =>
    httpClient.get(`${BASE_URL}/services/llm-workbench/models`, {
        params
    });

export const debouncedGetAllBaseModels = _.debounce(getAllBaseModels, 500, true);

export const getAllFineTunedModels = (params) =>
    httpClient.get(`${BASE_URL}/services/ml-models/finetuned/models`, {
        params
    });

export const debouncedGetAllFineTunedModels = _.debounce(getAllFineTunedModels, 500, true);

export const getAllDeployedModels = (params) =>
    httpClient.get(`${BASE_URL}/services/llm-workbench/deployments`, {
        params
    });

export const debouncedGetAllDeployedModels = _.debounce(getAllDeployedModels, 500, true);

export const getAllExperiments = (params) =>
    httpClient.get(`${BASE_URL}/services/llm-workbench/experiments`, { params });

export const debouncedGetAllExperiments = _.debounce(getAllExperiments, 500, true);

export const createDeployment = async (id) => {
    try {
        const data = await httpClient.post(`${BASE_URL}/services/llm-workbench/deployments`, {
            base_model_id: id
        });
        return data;
    } catch (error) {
        return error;
    }
};

export const getExperimentsStatus = async (params) => {
    try {
        const status = await httpClient.get(
            `${BASE_URL}/services/llm-workbench/experiments/statuses`,
            { params }
        );
        return status;
    } catch (error) {
        return error;
    }
};
export const getExperimentResultById = _.debounce(
    (id) => {
        return httpClient.get(`${BASE_URL}/services/llm-workbench/experiments/${id}/result`);
    },
    500,
    true
);
export const deployModel = async (params) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (params.id) {
                resolve({
                    message:
                        'Your LLM model is deployed successfully. It would take 15-20 mins to generate',
                    data: {
                        notebook: `\`\`\`
from nuclios.tasks.text import TextClient

# SET ENVIRONMENT VARIABLES
os.environ("BASE_URL") = "http://x.y.z.k/"
os.environ("NUCLIOS_PAT")= ""
os.environ("NUCLIOS_MODEL") = "ModelDeploymentName"
os.environ("NUCLIOS_MODEL_ACCESS_KEY") = "ACCESS_KEY"

# Instantiate Client and Generate Response
nuclios_llm_client = TextClient()

prompt = "Who Am I?"
response = nuclios_llm_client.inference(prompt)

print(response)\`\`\``,
                        package: `\`\`\`
pip install nuclios\`\`\``
                    }
                });
            }
        }, 1000);
    });
};

export const getModelConfigProperties = async (modelId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                data: {
                    id: modelId,
                    advancedOptions: [
                        {
                            id: 'compute_data_type',
                            label: 'Compute data type',
                            type: 'select',
                            options: [
                                { id: 'torch.float16', label: 'torch.float16' },
                                { id: 'torch.float32', label: 'torch.float32' }
                            ]
                        },
                        {
                            id: 'quantization_type',
                            label: 'Quantization Type',
                            type: 'select',
                            options: [
                                { id: 'nf4', label: 'nf4' },
                                { id: 'fp4', label: 'fp4' }
                            ]
                        },
                        {
                            id: 'use_double_quantization',
                            label: 'Use Double Quantization',
                            type: 'toggle'
                        }
                    ]
                }
            });
        }, 1000);
    });
};

export const getAdvancedModelConfig = async () => {
    return httpClient.get(`${BASE_URL}/services/ml-models/finetuned/form-configurations`);
};

export const getLLMModelConfigProperties = async () => {
    return httpClient.get(`${BASE_URL}/services/ml-models/deployed/form-configurations`);
};

export const debouncedGetLLMModelConfigProperties = _.debounce(
    getLLMModelConfigProperties,
    500,
    true
);

export const createFineTunedModel = async (params) => {
    return await httpClient.post(`${BASE_URL}/services/llm-workbench/experiments`, params);
};

export const updateFineTunedModelAdvanvcedConfig = async (params) => {
    return await httpClient.post(
        `${BASE_URL}/services/ml-models/finetuned/models/upload-fintuning-config`,
        params
    );
};

export const submitFineTunedModel = async (id) => {
    return await httpClient.post(`${BASE_URL}/services/ml-models/finetuned/${id}`);
};

export const getBaseModelById = (id) =>
    httpClient.get(`${BASE_URL}/services/ml-models/foundation/${id}`);

export const debouncedGetBaseModelById = _.debounce(getBaseModelById, 500, true);

export const getFineTunedModelById = (id) =>
    httpClient.get(`${BASE_URL}/services/ml-models/finetuned/${id}`);

export const debouncedGetFineTunedModelById = _.debounce(getFineTunedModelById, 500, true);

export const uploadDataset = async (params) => {
    return await httpClient({
        method: 'post',
        url: `${BASE_URL}/services/ml-models/finetuned/models/upload-data-set`,
        data: params,
        headers: {
            'Content-Type': `multipart/form-data; boundary=${params._boundary}`,
            Accept: 'application/json'
        }
    });
};

export const uploadFinetuneDataset = async (params) => {
    return await httpClient({
        method: 'post',
        url: `${BASE_URL}/services/llm-workbench/datasets`,
        data: params,
        headers: {
            'Content-Type': `multipart/form-data; boundary=${params._boundary}`,
            Accept: 'application/json'
        }
    });
};

export const executeFinetuneModel = ({ id, job_id, name, execution_type }) =>
    httpClient.patch(`${BASE_URL}/services/ml-models/finetuned/job`, {
        id,
        job_id,
        name,
        execution_type
    });

export const getAllDatasets = (params) =>
    httpClient.get(`${BASE_URL}/services/llm-workbench/datasets`, { params });

export const getAllInfraConfigs = (params) =>
    httpClient.get(`${BASE_URL}/services/llm-workbench/infras`, { params });

export const getProblemType = async () => [
    { name: 'Classification', id: 'classification' },
    { name: 'Text to SQL', id: 'text_to_sql' },
    { name: 'Summarization', id: 'summarization' },
    { name: 'OpenQA', id: 'openqa' },
    { name: 'MCQA', id: 'mcqa' },
    { name: 'Function Calling', id: 'function_calling' }
];

export const getErrorMetrics = async () => [
    { id: 'exactness_match', name: 'Exactness Match' },
    { id: 'execution_accuracy', name: 'Execution Accuracy' },
    { id: 'rouge_score', name: 'ROUGE Score' },
    { id: 'cosine_similarity', name: 'Cosine Similarity' },
    { id: 'bleu_score', name: 'BLEU Score' }
];

export const getPeftMethod = async () => [
    { id: 'lora', name: 'LoRA' },
    { id: 'qlora', name: 'QLoRA' }
];

export const getLrSchedulerType = async () => [
    { id: 'linear', name: 'Linear' },
    { id: 'cosine', name: 'Cosine' },
    { id: 'cosine_with_restarts', name: 'Cosine with restarts' },
    { id: 'polynomial', name: 'Polynomial' },
    { id: 'constant_with_warmup', name: 'Constant with warmup' },
    { id: 'inverse_sqrt', name: 'Inverse Squareroot' },
    { id: 'reduce_lr_on_plateau', name: 'Reduce LR on plateau' }
];

export const getQuantization = async () => [
    { id: '4', name: '4 Bit' },
    { id: '8', name: '8 Bit' }
];

export const getBaseModels = _.debounce(
    async () => {
        const response = await httpClient.get(`${BASE_URL}/services/llm-workbench/models`);
        return response.data;
    },
    500,
    true
);

export const validateFinetuneData = async ({ name, base_model_id }) =>
    httpClient.post(`${BASE_URL}/services/llm-workbench/experiments/validate`, {
        base_model_id,
        name
    });

export const getExperimentDetailById = _.debounce(
    async (id) => {
        const response = await httpClient.get(
            `${BASE_URL}/services/llm-workbench/experiments/${id}`
        );
        return response.data;
    },
    500,
    true
);

export const getExperimentChecpointResultsById = _.debounce(
    async (id, checkpointId) => {
        const response = await httpClient.get(
            `${BASE_URL}/services/llm-workbench/experiments/${id}/checkpoints/${checkpointId}/train-results`
        );
        return response.data;
    },
    500,
    true
);

export const getCheckpointEvaluationStatus = _.debounce(
    (id) =>
        httpClient.get(
            `${BASE_URL}/services/llm-workbench/experiments/${id}/checkpoints-evaluation-statuses`
        ),
    500,
    true
);

export const getCheckpointEvaluationResult = (id, checkpointName) =>
    httpClient.get(
        `${BASE_URL}/services/llm-workbench/experiments/${id}/checkpoints/${checkpointName}/evaluation-result`
    );

export const startCheckpointEvaluation = (id, checkpointName) =>
    httpClient.post(
        `${BASE_URL}/services/llm-workbench/experiments/${id}/checkpoints/${checkpointName}/evaluate`
    );

export const getExperimentStatusById = _.debounce(
    async (id) => {
        const response = await httpClient.get(
            `${BASE_URL}/services/llm-workbench/experiments/${id}/status`
        );
        return response;
    },
    500,
    true
);

export const interruptTraining = _.debounce(
    async (id) => {
        const response = await httpClient.delete(
            `${BASE_URL}/services/llm-workbench/experiments/${id}/stop-fintuning`
        );
        return response;
    },
    500,
    true
);

export const getDeploymentStatusById = async (id) => {
    return httpClient.get(`${BASE_URL}/services/llm-workbench/deployments/${id}/status`);
};

export const getExperimentTrainingResultById = _.debounce(
    async (id) => {
        const response = await httpClient.get(
            `${BASE_URL}/services/llm-workbench/experiments/${id}/training_result`
        );
        return response.data;
    },
    500,
    true
);
