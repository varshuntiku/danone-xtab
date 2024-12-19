from api.daos.dsw_execution_environment.dsw_execution_environment_dao import (
    DSWExecutionEnvironmentDao,
)
from api.dtos.dsw_execution_environment.dsw_execution_environment_dto import (
    DSWExecutionEnvironmentCreate,
    DSWExecutionEnvironmentMeta,
    DSWExecutionEnvironmentUpdate,
)


class DSWExecutionEnvironmentService:
    """
    Getting queryset from relevant DAO and selecting data which is necessary in DTO
    """

    def __init__(self):
        self.execution_environment_dao = DSWExecutionEnvironmentDao()

    def create(self, data):
        obj_in = DSWExecutionEnvironmentCreate(
            name=data.get("name", ""), desc=data.get("desc", ""), config=data.get("config", {})
        )
        obj = self.execution_environment_dao.create(obj_in=obj_in)
        return DSWExecutionEnvironmentMeta(id=obj.id, name=obj.name, desc=obj.desc, config=obj.config)

    def get(self, id):
        obj = self.execution_environment_dao.get(id=id)
        return DSWExecutionEnvironmentMeta(id=obj.id, name=obj.name, desc=obj.desc, config=obj.config)

    def get_all(self):
        objs = self.execution_environment_dao.get_all()
        return [DSWExecutionEnvironmentMeta(id=obj.id, name=obj.name, desc=obj.desc, config=obj.config) for obj in objs]

    def update(self, id, data):
        obj_in = DSWExecutionEnvironmentUpdate(name=data.get("name"), desc=data.get("desc"), config=data.get("config"))
        obj = self.execution_environment_dao.update(id=id, obj_in=obj_in.to_dict())
        return DSWExecutionEnvironmentMeta(id=obj.id, name=obj.name, desc=obj.desc, config=obj.config)

    def delete(self, id):
        return self.execution_environment_dao.delete(id=id)
