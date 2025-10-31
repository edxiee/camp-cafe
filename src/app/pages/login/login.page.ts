import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  template: `
  <ion-content>
    <div class="container">
      <img src="assets/logo.png" alt="Camp Café Logo" class="logo" />

      <div class="login-box">
        <h2>LOGIN</h2>

        <ion-input
          type="text"
          placeholder="Username"
          [(ngModel)]="username"
          class="input-field"
        ></ion-input>

        <ion-input
          [type]="showPassword ? 'text' : 'password'"
          placeholder="Password"
          [(ngModel)]="password"
          class="input-field"
        ></ion-input>

        <ion-button expand="block" class="signin-btn" (click)="onLogin()">
          Sign In
        </ion-button>

        <div class="options">
          <div class="left">
            <ion-checkbox [(ngModel)]="showPassword" class="checkbox"></ion-checkbox>
            <span>Show password</span>
          </div>
          <a href="#" class="forgot">Forgot password?</a>
        </div>
      </div>

      <p class="bottom-text">
        Not a member yet?
        <a href="/signup" class="link" (click)="goToSignup()">Sign up now!</a>
      </p>
    </div>
    <img src="assets/images/waves.png" class="waves" />
  </ion-content>
  `,
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username = '';
  password = '';
  showPassword = false;

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
  if (this.auth.login(this.username, this.password)) {
    alert('Login successful!');
    this.router.navigate(['/tabs']);
  } else {
    alert('Invalid username or password.');
  }
}

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}

export class LoginPageModule {}