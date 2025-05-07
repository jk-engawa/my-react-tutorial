import React, { ReactNode, useContext } from 'react'
import { Navigate } from 'react-router';

import { AuthContext, AuthProvider, type TAuthConfig, type IAuthContext } from 'react-oauth2-code-pkce'

import { paths } from '@/config/paths';
import { env } from '@/config/env'
import { OAuthUser } from '@/types/api';
import { createApiInstance } from './api-client';
import { string } from 'zod';



const authConfig: TAuthConfig = {
    clientId: env.OAUTH2_CLIENT_ID,
    authorizationEndpoint: env.OAUTH2_BASE_URL + env.OAUTH2_AUTH_PATH,
    logoutEndpoint: env.OAUTH2_BASE_URL + env.OAUTH2_LOGOUT_PATH,
    tokenEndpoint: env.OAUTH2_BASE_URL + env.OAUTH2_TOKEN_PATH,
    redirectUri: env.OAUTH2_REDIRECT_URL,
    scope: env.OAUTH2_SCOPE,
    // Example to redirect back to original path after login has completed
    // preLogin: () => localStorage.setItem('preLoginPath', window.location.pathname),
    // postLogin: () => <Navigate to={paths.app.root.getHref()} replace />,
    decodeToken: false,
    autoLogin: false,
}

type Props = {
    children: ReactNode;
};

export function OAuthProvider({ children }: Props) {
    return (
        <AuthProvider authConfig={authConfig}>
            {children}
        </AuthProvider>
    );
};

export function getToken(): string {
    const { token } = useContext(AuthContext) as IAuthContext;
    return token;
}

export function logIn() {
    const { logIn } = useContext(AuthContext) as IAuthContext;
    logIn();
}

export function logOut() {
    const { logOut } = useContext(AuthContext) as IAuthContext;
    logOut();
}

export function ProtectedRoute ({ children }: { children: React.ReactNode }) {
    const token = getToken();
  
    if (!token) {
      return (
        <Navigate to={paths.auth.login.getHref()} replace />
      );
    }
    return children;
};

export async function getUser (token?: string): Promise<OAuthUser> {

    const api = createApiInstance(env.OAUTH2_BASE_URL, token);
    const response = await api.get(env.OAUTH2_USERINFO_PATH);

    return response.data;
};

