/**
 * Configuracion de produccion: el frontend se sirve detras del stage del API
 * Gateway, asi que el redirectUri registrado en Entra apunta a esa URL.
 */
export const environment = {
  produccion: true,
  entra: {
    clientId: 'c483f102-da2d-41b5-b48e-26e7ca78ab98',
    tenantId: '5cb85dc6-a73b-41fc-b2b9-5b2a9b3f531b',
    // MSAL arma solo los endpoints v2 a partir de esta autoridad: no lleva /v2.0
    autoridad: 'https://login.microsoftonline.com/5cb85dc6-a73b-41fc-b2b9-5b2a9b3f531b',
    redirectUri: 'https://0nxb0dg1ub.execute-api.us-east-1.amazonaws.com/desarrollo/',
    appIdUri: 'api://c483f102-da2d-41b5-b48e-26e7ca78ab98'
  },
  // Amazon Cognito: acceso para usuarios externos (autorregistro con correo).
  // Los valores PENDIENTE salen de la consola de AWS al crear el grupo de usuarios.
  cognito: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_wxeYD55lo',      // us-east-1_XXXXXXXXX
    clientId: 'sc43g201v1873abj18sms16k1',        // Client ID de la app SPA en Cognito
    dominio: 'https://pedidos360-xeyd55lo.auth.us-east-1.amazoncognito.com',         // https://<prefijo>.auth.us-east-1.amazoncognito.com
    redirectUri: 'https://0nxb0dg1ub.execute-api.us-east-1.amazonaws.com/desarrollo/',
    logoutUri: 'https://0nxb0dg1ub.execute-api.us-east-1.amazonaws.com/desarrollo/'
  },
  apiBase: 'https://0nxb0dg1ub.execute-api.us-east-1.amazonaws.com/desarrollo'
};
