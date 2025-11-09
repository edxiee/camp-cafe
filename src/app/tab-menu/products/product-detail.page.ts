import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Product, ProductService } from '../../services/product.service';
import { CartService, CartSize } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: 'product-detail.page.html',
  styleUrls: ['product-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class ProductDetailPage {
  product: Product | null = null;
  loading = true;
  selectedSize: CartSize = 'regular';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private toastController: ToastController
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetch(id);
    } else {
      this.loading = false;
    }
  }

  async fetch(id: string) {
    try {
      this.loading = true;
      this.product = await this.productService.getProduct(id);
    } catch (err) {
      console.warn('Failed to load product', err);
    } finally {
      this.loading = false;
    }
  }

  get displayPrice(): number {
    if (!this.product) {
      return 0;
    }
    return this.product.price + (this.selectedSize === 'large' ? 20 : 0);
  }

  async addToCart() {
    if (!this.product) {
      return;
    }
    try {
      await this.cartService.addItem(this.product, this.selectedSize);
      const toast = await this.toastController.create({
        message: `${this.product.name} (${this.selectedSize === 'large' ? 'Large' : 'Regular'}) added to cart`,
        duration: 1500,
        position: 'bottom'
      });
      await toast.present();
    } catch (error) {
      console.warn('Failed to sync cart item', error);
      const toast = await this.toastController.create({
        message: 'Unable to save to cart. Please try again.',
        duration: 1500,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
    }
  }

  selectSize(size: CartSize) {
    this.selectedSize = size;
  }

}
