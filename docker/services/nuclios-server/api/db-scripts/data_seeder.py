# To run the data_seeder run below command in your terminal
# python data_seeder.py

import logging

from api.configs.settings import get_app_settings
from api.models.base_models import (
    AppTheme,
    AppThemeMode,
    Functions,
    Industry,
    NacRolePermissions,
    NacRoles,
    User,
    UserGroup,
)
from data import (
    initial_app_theme_modes_seed,
    initial_app_theme_seed,
    initial_function_seed,
    initial_industry_seed,
    initial_nac_role_permissions_seed,
    initial_nac_roles_seed,
    initial_user_groups_seed,
    initial_user_seed,
)
from sqlalchemy import create_engine, func
from sqlalchemy.orm import sessionmaker

settings = get_app_settings()

engine = create_engine(settings.SQLALCHEMY_DATABASE_URI)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

db_session = SessionLocal()


def seed_data():
    try:
        # Seeding default User Groups
        for user_group in initial_user_groups_seed:
            user_group_exists = (
                db_session.query(UserGroup).filter(func.lower(UserGroup.name) == func.lower(user_group["name"])).count()
            )
            if user_group_exists:
                print(f'User group {user_group["name"]} already exists: SKIPPED')
            else:
                new_user_group = UserGroup(
                    name=user_group["name"],
                    app=user_group["app"],
                    case_studies=user_group["case_studies"],
                    my_projects_only=user_group["my_projects_only"],
                    my_projects=user_group["my_projects"],
                    all_projects=user_group["all_projects"],
                    widget_factory=user_group["widget_factory"],
                    environments=user_group["environments"],
                    app_publish=user_group["app_publish"],
                    prod_app_publish=user_group["prod_app_publish"],
                    rbac=user_group["rbac"],
                    user_group_type=1,
                    created_by=user_group["created_by"],
                )
                db_session.add(new_user_group)
                print(f'User group {user_group["name"]}: ADDED')
        db_session.flush()

        # Seeding default NAC Role Permissions
        for nac_role_permission in initial_nac_role_permissions_seed:
            nac_role_permission_exists = (
                db_session.query(NacRolePermissions)
                .filter(func.lower(NacRolePermissions.name) == func.lower(nac_role_permission["name"]))
                .count()
            )
            if nac_role_permission_exists:
                print(f'Nac Role permission {nac_role_permission["name"]} already exists: SKIPPED')
            else:
                new_nac_role_permission = NacRolePermissions(
                    name=nac_role_permission["name"],
                    permission_type=nac_role_permission["permission_type"],
                    created_by=nac_role_permission["created_by"],
                )
                db_session.add(new_nac_role_permission)
                print(f'Nac Role permission {nac_role_permission["name"]}: ADDED')
        db_session.flush()

        # Seeding default NAC Roles
        for nac_role in initial_nac_roles_seed:
            nac_role_exists = (
                db_session.query(NacRoles).filter(func.lower(NacRoles.name) == func.lower(nac_role["name"])).count()
            )
            if nac_role_exists:
                print(f'Nac Role {nac_role["name"]} already exists: SKIPPED')
            else:
                role_permissions = [
                    db_session.query(NacRolePermissions)
                    .filter(func.lower(NacRolePermissions.name) == func.lower(role_permission))
                    .first()
                    for role_permission in nac_role["role_permissions"]
                ]
                new_nac_role = NacRoles(
                    name=nac_role["name"],
                    role_permissions=role_permissions,
                    user_role_type=nac_role["user_role_type"],
                )
                db_session.add(new_nac_role)
                print(f'Nac Role {nac_role["name"]}: ADDED')
        db_session.flush()

        # Seeding Miscellaneous Industry
        industry_exists = (
            db_session.query(Industry)
            .filter(func.lower(Industry.industry_name) == func.lower(initial_industry_seed["industry_name"]))
            .count()
        )
        if industry_exists:
            print(f'Industry {initial_industry_seed["industry_name"]} already exists: SKIPPED')
        else:
            new_industry = Industry(
                industry_name=initial_industry_seed["industry_name"],
                description=initial_industry_seed["description"],
                logo_name=initial_industry_seed["logo_name"],
                horizon=initial_industry_seed["horizon"],
                order=None,
                parent_industry_id=None,
                color=None,
                level=None,
            )
            db_session.add(new_industry)
            print(f'Industry {initial_industry_seed["industry_name"]}: ADDED')
            db_session.flush()

        # Seeding Miscellaneous Function
        function_exists = (
            db_session.query(Functions)
            .filter(func.lower(Functions.function_name) == func.lower(initial_function_seed["function_name"]))
            .count()
        )
        if function_exists:
            print(f'Function {initial_function_seed["function_name"]} already exists: SKIPPED')
        else:
            industry_id = (
                db_session.query(Industry)
                .filter(func.lower(Industry.industry_name) == func.lower(initial_function_seed["industry_name"]))
                .first()
                .id
            )
            new_function = Functions(
                industry_id=industry_id,
                function_name=initial_function_seed["function_name"],
                description=initial_function_seed["description"],
                logo_name=initial_function_seed["logo_name"],
                order=None,
                parent_function_id=None,
                color=None,
                level=None,
            )
            db_session.add(new_function)
            print(f'Function {initial_function_seed["function_name"]}: ADDED')
            db_session.flush()

        # Seeding default App Themes
        for app_theme in initial_app_theme_seed:
            app_theme_exists = (
                db_session.query(AppTheme).filter(func.lower(AppTheme.name) == func.lower(app_theme)).count()
            )
            if app_theme_exists:
                print(f"App Theme {app_theme} already exists: SKIPPED")
            else:
                new_app_theme = AppTheme(name=app_theme)
                db_session.add(new_app_theme)
                print(f"App Theme {app_theme}: ADDED")
        db_session.flush()

        # Seeding Default App Theme Modes
        for app_theme_mode in initial_app_theme_modes_seed:
            app_theme = (
                db_session.query(AppTheme)
                .filter(func.lower(AppTheme.name) == func.lower(app_theme_mode["app_theme"]))
                .first()
            )
            app_theme_mode_exists = (
                db_session.query(AppThemeMode).filter_by(mode=app_theme_mode["mode"], app_theme_id=app_theme.id).count()
            )
            if app_theme_mode_exists:
                print(f'{app_theme_mode["mode"]} mode for theme {app_theme_mode["app_theme"]} already exists: SKIPPED')
            else:
                new_app_theme_mode = AppThemeMode(
                    mode=app_theme_mode["mode"],
                    bg_variant=app_theme_mode["bg_variant"],
                    contrast_color=app_theme_mode["contrast_color"],
                    chart_colors=app_theme_mode["chart_colors"],
                    params=app_theme_mode["params"],
                    app_theme_id=app_theme.id,
                )
                db_session.add(new_app_theme_mode)
                print(f'{app_theme_mode["mode"]} mode for theme {app_theme_mode["app_theme"]}: ADDED')
        db_session.flush()

        # Seeding default User
        user_exists = (
            db_session.query(User)
            .filter(func.lower(User.email_address) == func.lower(initial_user_seed["email_address"]))
            .count()
        )
        if user_exists:
            print(f'User with email {initial_user_seed["email_address"]} already exists: SKIPPED')
        else:
            default_user_data = {"user_groups": [], "nac_user_roles": []}

            default_user_data["user_groups"] = [
                db_session.query(UserGroup).filter(func.lower(UserGroup.name) == func.lower(user_group)).first()
                for user_group in initial_user_seed["user_groups"]
            ]

            default_user_data["nac_user_roles"] = [
                db_session.query(NacRoles).filter(func.lower(NacRoles.name) == func.lower(nac_role)).first()
                for nac_role in initial_user_seed["nac_user_roles"]
            ]

            new_user = User(
                first_name=initial_user_seed["first_name"],
                last_name=initial_user_seed["last_name"],
                email_address=initial_user_seed["email_address"],
                access_key=initial_user_seed["access_key"],
                restricted_user=initial_user_seed["restricted_user"],
                default_user_data=default_user_data,
            )
            db_session.add(new_user)
            print(f'User with email {initial_user_seed["email_address"]}: ADDED')
            db_session.flush()
            db_session.execute(
                f"update public.user set password_hash='{initial_user_seed['password_hash']}' where email_address='{initial_user_seed['email_address']}'"
            )

        db_session.commit()
        db_session.close()

        print("Data seeding completed")

    except Exception as e:
        db_session.rollback()
        db_session.close()
        logging.error(e)
        print("Error seeding data")


seed_data()
