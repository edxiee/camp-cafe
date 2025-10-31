import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private users = [
    { username: 'admin', password: '1234' },
    { username: 'user', password: 'abcd' },
  ];

  constructor() {}

  login(username: string, password: string): boolean {
    const user = this.users.find(
      (u) => u.username === username && u.password === password
    );
    return !!user; // true if found
  }

  signup(username: string, password: string): boolean {
    const exists = this.users.some((u) => u.username === username);
    if (exists) return false;

    this.users.push({ username, password });
    return true;
  }
}
