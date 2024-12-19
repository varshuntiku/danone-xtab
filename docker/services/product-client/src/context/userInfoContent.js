import { createContext } from 'react';

export const UserInfoContext = createContext({
    status: '',
    user_id: 0,
    username: '',
    is_restricted_user: false,
    first_name: '',
    last_name: '',
    last_login: '',
    access_key: '',
    feature_access: {
        app: false,
        case_studies: false,
        my_projects: false,
        my_projects_only: false,
        all_projects: false,
        widget_factory: false,
        environments: false,
        rbac: false,
        admin: false,
        app_publish: false
    },
    nac_roles: []
});
