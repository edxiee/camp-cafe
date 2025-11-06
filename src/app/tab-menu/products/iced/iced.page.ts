import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-iced',
  templateUrl: './iced.page.html',
  styleUrls: ['./iced.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class IcedPage implements OnInit {
  products$!: Observable<Product[]>;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.products$ = this.productService.getProducts().pipe(
      map(list => list.filter(p => p.type === 'Iced'))
    );
  }
}
