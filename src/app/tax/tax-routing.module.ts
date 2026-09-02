import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaxListComponent } from './tax-list/tax-list.component';

const routes: Routes = [
  {
    path: '',
    component: TaxListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxRoutingModule { }
