import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'products.page.html',
  styleUrls: ['products.page.scss'],
  standalone: false,
})
export class ProductsPage {

  constructor(private router: Router) {}

  openIced() {
    // navigate to the iced products route under tabs/products
    this.router.navigate(['/tabs/products/iced']);
  }

  openHot() {
    // placeholder: navigate to hot list (not implemented yet)
    this.router.navigate(['/tabs/products/hot']);
  }

}
