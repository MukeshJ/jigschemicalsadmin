import { Routes } from '@angular/router';
import { SalesOrderListComponent } from './sales-order-list/sales-order-list.component';
import { SalesOrderAddEditComponent } from './sales-order-add-edit/sales-order-add-edit.component';
import { AuthGuard } from '@core/security/auth.guard';
import { SalesOrderUnitResolver } from './sales-order-add-edit/sales-order-unit-resolve';
import { SalesOrderTaxResolver } from './sales-order-add-edit/sales-order-tax-resolve';
import { SalesOrderByIdResolver } from './sales-order-add-edit/sales-oredr-by-id-resolve';
import { ChemicalsResolve } from '@core/services/chemicals.resolve';
import { SalesOrderDetailComponent } from './sales-order-detail/sales-order-detail.component';

export const routes: Routes = [
  {
    path: 'list',
    component: SalesOrderListComponent,
    data: { claimType: 'sales_order_view_sales_orders' },
    canActivate: [AuthGuard]
  }, {
    path: ':id',
    component: SalesOrderAddEditComponent,
    data: { claimType: ['sales_order_add_sales_order','sales_order_update_sales_order']},
    canActivate: [AuthGuard],
    resolve: {
      'units': SalesOrderUnitResolver,
      'taxs': SalesOrderTaxResolver,
      'salesorder': SalesOrderByIdResolver,
      'chemicals': ChemicalsResolve
    }
  },
  {
    path: 'detail/:id',
    component: SalesOrderDetailComponent,
     data: { claimType: 'sales_order_view_sales_order_detail' },
     canActivate: [AuthGuard]
  } 
];
