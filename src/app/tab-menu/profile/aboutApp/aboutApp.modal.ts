import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'aboutApp-modal',
  standalone: false,
  template: `
    <ion-header>
    <ion-toolbar>
    <ion-title>About the App</ion-title>
    <ion-buttons slot="end">
      <ion-button (click)="closeModal()">Close</ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding">
  <h1>Camp Café</h1>
  <div class="about-container">
    <p>
      <b>Camp Café</b> is a mobile app that lets users <b>pre-order their favorite drinks </b>easily. 
      Whether you like hot coffee, cold brews, frappes, refreshers, or non-caffeinated drinks, 
      you can order them ahead and skip the line. The app helps save time and makes getting 
      your drink faster and more convenient for busy students and professionals.
    </p>
  </div>
</ion-content>
  `,
  
  styleUrls: ['./aboutApp.modal.scss'],
})

export class AboutAppModal {
  constructor(private modalCtrl: ModalController) {}

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
