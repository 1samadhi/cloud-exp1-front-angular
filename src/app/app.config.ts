import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  MSAL_INSTANCE,
  MSAL_GUARD_CONFIG,
  MSAL_INTERCEPTOR_CONFIG,
  MsalService,
  MsalGuard,
  MsalBroadcastService,
  MsalInterceptor
} from '@azure/msal-angular';

import { CognitoService } from './auth/cognito.service';
import { InterceptorDoble } from './auth/interceptor-doble';
import { routes } from './app.routes';
import { crearMsal, configuracionDelGuard, configuracionDelInterceptor } from './auth/msal.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    // La sesion de Cognito se restaura antes de la primera navegacion, para que
    // el guard no mande a Microsoft a quien ya inicio sesion por Cognito.
    provideAppInitializer(() => inject(CognitoService).iniciar()),

    // withInterceptorsFromDi permite que MsalInterceptor, que es un
    // interceptor de clase, participe en la cadena de HttpClient.
    provideHttpClient(withInterceptorsFromDi()),

    { provide: MSAL_INSTANCE, useFactory: crearMsal },
    { provide: MSAL_GUARD_CONFIG, useFactory: configuracionDelGuard },
    { provide: MSAL_INTERCEPTOR_CONFIG, useFactory: configuracionDelInterceptor },

    // Adjunta el Authorization: Bearer en cada peticion cuya URL este en el
    // protectedResourceMap. Ningun servicio de la aplicacion maneja tokens.
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorDoble, multi: true },
    MsalInterceptor,

    MsalService,
    MsalGuard,
    MsalBroadcastService
  ]
};
