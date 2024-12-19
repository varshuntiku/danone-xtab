import { axiosClient, generateAxiosClient } from 'services/httpClient.js';
import axios from 'axios';
import store from 'store/store';

const axiosClientWithCredentials = generateAxiosClient();

export async function login(params) {
    try {
        const response = await axiosClient.post('/login', {
            username: params.username,
            password: params.password
        });
        params.callback(response['data']);
        return true;
    } catch (error) {
        if (error.response && error.response.data) {
            if (error.response.status === 429) {
                params.callback({
                    status: 'error',
                    message: 'Too many requests. Please wait a few minutes before trying again.'
                });
            } else {
                params.callback({
                    status: 'error',
                    message: error.response.data.error ? error.response.data.error : 'login error'
                });
            }
        }
        // throw new Error(error);
    }
}

export async function loginSAML(params) {
    try {
        const response = await axiosClientWithCredentials.get(
            '/login?redirect_url=' + window.location.href
        );
        params.callback(response['data']);
    } catch (error) {
        if (error.response && error.response.data) {
            params.callback({
                status: 'error',
                message: error.response.data.error ? error.response.data.error : 'login error'
            });
        }
    }
}

export async function loginSAMLToken(params) {
    try {
        const response = await axiosClientWithCredentials.get('/login/get-token');
        params.callback(response['data']);
    } catch (error) {
        if (error.response && error.response.data) {
            params.callback({
                status: 'error',
                message: error.response.data.error ? error.response.data.error : 'login error'
            });
        } else {
            params.callback({
                status: 'error',
                message: 'login error'
            });
        }
    }
}

export async function getLoginConfig(params) {
    try {
        const response = await axiosClient.get('/login/get-config');
        params.callback(response['data']);
    } catch (error) {
        if (error.response && error.response.data) {
            params.callback({
                status: 'error',
                message: error.response.data.error
                    ? error.response.data.error
                    : 'Error getting login config'
            });
        } else {
            params.callback({
                status: 'error',
                message: 'Error getting login config'
            });
        }
    }
}

// export async function saveLoginConfig(params) {
//     try {
//         const response = await axiosClient.post('/login/save-config', params.loginConfig);
//         params.callback(response['data']);
//     } catch (error) {
//         if (error.response && error.response.data) {
//             params.callback({
//                 status: 'error',
//                 message: error.response.data.error
//                     ? error.response.data.error
//                     : 'Error saving login config'
//             });
//         } else {
//             params.callback({
//                 status: 'error',
//                 message: 'Error saving login config'
//             });
//         }
//     }
// }

export async function saveLoginConfig(params) {
    try {
        const response = await axiosClient.post('/login/save-login-config', params.formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        params.callback(response['data']);
    } catch (error) {
        if (error.response && error.response.data) {
            params.callback({
                status: 'error',
                message: error.response.data.error
                    ? error.response.data.error
                    : 'Error saving login config'
            });
        } else {
            params.callback({
                status: 'error',
                message: 'Error saving login config'
            });
        }
    }
}

export async function getUserAppId(params) {
    try {
        const response = await axiosClient.get('/app/user-app');
        params.callback(response['data']);
        return true;
    } catch (error) {
        if (error.response && error.response.data) {
            params.callback({
                status: 'error',
                message: error.response.data.error ? error.response.data.error : 'access error'
            });
        }
        // throw new Error(error);
    }
}

export async function verifyAuth(params) {
    // var auth_token = localStorage.getItem('token');
    /******
     * SSO Cases
     * Case 1: No adal params (First time load)
     * Case 2: User has gone to the MSoft login screen through Codx (Not logged in)
     * adal.error ('')
     * adal.error.description ('')
     * adal.state.login (key)
     * adal.nonce.idtoken (key)
     * adal.login.request (URL redirect after login)
     * adal.login.error ('')
     * Case 3: On successful login from MSoft
     * adal.session.state (key)
     * adal.idtoken (key)
     * adal.token.keys (key)
     * adal.access.token.key... (key)
     * adal.expiration.key... (timestamp)
     * adal.token.renew.status... ('Completed')
     * Case 4: On logout from MSoft
     * adal.expiration.key... (0)
     * adal.token.renew.status... ('Completed')
     * adal.state.renew ('')
     * adal.session.state ('')
     * adal.token.keys ('')
     * adal.access.token.key... ('')
     * adal.idtoken ('')
     * Local login cases
     * Case 1: No local params (First time load)
     * Case 2: User has successfully logged in
     * local.access.token.key (key)
     * local.refresh.token.key (key)
     * Case 3: User has successfully logged out
     * local.access.token.key ('')
     * local.refresh.token.key ('')
     */
    try {
        const response = await axiosClient.get('/user/get-info');
        params.callback(response['data']);
        return true;
    } catch (error) {
        if (error.response && error.response.data) {
            params.callback({
                status: 'error',
                message: 'Error getting user information',
                loggedOutTokenError:
                    error.response.data.description === 'Logged out token used by client'
                        ? true
                        : false
            });
        }
        // throw new Error(error);
    }
    // stay on this route since the user is not authenticated
}

export async function getUserSpecialAccess(params) {
    try {
        if (import.meta.env['REACT_APP_COPILOT_ADMIN_CLIENT']) {
            params.callback({
                status: 'error',
                message: 'user-access unused!'
            });
            return;
        }
        const response = await axiosClient.get('/app/user-access');
        params.callback(response['data']);
        return true;
    } catch (error) {
        if (error.response && error.response.data) {
            params.callback({
                status: 'error',
                message: error.response.data.error ? error.response.data.error : 'access error'
            });
        }
        // throw new Error(error);
    }
}

export async function logout(params) {
    try {
        if (import.meta.env['REACT_APP_COPILOT_ADMIN_CLIENT']) {
            params.callback({ status: 'success' });
            return { status: 'success' };
        }
        const response = await axiosClient.put('/logout', null);
        params.callback(response['data']);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            params.callback({
                status: 'error',
                message: error.response.data.description
                    ? error.response.data.error
                    : 'logout error'
            });
        }
        // throw new Error(error);
    }
}

let timeout = null;
export async function setAutoRefreshActionToken() {
    if (timeout) {
        stopAutoRefreshAccessToken();
    }
    if (localStorage.getItem('local.refresh.token.key')) {
        const expiry = localStorage.getItem('local.access.token.exp');
        const now = Math.round(new Date().getTime() / 1000.0);
        const offset = 300; // 5min offset
        const left = expiry - (now + offset);
        timeout = setTimeout(async () => {
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
                setAutoRefreshActionToken();
                store.dispatch({
                    type: 'authentication/setRefreshTokenExpired',
                    payload: 'refreshed'
                });
            } catch (err) {
                const refreshTokenExpired = await store.getState().authData.refreshTokenExpired;
                if (refreshTokenExpired !== 'to login') {
                    localStorage.removeItem('local.access.token.key');
                    localStorage.removeItem('local.access.token.exp');
                    localStorage.removeItem('local.refresh.token.key');
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
        }, left * 1000);
    }
}

export function stopAutoRefreshAccessToken() {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
}
