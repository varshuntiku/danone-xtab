import MsalAuth from '../auth/auth/MSALAuth';
import { microsoftGraphApi, microsoftGraphApiPhotoSizes } from './user_config';
import { axiosClient } from './httpClient';

export const getProfilePhoto = async (photoSize = microsoftGraphApiPhotoSizes['48']) => {
    try {
        const msalAuth = new MsalAuth();
        await msalAuth.init();
        const token = await msalAuth.getToken({
            scopes: ['user.read']
        });
        const response = await fetch(`${microsoftGraphApi}/me/photos/${photoSize}/$value`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response?.status != 200) throw new Error(`Failed with ${response?.status} status code`);

        const blob = await response.blob();
        const url = window.URL || window.webkitURL;
        const blobUrl = url.createObjectURL(blob);

        return blobUrl;
    } catch (err) {
        // console.error(`Error while fetching user's profile picture! ${err}`);
        return null;
    }
};

export const getProfilePhotoSAML = async (userId) => {
    try {
        const response = await axiosClient.get(`/saml/avatar/${userId}`, { responseType: 'blob' });

        if (response?.status != 200) throw new Error(`Failed with ${response?.status} status code`);

        const blobUrl = URL.createObjectURL(response.data);

        return blobUrl;
    } catch (err) {
        return null;
    }
};
