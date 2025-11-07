import { Injectable, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { initializeApp, deleteApp, FirebaseApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signOut, fetchSignInMethodsForEmail, deleteUser } from 'firebase/auth';

export interface CreateAdminInput {
  email: string;
  password: string;
  username: string;
}

@Injectable({ providedIn: 'root' })
export class AdminAccountService {
  constructor(private firestore: Firestore, private injector: EnvironmentInjector) {}

  /**
   * Creates an Auth user in a secondary app (to preserve current session) and writes a users/{uid}
   * doc with role 'admin' and username fields. Cleans up the auth user if Firestore write fails.
   */
  async createAdminAccount({ email, password, username }: CreateAdminInput): Promise<string> {
    const secondaryName = `admin-secondary-${Date.now()}`;
    let app: FirebaseApp | null = null;
    try {
      app = initializeApp(environment.firebase as any, secondaryName);
      const auth = getAuth(app);

      // Pre-check duplicate email to surface a friendly error
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods && methods.length) {
        throw new Error('Firebase: Error (auth/email-already-in-use).');
      }

      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      // Optionally keep display name in Auth profile for UX
      if (username) {
        await updateProfile(cred.user, { displayName: username });
      }

      // Firestore users/{uid} with admin role and username
      await runInInjectionContext(this.injector, () => {
        const userRef = doc(this.firestore, 'users', uid);
        return setDoc(userRef, {
          email: email.toLowerCase(),
          username: username,
          usernameLower: username.toLowerCase(),
          role: 'admin',
          createdAt: new Date(),
        });
      });

      // Sign out secondary session to avoid leaks
      await signOut(auth);
      return uid;
    } catch (e: any) {
      // If Firestore write fails after user creation, try cleanup
      if (app) {
        try {
          const auth = getAuth(app);
          if (auth.currentUser) {
            await deleteUser(auth.currentUser);
          }
        } catch {}
      }
      throw e;
    } finally {
      if (app) await deleteApp(app);
    }
  }
}
