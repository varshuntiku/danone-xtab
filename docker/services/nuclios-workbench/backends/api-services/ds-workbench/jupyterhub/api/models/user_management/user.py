import hashlib
import secrets

from api.databases.base_class import mapper_registry
from api.models.mixins import BaseModelMixin
from api.models.user_management.auth import (
    NacRoles,
    UserGroup,
    nac_user_role_identifier,
    user_group_identifier,
)
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    TypeDecorator,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func


class HexByteString(TypeDecorator):
    """Convert Python bytestring to string with hexadecimal digits and back for storage."""

    impl = String

    def process_bind_param(self, value, dialect):
        if not isinstance(value, bytes):
            raise TypeError("HexByteString columns support only bytes values.")
        return value.hex()

    def process_result_value(self, value, dialect):
        return bytes.fromhex(value) if value else None


@mapper_registry.mapped
class User(BaseModelMixin):
    __tablename__ = "user"

    first_name = Column(String(1000), nullable=True)
    last_name = Column(String(1000), nullable=True)
    email_address = Column(String(1000), nullable=True)
    password_hash = Column(HexByteString, nullable=True)
    last_login = Column(DateTime(timezone=True))
    last_logout = Column(DateTime(timezone=True))
    access_key = Column(String(1000), nullable=True)
    user_groups = relationship("UserGroup", secondary=user_group_identifier, back_populates="users")
    nac_user_roles = relationship("NacRoles", secondary=nac_user_role_identifier)
    restricted_user = Column(Boolean, default=False)
    failed_login_count = Column(Integer, default=0)
    failed_login_at = Column(DateTime(timezone=True), nullable=True)

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


@mapper_registry.mapped
class UserPasswordCode(BaseModelMixin):
    __tablename__ = "user_password_code"

    user_id = Column(Integer, ForeignKey("user.id"))
    user_email = Column(String(100), nullable=False)
    secret = Column(HexByteString, nullable=True)
    attempt = Column(Integer, default=0)
    verify_attempt = Column(Integer, default=0)

    def __init__(self, user_id, user_email, secret, attempt):
        self.user_id = user_id
        self.user_email = user_email
        self.secret = secret
        self.attempt = attempt


@mapper_registry.mapped
class UserToken(BaseModelMixin):
    __tablename__ = "user_token"
    user_id = Column(Integer, ForeignKey("user.id"))
    user_name = Column(String(100), nullable=True)
    user_email = Column(String(100), nullable=False)
    execution_token = Column(Text, nullable=False)
    access = Column(Text)

    def __init__(self, user_id, user_name, user_email, execution_token, access):
        self.user_id = user_id
        self.user_name = user_name
        self.user_email = user_email
        self.execution_token = execution_token
        self.access = access
