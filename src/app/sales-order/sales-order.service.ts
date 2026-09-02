import { HttpClient, HttpEvent, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PurchaseOrder } from '@core/domain-classes/purchase-order/purchase-order';
import { PurchaseOrderShort } from '@core/domain-classes/purchase-order/purchase-order-short';
import { SalesOrder } from '@core/domain-classes/sales-order';
import { SalesOrderItem } from '@core/domain-classes/sales-order-item';
import { SalesOrderResource } from '@core/domain-classes/sales-order-resource';
import { SalesOrderResourceParameter } from '@core/domain-classes/sales-order-resource-parameter';
import { CommonError } from '@core/error-handler/common-error';
import { CommonHttpErrorService } from '@core/error-handler/common-http-error.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SalesOrderService {

  constructor(
    private http: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService) { }

  getAvailablePurchaseOrdersForChemical(id: string): Observable<PurchaseOrder[] | CommonError> {
    const url = `purchaseorder/chemical/${id}`;
    return this.http.get<PurchaseOrder[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getAllSalesOrder(
    resourceParams: SalesOrderResource
  ): Observable<HttpResponse<SalesOrder[]>> {
    const url = 'salesOrder';
    const customParams = new HttpParams()
      .set('Fields', resourceParams.fields)
      .set('OrderBy', resourceParams.orderBy)
      .set('PageSize', resourceParams.pageSize.toString())
      .set('Skip', resourceParams.skip.toString())
      .set('SearchQuery', resourceParams.searchQuery)
      .set('name', resourceParams.name)
      .set('customerId', resourceParams.customerId)
      .set('orderNumber', resourceParams.orderNumber)
      .set('customerName', resourceParams.customerName)
      .set('fromDate', resourceParams.fromDate ? resourceParams.fromDate.toDateString() : '')
      .set('toDate', resourceParams.toDate ? resourceParams.toDate.toDateString() : '')
      .set('chemicalId', resourceParams.chemicalId ? resourceParams.chemicalId : '')
      .set('soCreatedDate', resourceParams.soCreatedDate ? resourceParams.soCreatedDate.toString() : '')
      .set('status', resourceParams.status);
    return this.http.get<SalesOrder[]>(url, {
      params: customParams,
      observe: 'response'
    });
  }

  getAllSalesOrderExcel(
    resourceParams: SalesOrderResourceParameter
  ): Observable<HttpResponse<SalesOrder[]>> {
    const url = 'salesOrder';
    const customParams = new HttpParams()
      .set('Fields', resourceParams.fields)
      .set('OrderBy', resourceParams.orderBy)
      .set('PageSize', 0)
      .set('Skip', 0)
      .set('SearchQuery', resourceParams.searchQuery)
      .set('name', resourceParams.name)
      .set('orderNumber', resourceParams.orderNumber)
      .set('customerName', resourceParams.customerName)
      .set('fromDate', resourceParams.fromDate ? resourceParams.fromDate.toDateString() : '')
      .set('toDate', resourceParams.toDate ? resourceParams.toDate.toDateString() : '')
      .set('chemicalId', resourceParams.chemicalId ? resourceParams.chemicalId : '')
      .set('customerId', resourceParams.customerId ? resourceParams.customerId : '');
    return this.http.get<SalesOrder[]>(url, {
      params: customParams,
      observe: 'response'
    });
  }

  deleteSalesOrder(id: string): Observable<void | CommonError> {
    const url = `salesOrder/${id}`;
    return this.http.delete<void>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  closeSalesOrder(id: string): Observable<void | CommonError> {
    const url = `salesOrder/${id}/close`;
    return this.http.delete<void>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  createSalesOrder(salesOrder: SalesOrder): Observable<SalesOrder | CommonError> {
    const url = `salesorder`;
    return this.http.post<SalesOrder>(url, salesOrder)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  updateSalesOrder(salesOrder: SalesOrder): Observable<SalesOrder | CommonError> {
    const url = `salesOrder/${salesOrder.id}`;
    return this.http.put<SalesOrder>(url, salesOrder)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  updateSalesOrderReturn(salesOrder: SalesOrder): Observable<SalesOrder | CommonError> {
    const url = `salesOrder/${salesOrder.id}/return`;
    return this.http.put<SalesOrder>(url, salesOrder)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getNewSalesOrderNumber(): Observable<SalesOrder> {
    const url = `salesorder/newOrderNumber`;
    return this.http.get<SalesOrder>(url);
  }

  getPurchaseOrderBySoId(salesOrderId: string): Observable<PurchaseOrderShort[]> {
    const url = `salesorder/${salesOrderId}/purchaseOrder`;
    return this.http.get<PurchaseOrderShort[]>(url);
  }

  getSalesOrderById(salesOrderId: string): Observable<SalesOrder> {
    const url = `salesOrder/${salesOrderId}`;
    return this.http.get<SalesOrder>(url);
  }

  getSalesOrderDetail(id: string): Observable<SalesOrder | CommonError> {
    const url = `salesorder/${id}/detail`;
    return this.http.get<SalesOrder>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getSalesOrderItems(salesOrderId: string, isReturn: boolean = false): Observable<SalesOrderItem[]> {
    const url = `salesOrder/${salesOrderId}/items?isReturn=${isReturn}`;
    return this.http.get<SalesOrderItem[]>(url);
  }

  approveSalesOrder(salesOrderId: string): Observable<void> {
    const url = `salesOrder/${salesOrderId}/approve`;
    return this.http.post<void>(url, {});
  }

  downloadAttachment(id: string): Observable<HttpEvent<Blob>> {
    const url = `SalesOrderAttachment/${id}/download`;
    return this.http.get(url, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
    });
  }

  getSalesOrderItemReport(
    resourceParams: SalesOrderResourceParameter
  ): Observable<HttpResponse<SalesOrderItem[]>> {
    const url = 'salesOrder/items/reports';
    const customParams = new HttpParams()
      .set('Fields', resourceParams.fields)
      .set('OrderBy', resourceParams.orderBy)
      .set('PageSize', resourceParams.pageSize.toString())
      .set('Skip', resourceParams.skip.toString())
      .set('SearchQuery', resourceParams.searchQuery)
      .set('name', resourceParams.name)
      .set('orderNumber', resourceParams.orderNumber)
      .set('customerName', resourceParams.customerName)
      .set('fromDate', resourceParams.fromDate ? resourceParams.fromDate.toDateString() : '')
      .set('toDate', resourceParams.toDate ? resourceParams.toDate.toDateString() : '')
      .set('chemicalId', resourceParams.chemicalId ? resourceParams.chemicalId : '')
      .set('chemicalName', resourceParams.chemicalName ? resourceParams.chemicalName : '')
      .set('customerId', resourceParams.customerId ? resourceParams.customerId : '')
      .set('isSalesOrderRequest', resourceParams.isSalesOrderRequest)
    return this.http.get<SalesOrderItem[]>(url, {
      params: customParams,
      observe: 'response'
    });
  }
}
