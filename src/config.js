// src/config.js
export const config = {
  authorizationEndpoint: process.env.REACT_APP_AUTHORIZATION_ENDPOINT,
  tokenEndpoint: process.env.REACT_APP_TOKEN_ENDPOINT,
  clientId: process.env.REACT_APP_CLIENT_ID,
  redirectUri: process.env.REACT_APP_REDIRECT_URI,
  scope: process.env.REACT_APP_SCOPE,
  userInfoEndpoint: process.env.REACT_APP_USERINFO_ENDPOINT,
};
