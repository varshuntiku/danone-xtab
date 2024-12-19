class ModelParamsDTO:
    """
    Data Tranformation Object for model_params in ModelConfig.
    """

    def __init__(self, model_params) -> None:
        self.api_base = model_params["api_base"] if "api_base" in model_params else None
        self.api_version = model_params["api_version"] if "api_version" in model_params else None
        self.deployment_name = model_params["deployment_name"] if "deployment_name" in model_params else None


class ModelConfigDTO:
    """
    Data Tranformation Object for the Finetuned Models(Supported Models).
    """

    def __init__(self, model_config) -> None:
        self.id = model_config.id
        self.model_path = model_config.model_path
        self.model_path_type = model_config.model_path_type
        self.api_key = model_config.api_key
        self.model_params = ModelParamsDTO(model_config.model_params) if model_config.model_params else None


class ModelRegistryDTO:
    """
    Data Tranformation Object for the Finetuned Models(Supported Models).
    """

    def __init__(self, model_registry) -> None:
        self.id = model_registry.id
        self.name = model_registry.name
        self.source = model_registry.source
        self.description = model_registry.description
        self.problem_type = model_registry.problem_type
        self.model_type = model_registry.model_type
        self.config = ModelConfigDTO(model_registry.configs[0]) if len(model_registry.configs) > 0 else None
        self.created_by = str(model_registry.created_by_user.email_address) if model_registry.created_by_user else None
        self.created_at = str(model_registry.created_at)
