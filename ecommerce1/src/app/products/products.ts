import { Component, computed, inject, signal } from '@angular/core';
import { TranslatePipe, LocalizedCurrencyPipe } from '../pipes/locale.pipes';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Product } from '../product';
import { CartItem } from '../models/cart-item';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule, TranslatePipe, LocalizedCurrencyPipe],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products {

  private productService = inject(ProductService);

  searchText = signal('');
  selectedCategory = signal('All');

  products = this.productService.products;

  categories = computed(() => {

    const categories = this.products()
      .map(product => product.category);

    return ['All', ...new Set(categories)];
  });

  filteredProducts = computed(() => {

    const search = this.searchText().toLowerCase().trim();
    const selected = this.selectedCategory();

    return this.products().filter(product => {

      const matchesSearch =
        product.name.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search);

      const matchesCategory =
        selected === 'All' ||
        product.category === selected;

      return matchesSearch && matchesCategory;
    });
  });

  addToCart(product: Product): void {

    let cart: CartItem[] = [];

    try {
      cart = JSON.parse(localStorage.getItem('ecommerce_cart') || '[]');
    } catch {
      cart = [];
    }

    const existing = cart.find(
      item => item.product.id === product.id
    );

    if (existing) {
      if (existing.quantity >= product.stock) {
        alert(`Only ${product.stock} of ${product.name} available.`);
        return;
      }
      existing.quantity++;
    } else {
      cart.push({
        product,
        quantity: 1
      });
    }

    localStorage.setItem(
      'ecommerce_cart',
      JSON.stringify(cart)
    );

    alert(`${product.name} added to cart!`);
  }
}
