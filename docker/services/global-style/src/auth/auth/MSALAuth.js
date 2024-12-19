import * as msal from '@azure/msal-browser';
import BaseAuth from './BaseAuth';

export default class MsalAuth extends BaseAuth {
    msalPublicClientApp;
    request = {
        scopes: ['api://ab51dea7-e54a-4007-bfde-3404abf24dfc/user_impersonation'],
        prompt: 'select_account'
    };
    constructor() {
        super();
        this.msalPublicClientApp = new msal.PublicClientApplication({
            auth: {
                clientId: 'ab51dea7-e54a-4007-bfde-3404abf24dfc',
                authority: 'https://login.microsoftonline.com/4bf30310-e4f1-4658-9e34-9e8a5a193ed1/'
            },
            cache: {
                cacheLocation: 'localStorage'
                // storeAuthStateInCookie: true
            }
            // system: {
            //     loadFrameTimeout: 30000
            // },
        });
    }

    async init() {
        try {
            const response = await this.msalPublicClientApp.handleRedirectPromise();
            if (response?.account) {
                this.msalPublicClientApp.setActiveAccount(response.account);
            } else {
                // TODO
            }
        } catch (err) {
            // TODO
        }
    }

    login = async () => {
        try {
            let response = await this.msalPublicClientApp.loginPopup(this.request);
            if (response?.account) {
                this.msalPublicClientApp.setActiveAccount(response.account);
                return 'SUCCESS';
            } else {
                // TO DO : No Account impl
            }
        } catch (error) {
            // TODO
        }
    };

    logout = async () => {
        return this.msalPublicClientApp
            .logoutPopup({
                account: this.msalPublicClientApp.getActiveAccount()
            })
            .then(() => {
                return { status: 'success' };
            });
    };

    getToken = async (request = null) => {
        try {
            const tokenResponse = await this.msalPublicClientApp.acquireTokenSilentAsync(
                request || this.request,
                this.msalPublicClientApp.getActiveAccount()
            );
            return tokenResponse?.accessToken;
        } catch (err) {
            return '';
        }
    };

    getTokenWithPopupOnError = async (request = null) => {
        try {
            const tokenResponse = await this.msalPublicClientApp.acquireTokenSilentAsync(
                request || this.request,
                this.msalPublicClientApp.getActiveAccount()
            );
            return tokenResponse?.accessToken;
        } catch (err) {
            try {
                const respons = await this.msalPublicClientApp.acquireTokenPopup(
                    request || this.request
                );
                this.account = respons.account;
                this.msalPublicClientApp.setActiveAccount(respons.account);
                return respons.idToken;
            } catch (err) {
                return '';
            }
        }
    };

    getAccount = () => {
        return this.msalPublicClientApp.getActiveAccount();
    };
}
