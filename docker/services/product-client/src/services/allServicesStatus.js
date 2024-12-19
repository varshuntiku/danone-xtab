import httpClient from 'services/httpClient.js';

let deeUrl = import.meta.env['REACT_APP_DEE_ENV_BASE_URL'];
let apiUrl = import.meta.env['REACT_APP_NUCLIOS_BACKEND_API'];
let minervaUrl = import.meta.env['REACT_APP_MINERVA_BACKEND_URL'];
let genaiUrl = import.meta.env['REACT_APP_GENAI'];

if (
    import.meta.env['REACT_APP_DEE_ENV_BASE_URL'] &&
    ('' + import.meta.env['REACT_APP_DEE_ENV_BASE_URL']).length > 5
) {
    deeUrl = import.meta.env['REACT_APP_DEE_ENV_BASE_URL'].replace('/services', '');
}

if (
    import.meta.env['REACT_APP_NUCLIOS_BACKEND_API'] &&
    ('' + import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']).length > 5
) {
    apiUrl = import.meta.env['REACT_APP_NUCLIOS_BACKEND_API'].replace('/nuclios-product-api', '');
}

const urlMapper = {
    dee: deeUrl,
    api: apiUrl,
    minerva: minervaUrl,
    genai: genaiUrl
};

export async function apiHelper(params) {
    try {
        let response = '';
        if (params?.urlMapper) {
            response = await httpClient[params.method](
                urlMapper?.[params.urlMapper] + params.endpoint,
                params.payload
            );
        } else if (params?.generic) {
            response = await httpClient[params.method](params.endpoint, params.payload);
        } else {
            response = await httpClient[params.method](
                urlMapper?.api + params.endpoint,
                params.payload
            );
        }
        response = {
            status: 'success',
            data: response?.data,
            statusCode: response?.status
        };
        params.callback(response);
        return 1;
    } catch (error) {
        let response = {
            status: 'error',
            error: error?.response?.data?.error,
            statusCode: error?.response?.status
        };
        params.callback(response);
        return 1;
    }
}
