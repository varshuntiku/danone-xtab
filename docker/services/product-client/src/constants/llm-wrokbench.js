export const fieldNames = {
    name: 'Experiment Name',
    problem_type: 'Problem Type',
    description: 'Experiment Description',
    base_model: 'Base Model',
    model_path: 'Model Path',
    test_size: 'Test Size',
    batch_size: 'Batch Size',
    epochs: 'Epochs',
    error_metric_type: 'Error Metric',
    learning_rate: 'Learning Rate',
    max_tokens: 'Max Tokens',
    status: 'In-Progress',
    peft_method: 'PEFT Method',
    lr_scheduler_type: 'LR Scheduler Type',
    gradient_acc_steps: 'Gradient Accumulation Steps',
    logging_steps: 'Logging Steps',
    lora_alpha: 'LoRA Alpha',
    lora_rank: 'LoRA Rank',
    lora_dropout: 'LoRA Dropout',
    checkpoint_frequency: 'Checkpoint Frequency',
    quantization: 'Quantization'
};

export const baseConfigConstants = [
    {
        label: 'Experiment Configurations',
        description: 'The experiment details should be provided in this section.',
        fields: [
            {
                id: 'name',
                label: fieldNames.name,
                xs: 6,
                required: true,
                type: 'text',
                placeholder: 'Enter experiment name (Eg: exp-mistral)',
                regex: /^[a-z0-9-]+$/,
                validateRegex: /^[a-z0-9]*(-[a-z0-9]*)*[a-z0-9]$/
            },
            {
                id: 'problem_type',
                label: fieldNames.problem_type,
                xs: 6,
                required: true,
                type: 'select',
                fetchAction: 'getProblemType',
                fetchValues: 'problemTypes',
                placeholder: 'Select problem type'
            },
            {
                id: 'description',
                label: fieldNames.description,
                xs: 12,
                required: false,
                type: 'text',
                placeholder: 'Enter experiment description here'
            }
        ]
    },
    {
        label: 'Model Selection',
        description: 'Select a pre-trained model to fine-tune.',
        fields: [
            {
                id: 'base_model_id',
                label: fieldNames.base_model,
                xs: 6,
                required: true,
                type: 'select',
                fetchAction: 'getBaseModels',
                fetchValues: 'baseModels',
                placeholder: 'Select base models'
            },
            {
                id: 'model_path',
                label: fieldNames.model_path,
                xs: 6,
                required: false,
                disabled: (formData) => formData.base_model_id !== 'custom',
                type: 'text',
                placeholder: 'Enter model path here'
            }
        ]
    },
    {
        label: 'Finetune Configurations',
        description: 'Enter the basic parameters in this section.',
        fields: [
            {
                id: 'test_size',
                label: fieldNames.test_size,
                xs: 6,
                required: true,
                type: 'number',
                placeholder: 'Set test size (0 - 0.5)',
                min: 0.01,
                max: 0.5,
                info: 'A percentage split of data set used to evaluate the model'
            },
            {
                id: 'batch_size',
                label: fieldNames.batch_size,
                xs: 6,
                required: true,
                type: 'number',
                placeholder: 'Set batch size (min: 2))',
                min: 1,
                info: 'The batch size determines the number of training examples used to train a single forward and backward pass, influences computational efficiency and model performance. Larger batch sizes are generally more effective for larger data but require additional memory, potentially accelerating training.'
            },
            {
                id: 'epochs',
                label: fieldNames.epochs,
                xs: 6,
                required: true,
                type: 'number',
                placeholder: 'Set number of epochs (min: 1)',
                min: 1,
                info: 'An epoch is one complete pass of the training dataset through the algorithm'
            },
            {
                id: 'error_metric_type',
                label: fieldNames.error_metric_type,
                xs: 6,
                required: true,
                type: 'select',
                fetchAction: 'getErrorMetrics',
                fetchValues: 'errorMetrics',
                placeholder: 'Select error metric',
                info: 'Used to assess the performance of a model for specific task type'
            },
            {
                id: 'learning_rate',
                label: fieldNames.learning_rate,
                xs: 6,
                required: true,
                type: 'slider',
                min: 0.00001,
                max: 0.1,
                step: 0.00001,
                info: 'The learning rate indicates how fast a LLM updates its parameters when being trained'
            },
            {
                id: 'max_tokens',
                label: fieldNames.max_tokens,
                xs: 6,
                required: true,
                type: 'slider',
                min: 4,
                max: 8192,
                step: 4,
                info: 'Defines the maximum length of input sequences for tasks like natural language processing, restricting input tokens to a specified length during training or inference Learning Rate'
            }
        ]
    }
];

export const advancedConfigConstants = [
    {
        id: 'peft_method',
        label: fieldNames.peft_method,
        xs: 6,
        required: true,
        type: 'select',
        placeholder: 'Select PEFT method',
        fetchAction: 'getPeftMethod',
        fetchValues: 'peftMethods',
        info: 'Select appropriate peft method for model finetuning'
    },
    {
        id: 'lr_scheduler_type',
        label: fieldNames.lr_scheduler_type,
        xs: 6,
        required: true,
        type: 'select',
        placeholder: 'Select LR scheduler type',
        fetchAction: 'getLrSchedulerType',
        fetchValues: 'lrSchedulerTypes',
        info: 'An epoch is one complete pass of the training dataset through the algorithm'
    },
    {
        id: 'gradient_acc_steps',
        label: fieldNames.gradient_acc_steps,
        xs: 6,
        required: true,
        type: 'slider',
        min: 1,
        max: 16,
        step: 1,
        info: 'The number of update steps the model accumulates before performing a backward or update pass'
    },
    {
        id: 'logging_steps',
        label: fieldNames.logging_steps,
        xs: 6,
        required: true,
        type: 'slider',
        min: 1,
        max: 100,
        step: 1,
        info: 'Determines how often training progress is logged or  metrics are recorded during the training of a model'
    },
    {
        id: 'lora_alpha',
        label: fieldNames.lora_alpha,
        xs: 6,
        required: true,
        type: 'slider',
        min: 1,
        max: 1024,
        step: 1,
        info: 'Represents the scaling factor for the weight matrices in LoRA'
    },
    {
        id: 'lora_rank',
        label: fieldNames.lora_rank,
        xs: 6,
        required: true,
        type: 'slider',
        min: 1,
        max: 512,
        step: 1,
        info: 'The rank of the update matrices. Lower rank results in smaller update matrices with fewer trainable parameters'
    },
    {
        id: 'save_steps',
        label: fieldNames.checkpoint_frequency,
        xs: 6,
        required: true,
        type: 'slider',
        min: 2,
        max: 100,
        step: 1,
        info: 'Option to specify frequency to snapshot and save progress'
    },
    {
        id: 'quantization',
        label: fieldNames.quantization,
        xs: 6,
        required: true,
        type: 'select',
        placeholder: 'Select quantization',
        fetchAction: 'getQuantization',
        fetchValues: 'quantizations',
        hidden: (formData) => formData.peft_method !== 'qlora'
    }
];
