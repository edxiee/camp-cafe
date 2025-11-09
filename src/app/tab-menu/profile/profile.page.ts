import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { UserService } from 'src/app/user.service';
import { UpdateProfileModal } from './updateProfile/update-profile.modal';
import { AboutAppModal } from './aboutApp/aboutApp.modal';
import { AboutProductModal } from './aboutProduct/aboutProduct.modal';
import { BillingModal } from './billing/billing.modal';
import { SecurityModal } from './security/security.modal';

@Component({
  selector: 'app-tab4',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
  standalone: false,
})

export class ProfilePage {
  name = '';

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private router: Router,
    private modalCtrl: ModalController
  ) {}

  async ionViewWillEnter() {
    const user = await this.auth.getCurrentUser();
    if (user) {
      try {
        const profile = await firstValueFrom(this.userService.getUserProfile(user.uid));
        // Prefer Firestore username, then Firebase displayName, then email
        this.name = (profile?.username && profile.username.trim()) || user.displayName || user.email || '';
      } catch (err) {
        console.error('Error loading profile from Firestore:', err);
        this.name = user.displayName || user.email || '';
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  async updateProfile() {
    const modal = await this.modalCtrl.create({
      component: UpdateProfileModal,
      componentProps: { currentName: this.name },
      cssClass: 'custom-modal'
    });

    const result = await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data && data.newName) {
      this.name = data.newName;
      await this.auth.updateName(data.newName);
      alert('Profile updated!');
    }
  }

  async aboutApp() {
    const modal = await this.modalCtrl.create({
      component: AboutAppModal,
      cssClass: 'custom-modal'
    });

    await modal.present();
  }

  async aboutProduct() {
    const modal = await this.modalCtrl.create({
      component: AboutProductModal,
      cssClass: 'custom-modal'
    });

    await modal.present();
  }

  async openSecurity() {
    const modal = await this.modalCtrl.create({
      component: SecurityModal,
      cssClass: 'custom-modal'
    });
    await modal.present();
  }

  async openBilling() {
    const modal = await this.modalCtrl.create({
      component: BillingModal,
      cssClass: 'custom-modal'
    });
    await modal.present();
  }

  async onLogout() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }
}
