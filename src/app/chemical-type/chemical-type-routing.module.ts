import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { ChemicalTypeListComponent } from './chemical-type-list/chemical-type-list.component';

const routes: Routes = [
  {
    path: '', component: ChemicalTypeListComponent,
    data: { claimType: 'chemical_view_chemical_types' },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChemicalTypeRoutingModule { }
