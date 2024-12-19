export async function previewFile(params) {
  const { axiosClient } = await import("src/services/httpClient.js");
  try {
    const response = await axiosClient.post(
      `${
        window?.envConfig?.solution_blueprint
          ?.VITE_APP_JUPYTER_HUB_ENV_BASE_URL ||
        import.meta.env["VITE_APP_DEE_ENV_BASE_URL"]
      }/services/jupyterhub/files/preview-file`,
      {
        file_path: params?.filePath,
        file_share: params?.fileShare,
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
}
