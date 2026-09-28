import { Injectable, signal } from '@angular/core';
import { User, UserManager } from 'oidc-client-ts';

import { cognitoAuthConfig, cognitoConfigurado, urlCierreCognito } from './cognito.config';

/**
 * Sesion de Cognito. Convive con MSAL: un usuario de la institucion entra por
 * Microsoft y uno externo por Cognito; el backend acepta los dos emisores.
 */
@Injectable({ providedIn: 'root' })
export class CognitoService {
  private manager = cognitoConfigurado ? new UserManager(cognitoAuthConfig) : null;

  readonly usuario = signal<User | null>(null);
  readonly disponible = cognitoConfigurado;

  /** Procesa el retorno de Cognito (?code=...&state=...) y restaura la sesion guardada. */
  async iniciar(): Promise<void> {
    if (!this.manager) return;
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.has('code') && params.has('state')) {
        this.usuario.set(await this.manager.signinCallback() ?? null);
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        const u = await this.manager.getUser();
        this.usuario.set(u && !u.expired ? u : null);
      }
    } catch (e) {
      console.error('[Cognito] No se pudo completar el inicio de sesion', e);
    }
  }

  get autenticado(): boolean {
    const u = this.usuario();
    return !!u && !u.expired;
  }

  /** Access token que se envia al backend. */
  get token(): string | null {
    return this.autenticado ? this.usuario()!.access_token : null;
  }

  entrar(): Promise<void> {
    return this.manager!.signinRedirect();
  }

  async salir(): Promise<void> {
    await this.manager?.removeUser();
    this.usuario.set(null);
    window.location.href = urlCierreCognito();
  }
}
