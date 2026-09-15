import { Injectable } from '@angular/core';
import { } from '@environments/environment';
import {
  HttpClient,
  HttpResponse,
  HttpParams,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ChemicalResourceParameter } from '@core/domain-classes/chemical-resource-parameter';
import { Chemical } from '@core/domain-classes/chemical';
import { catchError } from 'rxjs/operators';
import { CommonHttpErrorService } from '@core/error-handler/common-http-error.service';
import { CommonError } from '@core/error-handler/common-error';

@Injectable({ providedIn: 'root' })
export class ChemicalService {
  constructor(private http: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService) { }

  getChemicals( resourceParams: ChemicalResourceParameter ): Observable<HttpResponse<Chemical[]>> {
    const url = 'chemical';
    const customParams = new HttpParams()
      .set('Fields', resourceParams.fields)
      .set('OrderBy', resourceParams.orderBy)
      .set('PageSize', resourceParams.pageSize.toString())
      .set('Skip', resourceParams.skip.toString())
      .set('SearchQuery', resourceParams.searchQuery)
      .set('name', resourceParams.name)
      .set('casNumber', resourceParams.casNumber)
      .set('isShowInFront', resourceParams.isShowFront)
    return this.http.get<Chemical[]>(url, {
      params: customParams,
      observe: 'response'
    });
  }

  getChemical(id: string): Observable<Chemical> {
    const url = `Chemical/${id}`;
    return this.http.get<Chemical>(url);
  }
  deleteChemical(id: string): Observable<void> {
    const customParams = new HttpParams().set('id', id);

    const url = `Chemical/${id}`;
    return this.http.delete<void>(url);
  }
  updateChemical(id: string, chemical: Chemical): Observable<void> {
    const url = `Chemical/${id}`;
    return this.http.put<void>(url, chemical);
  }

  updateChemicalShowFrontendFlag(id: string, isShowInFront: boolean): Observable<boolean> {
    const url = `Chemical/update/showfrontend`;
    return this.http.post<boolean>(url, {
      chemicalId: id,
      isShowInFront: isShowInFront
    });
  }

  saveChemical(chemical: Chemical): Observable<Chemical> {
    const url = `Chemical`;
    return this.http.post<Chemical>(url, chemical);
  }
  saveChemicalFile(data: any): Observable<any> {
    const url = `FileUpload`;
    return this.http.post<Chemical>(url, data);
  }

  getChemicalsForDropDown(searchBy: string, searchString: string): Observable<Chemical[]> {
    const url = 'ChemicalSearch';
    if (searchString && searchBy) {
      let params = `?searchQuery=${searchString.trim()}&searchBy=${searchBy}&pageSize=10`;
      return this.http.get<Chemical[]>(url + params);
    }
    return of([]);
  }

  bulkuUloadChemicals(chemicals: FormData): Observable<any | CommonError> {
    const url = `Chemical/upload`;
    return this.http.post<Chemical>(url, chemicals)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  deleteAllChemical(ids: string[]): Observable<any> {
    const url = 'chemical/deleteAllChemical';
    return this.http.post<void>(url, ids);
  }

}
