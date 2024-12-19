import httpClient from './httpClient.js';

export async function getProcessedQuestion(params) {
    try {
        const response = await httpClient.get(
            `${import.meta.env['REACT_APP_MINERVA_BACKEND_URL']}/services/query/${
                params.payload.minervaAppId
            }`,
            {
                params: {
                    user_query: params.payload.userQuery
                }
            }
        );
        if (response.data !== 'error') {
            params.callback(params.payload.question, response.data);
        } else {
            params.failureCallback();
        }
        return true;
    } catch (error) {
        params.failureCallback();
        // throw new Error(error);
    }
}
