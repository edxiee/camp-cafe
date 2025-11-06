import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsPage } from './products.page';

const routes: Routes = [
  {
    path: '',
    component: ProductsPage,
  }
];

// Add child route for iced products
routes.push({ path: 'iced', loadChildren: () => import('./iced/iced.module').then(m => m.IcedPageModule) });

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsPageRoutingModule {}
