import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, updateDoc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface UserProfile {
  uid: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private firestore: Firestore) {}

  // Create user profile document in Firestore
  async createUserProfile(uid: string, data: Omit<UserProfile, 'uid' | 'createdAt'>) {
    try {
      const userProfile: UserProfile = {
        uid,
        ...data,
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
    return updateDoc(userDocRef, data);
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
}
