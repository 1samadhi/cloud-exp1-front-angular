import { UserManagerSettings, WebStorageStateStore } from 'oidc-client-ts';

import { environment } from '../../environments/environment';

const { region, userPoolId, clientId, dominio, redirectUri, logoutUri } = environment.cognito;

/**
 * Configuracion OIDC de Cognito para usuarios externos a la institucion.
 *
 * Equivale al authConfig del proyecto de ejemplo. Cognito descubre solo sus
 * endpoints a partir del issuer: la "extension" del link es el id del grupo de
 * usuarios al final de la URL. El cierre de sesion no es estandar OIDC, por eso
 * se arma aparte contra el dominio de Cognito.
 */
export const cognitoAuthConfig: UserManagerSettings = {
  authority: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
  client_id: clientId,
  redirect_uri: redirectUri,
  post_logout_redirect_uri: logoutUri,
  response_type: 'code', // Authorization Code con PKCE, oidc-client-ts lo aplica solo
  scope: 'openid email profile',
  userStore: new WebStorageStateStore({ store: window.localStorage })
};

/** URL de cierre de sesion de Cognito; debe estar registrada en "URL de cierre de sesion". */
export function urlCierreCognito(): string {
  return `${dominio}/logout?client_id=${encodeURIComponent(clientId)}&logout_uri=${encodeURIComponent(logoutUri)}`;
}

export const cognitoConfigurado = !`${userPoolId}${clientId}${dominio}`.includes('PENDIENTE');
