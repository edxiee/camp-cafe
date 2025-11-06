import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  template: `
  <ion-content>
    <div class="container">
      <img src="assets/logo.png" alt="Camp Café Logo" class="logo" />

      <div class="login-box">
        <h2>LOGIN</h2>

        <ion-input
          type="email"
          placeholder="Email"
          [(ngModel)]="email"
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
  </ion-content>
  `,
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email = '';
  password = '';
  showPassword = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  async onLogin() {
    try {
      const email = this.email.trim();
      
      if (!email) {
        alert('Please enter your email.');
        return;
      }

      // Admin backdoor: if email and password are both 'admin', go to admin products page
      if (email.toLowerCase() === 'admin' && this.password === 'admin') {
        alert('Admin login successful!');
        this.router.navigate(['/admin/products']);
        return;
      }

      // Sign in with email and password
      await this.auth.signIn(email, this.password);
      alert('Login successful!');
      this.router.navigate(['/tabs']);
    } catch (err: any) {
      console.error('Login error:', err);
      const msg = err?.message || 'Login failed';
      alert(msg);
    }
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
