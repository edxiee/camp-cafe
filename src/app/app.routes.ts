import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup.page').then(m => m.SignupPage),
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tab-menu/tabs/tabs.module').then(m => m.TabsPageModule)
  },
];
