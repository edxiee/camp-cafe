import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Router } from '@angular/router';
import { Product, ProductService } from '../../services/product.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  products$!: Observable<Product[]>;
  featured$!: Observable<Product[]>;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit() {
    this.products$ = this.productService.getProducts();
    this.featured$ = this.products$.pipe(
      map(list => list.slice(0, 6)) // simple featured selection (first 6)
    );
  }

  navigateToProducts() {
    this.router.navigate(['/tabs/products']);
  }

  navigateToCategory(key: 'ice' | 'hot') {
    if (key === 'ice') {
      this.router.navigate(['/tabs/products/ice']);
    } else {
      // Hot page not yet split out; send to products root
      this.router.navigate(['/tabs/products']);
    }
  }

}
