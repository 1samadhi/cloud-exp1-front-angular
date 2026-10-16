import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Api, ItemCarrito, Orden } from '../../servicios/api';

@Component({
  selector: 'app-carrito',
  imports: [FormsModule, DatePipe],
  templateUrl: './carrito.html'
})
export class Carrito implements OnInit {
  private api = inject(Api);
  readonly items = signal<ItemCarrito[]>([]);
  readonly error = signal('');
  readonly ordenCreada = signal<Orden | null>(null);
  readonly confirmando = signal(false);
  productoId = 1;
  cantidad = 1;

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.api.carrito().subscribe({
      next: (p) => this.items.set(p),
      error: (e) => this.error.set(`No se pudo cargar el carrito (HTTP ${e.status})`)
    });
  }

  crear(): void {
    this.error.set('');
    this.api.agregarAlCarrito(this.productoId, this.cantidad).subscribe({
      next: () => this.cargar(),
      error: (e) => this.error.set(e.error?.error ?? `Error HTTP ${e.status}`)
    });
  }

  /** Convierte los items del carrito en una orden real: ms-ordenes descuenta
   *  stock, notifica y factura, todo disparado por el mismo evento. */
  confirmarCompra(): void {
    this.error.set('');
    this.ordenCreada.set(null);
    const lineas = this.items().map((i) => ({ productoId: i.productoId, cantidad: i.cantidad }));
    if (lineas.length === 0) {
      this.error.set('El carrito esta vacio: agrega un item antes de confirmar.');
      return;
    }
    this.confirmando.set(true);
    this.api.crearOrden(lineas).subscribe({
      next: (orden) => {
        this.confirmando.set(false);
        this.ordenCreada.set(orden);
      },
      error: (e) => {
        this.confirmando.set(false);
        this.error.set(e.error?.error ?? `Error HTTP ${e.status}`);
      }
    });
  }
}
