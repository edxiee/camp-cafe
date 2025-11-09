import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/auth.service';
import { UserService, BillingInfo } from 'src/app/user.service';

@Component({
  selector: 'billing-modal',
  standalone: false,
  templateUrl: './billing.modal.html',
  styleUrls: ['./billing.modal.scss'],
})
export class BillingModal implements OnInit {
  // Accept billing info from the caller
  @Input() billingInfo?: Partial<BillingInfo>;

  // Local fields bound to the template (if present)
  bankName = '';
  cardName = '';
  cardNumber = '';
  expiry = '';
  cvv = '';

  constructor(
    private modalCtrl: ModalController,
    private auth: AuthService,
    private userService: UserService
  ) {}

  async ngOnInit() {
    // if parent passed billingInfo, use it
    if (this.billingInfo) {
      this.bankName = this.billingInfo.bankName ?? this.bankName;
      this.cardName = this.billingInfo.cardName ?? this.cardName;
      this.cardNumber = this.billingInfo.cardNumber ?? this.cardNumber;
      this.expiry = this.billingInfo.expiry ?? this.expiry;
      this.cvv = this.billingInfo.cvv ?? this.cvv;
      return;
    }

    // otherwise load latest billing from Firestore and populate inputs
    try {
      const user = await this.auth.getCurrentUser();
      if (!user?.uid) return;
      const latest = await this.userService.getLatestBillingInfo(user.uid);
      if (latest) {
        this.bankName = latest.bankName ?? this.bankName;
        this.cardName = latest.cardName ?? this.cardName;
        this.cardNumber = latest.cardNumber ?? this.cardNumber;
        this.expiry = latest.expiry ?? this.expiry;
        this.cvv = latest.cvv ?? this.cvv;
      }
    } catch (err) {
      console.error('Error loading billing info in modal:', err);
    }
  }

  // Save / confirm billing info and return it to the caller
  async save() {
    const result: Partial<BillingInfo> = {
      bankName: this.bankName || undefined,
      cardName: this.cardName || undefined,
      cardNumber: this.cardNumber || undefined,
      expiry: this.expiry || undefined,
      cvv: this.cvv || undefined,
    };

    try {
      const user = await this.auth.getCurrentUser();
      if (!user?.uid) throw new Error('Not authenticated');

      // if there is an existing billing document use update, otherwise add
      const latest = await this.userService.getLatestBillingInfo(user.uid);
      if (latest && latest.id) {
        await this.userService.updateBillingInfo(user.uid, latest.id, result);
        // return updated id
        this.modalCtrl.dismiss({ billingInfo: result, id: latest.id });
      } else {
        const id = await this.userService.addBillingInfo(user.uid, result);
        this.modalCtrl.dismiss({ billingInfo: result, id });
      }
      // inform the user
      alert('Saved successfully');
    } catch (error) {
      console.error('Failed to save billing info (modal.save):', error);
      alert((error as any)?.message ?? 'Failed to save billing info. Please try again.');
    }
  }

  // Close without returning data
  dismiss() {
    this.modalCtrl.dismiss();
  }
}
