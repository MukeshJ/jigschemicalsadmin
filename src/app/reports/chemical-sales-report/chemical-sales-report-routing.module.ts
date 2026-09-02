import { ChemicalSalesReportComponent } from './chemical-sales-report.component';
import { Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';



export const routes: Routes = [
  {
    path:'',
    component: ChemicalSalesReportComponent,
     data: { claimType: 'reports_view_chemical_sales_report' },
     canActivate: [AuthGuard],
  }
];
