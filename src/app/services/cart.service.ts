import { EnvironmentInjector, Injectable, OnDestroy, runInInjectionContext } from '@angular/core';
import { Firestore, collection, deleteDoc, doc, getDocs, setDoc, writeBatch } from '@angular/fire/firestore';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
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
export class CartService implements OnDestroy {
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>([]);
  readonly items$ = this.itemsSubject.asObservable();
  private userId: string | null = null;
  private authSub: Subscription;

  constructor(
    private firestore: Firestore,
    private injector: EnvironmentInjector,
    private authService: AuthService
  ) {
    this.authSub = this.authService.user$.subscribe(async user => {
      const nextUserId = user?.uid ?? null;
      if (nextUserId === this.userId) {
        return;
      }

      this.userId = nextUserId;

      if (!this.userId) {
        this.itemsSubject.next([]);
        return;
      }

      await this.loadCart(this.userId);
    });
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
  }

  async addItem(product: Product, size: CartSize) {
    const items = [...this.itemsSubject.value];
    const productId = product.id ?? '';
    if (!productId) {
      console.warn('Cannot add product without an id to the cart');
      return;
    }
    const id = this.buildItemId(productId, size);
    const existingIndex = items.findIndex(item => item.id === id);
    const existing = existingIndex > -1 ? items[existingIndex] : undefined;

    let updated: CartItem;
    if (existing) {
      updated = { ...existing, quantity: existing.quantity + 1 };
      items[existingIndex] = updated;
    } else {
      updated = {
        id,
        productId,
        name: product.name,
        size,
        unitPrice: this.calculatePrice(product.price, size),
        quantity: 1,
        imageUrl: product.imageUrl,
        type: product.type,
        isFavorite: false,
      };
      items.push(updated);
    }
    this.itemsSubject.next(items);

    if (this.userId) {
      await this.persistItem(this.userId, updated);
    }
  }

  async changeQuantity(itemId: string, quantity: number) {
    if (quantity < 1) {
      await this.removeItem(itemId);
      return;
    }
    const items = this.itemsSubject.value.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    );
    this.itemsSubject.next(items);

    if (this.userId) {
      const updated = items.find(item => item.id === itemId);
      if (updated) {
        await this.persistItem(this.userId, updated);
      }
    }
  }

  async toggleFavorite(itemId: string) {
    const items = this.itemsSubject.value.map(item =>
      item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
    );
    this.itemsSubject.next(items);

    if (this.userId) {
      const updated = items.find(item => item.id === itemId);
      if (updated) {
        await this.persistItem(this.userId, updated);
      }
    }
  }

  async removeItem(itemId: string) {
    const items = this.itemsSubject.value.filter(item => item.id !== itemId);
    this.itemsSubject.next(items);

    if (this.userId) {
      await this.deleteItem(this.userId, itemId);
    }
  }

  async clear() {
    const items = this.itemsSubject.value;
    this.itemsSubject.next([]);

    if (this.userId && items.length) {
      await this.clearRemoteCart(this.userId, items.map(item => item.id));
    }
  }

  getSnapshot(): CartItem[] {
    return this.itemsSubject.value;
  }

  private calculatePrice(basePrice: number, size: CartSize): number {
    return size === 'large' ? basePrice + 20 : basePrice;
  }

  private buildItemId(productId: string, size: CartSize): string {
    return `${productId}_${size}`;
  }

  private async loadCart(userId: string) {
    try {
      const cartItems = await runInInjectionContext(this.injector, async () => {
        const cartRef = collection(this.firestore, `users/${userId}/cartItems`);
        const snapshot = await getDocs(cartRef);
        return snapshot.docs.map(docSnap => {
          const data = docSnap.data() as Partial<CartItem>;
          return {
            id: docSnap.id,
            productId: data.productId ?? '',
            name: data.name ?? '',
            size: (data.size as CartSize) ?? 'regular',
            unitPrice: data.unitPrice ?? 0,
            quantity: data.quantity ?? 1,
            imageUrl: data.imageUrl,
            type: data.type,
            isFavorite: data.isFavorite ?? false,
          } as CartItem;
        });
      });

      this.itemsSubject.next(cartItems);
    } catch (error) {
      console.warn('Failed to load cart from Firestore', error);
      this.itemsSubject.next([]);
    }
  }

  private persistItem(userId: string, item: CartItem) {
    return runInInjectionContext(this.injector, () => {
      const itemRef = doc(this.firestore, `users/${userId}/cartItems/${item.id}`);
      return setDoc(itemRef, item, { merge: true });
    });
  }

  private deleteItem(userId: string, itemId: string) {
    return runInInjectionContext(this.injector, () => {
      const itemRef = doc(this.firestore, `users/${userId}/cartItems/${itemId}`);
      return deleteDoc(itemRef);
    });
  }

  private async clearRemoteCart(userId: string, itemIds: string[]) {
    await runInInjectionContext(this.injector, async () => {
      const batch = writeBatch(this.firestore);
      itemIds.forEach(id => {
        const itemRef = doc(this.firestore, `users/${userId}/cartItems/${id}`);
        batch.delete(itemRef);
      });
      await batch.commit();
    });
  }
}
