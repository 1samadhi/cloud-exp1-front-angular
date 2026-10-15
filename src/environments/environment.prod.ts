/**
 * Configuracion de produccion: el frontend se sirve directo desde la EC2
 * (puerto 80, su propia URL), separado del API Gateway que solo expone el
 * backend. Son dos origenes distintos a proposito: asi el navegador hace
 * peticiones CORS reales hacia la API y cada microservicio las valida.
 */
export const environment = {
  produccion: true,
  entra: {
    clientId: 'c483f102-da2d-41b5-b48e-26e7ca78ab98',
    tenantId: '5cb85dc6-a73b-41fc-b2b9-5b2a9b3f531b',
    // MSAL arma solo los endpoints v2 a partir de esta autoridad: no lleva /v2.0
    autoridad: 'https://login.microsoftonline.com/5cb85dc6-a73b-41fc-b2b9-5b2a9b3f531b',
    redirectUri: 'http://44.204.158.222/',
    appIdUri: 'api://c483f102-da2d-41b5-b48e-26e7ca78ab98'
  },
  // Amazon Cognito: acceso para usuarios externos (autorregistro con correo).
  cognito: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_OQ82j9BOi',
    clientId: '20jn3q3vg0rd2d26jb9gq4dafg',
    dominio: 'https://pedidos360-oq82j9boi.auth.us-east-1.amazoncognito.com',
    redirectUri: 'http://44.204.158.222/',
    logoutUri: 'http://44.204.158.222/'
  },
  apiBase: 'https://8b3fvdvhe6.execute-api.us-east-1.amazonaws.com/desarrollo'
};
