import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
}

export interface ItemCarrito {
  id: number;
  cliente: string;
  productoId: number;
  cantidad: number;
  creado: string;
}

export interface Orden {
  id: number;
  cliente: string;
  correo: string;
  total: number;
  creado: string;
}

export interface NuevoUsuario {
  nombre: string;
  usuario: string;
  password: string;
}

/**
 * Cliente de la API.
 *
 * No aparece el header Authorization en ninguna parte: lo agrega el
 * MsalInterceptor segun el protectedResourceMap. Si un endpoint empieza a
 * devolver 401, el problema esta en ese mapa y no aqui.
 */
@Injectable({ providedIn: 'root' })
export class Api {
  private http = inject(HttpClient);
  private base = environment.apiBase;

  /** Sin token: sirve para comprobar que el despliegue responde. */
  publico(): Observable<Record<string, string>> {
    return this.http.get<Record<string, string>>(`${this.base}/v1/public`);
  }

  productos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.base}/v1/productos`);
  }

  producto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.base}/v1/productos/${id}`);
  }

  quienSoy(): Observable<Record<string, unknown>> {
    return this.http.get<Record<string, unknown>>(`${this.base}/v1/productos/quien-soy`);
  }

  carrito(): Observable<ItemCarrito[]> {
    return this.http.get<ItemCarrito[]>(`${this.base}/v1/carrito`);
  }

  agregarAlCarrito(productoId: number, cantidad: number): Observable<ItemCarrito> {
    return this.http.post<ItemCarrito>(`${this.base}/v1/carrito`, { productoId, cantidad });
  }

  /** Confirma la compra: ms-ordenes registra la orden y publica orden.creada
   *  (dispara descuento de stock, notificacion y facturacion en paralelo). */
  crearOrden(items: { productoId: number; cantidad: number }[]): Observable<Orden> {
    return this.http.post<Orden>(`${this.base}/v1/ordenes`, { items });
  }

  /** Anonimo a proposito: quien se registra todavia no tiene cuenta. */
  registrar(datos: NuevoUsuario): Observable<Record<string, string>> {
    return this.http.post<Record<string, string>>(`${this.base}/auth/registro`, datos);
  }
}
