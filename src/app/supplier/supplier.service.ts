import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpResponse, HttpClient, HttpParams } from '@angular/common/http';
import { SupplierResourceParameter } from '@core/domain-classes/supplier-resource-parameter';
import { Supplier } from '@core/domain-classes/supplier';
import { Guid } from 'guid-typescript';
import { ChemicalList } from '@core/domain-classes/chemical-list';
import { SupplierList } from '@core/domain-classes/supplier-list';
import { CommonError } from '@core/error-handler/common-error';
import { catchError } from 'rxjs/operators';
import { CommonHttpErrorService } from '@core/error-handler/common-http-error.service';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  constructor(private http: HttpClient,private commonHttpErrorService: CommonHttpErrorService) { }

  getSuppliers( resourceParams: SupplierResourceParameter ): Observable<HttpResponse<Supplier[]>> {
    const url = 'supplier';
    const customParams = new HttpParams()
      .set('Fields', resourceParams.fields)
      .set('OrderBy', resourceParams.orderBy)
      .set('PageSize', resourceParams.pageSize.toString())
      .set('Skip', resourceParams.skip.toString())
      .set('SearchQuery', resourceParams.searchQuery)
      .set('supplierName', resourceParams.supplierName)
      .set('mobileNo', resourceParams.mobileNo)
      .set('email', resourceParams.email)
      .set('country', resourceParams.country ? resourceParams.country : '')
      .set('website', resourceParams.website);
    return this.http.get<Supplier[]>(url, {
      params: customParams,
      observe: 'response',
    });
  }

  getSupplier(id: string): Observable<Supplier> {
    const url = 'supplier/' + id;
    return this.http.get<Supplier>(url);
  }
  deleteSupplier(id: string): Observable<void> {
    const url = `supplier/${id}`;
    return this.http.delete<void>(url);
  }
  updateSupplier(id: string, supplier: Supplier): Observable<Supplier> {
    const url = 'supplier/' + id;
    return this.http.put<Supplier>(url, supplier);
  }
  saveSupplier(supplier: Supplier): Observable<Supplier> {
    const url = 'supplier';
    return this.http.post<Supplier>(url, supplier);
  }

  checkEmailOrPhoneExist(
    email: string,
    mobileNo: string,
    supplierId: string | Guid
  ): Observable<boolean> {
    const url = `supplier/${supplierId}/Exist?email=${email}&mobileNo=${mobileNo}`;
    return this.http.get<boolean>(url);
  }

  getChemicalsBySupplierId(id: string, skip: number, take: number, chemicalName: string, casNumber: string): Observable<ChemicalList> {
    const url = `SupplierChemical/supplier/${id}?skip=${skip}&take=${take}&chemicalName=${chemicalName}&casNumber=${casNumber}`;
    return this.http.get<ChemicalList>(url);
  }

  getSuppliersByChemicalId(resourceParams: SupplierResourceParameter): Observable<SupplierList> {
    const customParams = new HttpParams()
      .set('PageSize', resourceParams.pageSize.toString())
      .set('Skip', resourceParams.skip.toString())
      .set('supplierName', resourceParams.supplierName)
      .set('mobileNo', resourceParams.mobileNo)
      .set('email', resourceParams.email)
      .set('country', resourceParams.country)
      .set('chemicalId', resourceParams.chemicalId.toString());
    const url = `SupplierChemical/chemical`;
    return this.http.get<SupplierList>(url, {
      params: customParams
    });
  }

  getSuppliersForDropDown(searchString: string): Observable<Supplier[]> {
    const url = 'SupplierSearch';
    if (searchString) {
      let params = `?searchQuery=${searchString.trim()}&pageSize=10`;
      return this.http.get<Supplier[]>(url + params);
    }
    return of([]);
  }

  
  uploadChemical(chemicals: FormData,id:string): Observable<any | CommonError> {
    const url = `supplier/uploadChemical/${id}`;
    return this.http.post<boolean>(url, chemicals)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

}
