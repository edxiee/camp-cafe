import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RedirectIfLoggedInGuard } from './guards/redirect-if-logged-in.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [RedirectIfLoggedInGuard],
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'signup',
    canActivate: [RedirectIfLoggedInGuard],
    loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tab-menu/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module').then( m => m.PagesPageModule)
  },
  {
    path: 'admin/products',
    loadChildren: () => import('./admin/products/products.module').then( m => m.ProductsPageModule)
  },
  {
    path: 'admin/users',
    loadChildren: () => import('./admin/users/users.module').then( m => m.UsersPageModule)
  },
  {
    path: 'admin/transactions',
    loadChildren: () => import('./admin/transactions/transactions.module').then( m => m.TransactionsPageModule)
  },
  // Fallback: any unknown route goes to login (MUST be last)
  { path: '**', redirectTo: 'login' },


 



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }