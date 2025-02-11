import moment from 'moment';
import { PublicAuthConnector } from 'auth/AuthContext';
import { logout } from 'services/auth.js';
import { stopAutoRefreshAccessToken } from 'services/auth';

export const capitalizeFirstLetter = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export function Pipeline(data) {
    return {
        data,
        call: (fn) => {
            return new Pipeline(fn(data));
        }
    };
}

export function parseDate(date) {
    return date && new Date(date);
}

export function dateToString(date, suppressUTC, allowInvalid) {
    if (allowInvalid && isNaN(date?.getTime())) {
        return date?.toString();
    }
    if (date && !isNaN(date?.getTime())) {
        if (suppressUTC) {
            const v = moment.utc(date).local().format('YYYY-MM-DDTHH:mm:ss.SSS');
            return v;
        } else {
            return date?.toJSON();
        }
    } else {
        return null;
    }
}

export const getDeepValue = (obj, field) => {
    try {
        return field.split('.').reduce((ob, p) => ob[p], obj);
    } catch (err) {
        return undefined;
    }
};

export const setDeepValue = (obj, field, value) => {
    try {
        return (field.split('.').reduce((ob, p, i, arr) => {
            if (i === arr.length - 1) {
                return ob;
            } else if (ob[p]) {
                return ob[p];
            } else {
                return (ob[p] = {});
            }
        }, obj)[field.split('.').slice(-1)] = value);
    } catch (err) {
        return undefined;
    }
};

export const getFinalFilterObj = (
    app_info,
    screen_id,
    screen_filters_values,
    selectedFilters,
    dataValues = null
) => {
    let final_selected = {};
    const pivotInfo = screen_filters_values?.pivot_info;
    const hasPivot = !!(pivotInfo && pivotInfo.length);

    if (!selectedFilters) {
        return final_selected;
    }

    Object.keys(selectedFilters)
        .filter((key) => {
            if (hasPivot) {
                const item = pivotInfo.find((el) => el.key === key);
                return !!item?.type;
            } else {
                return true;
            }
        })
        .forEach((item) => {
            final_selected[item] = selectedFilters[item];
        });

    if (hasPivot) {
        final_selected['__pivot_info__'] = pivotInfo;
    }

    sessionStorage.setItem(
        'app_screen_filter_info_' + app_info.id + '_' + screen_id,
        JSON.stringify(final_selected)
    );
    if (dataValues) {
        sessionStorage.setItem(
            'app_screen_filter_info_datavalue_' + app_info.id + '_' + screen_id,
            JSON.stringify(dataValues)
        );
    }
    if (app_info.modules?.retain_filters) {
        if (sessionStorage.getItem('app_filter_info_' + app_info.id)) {
            const app_filter = JSON.parse(sessionStorage.getItem('app_filter_info_' + app_info.id));
            const updated_app_filter = {
                ...app_filter,
                ...final_selected
            };
            sessionStorage.setItem(
                'app_filter_info_' + app_info.id,
                JSON.stringify(updated_app_filter)
            );
        } else {
            sessionStorage.setItem(
                'app_filter_info_' + app_info.id,
                JSON.stringify(final_selected)
            );
        }
    }
    return final_selected;
};

export const logoutUser = async () => {
    try {
        if (!localStorage.getItem('local.access.token.key')) {
            // azure ad user logout
            let account = PublicAuthConnector.authContext.getAccount();
            let response;
            if (account) {
                response = await setLastLogoutTime();
            }
            if (response.status == 'success') {
                return await PublicAuthConnector.authContext.logout();
            }
        } else {
            // db user logout
            stopAutoRefreshAccessToken();
            return await setLastLogoutTime();
        }
    } catch (err) {
        return undefined;
    }
};

export const setLastLogoutTime = () => {
    try {
        return logout({
            callback: () => {
                window.localStorage.setItem('logout-event', 'started');
                clearAllTokens();
            }
        });
    } catch (error) {
        // TODO
    }
};

export const clearAllTokens = () => {
    try {
        localStorage.removeItem('local.refresh.token.key');
        localStorage.removeItem('local.access.token.key');
        localStorage.removeItem('local.access.token.exp');
        localStorage.removeItem('local.saml.user.id');
        localStorage.removeItem('nac.access.token');
        localStorage.removeItem('logout-event');
    } catch (error) {
        // TODO
    }
};

export function dateDifference(date) {
    return Math.floor((new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
}
