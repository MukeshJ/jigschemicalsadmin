import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesOrderListComponent } from './sales-order-list/sales-order-list.component';
import { SalesOrderAddEditComponent } from './sales-order-add-edit/sales-order-add-edit.component';
import { SalesOrderRoutingModule } from './sales-order-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PoListComponent } from './po-list/po-list.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from '@shared/shared.module';
import { MatDividerModule } from '@angular/material/divider';
import { ViewSalesOrderPaymentComponent } from './view-sales-order-payment/view-sales-order-payment.component';
import { AddSalesOrderPaymentComponent } from './add-sales-order-payment/add-sales-order-payment.component';
import { SalesOrderItemsComponent } from './sales-order-list/sales-order-items/sales-order-items.component';
import { SalesOrderResolverService } from './sales-order-detail/sales-order-detail.resolver';
import { SalesOrderDetailComponent } from './sales-order-detail/sales-order-detail.component';

@NgModule({
  imports: [
    CommonModule,
    SalesOrderRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDividerModule,
    SalesOrderListComponent,
    SalesOrderAddEditComponent,
    PoListComponent,
    ViewSalesOrderPaymentComponent,
    AddSalesOrderPaymentComponent,
    SalesOrderItemsComponent,
    SalesOrderDetailComponent,
  ],
  providers: [SalesOrderResolverService],
})
export class SalesOrderModule {}
