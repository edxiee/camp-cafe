import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, collectionData, doc, orderBy, query, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Timestamp } from 'firebase/firestore';
import { AuthService } from 'src/app/auth.service';

type AdminTab = 'products' | 'users' | 'transactions' | 'logout';
type PaymentMethod = 'cash' | 'gcash';
type PaymentStatus = 'paid' | 'unpaid';
type OrderStatus = 'pending' | 'complete' | 'cancelled';

interface TransactionItem {
  cartItemId?: string;
  productId?: string;
  name?: string;
  size?: string;
  unitPrice?: number;
  quantity?: number;
  type?: string;
  imageUrl?: string;
  lineTotal?: number;
}

interface TransactionRecord {
  id: string;
  userId?: string;
  userName?: string;
  userEmail?: string | null;
  phone?: string;
  address?: string;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  notes?: string;
  total?: number;
  items?: TransactionItem[];
  createdAt?: Timestamp | null;
  status?: string;
}

interface TransactionView extends TransactionRecord {
  createdAtDate: Date | null;
  itemCount: number;
  items: TransactionItem[];
  notes: string;
  total: number;
}

@Component({
  selector: 'app-transactions',
  standalone: false,
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage implements OnInit {
  selectedTab: AdminTab = 'transactions';
  transactions$!: Observable<TransactionView[]>;
  ongoingTransactions$!: Observable<TransactionView[]>;
  completeTransactions$!: Observable<TransactionView[]>;
  activeFilter: 'ongoing' | 'complete' = 'ongoing';
  detailsOpen = false;
  selectedTransaction: TransactionView | null = null;
  canEdit = false;
  formStatus: OrderStatus = 'pending';
  formPaymentStatus: PaymentStatus = 'unpaid';
  isSaving = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private firestore: Firestore
  ) {}

  ngOnInit() {
    const ref = collection(this.firestore, 'transactions');
    const q = query(ref, orderBy('createdAt', 'desc'));
    this.transactions$ = collectionData(q, { idField: 'id' }).pipe(
      map(list => list.map(raw => this.mapTransaction(raw as TransactionRecord)))
    );

    this.ongoingTransactions$ = this.transactions$.pipe(
      map(list => list.filter(tx => tx.status === 'pending'))
    );

    this.completeTransactions$ = this.transactions$.pipe(
      map(list => list.filter(tx => tx.status === 'complete' && tx.paymentStatus === 'paid'))
    );
  }

  private mapTransaction(data: TransactionRecord): TransactionView {
    const createdAtTimestamp = data.createdAt;
    const createdAtDate = createdAtTimestamp && typeof (createdAtTimestamp as any)?.toDate === 'function'
      ? (createdAtTimestamp as Timestamp).toDate()
      : null;
    const items = Array.isArray(data.items) ? data.items : [];
    const total = typeof data.total === 'number' ? data.total : 0;
    const itemCount = items.reduce((sum, item) => sum + (item?.quantity ?? 0), 0);
    const notes = typeof data.notes === 'string' ? data.notes.trim() : '';
    const rawStatus = (data.status ?? 'pending').toString().toLowerCase();
    const status: OrderStatus = ['pending', 'complete', 'cancelled'].includes(rawStatus)
      ? (rawStatus as OrderStatus)
      : 'pending';
    const paymentStatus = (data.paymentStatus ?? 'unpaid').toString().toLowerCase() as PaymentStatus;

    return {
      ...data,
      status,
      paymentStatus,
      notes,
      items,
      total,
      itemCount,
      createdAtDate,
    };
  }

  onTabChange(event: any) {
    const tab = event.detail.value as AdminTab;

    if (tab === 'logout') {
      this.logout();
      return;
    }

    if (tab === 'products') {
      this.router.navigate(['/admin/products']);
    } else if (tab === 'users') {
      this.router.navigate(['/admin/users']);
    } else {
      this.selectedTab = 'transactions';
    }
  }

  openDetails(tx: TransactionView) {
    this.selectedTransaction = tx;
    this.detailsOpen = true;
    this.formStatus = (tx.status as OrderStatus) || 'pending';
    this.formPaymentStatus = (tx.paymentStatus || 'unpaid') as PaymentStatus;
    this.canEdit = tx.status === 'pending';
  }

  closeDetails() {
    this.detailsOpen = false;
    this.selectedTransaction = null;
    this.canEdit = false;
    this.isSaving = false;
  }

  async saveOrderChanges() {
    if (!this.selectedTransaction) {
      return;
    }

    this.isSaving = true;
    try {
      const ref = doc(this.firestore, 'transactions', this.selectedTransaction.id);
      await updateDoc(ref, {
        status: this.formStatus,
        paymentStatus: this.formPaymentStatus,
      });
      this.selectedTransaction = {
        ...this.selectedTransaction,
        status: this.formStatus,
        paymentStatus: this.formPaymentStatus,
      } as TransactionView;
      alert('Transaction updated.');
      if (this.formStatus !== 'pending') {
        this.closeDetails();
      }
    } catch (error) {
      console.error('Failed to update transaction:', error);
      alert('Failed to update transaction. Please try again.');
    } finally {
      this.isSaving = false;
    }
  }

  async cancelOrder() {
    if (!this.selectedTransaction) {
      return;
    }
    const confirmed = confirm('Cancel this order? This cannot be undone.');
    if (!confirmed) {
      return;
    }
    this.isSaving = true;
    try {
      const ref = doc(this.firestore, 'transactions', this.selectedTransaction.id);
      await updateDoc(ref, {
        status: 'cancelled',
      });
      this.selectedTransaction = {
        ...this.selectedTransaction,
        status: 'cancelled',
      } as TransactionView;
      alert('Order cancelled.');
      this.closeDetails();
    } catch (error) {
      console.error('Failed to cancel order:', error);
      alert('Failed to cancel order. Please try again.');
    } finally {
      this.isSaving = false;
    }
  }

  async logout() {
    const confirmed = confirm('Are you sure you want to logout?');
    if (!confirmed) {
      this.selectedTab = 'transactions';
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
