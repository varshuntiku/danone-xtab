from api.daos.dsw_execution_environment.dsw_execution_environment_project_mapping_dao import (
    DSWExecutionEnvironmentProjectMappingDao,
)
from api.dtos.dsw_execution_environment.dsw_execution_environment_project_mapping_dto import (
    DSWExecutionEnvironmentProjectMappingCreate,
    DSWExecutionEnvironmentProjectMappingMeta,
    DSWExecutionEnvironmentProjectMappingUpdate,
)


class DSWExecutionEnvironmentProjectMappingService:
    """
    Getting queryset from relevant DAO and selecting data which is necessary in DTO
    """

    def __init__(self):
        self.execution_environment_project_mapping_dao = DSWExecutionEnvironmentProjectMappingDao()

    def create(self, data):
        obj_in = DSWExecutionEnvironmentProjectMappingCreate(
            project_id=data.get("project_id"),
            execution_environment_id=data.get("execution_environment_id"),
            config=data.get("config", {}),
        )
        obj = self.execution_environment_project_mapping_dao.create(obj_in=obj_in)
        return DSWExecutionEnvironmentProjectMappingMeta(
            id=obj.id,
            project_id=obj.project_id,
            execution_environment_id=obj.execution_environment_id,
            config=obj.config,
            project=obj.project,
            execution_env=obj.execution_env,
        )

    def get_by_project_id(self, project_id):
        objs = self.execution_environment_project_mapping_dao.get_by_project_id(project_id=project_id)
        return [
            DSWExecutionEnvironmentProjectMappingMeta(
                id=obj.id,
                project_id=obj.project_id,
                execution_environment_id=obj.execution_environment_id,
                config=obj.config,
                project=obj.project,
                execution_env=obj.execution_env,
            )
            for obj in objs
        ]

    def update(self, id, data):
        obj_in = DSWExecutionEnvironmentProjectMappingUpdate(config=data.get("config"))
        obj = self.execution_environment_project_mapping_dao.update(id=id, obj_in=obj_in.to_dict())
        return DSWExecutionEnvironmentProjectMappingMeta(
            id=obj.id,
            project_id=obj.project_id,
            execution_environment_id=obj.execution_environment_id,
            config=obj.config,
            project=obj.project,
            execution_env=obj.execution_env,
        )

    def delete(self, id):
        return self.execution_environment_project_mapping_dao.delete(id=id)
