import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'security-modal',
  templateUrl: './security.modal.html',
  styleUrls: ['./security.modal.scss'],
  standalone: false,
})
export class SecurityModal implements OnInit {
  // ensure TS knows this will be assigned in ngOnInit
  passwordForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  async changePassword() {
    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;

    if (newPassword !== confirmPassword) {
      await this.showAlert('Passwords do not match!');
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Updating password...' });
    await loading.present();

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user || !user.email) {
      await loading.dismiss();
      await this.showAlert('No user is logged in.');
      return;
    }

    const credential = EmailAuthProvider.credential(user.email, currentPassword);

    try {
      // Reauthenticate user
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      await loading.dismiss();
      await this.showAlert('Password updated successfully!');
      this.passwordForm.reset();
      this.closeModal();
    } catch (error: any) {
      await loading.dismiss();
      // normalize error code to string when possible
      const code = (error && (error as any).code) ? String((error as any).code) : '';
      await this.showAlert(this.getErrorMessage(code));
    }
  }

  getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/wrong-password':
        return 'Your current password is incorrect.';
      case 'auth/weak-password':
        return 'Your new password is too weak.';
      case 'auth/requires-recent-login':
        return 'Please log in again to change your password.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  async showAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Change Password',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}