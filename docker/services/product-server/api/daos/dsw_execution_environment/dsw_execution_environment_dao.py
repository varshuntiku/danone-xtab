from api.db_models.dsw_execution_environment.dsw_execution_environment import (
    DSWExecutionEnvironment,
)
from api.models import db
from sqlalchemy import desc
from sqlalchemy.sql import func


class DSWExecutionEnvironmentDao:
    def create(self, obj_in):
        obj_in = DSWExecutionEnvironment(name=obj_in.name, desc=obj_in.desc, config=obj_in.config)
        db.session.add(obj_in)
        db.session.commit()
        # db.session.close()
        return obj_in

    def get(self, id):
        obj = DSWExecutionEnvironment.query.filter_by(id=id).first()
        # db.session.close()
        return obj

    def get_all(self):
        objs = (
            DSWExecutionEnvironment.query.filter_by(deleted_at=None)
            .order_by(desc(DSWExecutionEnvironment.created_at))
            .all()
        )
        # db.session.close()
        return objs

    def update(self, id, obj_in):
        obj = DSWExecutionEnvironment.query.filter_by(id=id).first()
        obj.update(obj_in)
        db.session.commit()
        # db.session.close()
        return obj

    def delete(self, id):
        delete_at_time = func.now()
        DSWExecutionEnvironment.query.filter_by(id=id).update({"deleted_at": delete_at_time})
        db.session.commit()
        # db.session.close()
        return True
