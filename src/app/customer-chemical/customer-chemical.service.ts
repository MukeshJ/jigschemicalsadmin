import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CustomerResourceParameter } from '@core/domain-classes/customer-resource-parameter';
import { Customer } from '@core/domain-classes/customer';
import { Observable } from 'rxjs';
import { CustomerChemicals } from '@core/domain-classes/customer-chemicals';
import { Chemical } from '@core/domain-classes/chemical';
import { ChemicalList } from '@core/domain-classes/chemical-list';
import { CustomerChemical } from '@core/domain-classes/customer-chemical';

@Injectable({providedIn: 'root'})
export class CustomerChemicalService {
  constructor(private httpClient: HttpClient) { }

  searchCustomer(
    resourceParams: CustomerResourceParameter
): Observable<Customer[]> {
    const url = 'customer';
    const customParams = new HttpParams()
        .set('Fields', resourceParams.fields)
        .set('OrderBy', resourceParams.orderBy)
        .set('PageSize', resourceParams.pageSize.toString())
        .set('Skip', '0')
        .set('SearchQuery', resourceParams.searchQuery);
    return this.httpClient.get<Customer[]>(url, {
        params: customParams
    });
}

addChemicalCustomer(
    chemicalSupplier: CustomerChemicals
): Observable<Chemical[]> {
    const url = 'CustomerChemical';
    return this.httpClient.post<Chemical[]>(url, chemicalSupplier);
}

deleteCustomerChemcial(
    chemicalId: string,
    supplierId: string
): Observable<boolean> {
    const url = `CustomerChemical/${chemicalId}/${supplierId}`;
    return this.httpClient.delete<boolean>(url);
}

getChemicalsByCustomerId(id: string, skip: number, take: number, chemicalName: string, casNumber: string):
Observable<ChemicalList> {
  const url = `CustomerChemical/customer/${id}?skip=${skip}&take=${take}&chemicalName=${chemicalName}&casNumber=${casNumber}`;
  return this.httpClient.get<ChemicalList>(url);
}

addCustomerByChemical(
  customerChemical: CustomerChemical
): Observable<boolean> {
  const url = `CustomerChemical/chemical/${customerChemical.chemicalId}`;
  return this.httpClient.post<boolean>(url, customerChemical);
}


}
