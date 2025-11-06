import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IcedPage } from './iced.page';

const routes: Routes = [
  {
    path: '',
    component: IcedPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IcedPageRoutingModule {}
