from api.models import ContainerMapping, db


def add_container_mapping(industry_id=None, function_id=None, container_id=None):
    existing_app_mapping_list = ContainerMapping.query.filter(ContainerMapping.container_id == container_id).all()
    new_app_mapping = ContainerMapping(industry_id=industry_id, function_id=function_id, container_id=container_id)
    if existing_app_mapping_list:
        __mapping_exists__ = False
        for mapping in existing_app_mapping_list:
            if mapping.industry_id == industry_id and mapping.function_id == function_id:
                # 1. if mentioned industry id and function id are alredy there in the app then do nothing.
                __mapping_exists__ = True
                break
            else:
                # 2. else delete them
                db.session.delete(mapping)
        if not __mapping_exists__:
            db.session.add(new_app_mapping)
    else:
        db.session.add(new_app_mapping)

    db.session.flush()
    db.session.commit()
