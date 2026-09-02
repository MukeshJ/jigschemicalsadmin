import { NgModule } from '@angular/core';
import { SupplierChemicalComponent } from './supplier-chemical.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: SupplierChemicalComponent,
    data: { claimType: 'supplier_assign_chemical_to_supplier' },
    canActivate: [AuthGuard]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupplierChemicalRoutingModule { }
