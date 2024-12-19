import httpClient, { axiosClient } from 'services/httpClient.js';

export async function getProjects(params) {
    try {
        const response = await axiosClient.put('/projects/list', params);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getProject(projecId, params = {}) {
    try {
        const response = await axiosClient.get('/projects/' + projecId, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function createProject(params) {
    try {
        const response = await httpClient.post(
            import.meta.env['REACT_APP_BACKEND_API'] + '/projects',
            {
                name: params.name,
                industry: '',
                project_status: 1,
                assignees: [],
                reviewer: null
            }
        );

        const app_response = await axiosClient.post('/app-admin/' + params.app_id + '/setup-app', {
            project_id: response['data'].id
        });

        params.callback(app_response);
    } catch (error) {
        params.callback({ status: 'error' });
    }
}

export async function saveProject(params) {
    try {
        if (params.id) {
            const response = await axiosClient.put('/projects/' + params.id, params);
            return response.data;
        } else {
            const response = await axiosClient.post('/projects', params);
            return response.data;
        }
    } catch (error) {
        throw error;
    }
}

export async function deleteProject(projecId) {
    try {
        const response = await axiosClient.delete('/projects/' + projecId);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getVersions(params) {
    try {
        const response = await axiosClient.get('/projects/' + params.projectId + '/versions', {
            params: params.payload
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getVersionData(projectId, versionId) {
    try {
        const response = await axiosClient.get('/projects/' + projectId + '/versions/' + versionId);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function deleteVersion(projectId, versionId) {
    try {
        const response = await axiosClient.delete(
            '/projects/' + projectId + '/versions/' + versionId
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function createNewVersion(params) {
    try {
        if (params.project_id) {
            const response = await axiosClient.post(
                '/projects/' + params.project_id + '/versions',
                params
            );
            return response.data;
        } else {
            const response = await axiosClient.post('/projects', params);
            return response.data;
        }
    } catch (error) {
        throw error;
    }
}

export async function setAsCurrentVersion(project_id, params) {
    try {
        const response = await axiosClient.put('/projects/' + project_id + '/versions', params);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getUsers(params) {
    try {
        const response = await axiosClient.get('/projects/users', { params });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getReviewers(params) {
    try {
        const response = await axiosClient.get('/projects/reviewers', { params });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function uploadAttachment(file) {
    const formData = new FormData();
    formData.append('file', file);
    try {
        const response = await axiosClient.post('/project-attachment', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function deleteAttachment(file_name) {
    try {
        const response = await axiosClient.delete('/project-attachment', {
            params: { file_name }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function downloadPPT(project) {
    try {
        const response = await httpClient.post(
            import.meta.env['REACT_APP_SERVERLESS_API'] +
                '/PDFramework?code=NZ6_tsB775I-0yrqX38xyXJf6BiIGTjbcVcjc18ehe4tAzFuQW3OPQ==',
            project
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getJpHubToken(projectId) {
    try {
        const response = await axiosClient.get(
            // import.meta.env['REACT_APP_BACKEND_API'] +
            '/projects/' + projectId + '/jphub_access_token'
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getDsWorkbenchHardReload(params) {
    try {
        const response = await axiosClient.get(
            `${
                import.meta.env['REACT_APP_JUPYTER_HUB_ENV_BASE_URL']
            }/services/jupyterhub/jphub/hard-reload/${params.projectId}`
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
    }
}

export async function getStreamData(params) {
    try {
        await axiosClient.get(
            `${
                import.meta.env['REACT_APP_DEE_ENV_BASE_URL']
            }/dynamic-execution-environment/execution-environments/${
                params.projectId
            }/project-status-stream`,
            {
                headers: {
                    Accept: 'text/event-stream'
                },
                onDownloadProgress: (evt) => {
                    let data = evt?.target?.responseText;
                    const dataSplit = data?.split('\n').filter((item) => item !== '');
                    const recentData = dataSplit?.[dataSplit?.length - 1];
                    data = JSON.parse(recentData?.substring(5));
                    params.callback({ data: data }, false);
                }
            }
        );
        // params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback(null, 'error');
    }
}
