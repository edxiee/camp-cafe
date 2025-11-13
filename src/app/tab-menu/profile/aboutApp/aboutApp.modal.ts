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
      <ion-button (click)="closeModal()" color="calm">Close</ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding modal-content">
  <h1 style="color: black;">Camp Café</h1>
  <div class="about-container">
    <p>
      <b>Camp Café</b> is a mobile app that lets users <b>pre-order their favorite drinks </b>easily. 
      Whether you like hot coffee, cold brews, frappes, refreshers, or non-caffeinated drinks, 
      you can order them ahead and skip the line. The app helps save time and makes getting 
      your drink faster and more convenient for busy students and professionals.
    </p>
  </div>

  <ion-card>
  <ion-card-header>
    <ion-card-title>Developers</ion-card-title>
    <ion-card-subtitle>Camp Café</ion-card-subtitle>
  </ion-card-header>
  <ion-card-content>
    <ion-list>
      <ion-item class="card-developer">
        <ion-thumbnail slot="start">
          <img src="assets/images/developers/carl2.png" />
        </ion-thumbnail>
        <ion-label><span class="span2">Canilang, Carl </span><br> 
        <span class="span1">Contact Number: 0928692755 </span><br> 
        <span class="span1">Made the presentation powerpoint</span>
        </ion-label>
      </ion-item>

      <ion-item class="card-developer">
        <ion-thumbnail slot="start">
          <img src="assets/images/developers/jayvee.jpg" />
        </ion-thumbnail>
        <ion-label><span class="span2">Espira, Jayve L. </span><br> 
        <span class="span1">Contact Number: 09972244972 </span><br> 
        <span class="span1">Developer, Made Profile page, and backend.</span>
        </ion-label>
      </ion-item>

      <ion-item class="card-developer">
        <ion-thumbnail slot="start">
          <img src="assets/images/developers/ayvan.jpg" />
        </ion-thumbnail>
        <ion-label><span class="span2">Lopez, Ayvan T. </span><br> 
        <span class="span1">Contact Number: 09203125337 </span><br> 
        <span class="span1">Main developer, Made Products page, Admin, and backend.</span>
        </ion-label> 
      </ion-item>

      <ion-item class="card-developer">
        <ion-thumbnail slot="start">
          <img src="assets/images/developers/carl.jpg" />
        </ion-thumbnail>
        <ion-label><span class="span2">Rentoy, Jan Carlo L.</span><br> 
        <span class="span1">Contact Number: 09286645722 </span><br> 
        <span class="span1">Developer, Made Cart page, Documentations and UI/UX.</span>
        </ion-label> 
      </ion-item>

      <ion-item lines="none" class="card-developer">
        <ion-thumbnail slot="start">
          <img src="assets/images/developers/ed.png" />
        </ion-thumbnail>
        <ion-label><span class="span2">Villanueva, Ed Christian F.</span><br> 
        <span class="span1">Contact Number: 09759652881 </span><br> 
        <span class="span1">Developer, Made Login page, and documentation.</span>
        </ion-label>
      </ion-item>
    </ion-list>
  </ion-card-content>
</ion-card>

  <ion-card class="history-card">
    <ion-card-header>
      <ion-card-title>Company History</ion-card-title>
      <ion-card-subtitle>From campus idea to coffee companion</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
      <p class="history-intro">
        Camp Cafe is a mobile app designed to bring premium coffee and beverages directly to customers' fingertips. Founded to eliminate long wait times and offer convenience, the app allows coffee enthusiasts to order specialty drinks, teas, and refreshers anytime, anywhere. With user-friendly features like one-tap reordering, personalized recommendations, favorites lists, and loyalty rewards, Camp Cafe combines modern technology with quality handcrafted beverages. The company continuously innovates based on customer feedback, keeping the menu fresh with seasonal options while providing a seamless ordering experience for coffee lovers.
      </p>
      
    </ion-card-content>
  </ion-card>

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
