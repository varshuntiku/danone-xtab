initial_user_groups_seed = [
    {
        "name": "default-user",
        "user_group_type": 1,
        "app": True,
        "case_studies": False,
        "my_projects_only": True,
        "my_projects": False,
        "all_projects": False,
        "rbac": False,
        "widget_factory": False,
        "environments": False,
        "app_publish": False,
        "prod_app_publish": None,
        "created_by": None,
    },
    {
        "name": "super-user",
        "user_group_type": 1,
        "app": True,
        "case_studies": False,
        "my_projects_only": False,
        "my_projects": True,
        "all_projects": True,
        "rbac": True,
        "widget_factory": True,
        "environments": True,
        "app_publish": True,
        "prod_app_publish": None,
        "created_by": None,
    },
]

initial_nac_role_permissions_seed = [
    {"name": "CREATE_VARIABLE", "permission_type": 1, "created_by": None},
    {"name": "CREATE_PREVIEW_APP", "permission_type": 1, "created_by": None},
    {"name": "CREATE_EXECUTION_ENVIRONMENT", "permission_type": 1, "created_by": None},
    {"name": "RESET_ALL_APP", "permission_type": 1, "created_by": None},
    {"name": "RESET_MY_APP", "permission_type": 1, "created_by": None},
    {"name": "PROMOTE_APP", "permission_type": 1, "created_by": None},
    {"name": "EDIT_PRODUCTION_APP", "permission_type": 1, "created_by": None},
    {"name": "CLONING_OF_APPLICATION", "permission_type": 1, "created_by": None},
]

initial_nac_roles_seed = [
    {"name": "App Default User", "user_role_type": 1, "role_permissions": []},
    {
        "name": "App Creator",
        "user_role_type": 1,
        "role_permissions": [
            "CREATE_VARIABLE",
            "CREATE_PREVIEW_APP",
            "RESET_MY_APP",
            "CLONING_OF_APPLICATION",
        ],
    },
    {
        "name": "Prod App Creator",
        "user_role_type": 1,
        "role_permissions": [
            "CREATE_VARIABLE",
            "CREATE_PREVIEW_APP",
            "CREATE_EXECUTION_ENVIRONMENT",
            "RESET_ALL_APP",
            "RESET_MY_APP",
            "EDIT_PRODUCTION_APP",
            "CLONING_OF_APPLICATION",
        ],
    },
    {
        "name": "App Admin",
        "user_role_type": 1,
        "role_permissions": [
            "CREATE_VARIABLE",
            "CREATE_PREVIEW_APP",
            "CREATE_EXECUTION_ENVIRONMENT",
            "RESET_ALL_APP",
            "RESET_MY_APP",
            "PROMOTE_APP",
            "EDIT_PRODUCTION_APP",
            "CLONING_OF_APPLICATION",
        ],
    },
]

initial_industry_seed = {
    "industry_name": "Miscellaneous Industry",
    "logo_name": "Technology",
    "horizon": "vertical",
    "description": "Miscellaneous Industry",
}

initial_function_seed = {
    "function_name": "Miscellaneous Function",
    "industry_name": "Miscellaneous Industry",
    "logo_name": "RetailCustomerInsightsIcon",
    "description": "Miscellaneous Function",
}

initial_app_theme_seed = ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"]

initial_app_theme_modes_seed = [
    {
        "mode": "light",
        "bg_variant": "v3",
        "contrast_color": "#CC4354",
        "chart_colors": '["#CC4354", "#F66796", "#F6BD79", "#736CD6", "#9FBBFF", "#D091FC", "#83BD63", "#CBE28D", "#60C29F", "#F7E3E5"]',
        "params": "{}",
        "app_theme": "Red",
    },
    {
        "mode": "dark",
        "bg_variant": "v3",
        "contrast_color": "#D03C4E",
        "chart_colors": '["#D03C4E", "#E56590", "#E7B376", "#6F67D2", "#92ACEE", "#B983E0", "#82BB62", "#CBE28D", "#60C29F", "#CDB8B8"]',
        "params": "{}",
        "app_theme": "Red",
    },
    {
        "mode": "light",
        "bg_variant": "v3",
        "contrast_color": "#1373E5",
        "chart_colors": '["#1373E5", "#A59CFD", "#62C6FC", "#FC6B96", "#F99992", "#FCA9F4", "#CAE882", "#80D388", "#EFE47E", "#D7CDBD"]',
        "params": "{}",
        "app_theme": "Blue",
    },
    {
        "mode": "dark",
        "bg_variant": "v3",
        "contrast_color": "#287DE1",
        "chart_colors": '["#308FFF", "#A384FC", "#62C6FC", "#FC6B96", "#FE9088", "#DA81D1", "#A3BD59", "#5EB567", "#DCD16C", "#6E6E82"]',
        "params": "{}",
        "app_theme": "Blue",
    },
    {
        "mode": "light",
        "bg_variant": "v3",
        "contrast_color": "#FFBF00",
        "chart_colors": '["#FFBF00", "#F8B15E", "#C2D355", "#B786F5", "#8375E9", "#F363A8", "#52ECBE", "#8AD3ED", "#2CACA4", "#B5B3C2"]',
        "params": "{}",
        "app_theme": "Yellow",
    },
    {
        "mode": "dark",
        "bg_variant": "v3",
        "contrast_color": "#EDCE65",
        "chart_colors": '["#EDCE65", "#EA9D42", "#BFCC6B", "#A37FD7", "#7065C8", "#CF5692", "#8AD3ED", "#45CAA4", "#25938E", "#AAA7B9"]',
        "params": "{}",
        "app_theme": "Yellow",
    },
    {
        "mode": "light",
        "bg_variant": "v3",
        "contrast_color": "#37BE8F",
        "chart_colors": '["#37BE8F", "#A6D8FB", "#B3E78D", "#C084EB", "#FC8AD2", "#8980EB", "#F88981", "#F8C67D", "#FD9CB8", "#EADEC9"]',
        "params": "{}",
        "app_theme": "Green",
    },
    {
        "mode": "dark",
        "bg_variant": "v3",
        "contrast_color": "#0FC183",
        "chart_colors": '["#0FC183", "#80C4F2", "#BFF299", "#C584F4", "#FD7DCE", "#948DE7", "#E76043", "#E5AA52", "#F28AA8", "#56605C"]',
        "params": "{}",
        "app_theme": "Green",
    },
    {
        "mode": "light",
        "bg_variant": "v3",
        "contrast_color": "#8257FC",
        "chart_colors": '["#8257FC", "#70A1FC", "#E69DFF", "#F6BB75", "#EF9880", "#F96CAC", "#D9F196", "#94C077", "#72D2CD", "#8DE6E7"]',
        "params": "{}",
        "app_theme": "Purple",
    },
    {
        "mode": "dark",
        "bg_variant": "v3",
        "contrast_color": "#AA8EFC",
        "chart_colors": '["#7D61D2", "#608BDB", "#C387DB", "#FEAB49", "#DE775D", "#D45190", "#B8CE82", "#7EA468", "#73C0B7", "#484661"]',
        "params": "{}",
        "app_theme": "Purple",
    },
    {
        "mode": "light",
        "bg_variant": "v3",
        "contrast_color": "#FCA74A",
        "chart_colors": '["#FCA74A", "#FA8585", "#F0E18C", "#C6A2F3", "#A397F3", "#FFA0CE", "#BEF49A", "#7BDAC9", "#ADDDFF", "#E2DACB"]',
        "params": "{}",
        "app_theme": "Orange",
    },
    {
        "mode": "dark",
        "bg_variant": "v3",
        "contrast_color": "#EE9636",
        "chart_colors": '["#EE9636", "#E56669", "#D9C96B", "#A87BE3", "#7065C9", "#CF5692", "#9ED97B", "#65C0B1", "#4C9FDA", "#CAC1B2"]',
        "params": "{}",
        "app_theme": "Orange",
    },
]

initial_user_seed = {
    "first_name": "System",
    "last_name": "NucliOS",
    "email_address": "system.user@admin.com",
    "password_hash": "29e794c4fc03d64d1569cdaa47b544b9a5af9e27675d295af7a0b9f373cc4f753f9bb467bafdaa584c3196bb89037fa54d3e5bd14ad6861e053fc40d4481f49e015791267ed3268c9867ad1fb42e4d8f5ba135aaf27a217fe15bf2cc56a8ab8de301f2ee1ccaae0994fd0f4db88f7c375aae0a8ea6dc2feaf44c6f761f341cbb",
    "access_key": True,
    "restricted_user": False,
    "user_groups": ["default-user", "super-user"],
    "nac_user_roles": ["App Admin"],
}
