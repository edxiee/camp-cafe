import { EnvironmentInjector, Injectable, runInInjectionContext } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, deleteDoc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Product {
  id?: string;
  name: string;
  description?: string;
  price: number;
  type: 'Iced' | 'Hot' | 'Refreshers' | 'Frappe' | 'Non-Caffeinated';
  imageUrl?: string;
  createdAt: Date;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private firestore: Firestore, private injector: EnvironmentInjector) {}

  async addProduct(data: Omit<Product, 'id' | 'createdAt'>) {
    const payload: Omit<Product, 'id'> = {
      ...data,
      createdAt: new Date(),
    };
    return runInInjectionContext(this.injector, () => {
      const productsRef = collection(this.firestore, 'products');
      return addDoc(productsRef, payload as any);
    });
  }

  getProducts(): Observable<Product[]> {
    return runInInjectionContext(this.injector, () => {
      const productsRef = collection(this.firestore, 'products');
      return collectionData(productsRef, { idField: 'id' }) as unknown as Observable<Product[]>;
    });
  }

  async getProduct(id: string): Promise<Product | null> {
    return runInInjectionContext(this.injector, async () => {
      const productRef = doc(this.firestore, 'products', id);
      const snap = await getDoc(productRef);
      if (!snap.exists()) {
        return null;
      }
      const data = snap.data() as Omit<Product, 'id'>;
      return {
        id: snap.id,
        ...data,
      } as Product;
    });
  }

  async uploadProductImage(file: File): Promise<string> {
    // Convert locally to a compressed Data URL (to be stored directly in Firestore)
    return this.compressImage(file, 1024, 1024, 0.72);
  }

  private compressImage(file: File, maxW: number, maxH: number, quality = 0.72): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = err => reject(err);
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          // Maintain aspect ratio while fitting within maxW x maxH
          let { width, height } = img;
          const ratio = Math.min(maxW / width, maxH / height, 1);
          const targetW = Math.round(width * ratio);
          const targetH = Math.round(height * ratio);

          const canvas = document.createElement('canvas');
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }
          ctx.drawImage(img, 0, 0, targetW, targetH);

          // Prefer JPEG for better compression; fallback to PNG if type suggests transparency
          const isPng = (file.type || '').toLowerCase().includes('png');
          const mime = isPng ? 'image/png' : 'image/jpeg';
          const dataUrl = canvas.toDataURL(mime, isPng ? undefined : quality);

          // Check if the data URL is too long (e.g., > 500KB to stay under Firestore limits)
          if (dataUrl.length > 500 * 1024) {
            reject(new Error('Image is too large after compression. Please choose a smaller image.'));
          } else {
            resolve(dataUrl);
          }
        };
        img.onerror = err => reject(err);
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  async updateProduct(id: string, data: Partial<Omit<Product, 'id' | 'createdAt'>>) {
    return runInInjectionContext(this.injector, () => {
      const productRef = doc(this.firestore, 'products', id);
      return updateDoc(productRef, data as any);
    });
  }

  async deleteProduct(id: string) {
    return runInInjectionContext(this.injector, () => {
      const productRef = doc(this.firestore, 'products', id);
      return deleteDoc(productRef);
    });
  }
}
