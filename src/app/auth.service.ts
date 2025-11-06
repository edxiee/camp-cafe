import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private users = [
    { username: 'admin', password: '1234' },
    { username: 'user', password: 'abcd' },
  ];

  private currentUser: any = null;

  constructor() {}

  // ✅ LOGIN
  login(username: string, password: string): boolean {
    const user = this.users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      const savedName = localStorage.getItem(`${username}-name`);
      this.currentUser = {
        username: user.username,
        name: savedName || user.username, // default display name
      };
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      return true;
    }
    return false;
  }

  // ✅ SIGNUP
  signup(username: string, password: string): boolean {
    const exists = this.users.find((u) => u.username === username);
    if (exists) return false;

    this.users.push({ username, password });
    // store display name
    localStorage.setItem(`${username}-name`, username);
    return true;
  }

  // ✅ LOGOUT
  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  // ✅ CHECK LOGIN STATUS
  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  // ✅ GET CURRENT USER
  getCurrentUser() {
    if (!this.currentUser) {
      const saved = localStorage.getItem('currentUser');
      if (saved) this.currentUser = JSON.parse(saved);
    }
    return this.currentUser;
  }

  // ✅ UPDATE DISPLAY NAME
  updateName(newName: string) {
    if (this.currentUser) {
      this.currentUser.name = newName;
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      localStorage.setItem(`${this.currentUser.username}-name`, newName);
    }
  }
}
