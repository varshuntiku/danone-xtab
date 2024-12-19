import MsalAuth from '../auth/auth/MSALAuth';
import axios from 'axios';

async function getAccessToken(scopes) {
    const msalAuth = new MsalAuth();
    await msalAuth.init();
    const token = await msalAuth.getTokenWithPopupOnError({
        scopes: scopes ? scopes : ['https://analysis.windows.net/powerbi/api/.default']
    });

    return token;
}

export async function getEmbedData(params) {
    try {
        const token = await getAccessToken();
        const { data: response } = await axios.get(
            'https://api.powerbi.com/v1.0/myorg/groups/' +
                params.workspaceId +
                '/reports/' +
                params.reportId,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        params.callback({
            embedUrl: response['embedUrl'],
            accessToken: token
        });
        return true;
    } catch (error) {
        console.log(error);
        params.callback({ status: 'error' });
        return false;
    }
}

export async function getWorkspaces(params) {
    try {
        const token = await getAccessToken([
            'https://analysis.windows.net/powerbi/api/Workspace.Read.All'
        ]);
        const { data: response } = await axios.get('https://api.powerbi.com/v1.0/myorg/groups', {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        params.callback(response['value']);
        return true;
    } catch (error) {
        console.log(error);
        // params.callback({ status: 'error' });
        return null;
    }
}

export async function getDashboards(params) {
    try {
        const token = await getAccessToken([
            'https://analysis.windows.net/powerbi/api/Dashboard.Read.All'
        ]);
        await axios.get(
            'https://api.powerbi.com/v1.0/myorg/groups/' + params.workspaceId + '/dashboards',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // params.callback(response['value']);
        return true;
    } catch (error) {
        console.log(error);
        // params.callback({ status: 'error' });
        return null;
    }
}

export async function getDashboardTiles(params) {
    try {
        const token = await getAccessToken([
            'https://analysis.windows.net/powerbi/api/Dashboard.Read.All'
        ]);
        await axios.get(
            'https://api.powerbi.com/v1.0/myorg/groups/' +
                params.workspaceId +
                '/dashboards/' +
                params.dashboardId +
                '/tiles',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // params.callback(response['value']);
        return true;
    } catch (error) {
        console.log(error);
        // params.callback({ status: 'error' });
        return null;
    }
}

export async function getReports(params) {
    try {
        const token = await getAccessToken([
            'https://analysis.windows.net/powerbi/api/Report.Read.All'
        ]);
        const { data: response } = await axios.get(
            'https://api.powerbi.com/v1.0/myorg/groups/' + params.workspaceId + '/reports',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // console.log(response['value']);
        params.callback(response['value']);
        return true;
    } catch (error) {
        console.log(error);
         params.callback({ status: 'error' });
        return null;
    }
}

export async function getReportPages(params) {
    try {
        const token = await getAccessToken([
            'https://analysis.windows.net/powerbi/api/Report.Read.All'
        ]);
        const { data: response } = await axios.get(
            'https://api.powerbi.com/v1.0/myorg/reports/' + params.reportId + '/pages',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // console.log(response['value']);
        params.callback(response['value']);
        return true;
    } catch (error) {
        console.log(error);
        // params.callback({ status: 'error' });
        return null;
    }
}
