import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartPage } from './cart.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { CartPageRoutingModule } from './cart-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    CartPageRoutingModule
  ],
  declarations: [CartPage]
})
export class CartPageModule {}
