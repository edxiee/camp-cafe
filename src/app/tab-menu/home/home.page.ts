import { Component } from '@angular/core';
import { Observable, Subscription, map, firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { Product, ProductService } from '../../services/product.service';
import { MenuController } from '@ionic/angular';
import { AboutAppModal } from '../profile/aboutApp/aboutApp.modal';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/auth.service';
import { UserService } from 'src/app/user.service';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-tab1',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  products$!: Observable<Product[]>;
  featured$!: Observable<Product[]>;
  photoURL: string | null = null;
  name = '';

  constructor(private auth: AuthService, private userService: UserService, private productService: ProductService, private router: Router, private menuCtrl: MenuController, private modalCtrl: ModalController) {}

  ngOnInit() {
    this.products$ = this.productService.getProducts();
    this.featured$ = this.products$.pipe(
      map(list => list.slice(0, 6)) // simple featured selection (first 6)
    );
  }

  navigateToProducts() {
    this.router.navigate(['/tabs/products']);
  }

  navigateToCategory(key: 'iced' | 'hot' | 'refresher' | 'frappe' | 'non-caffeinated') {
    // Route to products and pass the category as a query param; Products page will filter in realtime.
    this.router.navigate(['/tabs/products'], { queryParams: { category: key } });
  }

  closeMenu() {
    this.menuCtrl.close('homeMenu');
  }

  async aboutApp() {
      const modal = await this.modalCtrl.create({
        component: AboutAppModal,
        cssClass: 'custom-modal'
      });
  
      await modal.present();
    }

  async onLogout() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }

  async ionViewWillEnter() {
    await this.loadUserProfile();
  }

  private async loadUserProfile() {
    const user = await this.resolveCurrentUser();

    if (!user) {
      this.name = '';
      this.photoURL = null;
      this.router.navigate(['/login']);
      return;
    }

    try {
      const profile = await firstValueFrom(this.userService.getUserProfile(user.uid));
      // Prefer Firestore username, then Firebase displayName, then email
      this.name = (profile?.username && profile.username.trim()) || user.displayName || user.email || '';
      this.photoURL = profile?.photoURL ?? user.photoURL ?? null;
    } catch (err) {
      console.error('Error loading profile from Firestore:', err);
      this.name = user.displayName || user.email || '';
      this.photoURL = user.photoURL ?? null;
    }
  }

  private async resolveCurrentUser(timeoutMs = 5000): Promise<User | null> {
    const immediate = await this.auth.getCurrentUser();
    if (immediate) {
      return immediate;
    }

    return new Promise<User | null>((resolve) => {
      let settled = false;
      let sub: Subscription | null = null;

      const finish = (value: User | null) => {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeout(timerId);
        sub?.unsubscribe();
        resolve(value);
      };

      const timerId = setTimeout(() => finish(null), timeoutMs);

      sub = this.auth.user$.subscribe((user) => {
        if (user) {
          finish(user);
        }
      });
    });
  }
}
