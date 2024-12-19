class DynamicExecutionEnvDTO:
    def __init__(self, data):
        self.id = data.id
        self.name = data.name
        self.requirements = data.requirements
        self.py_version = data.py_version if data.py_version else False
        self.status = False
        self.created_by = (
            (f"{data.created_by_user.first_name} {data.created_by_user.last_name}") if data.created_by else "--"
        )
        self.updated_by = (
            (f"{data.updated_by_user.first_name} {data.updated_by_user.last_name}") if data.updated_by else "--"
        )
        self.created_at = data.created_at.strftime("%d %B, %Y %H:%M") if data.created_at else "--"
        self.updated_at = data.updated_at.strftime("%d %B, %Y %H:%M") if data.updated_at else "--"


class DynamicExecutionEnvByAppDTO:
    def __init__(self, data, app_id):
        self.app_id = data.app_id if data is not None else app_id
        self.dynamic_env_id = data.dynamic_env_id if data is not None else None


class CreateDynamicExecEnvDTO:
    def __init__(self, execution_env):
        self.id = execution_env.id
        self.name = execution_env.name
