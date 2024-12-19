import axios from 'axios';
import { matchPath } from 'react-router';
import { PublicAuthConnector } from '../auth/AuthContext';
import axiosRetry from 'axios-retry';
import store from 'store/store';

const httpClient = axios.create({
    baseURL: '',
    headers: {
        'Cache-Control': 'no-cache'
    }
});

const baseURL =
    import.meta.env['REACT_APP_ENABLE_FASTAPI'] === 'true'
        ? import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']
        : import.meta.env['REACT_APP_BACKEND_API'];
export const axiosClient = axios.create({
    baseURL: baseURL,
    headers: {
        'Cache-Control': 'no-cache'
    }
});

export const generateAxiosClient = (
    withCredentials = true,
    baseurl = import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']
) => {
    const axiosInstance = axios.create({
        baseURL: baseurl,
        headers: {
            'Cache-Control': 'no-cache'
        },
        withCredentials: withCredentials
    });
    axiosInstance.interceptors.request.use(authInterceptor);
    axiosInstance.interceptors.request.use(appInterceptor);
    return axiosInstance;
};

function getAppId() {
    const match = matchPath(window.location.pathname, {
        path: '/app/:app_id'
    });
    return match?.params?.app_id;
}

const authInterceptor = async (config) => {
    let local_token = localStorage.getItem('local.access.token.key');
    let nac_token = localStorage.getItem('nac.access.token');
    if (local_token) {
        if (isValidToken(local_token)) {
            config.headers['Authorization'] = `Bearer ${local_token}`;
            config.headers['nac_access_token'] = nac_token;
        } else {
            try {
                const { data: resp } = await axios.get(
                    import.meta.env['REACT_APP_NUCLIOS_BACKEND_API'] + '/refresh',
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                'local.refresh.token.key'
                            )}`
                        }
                    }
                );
                localStorage.setItem('local.access.token.key', resp.access_token);
                localStorage.setItem('local.access.token.exp', resp.exp);
                localStorage.setItem('local.refresh.token.key', resp.refresh_token);
                config.headers['Authorization'] = `Bearer ${resp.access_token}`;
                config.headers['nac_access_token'] = nac_token;
                store.dispatch({
                    type: 'authentication/setRefreshTokenExpired',
                    payload: 'refreshed'
                });
            } catch (err) {
                setTokenExpired();
            }
        }
    } else {
        try {
            let token = await PublicAuthConnector.authContext.getToken();
            config.headers['Authorization'] = `Bearer ${token}`;
            config.headers['nac_access_token'] = nac_token;
        } catch (err) {
            setTokenExpired();
        }
    }
    return config;
};

httpClient.interceptors.request.use(authInterceptor);
axiosClient.interceptors.request.use(authInterceptor);

const appInterceptor = (config) => {
    config.headers['Codx-App-Id'] = config.headers['Codx-App-Id'] || getAppId() || '';
    return config;
};
httpClient.interceptors.request.use(appInterceptor);
axiosClient.interceptors.request.use(appInterceptor);

function isValidToken(token) {
    if (!token) {
        return false;
    }
    const expiry = localStorage.getItem('local.access.token.exp');
    const now = Math.round(new Date().getTime() / 1000.0);
    const offset = 300; // 5min offset
    if (expiry && expiry > now + offset) {
        return true;
    } else {
        return false;
    }
}

async function setTokenExpired() {
    const refreshTokenExpired = await store.getState().authData.refreshTokenExpired;
    if (refreshTokenExpired !== 'to login') {
        localStorage.removeItem('local.access.token.key');
        localStorage.removeItem('local.access.token.exp');
        localStorage.removeItem('local.refresh.token.key');
        localStorage.removeItem('local.saml.user.id');
        localStorage.removeItem('nac.access.token');
        store.dispatch({
            type: 'authentication/resetAuthentication',
            payload: false
        });
        store.dispatch({
            type: 'authentication/setRefreshTokenExpired',
            payload: 'expired'
        });
    }
}

axiosRetry(httpClient, {
    retries: 2,
    retryDelay: () => {
        return 10000;
    },
    retryCondition: (error) => {
        if (error.response) {
            if (error.response.status === 502) {
                return true;
            } else if (import.meta.env['REACT_APP_ENV'] === 'prod') {
                return error.response.status === 500;
            }
            return false;
        } else {
            return error.message === 'Network Error';
        }
    }
});

axiosRetry(axiosClient, {
    retries: 2,
    retryDelay: () => {
        return 10000;
    },
    retryCondition: (error) => {
        if (error.response) {
            if (error.response.status === 502) {
                return true;
            } else if (import.meta.env['REACT_APP_ENV'] === 'prod') {
                return error.response.status === 500;
            }
            return false;
        } else {
            return error.message === 'Network Error';
        }
    }
});

export default httpClient;
