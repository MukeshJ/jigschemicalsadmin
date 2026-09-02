import { NgModule } from '@angular/core';
import { ChemicalSalesReportComponent } from './chemical-sales-report.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';



const routes: Routes = [
  {
    path:'',
    component: ChemicalSalesReportComponent,
     data: { claimType: 'reports_view_chemical_sales_report' },
     canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChemicalSalesReportRoutingModule { }
