from api.constants.variables import ModelType

BaseModelTableConfigurations = [
    {
        "id": "name",
        "label": "Model Name",
        "enableSorting": False,
        "enableSearching": True,
    },
    {
        "id": "description",
        "label": "Description",
        "enableSorting": False,
        "enableSearching": False,
    },
    {
        "id": "model_type",
        "label": "Model Type",
        "enableSorting": False,
        "enableSearching": False,
    },
    {
        "id": "created_by",
        "label": "Imported by",
        "enableSorting": False,
        "enableSearching": False,
    },
    {
        "id": "created_at",
        "label": "Created at",
        "enableSorting": False,
        "enableSearching": False,
    },
    {
        "id": "actions",
        "label": "Actions",
        "enableSorting": False,
        "enableSearching": False,
    },
]

DeployedModelTableConfigurations = [
    {
        "id": "name",
        "label": "Deployment Name",
        "enableSorting": False,
        "enableSearching": False,
    },
    {
        "id": "description",
        "label": "Description",
        "enableSorting": False,
        "enableSearching": False,
    },
    {
        "id": "endpoint",
        "label": "End Point",
        "enableSorting": False,
        "enableSearching": False,
    },
    {"id": "model_name", "label": "Base model", "enableSorting": False, "enableSearching": False},
    {
        "id": "created_at",
        "label": "Created At",
        "enableSorting": False,
        "enableSearching": False,
    },
    {
        "id": "status",
        "label": "Status",
        "enableSorting": False,
        "enableSearching": False,
    },
    {
        "id": "actions",
        "label": "Actions",
        "enableSorting": False,
        "enableSearching": False,
    },
]

FinetunedModelTableConfigurations = [
    {
        "id": "name",
        "label": "Model Name",
        "enableSorting": False,
        "enableSearching": True,
    },
    {
        "id": "parent_model_name",
        "label": "Parent Model",
        "enableSorting": False,
        "enableSearching": False,
    },
    {
        "id": "description",
        "label": "Description",
        "enableSorting": False,
        "enableSearching": False,
    },
    {
        "id": "model_type",
        "label": "Model Type",
        "enableSorting": False,
        "enableSearching": False,
    },
    {
        "id": "job_id",
        "label": "View Job",
        "enableSorting": False,
        "enableSearching": False,
    },
    {
        "id": "created_by",
        "label": "Created by",
        "enableSorting": False,
        "enableSearching": False,
    },
    {
        "id": "created_at",
        "label": "Created at",
        "enableSorting": False,
        "enableSearching": False,
    },
    {
        "id": "actions",
        "label": "Actions",
        "enableSorting": False,
        "enableSearching": False,
    },
]

DeployedModelFormConfigurations = {
    "advancedOptions": [
        {
            "id": "compute_data_type",
            "label": "Compute Data Type",
            "type": "select",
            "options": [{"id": 1, "title": "float16"}, {"id": 1, "title": "float32"}],
        },
        {
            "id": "quantization_type",
            "label": "Quantization Type",
            "type": "select",
            "options": [{"id": 1, "title": "nf4"}, {"id": 1, "title": "fp4"}],
        },
        {
            "id": "use_double_quantization",
            "label": "Use Double Quantization",
            "type": "toggle",
        },
    ]
}

BaseModelFormConfigurations = {}

FinetunedModelFormConfigurations = {
    "virtual_machine": {
        "id": 1,
        "label": "Vitrual Machine",
        "type": "select",
        "info": "System Configuration",
        "options": [
            {
                "id": 1,
                "label": "Basic",
                "specifications": [
                    {
                        "id": 1,
                        "label": "CPU",
                        "value": "6 Core, 5GHz",
                    },
                    {
                        "id": 2,
                        "label": "GPU",
                        "value": "T4",
                    },
                    {
                        "id": 3,
                        "label": "VRAM",
                        "value": "24 GB",
                    },
                    {
                        "id": 4,
                        "label": "Cost",
                        "value": "$500/month",
                    },
                ],
            },
            {
                "id": 2,
                "label": "Advance",
                "specifications": [
                    {
                        "id": "cpu",
                        "label": "CPU",
                        "value": "8 Core, 5GHz",
                    },
                    {
                        "id": "gpu",
                        "label": "GPU",
                        "value": "T4",
                    },
                    {
                        "id": "vram",
                        "label": "VRAM",
                        "value": "48 GB",
                    },
                    {
                        "id": "cost",
                        "label": "Cost",
                        "value": "$1000/month",
                    },
                ],
            },
        ],
    },
    "common": [
        {
            "id": "batch_size",
            "label": "Batch Size",
            "type": "input",
            "info": "BATCH_SIZE",
            "defaultValue": 16,
            "required": True,
        },
        {
            "id": "learning_rate",
            "label": "Learning Rate",
            "type": "slider",
            "info": "LEARNING_RATE",
            "defaultValue": 0.05,
            "required": True,
            "min": 0,
            "max": 1,
            "step": 0.001,
        },
        {
            "id": "epochs",
            "label": "Epochs",
            "type": "input",
            "info": "EPOCHS",
            "defaultValue": 10,
            "required": True,
        },
        {
            "id": "max_seq_length",
            "label": "Max Seq Length",
            "type": "input",
            "info": "MAX_SEQ_LENGTH",
            "defaultValue": 512,
            "required": True,
        },
        {
            "id": "sanity_check",
            "label": "Sanity Check",
            "type": "toggle",
            "info": "SANITY_CHECK",
            "defaultValue": True,
            "required": True,
        },
        {
            "id": "multy_checkpoint_analysis",
            "label": "Multi Checkpoint Analysis",
            "type": "toggle",
            "info": "MULTI-CHECKPOINT-ANALYSIS",
            "defaultValue": True,
            "required": True,
        },
    ],
    "training_methods": [
        {
            "id": "lora",
            "label": "LoRA",
            "configuration": [
                {
                    "id": "lora_alpha",
                    "label": "LoRA Alpha",
                    "type": "text",
                    "info": "LORA_ALPHA",
                    "defaultValue": "256",
                    "required": True,
                },
                {
                    "id": "lora_dropout",
                    "label": "LoRA Dropout",
                    "type": "slider",
                    "info": "LORA_DROPOUT",
                    "min": 0,
                    "max": 1,
                    "step": 0.1,
                    "defaultValue": 0.5,
                    "required": True,
                },
                {
                    "id": "lora_r",
                    "label": "LoRA R",
                    "type": "text",
                    "info": "LORA_R",
                    "defaultValue": "64",
                    "required": True,
                },
            ],
        },
        {
            "id": "qlora",
            "label": "QLoRA",
            "configuration": [
                {
                    "id": "lora_alpha",
                    "label": "LoRA Alpha",
                    "type": "text",
                    "info": "LORA_ALPHA",
                    "defaultValue": "256",
                    "required": True,
                },
                {
                    "id": "lora_dropout",
                    "label": "LoRA Dropout",
                    "type": "slider",
                    "info": "LORA_DROPOUT",
                    "min": 0,
                    "max": 1,
                    "step": 0.1,
                    "defaultvalue": 0.5,
                    "required": True,
                },
                {
                    "id": "lora_r",
                    "label": "LoRA R",
                    "type": "text",
                    "info": "LORA_R",
                    "defaultValue": "64",
                    "required": True,
                },
                {
                    "id": "bit",
                    "label": "No. of Bits",
                    "type": "select",
                    "info": "LOAD_IN_4BIT/LOAD_IN_8BIT",
                    "options": [
                        {"id": "4", "title": "4 Bit"},
                        {"id": "8", "title": "8 Bit"},
                    ],
                    "defaultValue": "4",
                    "required": True,
                },
            ],
        },
        {"id": "no-pref", "label": "No Pref"},
    ],
}

DeployedModelRequestTableConfiguration = [
    {
        "id": "name",
        "label": "Deployment Name",
        "enableSorting": False,
        "enableSearching": True,
        "component": None,
    },
    {
        "id": "description",
        "label": "Description",
        "enableSorting": False,
        "enableSearching": False,
        "component": None,
    },
    {
        "id": "created_by",
        "label": "Created By",
        "enableSorting": False,
        "enableSearching": False,
        "component": None,
    },
    {
        "id": "model_name",
        "label": "Model Name",
        "enableSorting": False,
        "enableSearching": False,
        "component": None,
    },
    {
        "id": "deployment_type",
        "label": "Source",
        "enableSorting": False,
        "enableSearching": False,
        "component": None,
    },
    {
        "id": "actions",
        "label": "Actions",
        "enableSorting": False,
        "enableSearching": False,
        "component": None,
    },
]


def get_table_configuration(type):
    """
    To get table configurations for models.
    """
    if type == ModelType.DEPLOYED.value:
        return DeployedModelTableConfigurations
    elif type == ModelType.BASE.value:
        return BaseModelTableConfigurations
    elif type == ModelType.FINETUNED.value:
        return FinetunedModelTableConfigurations
    elif type == "deployed-model-request":
        return DeployedModelRequestTableConfiguration
    return []


def get_form_configuration(type):
    """
    To get from configurations for models.
    """
    if type == ModelType.DEPLOYED.value:
        return DeployedModelFormConfigurations
    elif type == ModelType.BASE.value:
        return BaseModelFormConfigurations
    elif type == ModelType.FINETUNED.value:
        return FinetunedModelFormConfigurations
    return []
