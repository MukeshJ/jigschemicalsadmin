import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { ChemicalPurchaseReportComponent } from './chemical-purchase-report.component';
import { AuthGuard } from '@core/security/auth.guard';

export const routes: Routes = [
  {
    path:'',
    component: ChemicalPurchaseReportComponent,
    data: { claimType: 'reports_view_chemical_purchase_report' },
    canActivate: [AuthGuard],
  }
];
