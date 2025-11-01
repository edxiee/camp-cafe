import { Component, Input } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-profile-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Update Profile</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" (click)="dismiss()">✕</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="modal-content">

        <ion-label position="stacked" class="input-label">New Profile Name</ion-label>
        <ion-input [(ngModel)]="newName" placeholder="Enter new name" class="input-field"></ion-input>

      <ion-button expand="block" class="save-btn" (click)="save()">Save</ion-button>
      <ion-button expand="block" class="save-btn" (click)="dismiss()">Cancel</ion-button>
    </ion-content>
  `,
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  styleUrls: ['./update-profile.modal.scss'],
})
export class UpdateProfileModal {
  @Input() currentName = '';
  newName = '';

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.newName = this.currentName;
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  save() {
    if (!this.newName.trim()) {
      alert('Name cannot be empty.');
      return;
    }
    this.modalCtrl.dismiss({ newName: this.newName });
  }
}
