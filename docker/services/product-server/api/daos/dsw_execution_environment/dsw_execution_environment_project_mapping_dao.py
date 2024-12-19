from api.db_models.dsw_execution_environment.dsw_execution_environment_project_mapping import (
    DSWExecutionEnvironmentProjectMapping,
)
from api.models import db
from sqlalchemy import desc


class DSWExecutionEnvironmentProjectMappingDao:
    def create(self, obj_in):
        obj_in = DSWExecutionEnvironmentProjectMapping(
            project_id=obj_in.project_id, execution_environment_id=obj_in.execution_environment_id, config=obj_in.config
        )
        db.session.add(obj_in)
        db.session.commit()
        # db.session.close()
        return obj_in

    def get_by_project_id(self, project_id):
        obj = (
            DSWExecutionEnvironmentProjectMapping.query.filter_by(project_id=project_id)
            .order_by(desc(DSWExecutionEnvironmentProjectMapping.created_at))
            .all()
        )
        # db.session.close()
        return obj

    def update(self, id, obj_in):
        obj = DSWExecutionEnvironmentProjectMapping.query.filter_by(id=id).first()
        obj.update(obj_in)
        db.session.commit()
        # db.session.close()
        return obj

    def delete(self, id):
        obj = DSWExecutionEnvironmentProjectMapping.query.filter_by(id=id).first()
        db.session.delete(obj)
        db.session.commit()
        # db.session.close()
        return True
