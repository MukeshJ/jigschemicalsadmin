import { CommonModule } from '@angular/common';
import { PurchaseOrderReturnListComponent } from './purchase-order-return-list/purchase-order-return-list.component';
import { AuthGuard } from '@core/security/auth.guard';
import { PurchaseOrderReturnComponent } from './purchase-order-return/purchase-order-return.component';
import { PurchaseOrderUnitResolver } from '../purchase-order/purchase-order-add-edit/purchase-order-unit.resolve';
import { PurchaseOrderTaxResolver } from '../purchase-order/purchase-order-add-edit/purchase-order-tax.resolve';
import { PurchaseOrderByIdResolver } from '../purchase-order/purchase-order-add-edit/purchase-order-by-id.resolve';
import { ChemicalsResolve } from '@core/services/chemicals.resolve';
import { Routes } from '@angular/router';



export const routes: Routes = [
  {
    path: 'list',
    component: PurchaseOrderReturnListComponent,
    data: { claimType: 'purchase_order_return_purchase_order' },
    canActivate: [AuthGuard]
  }, {
    path: 'add',
    component: PurchaseOrderReturnComponent,
    data: { claimType: 'purchase_order_return_purchase_order' },
    canActivate: [AuthGuard],
    resolve: {
      'units': PurchaseOrderUnitResolver,
      'taxs': PurchaseOrderTaxResolver,
      'chemicals': ChemicalsResolve
    }
  }, {
    path: ':id',
    component: PurchaseOrderReturnComponent,
    data: { claimType: 'purchase_order_return_purchase_order' },
    canActivate: [AuthGuard],
    resolve: {
      'units': PurchaseOrderUnitResolver,
      'taxs': PurchaseOrderTaxResolver,
      'purchaseorder': PurchaseOrderByIdResolver,
      'chemicals': ChemicalsResolve
    }
  },

];
