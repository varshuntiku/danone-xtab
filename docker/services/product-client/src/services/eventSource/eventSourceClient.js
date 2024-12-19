/*
USAGE

eventSourceClient(<URL>, { onMessage, onError });

onMessage will get { data: '', event: '', id: '', retry: ''} as parameter
 - data contains the message data
 - event contains type of event which could be handled with switch or if-else

In EventSource events are handled like => eventSource.addEventListener('<event_name>', <handler>).

Here in this custom client events can be handled inside onMessage, an example is as follows:-
onMessage({data, event}) {
    switch(event) {
        case <event_name>:
            <handler(data)>
            break;
    }
}
*/
import store from 'store/store';
import EventSourceParser from './EventSourceParser';
import { PublicAuthConnector } from 'auth/AuthContext';
import axios from 'axios';

const DEFAULT_INTERVAL = 1000;

const hydrateAuthHeaders = async (config) => {
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

const eventSourceClient = (
    url,
    {
        isSignal = false,
        signal: userSignal,
        headers,
        onMessage = () => {},
        onOpen,
        onClose,
        onError,
        reconnect = true,
        forceInterval = 1000,
        ...options
    }
) => {
    return new Promise((resolve, reject) => {
        let controller;
        let interval = forceInterval > 1000 ? forceInterval : DEFAULT_INTERVAL;
        let timer;

        const closeConnection = () => {
            clearTimeout(timer);
            controller?.abort?.();
        };

        const retry = (_interval) => {
            clearTimeout(timer);
            if (isSignal && userSignal?.aborted) {
                closeConnection();
                return;
            }
            timer = setTimeout(openConnection, _interval);
        };

        if (isSignal && userSignal) {
            userSignal.addEventListener('abort', () => {
                closeConnection();
                resolve();
            });
        }

        const openConnection = async () => {
            controller?.abort?.();
            controller = new AbortController();
            try {
                let requestOptions = {
                    ...options,
                    headers: {
                        accept: 'text/event-stream'
                    },
                    signal: controller.signal
                };
                requestOptions = await hydrateAuthHeaders(requestOptions);
                if (headers) {
                    requestOptions.headers = { ...requestOptions.headers, ...headers };
                }
                const response = await fetch(url, requestOptions);

                if (!response.body) {
                    throw new Error('Not valid event stream');
                }

                if (onOpen) {
                    await onOpen(response);
                }

                const onId = (id) => {
                    if (id) {
                        requestOptions.headers['last-event-id'] = id;
                    } else {
                        delete requestOptions.headers['last-event-id'];
                    }
                };

                const onRetry = (_interval) => {
                    interval = _interval;
                };

                const parser = new EventSourceParser(onMessage, onId, onRetry);
                await parser.processStream(response.body);

                if (reconnect) {
                    retry(interval);
                } else {
                    onClose?.();
                    closeConnection();
                    resolve();
                }
            } catch (error) {
                if (!controller.signal.aborted) {
                    try {
                        onError?.(error);
                        retry(interval);
                    } catch (err) {
                        closeConnection();
                        reject(err);
                    }
                } else {
                    closeConnection();
                    reject(error);
                }
            }
        };
        openConnection();
    });
};

function isValidToken(token) {
    if (!token) {
        return false;
    }
    const expiry = localStorage.getItem('local.access.token.exp');
    const now = Math.round(new Date().getTime() / 1000.0);
    const offset = 300; // 5min offset
    return expiry && expiry > now + offset;
}

async function setTokenExpired() {
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

export default eventSourceClient;
