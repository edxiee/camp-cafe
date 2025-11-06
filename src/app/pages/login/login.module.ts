import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { LoginPage } from './login.page';

const routes: Routes = [
  { path: '', component: LoginPage }
];

@NgModule({
  declarations: [LoginPage],
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
  exports: [LoginPage]
})
export class LoginPageModule {}
