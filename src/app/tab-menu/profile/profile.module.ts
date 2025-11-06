import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfilePage } from './profile.page';
import { UpdateProfileModal } from './updateProfile/update-profile.modal';
import { AboutAppModal } from './aboutApp/aboutApp.modal';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { ProfilePageRoutingModule } from './profile-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    ProfilePageRoutingModule
  ],
  declarations: [ProfilePage, UpdateProfileModal, AboutAppModal]
})
export class ProfilePageModule {}
