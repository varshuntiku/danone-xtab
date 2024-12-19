import axios from 'axios';

export async function getSymptomsList() {
    try {
        const response = await axios.get(`https://diagnoseme.azurewebsites.net/get_symptoms_SD`, {
            params: {},
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response['data'];
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            return { status: 'error', message: error.response.data.error };
        } else {
            return { status: 'error' };
        }
    }
}

export async function getCategorySymptomsList() {
    try {
        const response = await axios.get(
            `https://diagnoseme.azurewebsites.net/get_all_body_symptoms`,
            {
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return response['data'];
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            return { status: 'error', message: error.response.data.error };
        } else {
            return { status: 'error' };
        }
    }
}

export async function getSymptomQuestionsList(inputData) {
    try {
        const response = await axios.post(
            `https://diagnoseme.azurewebsites.net/get_symptoms_quest_SD`,
            {
                selected_symptoms: inputData
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return response['data'];
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            return { status: 'error', message: error.response.data.error };
        } else {
            return { status: 'error' };
        }
    }
}

export async function getHistoryQuestionsList() {
    try {
        const response = await axios.get(
            `https://diagnoseme.azurewebsites.net/get_other_quest_SD`,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return response['data'];
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            return { status: 'error', message: error.response.data.error };
        } else {
            return { status: 'error' };
        }
    }
}

export async function getPredictionResult(inputData) {
    try {
        const response = await axios.post(
            `https://diagnoseme.azurewebsites.net/get_disease_predictions_SD`,
            {
                data: inputData
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return response['data'];
    } catch (error) {
        if (error.response && error.response.data && error.response.data.detail) {
            return { status: 'error', message: error.response.data.detail };
        } else {
            return { status: 'error' };
        }
    }
}

export async function postComment(inputData) {
    try {
        const response = await axios.post(
            `https://diagnoseme.azurewebsites.net/verify_results_SD`,
            inputData,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return response;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.detail) {
            return { status: 'error', message: error.response.data.detail };
        } else {
            return { status: 'error' };
        }
    }
}
