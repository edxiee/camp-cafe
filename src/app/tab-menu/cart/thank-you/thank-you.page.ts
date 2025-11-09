import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.page.html',
  styleUrls: ['./thank-you.page.scss'],
  standalone: false,
})
export class ThankYouPage {
  constructor(private navCtrl: NavController) {}

  async returnHome() {
    await this.navCtrl.navigateRoot('/tabs/cart', { animated: false });
    await this.navCtrl.navigateRoot('/tabs/home');
  }
}
