import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { SupplierDetailComponent } from './supplier-detail/supplier-detail.component';
import { SupplierResolverService } from './supplier-detail/supplier-detail.resolver';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { UploadChemicalComponent } from './upload-chemical/upload-chemical.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierListComponent,
    data: { claimType: 'supplier_view_suppliers' },
    canActivate: [AuthGuard]
  }, {
    path: 'uploadChemical',
    component: UploadChemicalComponent,
    // data: { claimType: ['chemical_add_chemical', 'chemical_update_chemical'] },
    //canActivate: [AuthGuard],
    //resolve: { chemical: ChemicalDetailResolverService }
  },
  {
    path: 'manage/:id',
    component: SupplierDetailComponent,
    resolve: { supplier: SupplierResolverService },
    data: { claimType: ['supplier_add_supplier', 'supplier_update_supplier'] },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRoutingModule { }
