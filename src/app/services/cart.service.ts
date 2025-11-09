import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './product.service';

export type CartSize = 'regular' | 'large';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  size: CartSize;
  unitPrice: number;
  quantity: number;
  imageUrl?: string;
  type?: string;
  isFavorite: boolean;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>([]);
  readonly items$ = this.itemsSubject.asObservable();

  addItem(product: Product, size: CartSize) {
    const items = [...this.itemsSubject.value];
    const productId = product.id ?? '';
    const existing = items.find(item => item.productId === productId && item.size === size);
    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({
        id: this.generateId(),
        productId,
        name: product.name,
        size,
        unitPrice: this.calculatePrice(product.price, size),
        quantity: 1,
        imageUrl: product.imageUrl,
        type: product.type,
        isFavorite: false,
      });
    }
    this.itemsSubject.next(items);
  }

  changeQuantity(itemId: string, quantity: number) {
    if (quantity < 1) {
      this.removeItem(itemId);
      return;
    }
    const items = this.itemsSubject.value.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    );
    this.itemsSubject.next(items);
  }

  toggleFavorite(itemId: string) {
    const items = this.itemsSubject.value.map(item =>
      item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
    );
    this.itemsSubject.next(items);
  }

  removeItem(itemId: string) {
    const items = this.itemsSubject.value.filter(item => item.id !== itemId);
    this.itemsSubject.next(items);
  }

  clear() {
    this.itemsSubject.next([]);
  }

  getSnapshot(): CartItem[] {
    return this.itemsSubject.value;
  }

  private calculatePrice(basePrice: number, size: CartSize): number {
    return size === 'large' ? basePrice + 20 : basePrice;
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2, 10);
  }
}
