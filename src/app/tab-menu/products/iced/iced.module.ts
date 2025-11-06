import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { IcedPageRoutingModule } from './iced-routing.module';
import { IcedPage } from './iced.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IcedPageRoutingModule,
    IcedPage
  ]
})
export class IcedPageModule {}
