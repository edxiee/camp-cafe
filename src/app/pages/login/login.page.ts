import { Component, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { Firestore, doc, getDoc, collection, query, where, getDocs } from '@angular/fire/firestore';

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
        <!-- MODIFIED: Changed from href to click handler -->
        <a class="link" (click)="goToSignup()">Sign up now!</a>
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
    private router: Router,
    private firestore: Firestore,
    private injector: EnvironmentInjector
  ) {}

  async onLogin() {
    try {
      const identifier = this.email.trim();
      
      if (!identifier) {
        alert('Please enter your email.');
        return;
      }

      // Admin backdoor: if email and password are both 'admin', go to admin products page
      if (identifier.toLowerCase() === 'admin' && this.password === 'admin') {
        alert('Admin login successful!');
        this.router.navigate(['/admin/products']);
        return;
      }

      // If identifier looks like a username (no @), try admin username login
      if (!identifier.includes('@')) {
        // Look up admin user by usernameLower in Firestore
        const emailFromUsername = await runInInjectionContext(this.injector, async () => {
          const ref = collection(this.firestore, 'users');
          const q = query(ref, where('role', '==', 'admin'), where('usernameLower', '==', identifier.toLowerCase()));
          const snap = await getDocs(q);
          const first = snap.docs[0];
          return first ? (first.data() as any)?.email : null;
        });

        if (!emailFromUsername) {
          alert('Admin username not found.');
          return;
        }

        const cred = await this.auth.signIn(emailFromUsername, this.password);
        alert('Login successful!');
        this.router.navigate(['/admin/products']);
        return;
      }

      // Otherwise treat as email and sign in normally
      const cred = await this.auth.signIn(identifier, this.password);
      alert('Login successful!');
      // After login, check role from Firestore users/{uid}
      const uid = cred.user?.uid;
      if (!uid) {
        this.router.navigate(['/tabs/home']);
        return;
      }

      try {
        const snap = await runInInjectionContext(this.injector, () => {
          const ref = doc(this.firestore, 'users', uid);
          return getDoc(ref);
        });
        const role = snap.exists() ? (snap.data() as any)?.role : undefined;
        if (role === 'admin') {
          this.router.navigate(['/admin/products']);
        } else {
          this.router.navigate(['/tabs/home']);
        }
      } catch (e) {
        // If Firestore read fails, default to normal tabs/home
        this.router.navigate(['/tabs/home']);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const msg = err?.message || 'Login failed';
      alert(msg);
    }
  }

  goToSignup() {
    this.router.navigate(['/signup']); // MODIFIED: Use router navigation
  }
}