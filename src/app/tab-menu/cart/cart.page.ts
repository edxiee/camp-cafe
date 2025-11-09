import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartItem, CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: false,
})
export class CartPage implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  private subscription?: Subscription;

  constructor(private router: Router, private cartService: CartService) {}

  ngOnInit() {
    this.subscription = this.cartService.items$.subscribe(items => {
      this.cartItems = items;
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  get totalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
  }

  get totalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  increaseQuantity(item: CartItem) {
    this.cartService.changeQuantity(item.id, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem) {
    const next = item.quantity - 1;
    if (next < 1) {
      this.removeItem(item.id);
      return;
    }
    this.cartService.changeQuantity(item.id, next);
  }

  toggleFavorite(item: CartItem) {
    this.cartService.toggleFavorite(item.id);
  }

  removeItem(itemId: string) {
    this.cartService.removeItem(itemId);
  }

  checkout() {
    const payload = this.cartService.getSnapshot();
    console.log('Proceeding to checkout with items:', payload);
    alert('Proceeding to checkout!');
  }

  // Back button from cart to product page
  goBackToProducts() {
    this.router.navigate(['/tabs/products']);
  }
}