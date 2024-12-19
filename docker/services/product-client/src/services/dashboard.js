import httpClient, { axiosClient } from 'services/httpClient.js';
import { decodeHtmlEntities } from 'util/decodeHtmlEntities';

export async function getApps(params) {
    try {
        const response = await axiosClient.get('/industry/' + params.industry + '/apps', {});
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}
export async function getAllApps(params) {
    try {
        if (params.payload) {
            const response = await axiosClient.get('/applications', { params: params.payload });
            params.callback(response['data']);
        } else {
            const response = await axiosClient.get('/applications', {});
            params.callback(response['data']);
        }
        return true;
    } catch (error) {
        throw error;
    }
}

export async function getIndustriesList(params = { callback: () => {} }) {
    try {
        const response = await axiosClient.get('/industry', {});
        params.callback(response['data']);
        return response;
    } catch (error) {
        throw new Error(error);
    }
}

export async function createIndustry(params) {
    try {
        const response = await axiosClient.post('/industry', {
            ...params.payload
        });
        params.callback(response['data']);
        return true;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            params.callback({ status: 'error', message: error.response.data.error });
        } else {
            params.callback({ status: 'error' });
        }
        // throw new Error(error);
    }
}

export async function updateIndustry(params) {
    try {
        const response = await axiosClient.put('/industry/' + params.payload.id, {
            ...params.payload
        });
        params.callback(response['data']);
        return true;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            params.callback({ status: 'error', message: error.response.data.error });
        } else {
            params.callback({ status: 'error' });
        }
        // throw new Error(error);
    }
}

export async function deleteIndustry(params) {
    try {
        const response = await axiosClient.delete('/industry/' + params.industry_id, {});
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getFunctionsList(params) {
    try {
        if (params.industry_id) {
            const response = await axiosClient.get(
                '/industry/' + params.industry_id + '/function',
                {}
            );
            params.callback(decodeHtmlEntities(response['data']));
        } else {
            const response = await axiosClient.get('/function', {});
            params.callback(decodeHtmlEntities(response['data']));
        }
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function createFunction(params) {
    try {
        const response = await axiosClient.post('/function', {
            ...params.payload
        });
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function updateFunction(params) {
    try {
        const response = await axiosClient.put('/function/' + params.payload.function_id, {
            ...params.payload
        });
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function deleteFunction(params) {
    try {
        const response = await axiosClient.delete('/function/' + params.function_id, {});
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getUserAppsHierarchy(params) {
    try {
        const response = await axiosClient.get('/user-apps-hierarchy', {});
        if (params?.callback) {
            params.callback(response['data']);
        }
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getUsers(params) {
    try {
        const response = await axiosClient.get('/bulk/lists/users', { params });
        return response['data'];
    } catch (error) {
        throw new Error(error);
    }
}

export async function bulkUserUpload(params) {
    try {
        const response = await axiosClient.post('/bulk/users', params.payload);
        return response['data'];
    } catch (error) {
        throw error;
    }
}

export async function deleteUser(params) {
    try {
        const response = await axiosClient.delete('/users/' + params.user_id, {});
        return response['data'];
    } catch (error) {
        throw new Error(error);
    }
}

export async function editUser(params) {
    try {
        const response = await axiosClient.put('/users/' + params.payload.user_id, {
            ...params.payload
        });
        return response['data'];
    } catch (error) {
        throw error;
    }
}
export async function addUser(params) {
    try {
        const response = await axiosClient.post('/users', params);
        return response['data'];
    } catch (error) {
        throw error;
    }
}

export async function getUserGroups() {
    try {
        const response = await axiosClient.get('/users/user-groups', {});
        return response['data'];
    } catch (error) {
        throw new Error(error);
    }
}

export async function getUserDetails(payload) {
    try {
        const response = await axiosClient.get(`/users/${payload.id}`, {});
        return response['data'];
    } catch (error) {
        throw new Error(error);
    }
}

//Gets the details of Apps Associated with the particular user
export async function getUserAppDetails(payload) {
    try {
        const response = await axiosClient.get(`/user-apps/${payload.email_address}`, {});
        return response['data'];
    } catch (error) {
        throw new Error(error);
    }
}

//Used to update the details the apps associated with the user
export async function updateUserAppDetails(params) {
    try {
        const response = await axiosClient.post(`/user-apps/${params.email_address}`, params);
        return response['data'];
    } catch (error) {
        throw new Error(error);
    }
}

export async function getHierarchy(params) {
    try {
        const response = await axiosClient.get(`/dashboard/${params['dashboardId']}`, {});
        return response['data'];
    } catch (error) {
        throw new Error(error);
    }
}

export async function getDashboardsList(params) {
    try {
        const response = await axiosClient.get('/dashboards', {});
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function createDashboard(params) {
    try {
        const response = await axiosClient.post('/dashboard', { ...params.payload });
        params.callback(response['data']);
        return true;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            params.callback({ status: 'error', message: error.response.data.error });
        } else {
            params.callback({ status: 'error' });
        }
    }
}

export async function updateDashboard(params) {
    try {
        const response = await axiosClient.put(`/dashboard/${params?.payload?.id}`, {
            ...params.payload
        });
        params.callback(response['data']);
        return true;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            params.callback({ status: 'error', message: error.response.data.error });
        } else {
            params.callback({ status: 'error' });
        }
    }
}

export async function getTemplatesList(params) {
    try {
        const response = await axiosClient.get('/dashboard-templates', {});
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getDashboardByIndustryId(params) {
    try {
        const response = await axiosClient.get(`/industry/${params.industryId}/dashboard`, {});
        if (response.data.message) {
            params.callback();
        } else {
            params.callback(response.data);
        }
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getDashboardDetails(params) {
    try {
        const response = await axiosClient.get(`/get-dashboard-details`, {
            params: { ...params.payload }
        });
        if (response.data.message) {
            params.callback();
        } else {
            params.callback(response.data);
        }
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getBannerInfo(params) {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_BACKEND_API'] + '/announcement/banner',
            {}
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getApplicationScreens(params) {
    try {
        const response = await axiosClient.get(
            `/get-applications-screens/${params['functionID']}`,
            {}
        );
        return response['data'];
    } catch (error) {
        throw new Error(error);
    }
}

// export async function getKpiInsights(params) {
//     try {
//         const response = await axiosClient.get(
//             `/${params.dashboard_id}/${params.process_id}/${params.problem_definition_id}/kpiinsights`,
//             {}
//         );
//         params.callback(response['data']);
//         return true;
//     } catch (error) {
//         throw new Error(error);
//     }
// }

export async function deleteDashboard(params) {
    try {
        const response = await axiosClient.delete(`/dashboard/${params?.payload?.id}`);
        params.callback(response['data']);
        return true;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            params.callback({ status: 'error', message: error.response.data.error });
        } else {
            params.callback({ status: 'error' });
        }
    }
}

export async function getInActiveUsers() {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_BACKEND_API'] + '/bulk/lists/inactive_users'
        );
        return response.data.data;
    } catch (error) {
        throw new Error(error);
    }
}

export async function deleteInactiveUsers(params) {
    try {
        const response = await axiosClient.post('/delete_users', params);
        return response;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getLayoutOptions(params) {
    try {
        const response = await axiosClient.get(
            `/${params?.payload?.app_id}` + '/layoutOptions',
            params
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function updateLayoutOptions(params) {
    try {
        const response = await axiosClient.post('/update_layoutOptions', {
            ...params.payload
        });
        params.callback({ message: 'success', response: response });
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function insertLayoutOptions(params) {
    try {
        const response = await axiosClient.put('/update_layoutOptions', {
            ...params.payload
        });
        params.callback({ message: 'success', response: response });
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getScreenOverViewImages(params) {
    try {
        const response = await axiosClient.get('/screen_overview_images', {
            ...params?.payload
        });
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}
