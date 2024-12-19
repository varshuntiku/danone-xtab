from api.constants.users.user_variables import UserGroupType


class NacRolesDTO:
    def __init__(self) -> None:
        pass

    def get_nac_role(nac_role):
        return {
            "id": nac_role.id,
            "name": nac_role.name,
            "permissions": [row.name.upper() for row in nac_role.role_permissions],
            "user_role_type": UserGroupType.get_label(nac_role.user_role_type),
            "created_by": (
                f"{nac_role.created_by_user.first_name} {nac_role.created_by_user.last_name}"
                if nac_role.created_by
                else "--"
            ),
        }
