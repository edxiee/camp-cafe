import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'aboutProduct-modal',
  standalone: false,
  template: `
    <ion-header>
    <ion-toolbar>
    <ion-title>About our Products</ion-title>
    <ion-buttons slot="end">
      <ion-button (click)="closeModal()" color="calm">Close</ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding modal-content">
  <h1 style="color: black;">Camp Café</h1>
  <div class="about-container">
    <p>
      <b>Camp Café</b> takes pride in offering a diverse menu crafted for every kind of coffee lover. 
      From the comforting warmth of our <b>hot brews</b> to the crisp delight of <b>iced coffees</b> 
      and <b>refreshing coolers</b>, there’s a drink for every mood and moment. Indulge in our creamy 
      <b>frappes</b> or choose from our <b>non-caffeinated selections</b>, perfect for those who prefer 
      flavor without the buzz. Each cup is made using beans and ingredients <b>ethically sourced from 
      eco-friendly farms</b>, ensuring that every sip not only tastes good but also does good for the 
      planet. At <b>Camp Café</b>, we blend <b>sustainability</b> and <b>flavor</b> to bring you beverages 
      that warm the heart, refresh the soul, and respect nature.
    </p>
  </div>
</ion-content>
  `,
  
  styleUrls: ['./aboutProduct.modal.scss'],
})

export class AboutProductModal {
  constructor(private modalCtrl: ModalController) {}

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
