import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SalesOrderResourceParameter } from '@core/domain-classes/sales-order-resource-parameter';
import { SalesOrderPayment } from '@core/domain-classes/sales-order-payment';

@Injectable({providedIn: 'root'})
export class SalesPaymentReportService {
  constructor(private httpClient: HttpClient) {

   }

   getAllSalesOrderPaymentReport(
    resourceParams: SalesOrderResourceParameter
  ): Observable<HttpResponse<SalesOrderPayment[]>> {
    const url = 'SalesOrderPayment/report';
    const customParams = new HttpParams()
      .set('Fields', resourceParams.fields)
      .set('OrderBy', resourceParams.orderBy)
      .set('PageSize', resourceParams.pageSize.toString())
      .set('Skip', resourceParams.skip.toString())
      .set('SearchQuery', resourceParams.searchQuery)
      .set('name', resourceParams.name)
      .set('orderNumber', resourceParams.orderNumber)
      .set('customerName', resourceParams.customerName)
      .set('fromDate', resourceParams.fromDate?resourceParams.fromDate.toDateString():'')
      .set('toDate',  resourceParams.toDate?resourceParams.toDate.toDateString():'')
      .set('chemicalId', resourceParams.chemicalId?resourceParams.chemicalId:'')
      .set('customerId', resourceParams.customerId ? resourceParams.customerId : '')
      .set('isSalesOrderRequest', resourceParams.isSalesOrderRequest)
    return this.httpClient.get<SalesOrderPayment[]>(url, {
      params: customParams,
      observe: 'response'
    });
  }

  getAllSalesOrderPaymentReportExcel(
    resourceParams: SalesOrderResourceParameter
  ): Observable<HttpResponse<SalesOrderPayment[]>> {
    const url = 'SalesOrderPayment/report';
    const customParams = new HttpParams()
      .set('Fields', resourceParams.fields)
      .set('OrderBy', resourceParams.orderBy)
      .set('PageSize', "0")
      .set('Skip', "0")
      .set('SearchQuery', resourceParams.searchQuery)
      .set('name', resourceParams.name)
      .set('orderNumber', resourceParams.orderNumber)
      .set('customerName', resourceParams.customerName)
      .set('fromDate', resourceParams.fromDate?resourceParams.fromDate.toDateString():'')
      .set('toDate',  resourceParams.toDate?resourceParams.toDate.toDateString():'')
      .set('chemicalId', resourceParams.chemicalId?resourceParams.chemicalId:'')
      .set('customerId', resourceParams.customerId ? resourceParams.customerId : '')
      .set('isSalesOrderRequest', resourceParams.isSalesOrderRequest)
    return this.httpClient.get<SalesOrderPayment[]>(url, {
      params: customParams,
      observe: 'response'
    });
  }

}
