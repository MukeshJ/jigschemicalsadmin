import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SearchChemicalBySupplierComponent } from './search-chemical-by-supplier/search-chemical-by-supplier.component';
import { SearchSupplierByChemicalComponent } from './search-supplier-by-chemical/search-supplier-by-chemical.component';
import { AuthGuard } from '@core/security/auth.guard';

const routes: Routes = [
  {
    path: 'chemical',
    component: SearchChemicalBySupplierComponent,
    data: { claimType: 'supplier_search_chemicals_by_supplier' },
    canActivate: [AuthGuard]
  }, {
    path: 'supplier',
    component: SearchSupplierByChemicalComponent,
    data: { claimType: 'chemical_search_suppliers_by_chemical' },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchChemicalSupplierRoutingModule { }
