from api.routes import generic_route
from api.routes.alerts_notifications import alerts_route, notifications_route
from api.routes.apps import (
    ai_response_route,
    app_functions_route,
    app_route,
    app_variables_route,
    comments_route,
    execution_env_route,
    notification_subscription_route,
    planogram_route,
    projects_route,
    report_route,
    scenarios_route,
    screen_actions_route,
    screen_filters_route,
    screen_route,
    tableau_route,
    theme_route,
    widget_route,
)
from api.routes.auth import login_route, saml_login_route
from api.routes.connected_systems import (
    business_process_route as connsystem_business_process_route,
)
from api.routes.connected_systems import (
    business_process_template_route as connsystem_business_process_template_route,
)
from api.routes.connected_systems import dashboard_route as connsystem_dashboard_route
from api.routes.connected_systems import (
    dashboard_tab_route as connsystem_dashboard_tab_route,
)
from api.routes.connected_systems import driver_route as connsystem_driver_route
from api.routes.connected_systems import goal_route as connsystem_goal_route
from api.routes.connected_systems import initiative_route as connsystem_initiative_route

# from api.routes.connected_systems import connected_systems_route
from api.routes.dashboards import dashboard_route, function_route, industry_route
from api.routes.users import app_users_route, users_route

# from api.routes.utils.azure import azure_route
from fastapi import APIRouter

router = APIRouter()  # Router Initialization

# Authentication Routes
router.include_router(login_route.router, tags=["Authentication"])

# SAML Login Routes
router.include_router(saml_login_route.router, tags=["SAML Login"])

# Generic Routes
router.include_router(generic_route.router, tags=["Generic"])

# User Management Routes
router.include_router(users_route.router)

# Industry Routes
router.include_router(industry_route.router, prefix="/industry", tags=["Industries"])

# Function Routes
router.include_router(function_route.router, prefix="/function", tags=["Functions"])

# Connected System routes
# router.include_router(connected_systems_route.router, tags=["Connected Systems"])

# Dashboard Routes
router.include_router(dashboard_route.router, tags=["Dashboards"])

# App Routes
router.include_router(app_route.router, tags=["App"])

# Projects Routes
router.include_router(projects_route.router, tags=["Projects"])

# App Screen Routes
router.include_router(screen_route.router, tags=["App Screens"])

# App Screen Actions Routes
router.include_router(screen_filters_route.router, tags=["App Screen Filters"])

# App Screen Actions Routes
router.include_router(screen_actions_route.router, tags=["App Screen Actions"])

# App Screen Widgets Routes
router.include_router(widget_route.router, tags=["App Screen Widgets"])

# App Variable Routes
router.include_router(app_variables_route.router, tags=["App Variables"])

# App Function Routes
router.include_router(app_functions_route.router, tags=["App Functions"])

# App Users And User Roles Routes
router.include_router(app_users_route.router, tags=["App Users And User Roles"])

# Execution Env Routes
router.include_router(execution_env_route.router, tags=["Execution Envs"])

# Theme Routes
router.include_router(theme_route.router, tags=["Themes"])

# Scenarios Routes
router.include_router(scenarios_route.router, tags=["Scenarios"])

# Planogram Routes
router.include_router(planogram_route.router, tags=["Planogram"])

# AI Insights Routes
router.include_router(ai_response_route.router, tags=["AI Insights"])

# Alerts Routes
router.include_router(alerts_route.router, prefix="/alerts", tags=["Alerts"])

# Notifications Routes
router.include_router(notifications_route.router, tags=["Notifications"])

# Reports Routes
router.include_router(report_route.router, tags=["Reports"])

# # Azure Service Routes
# router.include_router(
#     azure_route.router,
#     prefix="/azure",
# )

# Connected System Routes
router.include_router(
    connsystem_dashboard_route.router,
    prefix="/connected-system/dashboard",
    tags=["Connected Systems"],
)

router.include_router(
    connsystem_dashboard_tab_route.router,
    prefix="/connected-system/dashboard",
    tags=["Connected Systems"],
)

router.include_router(
    connsystem_goal_route.router,
    prefix="/connected-system/dashboard",
    tags=["Connected Systems"],
)

router.include_router(
    connsystem_initiative_route.router,
    prefix="/connected-system/dashboard",
    tags=["Connected Systems"],
)

router.include_router(
    connsystem_driver_route.router,
    prefix="/connected-system/dashboard",
    tags=["Connected Systems"],
)

router.include_router(
    connsystem_business_process_route.router,
    prefix="/connected-system/dashboard",
    tags=["Connected Systems"],
)

router.include_router(comments_route.router, prefix="/comments", tags=["comments"])

router.include_router(notification_subscription_route.router, prefix="/subscription", tags=["subscription"])
router.include_router(connsystem_business_process_template_route.router, prefix="/connected-system/dashboard")

# Tableau Routes
router.include_router(tableau_route.router, prefix="/tableau", tags=["Tableau"])
