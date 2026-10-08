import { Injectable, signal } from '@angular/core';
import { Product } from '../product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly storageKey = 'ecommerce_products';

  private productsSignal = signal<Product[]>(this.loadProducts());

  products = this.productsSignal.asReadonly();

  constructor() {
    if (localStorage.getItem(this.storageKey) === null) {
      this.addDefaultProducts();
    }
  }

  private loadProducts(): Product[] {
    const data = localStorage.getItem(this.storageKey);

    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return [];
      }
    }

    return [];
  }

  private saveProducts(products: Product[]): void {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(products)
    );

    this.productsSignal.set(products);
  }

  private addDefaultProducts(): void {

    const products: Product[] = [
      {
        id: 1,
        name: 'Samsung Galaxy Smartphone',
        description: 'Latest Samsung smartphone with excellent camera and performance.',
        price: 24999,
        category: 'Mobiles',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
        rating: 4.5,
        stock: 20
      },
      {
        id: 2,
        name: 'HP Laptop',
        description: 'Powerful laptop suitable for students and professionals.',
        price: 54999,
        category: 'Laptops',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
        rating: 4.4,
        stock: 15
      },
      {
        id: 3,
        name: 'Wireless Headphones',
        description: 'Comfortable wireless headphones with high-quality sound.',
        price: 2999,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        rating: 4.3,
        stock: 30
      },
      {
        id: 4,
        name: 'Smart Watch',
        description: 'Smart watch with fitness tracking and notifications.',
        price: 3999,
        category: 'Wearables',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
        rating: 4.2,
        stock: 25
      },
      {
        id: 5,
        name: 'Running Shoes',
        description: 'Lightweight running shoes for everyday use.',
        price: 2499,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
        rating: 4.1,
        stock: 40
      },
      {
        id: 6,
        name: 'Digital Camera',
        description: 'High-resolution digital camera for photography enthusiasts.',
        price: 32999,
        category: 'Cameras',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
        rating: 4.6,
        stock: 10
      }
    ];

    this.saveProducts(products);
  }

  getProducts(): Product[] {
    return this.productsSignal();
  }

  getProductById(id: number): Product | undefined {
    return this.productsSignal().find(product => product.id === id);
  }

  addProduct(product: Omit<Product, 'id'>): void {

    const products = this.productsSignal();

    const newProduct: Product = {
      ...product,
      id: Date.now()
    };

    this.saveProducts([
      ...products,
      newProduct
    ]);
  }

  updateProduct(updatedProduct: Product): void {

    const products = this.productsSignal().map(product =>
      product.id === updatedProduct.id
        ? updatedProduct
        : product
    );

    this.saveProducts(products);
  }

  deleteProduct(id: number): void {

    const products = this.productsSignal().filter(
      product => product.id !== id
    );

    this.saveProducts(products);
  }
}