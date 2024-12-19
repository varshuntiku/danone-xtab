import React from 'react';
import FullScreenMessage from './Admin/FullScreenMessage';
export default function AppUserMessage({ app_info }) {
    let no_screen_msg = '';
    if (!app_info.scrrens?.length) {
        if (app_info.modules.user_mgmt) {
            if (app_info.is_app_user) {
                no_screen_msg = 'Role or screens are not associated. Please contact Admin.';
            } else {
                no_screen_msg = 'You are not an App user. Please contact Admin.';
            }
        }
    }
    if (no_screen_msg) {
        return <FullScreenMessage text={no_screen_msg} />;
    } else {
        return null;
    }
}
