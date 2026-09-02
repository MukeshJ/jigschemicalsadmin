import { Injectable } from '@angular/core';
import {
    Resolve,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { SalesOrder } from '@core/domain-classes/sales-order';
import { Supplier } from '@core/domain-classes/supplier';
import { Observable, of } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';
import { SalesOrderService } from '../sales-order.service';



@Injectable()
export class SalesOrderResolverService implements Resolve<SalesOrder> {
    constructor(private salesOrderService: SalesOrderService, private router: Router) { }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<SalesOrder> | null {
        const id = route.paramMap.get('id');
        return this.salesOrderService.getSalesOrderDetail(id).pipe(
            take(1),
            mergeMap((salesOrder: SalesOrder) => {
                if (salesOrder) {
                    return of(salesOrder);
                } else {
                    this.router.navigate(['/sales-order']);
                    return null;
                }
            })
        );
    }
}
