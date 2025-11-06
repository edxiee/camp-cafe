import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products',
  standalone:false,
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  name = '';
  description = '';
  price: number | null = null;
  type: 'Iced' | 'Hot' | '' = '';
  isSaving = false;
  products$!: Observable<Product[]>;
  selectedImage: File | null = null;
  imageUrl: string = '';

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.products$ = this.productService.getProducts();
  }

  async addProduct() {
    if (!this.name || this.price === null || this.price === undefined || !this.type) {
      alert('Please fill in Name, Price, and Type.');
      return;
    }

    this.isSaving = true;
    try {
      const withTimeout = async <T>(promise: Promise<T>, ms = 20000, label = 'operation'): Promise<T> => {
        return Promise.race([
          promise,
          new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms))
        ]) as Promise<T>;
      };

      // If user selected a file, upload it and get the URL
      let finalImageUrl: string | undefined = undefined;
      if (this.selectedImage) {
        finalImageUrl = await withTimeout(
          this.productService.uploadProductImage(this.selectedImage),
          30000,
          'Image upload'
        );
      }

      await withTimeout(this.productService.addProduct({
        name: this.name.trim(),
        description: this.description?.trim() || '',
        price: Number(this.price),
        type: this.type,
        imageUrl: finalImageUrl,
      }), 20000, 'Save product');
      
      alert('Product added!');
      this.name = '';
      this.description = '';
      this.price = null;
      this.type = '';
      this.selectedImage = null;
      this.imageUrl = '';
    } catch (e) {
      console.error(e);
      const msg = e instanceof Error ? e.message : 'Failed to add product.';
      alert(msg + ' Check console.');
    } finally {
      this.isSaving = false;
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
      // Store filename for display
      this.imageUrl = this.selectedImage.name;
    }
  }

}
