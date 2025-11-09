import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfilePage } from './profile.page';
import { UpdateProfileModal } from './updateProfile/update-profile.modal';
import { AboutAppModal } from './aboutApp/aboutApp.modal';
import { BillingModal } from './billing/billing.modal';

import { ProfilePageRoutingModule } from './profile-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ProfilePageRoutingModule
  ],
  declarations: [ProfilePage, UpdateProfileModal, AboutAppModal,BillingModal]
})
export class ProfilePageModule {}
