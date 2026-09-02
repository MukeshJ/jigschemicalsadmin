import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesPurchaseReportComponent } from './sales-purchase-report.component';
import { SalesPurchaseRoutingModule } from './sales-purchase-routing.module';
import { FormsModule } from '@angular/forms';
import { UTCToLocalTime } from '@shared/pipes/utc-to-localtime.pipe';
import { SharedModule } from '@shared/shared.module';
import { ChartsModule } from 'ng2-charts';



@NgModule({
  declarations: [
    SalesPurchaseReportComponent
  ],
  imports: [
    CommonModule,
    SalesPurchaseRoutingModule,
    FormsModule,
    SharedModule,
    ChartsModule
  ],
  providers: [UTCToLocalTime]
})
export class SalesPurchaseReportModule { }
