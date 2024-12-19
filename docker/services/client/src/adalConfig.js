import { AuthenticationContext } from "react-adal";

export const adalConfig = {
  tenant: "4bf30310-e4f1-4658-9e34-9e8a5a193ed1",
  clientId: "ab51dea7-e54a-4007-bfde-3404abf24dfc",
  endpoints: {
    api: "https://themathcompany.com/6d477e6c-ac10-4336-b497-87d176835165"
  },
  cacheLocation: "localStorage"
};

export const authContext = new AuthenticationContext(adalConfig);

export const getToken = () => {
  return authContext.getCachedToken(authContext.config.clientId);
};

// export const adalApiFetch = (fetch, url, options) =>
//   adalFetch(authContext, adalConfig.endpoints.api, fetch, url, options);

// export const withAdalLoginApi = withAdalLogin(
//   authContext,
//   adalConfig.endpoints.api
// );
