import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  template: `
  <ion-content [fullscreen]="true" class="signup-bg">
  <div class="container">
    <div class="logo">
      <img src="assets/logo.png" alt="Camp Café Logo" />
    </div>

    <div class="form-container">
      <h2>SIGN UP</h2>

        <ion-input placeholder="Username" 
        [(ngModel)]="username"
        class="input-field"
        ></ion-input>

        <ion-input
          [type]="showPassword ? 'text' : 'password'"
          placeholder="Password"
          [(ngModel)]="password"
          class="input-field"
        ></ion-input>

        <ion-input
          [type]="showPassword ? 'text' : 'password'"
          placeholder="Retype Password"
          [(ngModel)]="retypePassword"
          class="input-field"
        ></ion-input>

      <ion-button expand="block" class="signup-btn" (click)="onSignup()">
        Sign Up
      </ion-button>

      <div class="options">
        <ion-checkbox
          [(ngModel)]="showPassword"
          labelPlacement="end"
        >
          show password
        </ion-checkbox>
      </div>
    </div>

    <div class="bottom-text">
      Already have an account? 
      <a href="/login" class="link" (click)="goToLogin()">Log In!</a>
    </div>
  </div>
  <img src="assets/images/waves.png" class="waves" />
  </ion-content>
  `,
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  username = '';
  password = '';
  retypePassword = '';
  showPassword = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSignup() {
  if (this.password !== this.retypePassword) {
    alert('Passwords do not match!');
    return;
  }

  const success = this.auth.signup(this.username, this.password);
  if (success) {
    alert('Signup successful!');
    this.router.navigate(['/login']);
  } else {
    alert('Username already exists!');
  }
}
  goToLogin() {
    this.router.navigate(['/login']);
  }
}

export class SignupPageModule {}