import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { ProductService, ProductResponseDTO } from '../../../services/product.service';

@Component({
  selector: 'app-waiter-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './waiter-order.component.html'
})
export class WaiterOrderComponent implements OnInit {
  tableId!: number;
  products: ProductResponseDTO[] = [];
  cart: any[] = [];
  activeOrder: any = null;
  showSuccessModal = false;
  showCloseModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.tableId = +this.route.snapshot.params['tableId'];
    this.loadData();
  }

  loadData() {
    // Llamamos al servicio de productos para obtener solo los activos
    this.productService.getActiveProducts().subscribe({
      next: (data) => {
        this.products = data;
        console.log("Productos activos cargados:", this.products);
      },
      error: (err) => {
        console.error("Error 500 al cargar productos habilitados:", err);
      }
    });

    // Llamamos al servicio de órdenes para el consumo de la mesa
    this.orderService.getActiveOrder(this.tableId).subscribe({
      next: (order) => {
        this.activeOrder = order || null;
      },
      error: (err) => {
        console.error("Error al cargar consumo de mesa:", err);
        this.activeOrder = null;
      }
    });
  }

// Cambia el método addItem por este:
  addItem(p: ProductResponseDTO) { // Usamos el tipo real en lugar de 'any'
    const itemInCart = this.cart.find(i => i.productId === p.id);
    const currentQuantity = itemInCart ? itemInCart.quantity : 0;

    if (currentQuantity < p.stock) {
      if (itemInCart) {
        itemInCart.quantity++;
      } else {
        this.cart.push({
          productId: p.id,
          // Usamos el índice de forma segura
          name: p.translations.length > 0 ? p.translations[0].name : 'Sin nombre',
          quantity: 1,
          price: p.price
        });
      }
    }
  }

  removeItem(p: ProductResponseDTO) {
    const index = this.cart.findIndex(i => i.productId === p.id);
    if (index !== -1) {
      if (this.cart[index].quantity > 1) {
        this.cart[index].quantity--;
      } else {
        this.cart.splice(index, 1);
      }
    }
  }

  getQuantity(id: number) { return this.cart.find(i => i.productId === id)?.quantity || 0; }
  calculateTotal() { return this.cart.reduce((t, i) => t + (i.price * i.quantity), 0); }

  sendOrder() {
    const userJson = localStorage.getItem('currentUser');
    if (!userJson) return;
    const user = JSON.parse(userJson);

    const orderData = {
      user: { id: Number(user.id) },
      table: { id: Number(this.tableId) },
      items: this.cart.map(i => ({
        product: { id: Number(i.productId) },
        quantity: i.quantity
      }))
    };

    this.orderService.createOrder(orderData).subscribe({
      next: () => {
        this.showSuccessModal = true;
        this.cart = [];
        this.loadData();
      },
      error: (err: any) => console.error("Error al enviar:", err)
    });
  }

  confirmClose() {
    this.orderService.closeOrder(this.tableId).subscribe({
      next: () => {
        this.showCloseModal = false;
        this.router.navigate(['/mozos/mesas']);
      },
      error: (err: any) => console.error("Error al cerrar:", err)
    });
  }

  closeSuccessAndNavigate() {
    this.showSuccessModal = false;
    this.router.navigate(['/mozos/mesas']);
  }
}
