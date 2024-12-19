import axios from 'axios';
export const client = axios.create({
    baseURL: '',
    headers: {
        'Cache-Control': 'no-cache'
    }
});

export async function getAdidasSuggestions(params) {
    if (params?.type == 'image')
        try {
            const response = await client.post(
                'https://demogpu.mathco.com:5000/image_to_image_infer',
                params?.payload
            );
            return response['data'];
        } catch (error) {
            return { error: error?.response?.data?.error || 'Error while fetching suggestions' };
        }
    else if (params?.type == 'text')
        try {
            const response = await client.post(
                'https://demogpu.mathco.com:5000/text_search',
                params?.payload
            );
            return response['data'];
        } catch (error) {
            return { error: error?.response?.data?.error || 'Error while fetching suggestions' };
        }
}

export async function getAdidasInsights(params) {
    try {
        const response = await client.post(
            'https://demogpu.mathco.com:5000/get_similarity_insight',
            params?.payload
        );
        return response['data'];
    } catch (err) {
        throw new Error('error while fetching insights');
    }
}
