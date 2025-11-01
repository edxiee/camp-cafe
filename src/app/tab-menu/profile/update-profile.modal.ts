import { Component, Input } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-profile-modal',
  template: `
    <ion-header>
      <ion-toolbar color="warning">
        <ion-title>Update Profile</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" (click)="dismiss()">✕</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <p class="modal-instruction">Update your display name:</p>

      <ion-item>
        <ion-label position="stacked">New Name</ion-label>
        <ion-input [(ngModel)]="newName" placeholder="Enter new name"></ion-input>
      </ion-item>

      <ion-button expand="block" color="warning" class="save-btn" (click)="save()">
        Save
      </ion-button>
    </ion-content>
  `,
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  styles: [`
    .modal-instruction {
      text-align: center;
      margin-bottom: 16px;
      font-weight: 500;
      color: #333;
    }

    ion-item {
      --border-radius: 12px;
      margin-bottom: 20px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }

    ion-input {
      padding: 8px;
      font-size: 16px;
    }

    .save-btn {
      border-radius: 12px;
      font-weight: bold;
    }
  `]
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
    if (this.newName.trim() === '') {
      alert('Name cannot be empty.');
      return;
    }
    this.modalCtrl.dismiss({ newName: this.newName });
  }
}
