import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { AdminAccountService } from 'src/app/services/admin-account.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  standalone: false,
})
export class UsersPage implements OnInit {
  selectedTab: 'products' | 'users' | 'transactions' | 'logout' = 'users';
  // Add-admin UI state
  showAddAdmin = false;
  newAdminName = '';
  newAdminEmail = '';
  newAdminPassword = '';
  isSaving = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private adminAccountService: AdminAccountService
  ) { }

  ngOnInit() {
  }

  onTabChange(event: any) {
    const tab = event.detail.value;

    if (tab === 'logout') {
      this.logout();
      return;
    }

    if (tab === 'products') {
      this.router.navigate(['/admin/products']);
    } else if (tab === 'users') {
      // stay on this page
    } else if (tab === 'transactions') {
      alert('Transactions page coming soon!');
      this.selectedTab = 'users';
    }
  }

  async logout() {
    const confirmed = confirm('Are you sure you want to logout?');
    if (!confirmed) {
      this.selectedTab = 'users';
      return;
    }
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (e) {
      console.error('Logout error:', e);
      alert('Logout failed. Check console.');
    }
  }

  toggleAddAdmin() {
    this.showAddAdmin = !this.showAddAdmin;
    if (!this.showAddAdmin) {
      this.newAdminName = '';
      this.newAdminEmail = '';
      this.newAdminPassword = '';
    }
  }

  async addAdmin() {
    const name = this.newAdminName.trim();
    const email = this.newAdminEmail.trim().toLowerCase();
    const password = this.newAdminPassword; // used to create Auth account

    if (!name || !email || !password) {
      alert('Please provide username, email and password.');
      return;
    }

    this.isSaving = true;
    try {
      // Create a real Firebase Auth account and matching Firestore doc for admin
      await this.adminAccountService.createAdminAccount({
        email,
        password,
        username: name,
      });
      alert('Admin account created. They can now log in with username or email.');
      this.toggleAddAdmin();
    } catch (e) {
      console.error('Failed to create admin account:', e);
      alert('Failed to create admin. Check console.');
    } finally {
      this.isSaving = false;
    }
  }

}
