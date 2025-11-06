import { Injectable } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, User } from '@angular/fire/auth';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user$: Observable<User | null>;

  constructor(private auth: Auth) {
    // Stream of the current user (null if logged out)
    this.user$ = authState(this.auth);
  }

  // Firebase Email/Password Signup
  signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // Firebase Email/Password Sign-in
  signIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Sign out
  signOut() {
    return signOut(this.auth);
  }

  // Backwards-compatible alias for existing code
  logout() {
    return this.signOut();
  }

  // Convenience boolean observable for templates/guards if needed
  isLoggedIn$(): Observable<boolean> {
    return this.user$.pipe(map((u) => !!u));
  }

  // Snapshot access (may be null)
  getCurrentUser() {
    return Promise.resolve(this.auth.currentUser);
  }

  // Update the Firebase user's display name
  async updateName(newName: string) {
    const user = this.auth.currentUser;
    if (user) {
      await updateProfile(user, { displayName: newName });
    }
  }
}
