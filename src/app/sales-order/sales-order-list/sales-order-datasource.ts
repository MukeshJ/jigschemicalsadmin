import { DataSource } from '@angular/cdk/table';
import { HttpResponse } from '@angular/common/http';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { SalesOrder } from '@core/domain-classes/sales-order';
import { SalesOrderResource } from '@core/domain-classes/sales-order-resource';
import { SalesOrderService } from '../sales-order.service';

export class SalesOrderDataSource implements DataSource<SalesOrder> {
  private _saleOrderSubject$ = new BehaviorSubject<SalesOrder[]>([]);
  private _responseHeaderSubject$ = new BehaviorSubject<ResponseHeader>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  private _count: number = 0;
  sub$: Subscription;

  public get count(): number {
    return this._count;
  }
  public responseHeaderSubject$ = this._responseHeaderSubject$.asObservable();

  constructor(private saleOrderService: SalesOrderService) {
  }

  connect(): Observable<SalesOrder[]> {
    this.sub$ = new Subscription();
    return this._saleOrderSubject$.asObservable();
  }

  disconnect(): void {
    this._saleOrderSubject$.complete();
    this.loadingSubject.complete();
    this.sub$.unsubscribe();
  }

  loadData(salesOrderResource: SalesOrderResource) {
    this.loadingSubject.next(true);
    this.sub$ = this.saleOrderService.getAllSalesOrder(salesOrderResource)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false)))
      .subscribe((resp: HttpResponse<SalesOrder[]>) => {
        if (resp && resp.headers) {
          const paginationParam = JSON.parse(
            resp.headers.get('X-Pagination')
          ) as ResponseHeader;
          this._responseHeaderSubject$.next(paginationParam);
          const purchaseOrders = [...resp.body];
          this._count = purchaseOrders.length;
          this._saleOrderSubject$.next(purchaseOrders);
        }
      });
  }
}
