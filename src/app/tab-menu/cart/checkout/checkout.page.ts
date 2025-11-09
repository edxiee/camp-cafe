import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Observable, Subject, map, of, switchMap, take, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { CartItem, CartService } from 'src/app/services/cart.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { UserService } from 'src/app/user.service';

interface CheckoutFormState {
  fullName: string;
  phone: string;
  address: string;
  paymentMethod: 'cash' | 'gcash' | '';
  notes: string;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: false,
})
export class CheckoutPage implements OnInit, OnDestroy {
  readonly items$: Observable<CartItem[]> = this.cartService.items$;
  readonly total$ = this.items$.pipe(
    map(items => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0))
  );

  private destroy$ = new Subject<void>();
  private prefilledFullName = '';

  form: CheckoutFormState = {
    fullName: this.prefilledFullName,
    phone: '',
    address: '',
    paymentMethod: '',
    notes: ''
  };

  submitting = false;

  constructor(
    private cartService: CartService,
    private toastController: ToastController,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private transactionService: TransactionService
  ) {}

  ngOnInit() {
    this.authService.user$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(user => {
          if (!user) {
            this.prefilledFullName = '';
            return of('');
          }

          return this.userService.getUserProfile(user.uid).pipe(
            take(1),
            map(profile => {
              if (profile) {
                const name = `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim();
                return name || user.displayName || '';
              }

              return user.displayName || '';
            })
          );
        })
      )
      .subscribe(fullName => {
        const shouldOverwrite = !this.form.fullName || this.form.fullName === this.prefilledFullName;
        this.prefilledFullName = fullName;
        if (shouldOverwrite) {
          this.form.fullName = fullName;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async submitOrder(form: NgForm) {
    if (this.submitting) {
      return;
    }

    const items = this.cartService.getSnapshot();
    if (!items.length) {
      await this.presentToast('Your cart is empty. Add items before checking out.', 'warning');
      return;
    }

    if (form.invalid || !this.form.paymentMethod) {
      form.control.markAllAsTouched();
      await this.presentToast('Please complete the checkout form.', 'danger');
      return;
    }

    this.submitting = true;
    try {
      const user = await this.authService.getCurrentUser();
      if (!user) {
        await this.presentToast('You need to be logged in to place an order.', 'danger');
        return;
      }

      const paymentMethod = this.form.paymentMethod as 'cash' | 'gcash';
      const paymentStatus = paymentMethod === 'gcash' ? 'paid' : 'unpaid';
      const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

      await this.transactionService.createTransaction({
        userId: user.uid,
        userName: this.form.fullName.trim(),
        userEmail: user.email ?? '',
        phone: this.form.phone.trim(),
        address: this.form.address.trim(),
        paymentMethod,
        paymentStatus,
        notes: this.form.notes?.trim(),
        total,
        items: items.map(item => ({
          cartItemId: item.id,
          productId: item.productId,
          name: item.name,
          size: item.size,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          type: item.type,
          imageUrl: item.imageUrl,
          lineTotal: item.unitPrice * item.quantity,
        })),
      });

      await this.cartService.clear();
      await this.presentToast('Order placed! Thank you.', 'success');
      form.resetForm();
      this.resetFormState();
      await this.router.navigate(['/tabs/cart/thank-you']);
    } catch (error) {
      console.error('Failed to place order', error);
      await this.presentToast('Something went wrong. Please try again.', 'danger');
    } finally {
      this.submitting = false;
    }
  }

  private async presentToast(message: string, color: 'success' | 'warning' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 1800,
      position: 'bottom',
      color
    });
    await toast.present();
  }

  private resetFormState() {
    this.form = {
      fullName: this.prefilledFullName,
      phone: '',
      address: '',
      paymentMethod: '',
      notes: ''
    };
  }

  selectPaymentMethod(method: 'cash' | 'gcash') {
    this.form.paymentMethod = method;
  }
}
