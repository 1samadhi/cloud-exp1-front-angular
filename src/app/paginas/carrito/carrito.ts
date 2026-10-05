import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Api, ItemCarrito } from '../../servicios/api';

@Component({
  selector: 'app-carrito',
  imports: [FormsModule, DatePipe],
  templateUrl: './carrito.html'
})
export class Carrito implements OnInit {
  private api = inject(Api);
  readonly items = signal<ItemCarrito[]>([]);
  readonly error = signal('');
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
}
