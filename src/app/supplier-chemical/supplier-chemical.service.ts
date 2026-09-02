import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChemicalResourceParameter } from '@core/domain-classes/chemical-resource-parameter';
import { Chemical } from '@core/domain-classes/chemical';
import { SupplierResourceParameter } from '@core/domain-classes/supplier-resource-parameter';
import { Supplier } from '@core/domain-classes/supplier';
import { SupplierChemicals } from '@core/domain-classes/supplier-chemicals';
import { SupplierChemical } from '@core/domain-classes/supplier-chemical';

@Injectable({ providedIn: 'root' })
export class SupplierChemicalService {
  constructor(private httpClient: HttpClient) { }

  searchSupplier(
    resourceParams: SupplierResourceParameter
  ): Observable<Supplier[]> {
    const url = 'supplier';
    const customParams = new HttpParams()
      .set('Fields', resourceParams.fields)
      .set('OrderBy', resourceParams.orderBy)
      .set('PageSize', resourceParams.pageSize.toString())
      .set('Skip', '0')
      .set('SupplierName', resourceParams.searchQuery);
    return this.httpClient.get<Supplier[]>(url, {
      params: customParams
    });
  }

  addChemicalSupplier(
    chemicalSupplier: SupplierChemicals
  ): Observable<Chemical[]> {
    const url = 'SupplierChemical';
    return this.httpClient.post<Chemical[]>(url, chemicalSupplier);
  }

  addSupplierByChemical(
    chemicalSupplier: SupplierChemical
  ): Observable<boolean> {
    const url = `SupplierChemical/chemical/${chemicalSupplier.chemicalId}`;
    return this.httpClient.post<boolean>(url, chemicalSupplier);
  }

  deleteSupplierChemcial(
    chemicalId: string,
    supplierId: string
  ): Observable<boolean> {
    const url = `SupplierChemical/${chemicalId}/${supplierId}`;
    return this.httpClient.delete<boolean>(url);
  }
}
