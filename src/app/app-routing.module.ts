import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignupPageModule),
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tab-menu/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module').then( m => m.PagesPageModule)
  },
 

  

 

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
