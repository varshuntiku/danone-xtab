from api.databases.base_class import Base, mapper_registry
from api.models.mixins import BaseModelMixin
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship

user_group_identifier = Table(
    "user_group_identifier",
    Base.metadata,
    Column("user_group_id", Integer, ForeignKey("user_group.id")),
    Column("user_id", Integer, ForeignKey("user.id")),
)

nac_user_role_identifier = Table(
    "nac_user_role_identifier",
    Base.metadata,
    Column("nac_role_id", Integer, ForeignKey("nac_roles.id")),
    Column("user_id", Integer, ForeignKey("user.id")),
)

nac_role_permissions_identifier = Table(
    "nac_role_permissions_identifier",
    Base.metadata,
    Column("nac_role_id", Integer, ForeignKey("nac_roles.id")),
    Column("nac_role_permissions_id", Integer, ForeignKey("nac_role_permissions.id")),
)


@mapper_registry.mapped
class NacRoles(BaseModelMixin):
    __tablename__ = "nac_roles"

    name = Column(String(1000), nullable=False)
    user_role_type = Column(Integer, default=1)
    role_permissions = relationship("NacRolePermissions", secondary=nac_role_permissions_identifier)
    users = relationship("User", secondary=nac_user_role_identifier, overlaps="nac_user_roles")

    # query_class = QueryWithSoftDelete

    def __init__(self, name, role_permissions=False, created_by=False, user_role_type=1):
        self.name = name
        if role_permissions:
            for permission in role_permissions:
                self.role_permissions.append(NacRolePermissions.query.filter_by(id=permission).first())
        self.user_role_type = user_role_type
        if created_by:
            self.created_by = created_by


@mapper_registry.mapped
class NacRolePermissions(BaseModelMixin):
    __tablename__ = "nac_role_permissions"

    name = Column(String(1000), nullable=False, unique=True)
    permission_type = Column(Integer, default=1)
    roles = relationship(
        "NacRoles",
        secondary=nac_role_permissions_identifier,
        overlaps="role_permissions",
    )
    # query_class = QueryWithSoftDelete

    def __init__(self, name, created_by, permission_type=1):
        self.name = name
        self.permission_type = permission_type
        self.created_by = created_by


@mapper_registry.mapped
class UserGroup(BaseModelMixin):
    __tablename__ = "user_group"

    name = Column(String(1000), nullable=True)
    user_group_type = Column(Integer, default=1)
    app = Column(Boolean, default=True)
    case_studies = Column(Boolean, default=False)
    my_projects_only = Column(Boolean, default=False)
    my_projects = Column(Boolean, default=False)
    all_projects = Column(Boolean, default=False)
    rbac = Column(Boolean, default=False)
    widget_factory = Column(Boolean, default=False)
    environments = Column(Boolean, default=False)
    app_publish = Column(Boolean, default=False)
    prod_app_publish = Column(Boolean, default=False)
    users = relationship("User", secondary=user_group_identifier, overlaps="user_groups", back_populates="user_groups")

    # query_class = QueryWithSoftDelete

    def __init__(
        self,
        name,
        created_by,
        user_group_type=1,
        app=True,
        case_studies=False,
        my_projects_only=False,
        my_projects=False,
        all_projects=False,
        widget_factory=False,
        environments=False,
        app_publish=False,
        prod_app_publish=False,
        rbac=False,
    ):
        self.name = name
        self.app = app
        self.case_studies = case_studies
        self.my_projects = my_projects
        self.my_projects_only = my_projects_only
        self.all_projects = all_projects
        self.widget_factory = widget_factory
        self.environments = environments
        self.app_publish = app_publish
        self.rbac = rbac
        self.user_group_type = user_group_type
        self.created_by = created_by
        self.prod_app_publish = prod_app_publish
