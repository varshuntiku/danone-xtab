export const getIds = () => {
    let appId,
        projectId,
        item_name = '';
    const location = window.location.pathname.toLowerCase();
    if (location.includes('ds-workbench/project') && location.includes('applications/app')) {
        const paths = location.split('/');
        const projectIdIndex = paths.indexOf('project');
        const appIdIndex = paths.indexOf('app');
        const adminIndex = paths.indexOf('admin');
        const userManagementIndex = paths.indexOf('user-mgmt');
        if (projectIdIndex >= 0 && appIdIndex >= 0) {
            let project_id = Number(paths[projectIdIndex + 1]);
            let app_id = Number(paths[appIdIndex + 1]);
            if (!isNaN(project_id) && !isNaN(app_id)) {
                projectId = project_id;
                appId = app_id;
            }
        }
        if (adminIndex) {
            item_name = paths[adminIndex + 1];
        } else {
            item_name = paths[paths.length - 1];
        }
        if (adminIndex === -1 && userManagementIndex !== -1) {
            item_name = 'user-mgmt';
        }

        return {
            app_id: appId,
            project_id: projectId,
            item_name
        };
    }
};
