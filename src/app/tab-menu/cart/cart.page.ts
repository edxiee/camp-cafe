import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // MODIFIED: Added Router import

interface CartItem {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
  isFavorite: boolean;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: false,
})
export class CartPage implements OnInit {

  // these items are only sample
  cartItems: CartItem[] = [
    {
      id: 1,
      name: 'Matcha Latte',
      category: 'Tea & Herbal Infusions',
      price: 299.00,
      quantity: 2,
      image: 'assets/images/products/matcha.jpg',
      isFavorite: false
    },
    {
      id: 2,
      name: 'Cappuccino',
      category: 'Classic Flavors',
      price: 259.00,
      quantity: 1,
      image: 'assets/images/products/cappucino.jpg',
      isFavorite: true
    },
    {
      id: 3,
      name: 'Strawberry Milkshake',
      category: 'Frappe',
      price: 359.00,
      quantity: 1,
      image: 'assets/images/products/strawberry milkshake.jpg',
      isFavorite: false
    }
  ];

  // MODIFIED: Added Router to constructor
  constructor(private router: Router) { }

  ngOnInit() {
  }

  get totalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  get totalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  increaseQuantity(item: CartItem) {
    item.quantity++;
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      // Optional: Remove item if quantity becomes 0
      this.removeItem(item.id);
    }
  }

  toggleFavorite(item: CartItem) {
    item.isFavorite = !item.isFavorite;
  }

  removeItem(itemId: number) {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
  }

  checkout() {
    // Implement checkout logic here
    console.log('Proceeding to checkout with items:', this.cartItems);
    alert('Proceeding to checkout!');
  }

  // Back button from cart to product page
  goBackToProducts() {
    this.router.navigate(['/tabs/products']);
  }
}