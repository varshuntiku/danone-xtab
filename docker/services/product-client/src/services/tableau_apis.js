
import { axiosClient } from 'services/httpClient.js'; // Local backend API URL

// Sign-in to Tableau and retrieve siteId and userId
export const tableauSignIn = async (signInData) => {
    try {
        const response = await axiosClient.post(`tableau/signin`, signInData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Extract siteId, userId, and token from the response
        const { site, user, token } = response.data.credentials;

        return {
            siteId: site.id,
            userId: user.id,
            authToken: token,
            contentURL: site.contentUrl// Store the authentication token
        };
    } catch (error) {
        console.error('Error during Tableau sign-in:', error);
        throw error;
    }
};

export const getWorkbooks = async (siteId, userId, authToken) => {


    try {
        const response = await axiosClient.get(`tableau/sites/${siteId}/users/${userId}/workbooks`, {
            headers: {
                'X-Tableau-Auth': authToken,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        });




        return response.data.workbooks || [];
    } catch (error) {
        console.error('Error fetching Tableau workbooks:', error.response?.data || error);
        throw error;
    }
};

export const getViews = async (siteId, workbookId, authToken) => {



    try {
        const response = await axiosClient.get(`tableau/sites/${siteId}/workbooks/${workbookId}/views`, {
            headers: {
                'X-Tableau-Auth': authToken,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        });


        return response.data.views || [];
    } catch (error) {
        console.error('Error fetching Tableau views:', error.response?.data || error);
        throw error;
    }
};


