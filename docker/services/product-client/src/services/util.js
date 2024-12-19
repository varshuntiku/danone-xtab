import { axiosClient } from 'services/httpClient.js';

export async function previewFile(params) {
    try {
        const response = await axiosClient.post(
            `${
                import.meta.env['REACT_APP_JUPYTER_HUB_ENV_BASE_URL']
            }/services/jupyterhub/files/preview-file`,
            {
                file_path: params?.filePath,
                file_share: params?.fileShare
            }
        );
        return response.data;
    } catch (error) {
        return error;
    }
}
