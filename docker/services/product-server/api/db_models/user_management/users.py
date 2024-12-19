import hashlib
import secrets

from api.models import CodexModelMixin, QueryWithSoftDelete, db
from sqlalchemy.sql import func

user_group_identifier = db.Table(
    "user_group_identifier",
    db.Column("user_group_id", db.Integer, db.ForeignKey("user_group.id")),
    db.Column("user_id", db.Integer, db.ForeignKey("user.id")),
)

nac_user_role_identifier = db.Table(
    "nac_user_role_identifier",
    db.Column("nac_role_id", db.Integer, db.ForeignKey("nac_roles.id")),
    db.Column("user_id", db.Integer, db.ForeignKey("user.id")),
)

nac_role_permissions_identifier = db.Table(
    "nac_role_permissions_identifier",
    db.Column("nac_role_id", db.Integer, db.ForeignKey("nac_roles.id")),
    db.Column("nac_role_permissions_id", db.Integer, db.ForeignKey("nac_role_permissions.id")),
)


class HexByteString(db.TypeDecorator):
    """Convert Python bytestring to string with hexadecimal digits and back for storage."""

    impl = db.String

    def process_bind_param(self, value, dialect):
        if not isinstance(value, bytes):
            raise TypeError("HexByteString columns support only bytes values.")
        return value.hex()

    def process_result_value(self, value, dialect):
        return bytes.fromhex(value) if value else None


class NacRoles(CodexModelMixin, db.Model):
    name = db.Column(db.String(1000), nullable=False)
    user_role_type = db.Column(db.Integer, default=1)
    role_permissions = db.relationship("NacRolePermissions", secondary=nac_role_permissions_identifier)
    users = db.relationship("User", secondary=nac_user_role_identifier, overlaps="nac_user_roles")

    query_class = QueryWithSoftDelete

    def __init__(self, name, role_permissions=False, created_by=False, user_role_type=1):
        self.name = name
        if role_permissions:
            for permission in role_permissions:
                self.role_permissions.append(NacRolePermissions.query.filter_by(id=permission).first())
        self.user_role_type = user_role_type
        if created_by:
            self.created_by = created_by


class NacRolePermissions(CodexModelMixin, db.Model):
    name = db.Column(db.String(1000), nullable=False, unique=True)
    permission_type = db.Column(db.Integer, default=1)
    roles = db.relationship(
        "NacRoles",
        secondary=nac_role_permissions_identifier,
        overlaps="role_permissions",
    )
    query_class = QueryWithSoftDelete

    def __init__(self, name, created_by, permission_type=1):
        self.name = name
        self.permission_type = permission_type
        self.created_by = created_by


class User(CodexModelMixin, db.Model):
    first_name = db.Column(db.String(1000), nullable=True)
    last_name = db.Column(db.String(1000), nullable=True)
    email_address = db.Column(db.String(1000), nullable=True)
    password_hash = db.Column(HexByteString, nullable=True)
    last_login = db.Column(db.DateTime(timezone=True))
    last_logout = db.Column(db.DateTime(timezone=True))
    access_key = db.Column(db.String(1000), nullable=True)
    user_groups = db.relationship("UserGroup", secondary=user_group_identifier)
    nac_user_roles = db.relationship("NacRoles", secondary=nac_user_role_identifier)
    restricted_user = db.Column(db.Boolean, default=False)
    failed_login_count = db.Column(db.Integer, default=0)
    failed_login_at = db.Column(db.DateTime(timezone=True), nullable=True)
    restricted_access = db.Column(db.Boolean, default=False)

    query_class = QueryWithSoftDelete

    def __init__(
        self,
        first_name,
        last_name,
        email_address,
        created_by=False,
        updated_by=False,
        login=False,
        access_key=False,
        user_groups=False,
        nac_user_roles=False,
        password=False,
        restricted_user=False,
        auto_generation=False,
        restricted_access=False,
    ):
        self.first_name = first_name
        self.last_name = last_name
        self.email_address = email_address

        if created_by:
            self.created_by = created_by
        if updated_by:
            self.updated_by = updated_by

        if login:
            self.last_login = func.now()

        if access_key:
            self.access_key = secrets.token_urlsafe(16)

        self.user_groups.append(UserGroup.query.filter_by(name="default-user").first())
        if auto_generation:
            self.user_groups.append(UserGroup.query.filter(func.lower(UserGroup.name) == "coach").first())
        if user_groups:
            for user_group_item in user_groups:
                self.user_groups.append(UserGroup.query.filter_by(id=user_group_item).first())
        if nac_user_roles:
            for user_group_item in nac_user_roles:
                self.nac_user_roles.append(NacRoles.query.filter_by(id=user_group_item).first())
        if password:
            # create hashed password = hash(salt + password)
            self.password_hash = hashlib.pbkdf2_hmac(
                "sha256",
                password.encode("utf-8"),
                "codxauth".encode("utf-8"),
                100000,
                dklen=128,
            )
        else:
            self.password_hash = hashlib.pbkdf2_hmac(
                "sha256",
                secrets.token_urlsafe(16).encode("utf-8"),
                "codxauth".encode("utf-8"),
                100000,
                dklen=128,
            )

        self.restricted_user = restricted_user
        self.restricted_access = restricted_access


class UserGroup(CodexModelMixin, db.Model):
    name = db.Column(db.String(1000), nullable=True)
    user_group_type = db.Column(db.Integer, default=1)
    app = db.Column(db.Boolean, default=True)
    case_studies = db.Column(db.Boolean, default=False)
    my_projects_only = db.Column(db.Boolean, default=False)
    my_projects = db.Column(db.Boolean, default=False)
    all_projects = db.Column(db.Boolean, default=False)
    rbac = db.Column(db.Boolean, default=False)
    widget_factory = db.Column(db.Boolean, default=False)
    environments = db.Column(db.Boolean, default=False)
    app_publish = db.Column(db.Boolean, default=False)
    prod_app_publish = db.Column(db.Boolean, default=False)
    users = db.relationship("User", secondary=user_group_identifier, overlaps="user_groups")

    query_class = QueryWithSoftDelete

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


class UserPasswordCode(CodexModelMixin, db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    user_email = db.Column(db.String(100), nullable=False)
    secret = db.Column(HexByteString, nullable=True)
    attempt = db.Column(db.Integer, default=0)
    verify_attempt = db.Column(db.Integer, default=0)

    def __init__(self, user_id, user_email, secret, attempt):
        self.user_id = user_id
        self.user_email = user_email
        self.secret = secret
        self.attempt = attempt
