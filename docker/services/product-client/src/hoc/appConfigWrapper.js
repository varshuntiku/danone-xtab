import { useContext } from 'react';
import AppContext from '../context/appContext';

export const AppConfigOptions = {
    data_story: 'data_story',
    filter: 'filter',
    dashboard: 'dashboard',
    user_mgmt: 'user_mgmt'
};

export default function AppConfigWrapper({ appConfig, disableHide = false, children }) {
    const { app_info } = useContext(AppContext);
    const featureEnabled = app_info && app_info.modules && app_info.modules[appConfig];
    const showChild = disableHide || featureEnabled;
    if (typeof children === 'function') {
        if (showChild) {
            return children({ featureEnabled });
        } else {
            return null;
        }
    } else {
        if (showChild) {
            return children;
        } else {
            return null;
        }
    }
}
