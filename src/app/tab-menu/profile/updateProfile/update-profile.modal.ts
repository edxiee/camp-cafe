import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-update-profile-modal',
  standalone: false,
  templateUrl: './update-profie.modal.html',
  styleUrls: ['./update-profile.modal.scss'],
})
export class UpdateProfileModal {
  @Input() currentName = '';
  newName = '';

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private userService: UserService
  ) {}

  // Initialize newName. If currentName isn't provided, load the user's profile
  // and set newName to "firstName lastName".
  async ngOnInit() {
    if (this.currentName?.trim()) {
      this.newName = this.currentName;
      return;
    }

    try {
      const user = await this.authService.getCurrentUser();
      if (user?.uid) {
        const profile = await firstValueFrom(this.userService.getUserProfile(user.uid));
        if (profile) {
          const first = profile.firstName ?? '';
          const last = profile.lastName ?? '';
          this.newName = `${first} ${last}`.trim();
          this.currentName = this.newName;
        }
      }
    } catch (err) {
      console.error('Error loading user profile for default name:', err);
      // fallback: leave newName as empty string
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  // Save: update Firebase Auth displayName and the Firestore user document (username, firstName, lastName)
  async save() {
    if (!this.newName.trim()) {
      alert('Name cannot be empty.');
      return;
    }

    try {
      // Normalize name and split into first/last parts
      const full = this.newName.trim();
      const parts = full.split(/\s+/);
      const firstName = parts.shift() || '';
      const lastName = parts.join(' ') || '';

      // Update Firebase Auth displayName
      await this.authService.updateName(full);

      // Update Firestore user profile (username should be "firstName lastName" and store parts)
      const user = await this.authService.getCurrentUser();
      if (user?.uid) {
        await this.userService.updateUserProfile(user.uid, {
          username: full,
          firstName,
          lastName,
        });
      }

      // Return the new name to the caller
      this.modalCtrl.dismiss({ newName: full });
    } catch (error) {
      console.error('Failed to update profile name:', error);
      alert('Failed to update profile. Please try again.');
    }
  }
}
