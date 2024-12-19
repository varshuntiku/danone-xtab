import { axiosClient } from 'services/httpClient.js';

export async function getAlerts(params) {
    try {
        const response = await axiosClient.get('/alerts', {
            params: params.payload
        });
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function createAlert(params) {
    try {
        const response = await axiosClient.post('/alerts', {
            ...params.payload
        });
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getAlertsByWidget(params) {
    try {
        const response = await axiosClient.get('/alerts/widgets/' + params.widgetId, {
            params: params.payload
        });
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function updateAlert(params) {
    try {
        const response = await axiosClient.put('/alerts/' + params.alertId, { ...params.payload });
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function deleteAlert(params) {
    try {
        const response = await axiosClient.delete('/alerts/' + params.alertId, {});
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function updateAlertNotification(params) {
    //update receive notification from alert workspace
    try {
        const response = await axiosClient.put('/alerts/' + params.alertId + '/notification', {
            ...params.payload
        });
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getNotifications(params) {
    try {
        const response = await axiosClient.get('/notification', { params: params.payload });
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function updateNotificationRead(params) {
    try {
        const response = await axiosClient.put('/notification/' + params.notificationId + '/read', {
            ...params.payload
        });
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function markAllNotificationRead(params) {
    try {
        const response = await axiosClient.put('/notifications/read', { ...params.payload });
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function deleteNotifications(params) {
    try {
        await axiosClient.delete('/notification/delete', {
            data: { ...params.payload }
        });
        params.callback();
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getFilteredNotifications(params) {
    try {
        const response = await axiosClient.get('/notifications/filter', { params: params.payload });
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getJwtToken(params) {
    try {
        const response = await axiosClient.post('/user/token/', { ...params.payload });
        params.callback(response['data']);
    } catch (error) {
        throw new Error(error);
    }
}

export async function getJwtTokenByUser(params) {
    try {
        const response = await axiosClient.get('/user/token/');
        params.callback(response['data']);
    } catch (error) {
        throw new Error(error);
    }
}

export async function deleteUserToken(params) {
    try {
        const response = await axiosClient.delete('/user/token/' + params.id);
        params.callback(response['data']);
    } catch (error) {
        throw new Error(error);
    }
}

export async function addSubscription(params) {
    try {
        const response = await axiosClient.post('/subscriptionapp/screen/subscription', {
            subscriptions: params.appLevelSetting ? params.appLevelSetting : params.savedChanges
        });
        params.callback('Successfully saved subscription settings!', 'success', response['data']);
    } catch (error) {
        params.callback('Could not save subscription settings', 'error');
        throw new Error(error);
    }
}
