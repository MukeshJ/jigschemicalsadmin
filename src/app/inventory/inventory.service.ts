import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Inventory } from '@core/domain-classes/inventory/inventory';
import { InventoryHistory } from '@core/domain-classes/inventory/inventory-history';
import { InventoryHistoryResourceParameter } from '@core/domain-classes/inventory/inventory-history-resource-parameter';
import { InventoryResourceParameter } from '@core/domain-classes/inventory/inventory-resource-parameter';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private http: HttpClient) { }

  getInventories(
    resourceParams: InventoryResourceParameter
  ): Observable<HttpResponse<Inventory[]>> {
    const url = 'inventory';
    const customParams = new HttpParams()
      .set('Fields', resourceParams.fields)
      .set('OrderBy', resourceParams.orderBy)
      .set('PageSize', resourceParams.pageSize.toString())
      .set('Skip', resourceParams.skip.toString())
      .set('SearchQuery', resourceParams.searchQuery)
      .set('chemicalName', resourceParams.chemicalName ? resourceParams.chemicalName : '')

    return this.http.get<Inventory[]>(url, {
      params: customParams,
      observe: 'response',
    });
  }

  getInventoriesReport(
    resourceParams: InventoryResourceParameter
  ): Observable<HttpResponse<Inventory[]>> {
    const url = 'inventory';
    const customParams = new HttpParams()
      .set('Fields', resourceParams.fields)
      .set('OrderBy', resourceParams.orderBy)
      .set('PageSize', 0)
      .set('Skip', 0)
      .set('SearchQuery', resourceParams.searchQuery)
      .set('chemicalName', resourceParams.chemicalName ? resourceParams.chemicalName : '')

    return this.http.get<Inventory[]>(url, {
      params: customParams,
      observe: 'response',
    });
  }

  addInventory(inventory: Inventory): Observable<Inventory> {
    const url = 'inventory';
    return this.http.post<Inventory>(url, inventory);
  }

  getInventoryHistories(
    resourceParams: InventoryHistoryResourceParameter
  ): Observable<HttpResponse<InventoryHistory[]>> {
    const url = 'inventory/history';
    const customParams = new HttpParams()
      .set('Fields', resourceParams.fields)
      .set('OrderBy', resourceParams.orderBy)
      .set('PageSize', resourceParams.pageSize.toString())
      .set('Skip', resourceParams.skip.toString())
      .set('SearchQuery', resourceParams.searchQuery)
      .set('chemicalId', resourceParams.chemicalId)

    return this.http.get<InventoryHistory[]>(url, {
      params: customParams,
      observe: 'response',
    });
  }

}
