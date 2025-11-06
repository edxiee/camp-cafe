import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Product {
  id?: string;
  name: string;
  description?: string;
  price: number;
  type: 'Iced' | 'Hot';
  imageUrl?: string;
  createdAt: Date;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private firestore: Firestore) {}

  async addProduct(data: Omit<Product, 'id' | 'createdAt'>) {
    const productsRef = collection(this.firestore, 'products');
    const payload: Omit<Product, 'id'> = {
      ...data,
      createdAt: new Date(),
    };
    return addDoc(productsRef, payload as any);
  }

  getProducts(): Observable<Product[]> {
    const productsRef = collection(this.firestore, 'products');
    return collectionData(productsRef, { idField: 'id' }) as unknown as Observable<Product[]>;
  }

  async uploadProductImage(file: File): Promise<string> {
    // Convert file to base64 data URL - stores directly in Firestore
    return this.fileToBase64(file);
  }
  
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  async updateProduct(id: string, data: Partial<Omit<Product, 'id' | 'createdAt'>>) {
    const productRef = doc(this.firestore, 'products', id);
    return updateDoc(productRef, data as any);
  }

  async deleteProduct(id: string) {
    const productRef = doc(this.firestore, 'products', id);
    return deleteDoc(productRef);
  }
}
