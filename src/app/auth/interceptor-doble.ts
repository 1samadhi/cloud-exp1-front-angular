import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { MsalInterceptor } from '@azure/msal-angular';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { CognitoService } from './cognito.service';

/** Rutas que viajan sin token, igual que en el protectedResourceMap de MSAL. */
const ANONIMAS = [`${environment.apiBase}/v1/public`, `${environment.apiBase}/auth/`];

/**
 * Adjunta el token segun el proveedor con que se inicio sesion: si hay sesion
 * de Cognito usa su access token; si no, delega en MsalInterceptor (Entra ID).
 * Sin este desvio, MsalInterceptor mandaria al usuario de Cognito a Microsoft.
 */
@Injectable()
export class InterceptorDoble implements HttpInterceptor {
  private msal = inject(MsalInterceptor);
  private cognito = inject(CognitoService);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.cognito.token;
    const esApi = req.url.startsWith(environment.apiBase);
    if (token && esApi && !ANONIMAS.some((a) => req.url.startsWith(a))) {
      return next.handle(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
    }
    return this.msal.intercept(req, next);
  }
}
