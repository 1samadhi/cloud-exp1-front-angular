import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

import { CognitoService } from './cognito.service';

/** Deja pasar con sesion de Cognito; si no, aplica MsalGuard (redirige a Microsoft). */
export const guardSesion: CanActivateFn = (route, state) => {
  if (inject(CognitoService).autenticado) return true;
  return inject(MsalGuard).canActivate(route, state);
};
