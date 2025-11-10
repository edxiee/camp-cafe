import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import {
  ModalController,
  AlertController,
  LoadingController,
} from '@ionic/angular';

@Component({
  selector: 'security-modal',
  templateUrl: './security.modal.html',
  styleUrls: ['./security.modal.scss'],
  standalone: false,
})
export class SecurityModal implements OnInit {
  passwordForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private afAuth: Auth // use injected AngularFire Auth instance
  ) {}

  ngOnInit() {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  async changePassword() {
    if (this.passwordForm.invalid) {
      await this.showAlert('Please fill all required fields.');
      return;
    }

    const { currentPassword, newPassword, confirmPassword } =
      this.passwordForm.value;

    if (newPassword !== confirmPassword) {
      await this.showAlert('Passwords do not match!');
      return;
    }

    // use a generic type for the loading element to avoid importing a non-exported symbol
    let loading: any | undefined;
    try {
      loading = await this.loadingCtrl.create({ message: 'Updating password...' });
      await loading.present();

      // get current user from injected AngularFire Auth (ensures firebase app was initialized)
      const user = await this.afAuth.currentUser;
      if (!user || !user.email) {
        throw new Error('No user is currently logged in.');
      }

      // Re-authenticate
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      await this.showAlert('Password updated successfully!');
      this.passwordForm.reset();
      this.closeModal();
    } catch (error: any) {
      console.error('Change password error:', error);
      const code = error?.code ?? '';
      const message = error?.message ?? '';
      const friendly = this.getErrorMessage(code, message);
      await this.showAlert(friendly);
    } finally {
      if (loading) {
        try {
          await loading.dismiss();
        } catch {
          // ignore
        }
      }
    }
  }

  getErrorMessage(code: string, serverMessage?: string): string {
    switch (code) {
      case 'auth/wrong-password':
        return 'The current password is incorrect.';
      case 'auth/user-mismatch':
        return 'User credentials do not match the current user.';
      case 'auth/user-not-found':
        return 'User not found.';
      case 'auth/weak-password':
        return 'Your new password is too weak (min 6 characters).';
      case 'auth/requires-recent-login':
        return 'Please log in again to change your password.';
      case 'auth/network-request-failed':
        return 'Network error. Check your connection and try again.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      default:
        if (serverMessage && typeof serverMessage === 'string' && serverMessage.trim()) {
          return serverMessage;
        }
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
  
  dismiss() {
    this.modalCtrl.dismiss();
  }
}
