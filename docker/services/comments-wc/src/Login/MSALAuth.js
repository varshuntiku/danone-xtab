import * as msal from '@azure/msal-browser';
import BaseAuth from "./BaseAuth";
import globalState from '../../store/GlobalState';

export default class MsalAuth extends BaseAuth {
  msalPublicClientApp;

  request = {
    scopes: [],
    prompt: 'select_account'
  };

  constructor() {
    super();
  }

  //  fetch clientId and tenantId from the backend
  async fetchClientConfig() {
    try {
      const response = await fetch("https://nuclios-gen-ai-dev.mathco.com/comments-backend/users/ad-details");
      const data = await response.json();

      globalState.setState({
        clientId: data.clientId,
        tenantId: data.tenantId
      });


      return data;
    } catch (err) {
      console.error("Error fetching client configuration:", err);
      throw new Error("Could not fetch configuration");
    }
  }

  async init() {
    try {
      // Check if clientId and tenantId are already in the global state
      let clientId = globalState.getState().clientId;
      let tenantId = globalState.getState().tenantId;

      // If not present, fetch them from backend and store in global state
      if (!clientId || !tenantId) {
        const config = await this.fetchClientConfig();
        clientId = config.clientId;
        tenantId = config.tenantId;
      }

      // Initialize MSAL only if clientId and tenantId are available
      if (clientId && tenantId) {
        this.msalPublicClientApp = new msal.PublicClientApplication({
          auth: {
            clientId: clientId,
            authority: `https://login.microsoftonline.com/${tenantId}`
          },
          cache: {
            cacheLocation: 'localStorage'
          }
        });

        // Set scopes dynamically using clientId
        this.request.scopes = [`api://${clientId}/User.Read`];

      await this.msalPublicClientApp.initialize()
      const response = await this.msalPublicClientApp.handleRedirectPromise();
        if (response?.account) {
          this.msalPublicClientApp.setActiveAccount(response.account);
        }
      } else {
        console.error("Client ID or Tenant ID is missing");
      }
    } catch (err) {
      console.error("Initialization error:", err);
    }
  }

  login = async () => {
    try {
      let response = await this.msalPublicClientApp.loginPopup(this.request);
      if (response?.account) {
        this.msalPublicClientApp.setActiveAccount(response.account);
      } 
      return response;
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  getToken = async (request = null) => {
    try {
      const tokenResponse = await this.msalPublicClientApp.acquireTokenSilent(
        request || this.request,
        this.msalPublicClientApp.getActiveAccount()
      );
      return tokenResponse?.accessToken;
    } catch (err) {
      console.error("Error fetching token:", err);
      return '';
    }
  };

  getTokenWithPopupOnError = async (request = null) => {
    try {
      const tokenResponse = await this.msalPublicClientApp.acquireTokenSilent(
        request || this.request,
        this.msalPublicClientApp.getActiveAccount()
      );
      return tokenResponse?.accessToken;
    } catch (err) {
      try {
        const response = await this.msalPublicClientApp.acquireTokenPopup(
          request || this.request
        );
        this.msalPublicClientApp.setActiveAccount(response.account);
        return response.idToken;
      } catch (err) {
        console.error("Error fetching token with popup:", err);
        return '';
      }
    }
  };
}
