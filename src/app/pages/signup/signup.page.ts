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
      <a href="/login" class="link" (click)="goToLogin()">Log In!</a>
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
    console.log('Signup button clicked!');
    
    const firstName = this.firstName?.trim();
    const lastName = this.lastName?.trim();
    const email = this.email?.trim();

    if (!firstName || !lastName) {
      alert('Please enter your first and last name.');
      this.isLoading = false;
      return;
    }
    if (!email) {
      alert('Please enter your email.');
      this.isLoading = false;
      return;
    }
    if (this.password !== this.retypePassword) {
      alert('Passwords do not match!');
      this.isLoading = false;
      return;
    }

    try {
      console.log('Creating Firebase Auth user...');
      // Create Firebase Auth user
      const result = await this.auth.signUp(email, this.password);
      const uid = result.user?.uid;
      console.log('Auth user created with UID:', uid);

      if (uid) {
        console.log('Setting display name...');
        // Set display name
        await this.auth.updateName(`${firstName} ${lastName}`);
        console.log('Display name set successfully');

        console.log('Creating Firestore profile...');
        // Store user profile in Firestore (no username needed)
        await this.userService.createUserProfile(uid, {
          email,
          username: email, // Use email as username for backwards compatibility
          firstName,
          lastName,
        });
        console.log('Firestore profile created successfully!');

        alert('Signup successful!');
        this.router.navigate(['/login']);
      } else {
        console.error('No UID returned from signup');
        alert('Signup failed: No user ID returned');
      }
    } catch (err: any) {
      // Common Firebase codes: auth/email-already-in-use, auth/invalid-email, auth/weak-password
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
