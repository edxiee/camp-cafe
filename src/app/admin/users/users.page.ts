import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  standalone: false,
})
export class UsersPage implements OnInit {
  selectedTab: 'products' | 'users' | 'transactions' | 'logout' = 'users';

  constructor(private router: Router, private authService: AuthService) { }

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

}
