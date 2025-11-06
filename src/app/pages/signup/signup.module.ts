import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { SignupPage } from './signup.page';

const routes: Routes = [
  { path: '', component: SignupPage }
];

@NgModule({
  declarations: [SignupPage],
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
  exports: [SignupPage]
})
export class SignupPageModule {}
