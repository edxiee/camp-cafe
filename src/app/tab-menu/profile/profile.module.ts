import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfilePage } from './profile.page';
import { UpdateProfileModal } from './updateProfile/update-profile.modal';
import { AboutProductModal } from './aboutProduct/aboutProduct.modal';
import { AboutAppModal } from './aboutApp/aboutApp.modal';
import { BillingModal } from './billing/billing.modal';
import { SecurityModal } from './security/security.modal';

import { ProfilePageRoutingModule } from './profile-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProfilePageRoutingModule
  ],
  declarations: [ProfilePage, UpdateProfileModal, AboutProductModal, SecurityModal, AboutAppModal,BillingModal]
})
export class ProfilePageModule {}
