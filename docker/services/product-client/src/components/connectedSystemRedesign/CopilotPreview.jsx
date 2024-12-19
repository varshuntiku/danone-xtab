import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from '@material-ui/core';

import ConnSystemChatbot from 'components/minerva/ConnSystemChatbot.jsx';

function CopilotPreview({ config }) {
    var app_info = false;
    const [open, setOpen] = React.useState(false);
    if (config['app_id']) {
        var app_id = parseInt(config['app_id']);

        app_info = {
            modules: {}
        };

        if (config['is_copilot']) {
            app_info.modules['copilot'] = {
                enabled: true,
                app_id: app_id,
                server_url: config['server_url']
            };
        } else {
            app_info.modules['minerva'] = {
                enabled: true,
                tenant_id: app_id,
                server_url: config['server_url']
            };
        }
    } else {
        return '';
    }

    const handlePreview = () => {
        setOpen(true);
    };

    const closePopup = () => {
        setOpen(false);
    };

    return (
        <>
            <Button variant="outlined" onClick={handlePreview}>
                Preview
            </Button>
            <ConnSystemChatbot app_info={app_info} open={open} closePopup={closePopup} />
        </>
    );
}

export default withRouter(CopilotPreview);
