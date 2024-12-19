// import httpClient from 'services/httpClient.js';
import axios from 'axios';
//TODO: rename logMatomoEvent to createMatomoEvent or logMatomoEvent
export async function logMatomoEvent(params) {
    try {
        if (
            import.meta.env['REACT_APP_MATOMO_SITE_URL'] &&
            import.meta.env['REACT_APP_MATOMO_TOKEN'] &&
            import.meta.env['REACT_APP_MATOMO_SITE_ID']
        ) {
            const api_params = {
                ...params,
                idsite: import.meta.env['REACT_APP_MATOMO_SITE_ID'],
                rec: 1,
                uid: sessionStorage.getItem('user_email'),
                token_auth: import.meta.env['REACT_APP_MATOMO_TOKEN']
            };
            // if (sessionStorage.getItem('user_country_code')) {
            //     api_params["country"] = sessionStorage.getItem('user_country_code');
            // }

            // if (sessionStorage.getItem('user_ip')) {
            //     api_params["cip"] = sessionStorage.getItem('user_ip');
            const response = axios.get(
                import.meta.env['REACT_APP_MATOMO_SITE_URL'] + 'matomo.php',
                {
                    params: api_params
                }
            );
            if (params.callback) {
                params.callback(response);
            }
            // params.callback(response['data']);
        }

        return true;
    } catch (error) {
        // throw new Error(error);
    }
}

export async function getGeoPlugin() {
    const apiTimeStamp = parseInt(sessionStorage.getItem('geoplugin_timestamp') || '0');

    const timeElapsed = Math.floor((Date.now() - apiTimeStamp) / 1000);

    if (timeElapsed > 10000) {
        try {
            axios
                .get('https://ipinfo.io/json?token=ea5a4117586bae')
                .then((res) => {
                    const response = res;
                    sessionStorage.setItem('user_ip', response.data?.ip);
                    // sessionStorage.setItem('user_country', response.data?.country_name);
                    // sessionStorage.setItem('user_country_code', response.data?.country_code?.toLowerCase());
                    sessionStorage.setItem(
                        'user_country_code',
                        response.data?.country?.toLowerCase()
                    );
                    sessionStorage.setItem('geoplugin_timestamp', String(Date.now()));
                })
                .catch(() => {
                    // TODO
                });
        } catch (error) {
            // TODO
        }
    }
}
