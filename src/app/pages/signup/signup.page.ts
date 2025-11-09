import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { UserService } from 'src/app/user.service';

//rentoy comment

@Component({
  selector: 'app-signup',
  standalone: false,
  template: `
  <ion-content [fullscreen]="true" class="signup-bg">
  <div class="container">
    <div class="logo">
      <img src="assets/logo.png" alt="Camp Café Logo" />
    </div>

    <div class="form-container">
      <h2>SIGN UP</h2>

        <ion-input placeholder="First Name"
        [(ngModel)]="firstName"
        class="input-field"
        ></ion-input>

        <ion-input placeholder="Last Name"
        [(ngModel)]="lastName"
        class="input-field"
        ></ion-input>

        <ion-input placeholder="Email"
        type="email"
        [(ngModel)]="email"
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

      <ion-button 
        expand="block" 
        class="signup-btn" 
        (click)="onSignup()"
        [disabled]="isLoading"
      >
        {{ isLoading ? 'Signing up...' : 'Sign Up' }}
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
      <!-- MODIFIED: Changed from href to click handler -->
      <a class="link" (click)="goToLogin()">Log In!</a>
    </div>
  </div>
  
  </ion-content>
  `,
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  retypePassword = '';
  showPassword = false;
  isLoading = false;

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  async onSignup() {
    if (this.isLoading) return;
    this.isLoading = true;
    try {
      const firstName = this.firstName?.trim();
      const lastName = this.lastName?.trim();
      const email = this.email?.trim();

      if (!firstName || !lastName) {
        alert('Please enter your first and last name.');
        return;
      }
      if (!email) {
        alert('Please enter your email.');
        return;
      }
      if (!this.password) {
        alert('Please enter your password.');
        return;
      }
      if (this.password !== this.retypePassword) {
        alert('Passwords do not match!');
        return;
      }

      // Sign up in Firebase Auth
      const cred = await this.auth.signUp(email, this.password);
      const uid = cred.user?.uid;
      if (!uid) {
        throw new Error('Signup failed: No user ID returned');
      }

      // Create user profile in Firestore
      // Build username from firstName + lastName (display name)
      const username = [firstName, lastName].filter(Boolean).join(' ').trim();
      await this.userService.createUserProfile(uid, {
        email,
        username,
        firstName,
        lastName,
      });

      alert('Signup successful!');
      this.router.navigate(['/login']);
    } catch (err: any) {
      console.error('Signup error:', err);
      const msg = err?.message || 'Signup failed';
      alert(msg);
    } finally {
      this.isLoading = false;
    }
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
}