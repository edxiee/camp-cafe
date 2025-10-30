import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


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
          Not a member yet? <a routerLink="/signup" class="link">Sign up now!</a>
        </p>
      </div>
    </ion-content>
`,
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username = '';
  password = '';
  showPassword = false;

  onLogin() {
    console.log('Logging in with', this.username, this.password);
  }
}
