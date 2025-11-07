import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, ProductService } from '../../services/product.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'products.page.html',
  styleUrls: ['products.page.scss'],
  standalone: false,
})
export class ProductsPage {
  // Category definitions (label for UI, key for filtering)
  readonly categories = [
    { key: 'iced', label: 'Iced' },
    { key: 'hot', label: 'Hot' },
    { key: 'refresher', label: 'Refreshers' },
    { key: 'frappe', label: 'Frappe' },
    { key: 'non-caffeinated', label: 'Non-caffeinated' },
  ] as const;

  selectedCategory = this.categories[0].key;
  private selectedCategory$ = new BehaviorSubject<string>(this.selectedCategory);

  products$!: Observable<Product[]>;
  filteredProducts$!: Observable<Product[]>;

  constructor(private router: Router, private route: ActivatedRoute, private productService: ProductService) {
    this.products$ = this.productService.getProducts();
    this.filteredProducts$ = combineLatest([
      this.products$,
      this.selectedCategory$,
    ]).pipe(
      map(([items, cat]) => items.filter(p => this.matchesCategory(p, cat)))
    );

    // React to query param changes to set the selected category (supports deep links and home shortcuts)
    this.route.queryParamMap.subscribe(params => {
      const cat = (params.get('category') || '').toLowerCase();
      const allowed = this.categories.map(c => c.key);
      if (allowed.includes(cat as any)) {
        this.selectedCategory = cat as any;
        this.selectedCategory$.next(this.selectedCategory);
      }
    });
  }

  onSegmentChanged(ev: CustomEvent) {
    const value = (ev.detail as any)?.value ?? ev.detail;
    this.selectedCategory = value;
    this.selectedCategory$.next(value);
  }

  private matchesCategory(p: Product, key: string): boolean {
    const type = (p.type || '').toString().toLowerCase();
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, '');
    const t = norm(type);
    const k = norm(key);
    if (k === 'iced') return t.includes('iced');
    if (k === 'hot') return t.includes('hot');
    if (k === 'refresher') return t.includes('refresher'); // matches refresher/refreshers
    if (k === 'frappe') return t.includes('frappe');
    if (k === 'noncaffeinated') return (
      t.includes('noncaffeinated') || t.includes('noncaffinated') || t.includes('decaf')
    );
    return true;
  }

}
