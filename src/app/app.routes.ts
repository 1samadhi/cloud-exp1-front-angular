import { Routes } from '@angular/router';
import { guardSesion } from './auth/guard-sesion';

import { Inicio } from './paginas/inicio/inicio';
import { Catalogo } from './paginas/catalogo/catalogo';
import { Carrito } from './paginas/carrito/carrito';
import { Perfil } from './paginas/perfil/perfil';
import { Registro } from './paginas/registro/registro';

/**
 * MsalGuard protege las rutas: si no hay sesion activa redirige a Microsoft
 * antes de que el componente llegue a construirse. Inicio y Registro quedan
 * abiertas, porque un usuario que aun no tiene cuenta debe poder llegar a ellas.
 */
export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'registro', component: Registro },
  { path: 'catalogo', component: Catalogo, canActivate: [guardSesion] },
  { path: 'carrito', component: Carrito, canActivate: [guardSesion] },
  { path: 'perfil', component: Perfil, canActivate: [guardSesion] },
  { path: '**', redirectTo: '' }
];
