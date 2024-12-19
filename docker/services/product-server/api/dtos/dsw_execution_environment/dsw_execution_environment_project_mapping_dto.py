class DSWExecutionEnvironmentProjectMappingCreate:
    def __init__(self, project_id, execution_environment_id, config={}):
        self.project_id = project_id
        self.execution_environment_id = execution_environment_id
        self.config = config


class DSWExecutionEnvironmentProjectMappingUpdate:
    def __init__(self, config=None):
        if config:
            self.config = config

    def to_dict(self):
        return vars(self)


class DSWExecutionEnvironmentProjectMappingMeta:
    def __init__(self, id, project_id, execution_environment_id, config, project, execution_env) -> None:
        self.id = id
        self.project_id = project_id
        self.execution_environment_id = execution_environment_id
        self.config = config
        self.project = project
        self.execution_env = execution_env
