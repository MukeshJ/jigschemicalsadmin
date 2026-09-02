import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChemicalsResolve } from '@core/services/chemicals.resolve';
import { SalesOrderTaxResolver } from '../sales-order/sales-order-add-edit/sales-order-tax-resolve';
import { SalesOrderUnitResolver } from '../sales-order/sales-order-add-edit/sales-order-unit-resolve';
import { SalesOrderByIdResolver } from '../sales-order/sales-order-add-edit/sales-oredr-by-id-resolve';
import { SaleOrderReturnListComponent } from './sales-order-return-list/sales-order-return-list.component';
import { SaleOrderReturnComponent } from './sales-order-return/sales-order-return.component';



const routes: Routes = [
  {
    path: 'list',
    component: SaleOrderReturnListComponent,
    // data: { claimType: 'SO_RETURN_SO' },
    // canActivate: [AuthGuard]
  },{
    path: 'add',
    component: SaleOrderReturnComponent,
    // data: { claimType: 'SO_RETURN_SO' },
    // canActivate: [AuthGuard],
    resolve: {
      'units': SalesOrderUnitResolver,
      'taxs': SalesOrderTaxResolver,
      'chemicals': ChemicalsResolve
    }
  },{
    path: ':id',
    component: SaleOrderReturnComponent,
    // data: { claimType: 'SO_RETURN_SO' },
    // canActivate: [AuthGuard],
    resolve: {
      'units': SalesOrderUnitResolver,
      'taxs': SalesOrderTaxResolver,
      'salesorder': SalesOrderByIdResolver,
      'chemicals': ChemicalsResolve
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleOrderReturnRoutingModule { }
