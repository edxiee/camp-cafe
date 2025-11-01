import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/auth.service';
import { UpdateProfileModal } from './update-profile.modal';

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

  ionViewWillEnter() {
    const user = this.auth.getCurrentUser();
    if (user) {
      this.name = user.name || '';
    } else {
      this.router.navigate(['/login']);
    }
  }

  async updateProfile() {
  const modal = await this.modalCtrl.create({
    component: UpdateProfileModal,
    componentProps: { currentName: this.name },
    cssClass: 'centered-modal'  // This makes it appear as a box
  });

  modal.onDidDismiss().then((res) => {
    if (res.data && res.data.newName) {
      this.name = res.data.newName;
      this.auth.updateName(res.data.newName);
      alert('Profile updated!');
    }
  });

  await modal.present();
}

  onLogout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
