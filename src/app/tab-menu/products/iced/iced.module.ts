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
    // IcedPage is implemented as a standalone component in the source, so import it
    // instead of declaring it here. This avoids the "standalone cannot be declared"
    // compiler error and lets the route load the standalone component.
    IcedPage
  ],
})
export class IcedPageModule {}
