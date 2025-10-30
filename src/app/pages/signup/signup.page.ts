import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  template: `<ion-content [fullscreen]="true" class="signup-bg">
      <div class="logo">
        <img src="assets/logo.png" alt="Camp Café Logo" />
      </div>

      <div class="form-container">
        <h2>SIGN UP</h2>

        <ion-item lines="none">
          <ion-input placeholder="Username" [(ngModel)]="username"></ion-input>
        </ion-item>

        <ion-item lines="none">
          <ion-input
            [type]="showPassword ? 'text' : 'password'"
            placeholder="Password"
            [(ngModel)]="password"
          ></ion-input>
        </ion-item>

        <ion-item lines="none">
          <ion-input
            [type]="showPassword ? 'text' : 'password'"
            placeholder="Retype Password"
            [(ngModel)]="retypePassword"
          ></ion-input>
        </ion-item>

        <ion-button expand="block" class="signup-btn" (click)="onSignup()">
          Sign Up
        </ion-button>

        <div class="options">
          <ion-checkbox
            [(ngModel)]="showPassword"
            labelPlacement="end"
            color="warning"
          >
            show password
          </ion-checkbox>
          <a href="#" class="forgot">Forgot password?</a>
        </div>
      </div>

      <div class="bottom-text">
        Already have an account? <a routerLink="/login"><b>Log In!</b></a>
      </div>
    </ion-content>
`,
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
