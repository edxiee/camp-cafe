import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, serverTimestamp } from '@angular/fire/firestore';
import { CartItem } from './cart.service';

type PaymentMethod = 'cash' | 'gcash';
type PaymentStatus = 'paid' | 'unpaid';

export interface TransactionCreatePayload {
  userId: string;
  userName: string;
  userEmail?: string | null;
  phone: string;
  address: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
  total: number;
  items: Array<{
    cartItemId: string;
    productId: string;
    name: string;
    size: CartItem['size'];
    unitPrice: number;
    quantity: number;
    type?: string;
    imageUrl?: string;
    lineTotal: number;
  }>;
}

@Injectable({ providedIn: 'root' })
export class TransactionService {
  constructor(private firestore: Firestore) {}

  createTransaction(payload: TransactionCreatePayload) {
    const transactionsRef = collection(this.firestore, 'transactions');
    return addDoc(transactionsRef, {
      ...payload,
      notes: payload.notes ?? '',
      createdAt: serverTimestamp(),
      status: 'pending',
    });
  }
}
