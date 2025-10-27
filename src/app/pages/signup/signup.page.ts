import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  username = '';
  password = '';
  retypePassword = '';
  showPassword = false;

  onSignup() {
    console.log('Signing up:', this.username);
  }
}
