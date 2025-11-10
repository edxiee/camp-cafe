import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, updateDoc, docData, collection, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface UserProfile {
  uid: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  photoURL?: string | null;
  createdAt: Date;
}

export interface BillingInfo {
  bankName?: string;
  cardName?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  amount?: number;
  createdAt?: Date;
  id?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private firestore: Firestore) {}

  // Create user profile document in Firestore
  async createUserProfile(uid: string, data: Omit<UserProfile, 'uid' | 'createdAt'>) {
    try {
      // Build default username from firstName + lastName (skip empty parts)
      const parts = [data.firstName?.trim(), data.lastName?.trim()].filter(Boolean);
      const defaultUsername = parts.join(' ');

      const userProfile: UserProfile = {
        uid,
        email: data.email,
        username: data.username && data.username.trim() ? data.username : defaultUsername,
        firstName: data.firstName,
        lastName: data.lastName,
        photoURL: data.photoURL,
        createdAt: new Date(),
      };
      console.log('Attempting to save user profile:', userProfile);
      const userDocRef = doc(this.firestore, `users/${uid}`);
      await setDoc(userDocRef, userProfile);
      console.log('User profile saved successfully to Firestore');
    } catch (error) {
      console.error('Error saving to Firestore:', error);
      throw error;
    }
  }

  // Get user profile by UID
  getUserProfile(uid: string): Observable<UserProfile | undefined> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    return docData(userDocRef) as Observable<UserProfile | undefined>;
  }

  // Update user profile
  async updateUserProfile(uid: string, data: Partial<UserProfile>) {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    const payload: Partial<UserProfile> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        (payload as Record<string, unknown>)[key] = value;
      }
    }
    return updateDoc(userDocRef, payload);
  }

  // Find email by username (for login with username)
  async getEmailByUsername(username: string): Promise<string | null> {
    try {
      console.log('Looking up username:', username);
      const { collection, query, where, getDocs } = await import('@angular/fire/firestore');
      const usersRef = collection(this.firestore, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].data() as UserProfile;
        console.log('Found user with email:', userDoc.email);
        return userDoc.email;
      }
      console.log('No user found with username:', username);
      return null;
    } catch (error) {
      console.error('Error looking up username:', error);
      return null;
    }
  }

  // Add a billing document under users/{uid}/billing (auto-id)
  async addBillingInfo(uid: string, billing: Partial<BillingInfo>) {
    try {
      const colRef = collection(this.firestore, `users/${uid}/billing`);
      // strip undefined values
      const payload: Record<string, any> = {};
      for (const [k, v] of Object.entries(billing)) {
        if (v !== undefined) payload[k] = v;
      }
      payload['createdAt'] = new Date();
      const docRef = await addDoc(colRef, payload);
      return docRef.id;
    } catch (error) {
      console.error('Error saving billing info:', error);
      throw error;
    }
  }

  // Update an existing billing document under users/{uid}/billing/{id}
  async updateBillingInfo(uid: string, id: string, billing: Partial<BillingInfo>) {
    try {
      // build payload without undefined values
      const payload: Record<string, any> = {};
      for (const [k, v] of Object.entries(billing)) {
        if (v !== undefined) payload[k] = v;
      }
      // do not overwrite createdAt on update
      const docRef = doc(this.firestore, `users/${uid}/billing/${id}`);
      await updateDoc(docRef, payload);
      return id;
    } catch (error) {
      console.error('Error updating billing info:', error);
      throw error;
    }
  }

  // Return the latest billing document for a user (or null)
  async getLatestBillingInfo(uid: string): Promise<BillingInfo | null> {
    try {
      // dynamic import to reuse AngularFire helpers (keeps imports consistent)
      const { collection, query, orderBy, limit, getDocs } = await import('@angular/fire/firestore');
      const colRef = collection(this.firestore, 'users', uid, 'billing');
      const q = query(colRef, orderBy('createdAt', 'desc'), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const data = snap.docs[0].data() as BillingInfo;
        // include id if needed
        return { ...(data as BillingInfo), id: snap.docs[0].id };
      }
      return null;
    } catch (error) {
      console.error('Error fetching latest billing info:', error);
      return null;
    }
  }
}
