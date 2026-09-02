import { Routes, RouterModule } from '@angular/router';
import { ChemicalListComponent } from './chemical-list/chemical-list.component';
import { ChemicalDetailComponent } from './chemical-detail/chemical-detail.component';
import { NgModule } from '@angular/core';
import { ChemicalComponent } from './chemical.component';
import { ChemicalDetailResolverService } from './chemical-detail/chemical-detail.resolver';
import { AuthGuard } from '@core/security/auth.guard';
import { BulkUploadChemicalComponent } from './bulk-upload-chemical/bulk-upload-chemical.component';

export const routes: Routes = [
  {
    path: '',
    component: ChemicalComponent,
    children: [
      {
        path: '',
        component: ChemicalListComponent,
        data: { claimType: 'chemical_view_chemicals' },
        canActivate: [AuthGuard]
      },
      {
        path: 'bulk-upload',
        component: BulkUploadChemicalComponent,
       // data: { claimType: ['chemical_add_chemical', 'chemical_update_chemical'] },
        //canActivate: [AuthGuard],
        //resolve: { chemical: ChemicalDetailResolverService }
      },
      {
        path: ':id',
        component: ChemicalDetailComponent,
        data: { claimType: ['chemical_add_chemical', 'chemical_update_chemical'] },
        canActivate: [AuthGuard],
        resolve: { chemical: ChemicalDetailResolverService }
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChemicalRoutingModule { }
