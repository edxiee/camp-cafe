import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Product, ProductService } from 'src/app/services/product.service';
import { AuthService } from 'src/app/auth.service';

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

  // Edit modal state
  isEditModalOpen = false;
  editingProduct: Product | null = null;
  editName = '';
  editDescription = '';
  editPrice: number | null = null;
  editType: 'Iced' | 'Hot' | '' = '';
  editSelectedImage: File | null = null;
  editImageUrl: string = '';

  // Navigation state
  selectedTab = 'products';

  constructor(
    private productService: ProductService,
    private router: Router,
    private authService: AuthService
  ) { }

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

  onEditFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.editSelectedImage = input.files[0];
      this.editImageUrl = this.editSelectedImage.name;
    }
  }

  openEditModal(product: Product) {
    this.editingProduct = product;
    this.editName = product.name;
    this.editDescription = product.description || '';
    this.editPrice = product.price;
    this.editType = product.type;
    this.editImageUrl = product.imageUrl || '';
    this.editSelectedImage = null;
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.editingProduct = null;
  }

  async saveEdit() {
    if (!this.editingProduct || !this.editingProduct.id) {
      alert('No product selected.');
      return;
    }

    if (!this.editName || this.editPrice === null || this.editPrice === undefined || !this.editType) {
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

      let finalImageUrl: string | undefined = this.editingProduct.imageUrl;
      
      // If user selected a new image, upload it
      if (this.editSelectedImage) {
        finalImageUrl = await withTimeout(
          this.productService.uploadProductImage(this.editSelectedImage),
          30000,
          'Image upload'
        );
      }

      await withTimeout(this.productService.updateProduct(this.editingProduct.id, {
        name: this.editName.trim(),
        description: this.editDescription?.trim() || '',
        price: Number(this.editPrice),
        type: this.editType as 'Iced' | 'Hot',
        imageUrl: finalImageUrl,
      }), 20000, 'Update product');

      alert('Product updated!');
      this.closeEditModal();
    } catch (e) {
      console.error(e);
      const msg = e instanceof Error ? e.message : 'Failed to update product.';
      alert(msg + ' Check console.');
    } finally {
      this.isSaving = false;
    }
  }

  async deleteProduct() {
    if (!this.editingProduct || !this.editingProduct.id) {
      alert('No product selected.');
      return;
    }

    const confirmed = confirm(`Are you sure you want to delete "${this.editingProduct.name}"?`);
    if (!confirmed) return;

    this.isSaving = true;
    try {
      await this.productService.deleteProduct(this.editingProduct.id);
      alert('Product deleted!');
      this.closeEditModal();
    } catch (e) {
      console.error(e);
      alert('Failed to delete product. Check console.');
    } finally {
      this.isSaving = false;
    }
  }

  onTabChange(event: any) {
    const tab = event.detail.value;
    
    if (tab === 'logout') {
      this.logout();
      return;
    }

    // Navigate to other admin pages when they're created
    if (tab === 'users') {
      this.router.navigate(['/admin/users']);
    } else if (tab === 'transactions') {
      alert('Transactions page coming soon!');
      this.selectedTab = 'products'; // Reset to products
    }
  }

  async logout() {
    const confirmed = confirm('Are you sure you want to logout?');
    if (!confirmed) {
      this.selectedTab = 'products'; // Reset to products
      return;
    }

    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (e) {
      console.error('Logout error:', e);
      alert('Logout failed. Check console.');
    }
  }

}
