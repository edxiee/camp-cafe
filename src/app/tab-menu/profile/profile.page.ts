import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/auth.service';
import { UpdateProfileModal } from './updateProfile/update-profile.modal';
import { AboutAppModal } from './aboutApp/aboutApp.modal';

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
    private router: Router,
    private modalCtrl: ModalController
  ) {}

  async ionViewWillEnter() {
    const user = await this.auth.getCurrentUser();
    if (user) {
      // Use displayName if set, else fall back to email
      this.name = user.displayName || user.email || '';
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

  async onLogout() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }
}
