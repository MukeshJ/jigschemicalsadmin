import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { PurchaseOrderRequestListComponent } from './purchase-order-request-list/purchase-order-request-list.component';
import { AuthGuard } from '@core/security/auth.guard';
import { PurchaseOrderRequestAddEditComponent } from './purchase-order-request-add-edit/purchase-order-request-add-edit.component';
import { PurchaseOrderUnitResolver } from '../purchase-order/purchase-order-add-edit/purchase-order-unit.resolve';
import { PurchaseOrderTaxResolver } from '../purchase-order/purchase-order-add-edit/purchase-order-tax.resolve';
import { PurchaseOrderByIdResolver } from '../purchase-order/purchase-order-add-edit/purchase-order-by-id.resolve';
import { ChemicalsResolve } from '@core/services/chemicals.resolve';



export const routes: Routes = [
  {
    path: 'list',
    component: PurchaseOrderRequestListComponent,
    data: { claimType: 'purchase_order_request_view_purchase_order_requests' },
    canActivate: [AuthGuard]
  }, {
    path: ':id',
    component: PurchaseOrderRequestAddEditComponent,
    data: { claimType: ['purchase_order_request_add_purchase_order_request', 'purchase_order_request_update_purchase_order_request'] },
    canActivate: [AuthGuard],
    resolve: {
      'units': PurchaseOrderUnitResolver,
      'taxs': PurchaseOrderTaxResolver,
      'purchaseorder': PurchaseOrderByIdResolver,
      'chemicals': ChemicalsResolve
    }
  }
];
