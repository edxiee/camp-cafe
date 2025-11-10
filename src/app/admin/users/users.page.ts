import { Component, OnInit, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { AdminAccountService } from 'src/app/services/admin-account.service';
import { Firestore, collection, collectionData, query, where, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';

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

  // Admin list and edit modal
  admins$!: Observable<any[]>;
  isEditOpen = false;
  editId: string | null = null;
  editUsername = '';
  editEmail = '';

  // Normal users list and edit modal
  users$!: Observable<any[]>;
  isUserEditOpen = false;
  userEditId: string | null = null;
  userEditUsername = '';
  userEditEmail = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private adminAccountService: AdminAccountService,
    private firestore: Firestore,
    private injector: EnvironmentInjector,
    private auth: Auth
  ) { }

  ngOnInit() {
    // Stream admins from Firestore
    this.admins$ = runInInjectionContext(this.injector, () => {
      const ref = collection(this.firestore, 'users');
      const q = query(ref, where('role', '==', 'admin'));
      return collectionData(q, { idField: 'id' }) as unknown as Observable<any[]>;
    });

    // Stream normal users (exclude admins). Many user docs may not have a role field; fetch all and filter client-side.
    this.users$ = runInInjectionContext(this.injector, () => {
      const ref = collection(this.firestore, 'users');
      return (collectionData(ref, { idField: 'id' }) as unknown as Observable<any[]>)
        .pipe(map(list => list.filter((u: any) => u.role !== 'admin')));
    });
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
      this.router.navigate(['/admin/transactions']);
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

  // Admin list interactions
  openEditAdmin(a: any) {
    this.editId = a.id;
    this.editUsername = a.username || '';
    this.editEmail = a.email || '';
    this.isEditOpen = true;
  }

  closeEditAdmin() {
    this.isEditOpen = false;
    this.editId = null;
    this.editUsername = '';
    this.editEmail = '';
  }

  async saveAdmin() {
    if (!this.editId) return;
    const username = this.editUsername.trim();
    if (!username) {
      alert('Username is required');
      return;
    }
    this.isSaving = true;
    try {
      await runInInjectionContext(this.injector, () => {
        const ref = doc(this.firestore, 'users', this.editId!);
        return updateDoc(ref, {
          username,
          usernameLower: username.toLowerCase(),
          // email left unchanged here to avoid desync with Auth
        } as any);
      });
      alert('Admin updated');
      this.closeEditAdmin();
    } catch (e) {
      console.error('Update admin failed:', e);
      alert('Failed to update admin. Check console.');
    } finally {
      this.isSaving = false;
    }
  }

  async sendReset() {
    const email = this.editEmail?.trim();
    if (!email) {
      alert('No email set for this admin.');
      return;
    }
    try {
      await sendPasswordResetEmail(this.auth, email);
      alert('Password reset email sent.');
    } catch (e) {
      console.error('Reset email error:', e);
      alert('Failed to send reset email.');
    }
  }

  async deleteAdmin() {
    if (!this.editId) return;
    const confirmed = confirm('Delete this admin account? This removes admin privileges (Firestore doc).');
    if (!confirmed) return;
    this.isSaving = true;
    try {
      await runInInjectionContext(this.injector, () => {
        const ref = doc(this.firestore, 'users', this.editId!);
        return deleteDoc(ref);
      });
      alert('Admin removed. Their Auth account remains but will no longer have admin access.');
      this.closeEditAdmin();
    } catch (e) {
      console.error('Delete admin failed:', e);
      alert('Failed to delete admin. Check console.');
    } finally {
      this.isSaving = false;
    }
  }

  // Normal users interactions
  openEditUser(u: any) {
    this.userEditId = u.id;
    this.userEditUsername = u.username || '';
    this.userEditEmail = u.email || '';
    this.isUserEditOpen = true;
  }

  closeEditUser() {
    this.isUserEditOpen = false;
    this.userEditId = null;
    this.userEditUsername = '';
    this.userEditEmail = '';
  }

  async saveUser() {
    if (!this.userEditId) return;
    const username = this.userEditUsername.trim();
    if (!username) {
      alert('Username is required');
      return;
    }
    this.isSaving = true;
    try {
      await runInInjectionContext(this.injector, () => {
        const ref = doc(this.firestore, 'users', this.userEditId!);
        return updateDoc(ref, {
          username,
          usernameLower: username.toLowerCase(),
        } as any);
      });
      alert('User updated');
      this.closeEditUser();
    } catch (e) {
      console.error('Update user failed:', e);
      alert('Failed to update user. Check console.');
    } finally {
      this.isSaving = false;
    }
  }

  async sendUserReset() {
    const email = this.userEditEmail?.trim();
    if (!email) {
      alert('No email set for this user.');
      return;
    }
    try {
      await sendPasswordResetEmail(this.auth, email);
      alert('Password reset email sent.');
    } catch (e) {
      console.error('Reset email error:', e);
      alert('Failed to send reset email.');
    }
  }

  async deleteUser() {
    if (!this.userEditId) return;
    const confirmed = confirm('Delete this user profile? This removes their Firestore user document.');
    if (!confirmed) return;
    this.isSaving = true;
    try {
      await runInInjectionContext(this.injector, () => {
        const ref = doc(this.firestore, 'users', this.userEditId!);
        return deleteDoc(ref);
      });
      alert('User profile removed. Their Auth account may still exist.');
      this.closeEditUser();
    } catch (e) {
      console.error('Delete user failed:', e);
      alert('Failed to delete user. Check console.');
    } finally {
      this.isSaving = false;
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
