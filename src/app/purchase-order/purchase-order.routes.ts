import { Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { ChemicalsResolve } from '@core/services/chemicals.resolve';
import { PurchaseOrderAddEditComponent } from './purchase-order-add-edit/purchase-order-add-edit.component';
import { PurchaseOrderByIdResolver } from './purchase-order-add-edit/purchase-order-by-id.resolve';
import { PurchaseOrderTaxResolver } from './purchase-order-add-edit/purchase-order-tax.resolve';
import { PurchaseOrderUnitResolver } from './purchase-order-add-edit/purchase-order-unit.resolve';
import { PurchaseOrderDetailComponent } from './purchase-order-detail/purchase-order-detail.component';
import { PurchaseOrderListComponent } from './purchase-order-list/purchase-order-list.component';

export const routes: Routes = [
  {
    path: 'list',
    component: PurchaseOrderListComponent,
    data: { claimType: 'purchase_order_view_purchase_orders' },
    canActivate: [AuthGuard]
  }, {
    path: ':id',
    component: PurchaseOrderAddEditComponent,
    data: { claimType: ['purchase_order_add_purchase_order','purchase_order_update_purchase_order' ]},
    canActivate: [AuthGuard],
    resolve: {
      'units': PurchaseOrderUnitResolver,
      'taxs': PurchaseOrderTaxResolver,
      'purchaseorder': PurchaseOrderByIdResolver,
      'chemicals': ChemicalsResolve
    }
  },
  {
    path: 'detail/:id',
    component: PurchaseOrderDetailComponent,
    data: { claimType: ['purchase_order_view_purchase_order_detail']},
    canActivate: [AuthGuard],
  }
];
