import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChemicalPurchaseReportComponent } from './chemical-purchase-report.component';
import { AuthGuard } from '@core/security/auth.guard';

const routes: Routes = [
  {
    path:'',
    component: ChemicalPurchaseReportComponent,
    data: { claimType: 'reports_view_chemical_purchase_report' },
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChemicalPurchaseReportRoutingModule { }
