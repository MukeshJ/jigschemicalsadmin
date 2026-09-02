import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChemicalType } from '@core/domain-classes/chemical-type';

@Injectable({ providedIn: 'root' })
export class ChemicalTypeService {
  constructor(private httpClient: HttpClient) { }

  getChemicalTypes(): Observable<ChemicalType[]> {
    const url = 'category';
    return this.httpClient.get<ChemicalType[]>(url);
  }
  getChemicalType(id: string): Observable<ChemicalType> {
    const url = `category/${id}`;
    return this.httpClient.get<ChemicalType>(url);
  }
  deleteChemicalType(id: string): Observable<boolean> {
    const customParams = new HttpParams().set('id', id);
    const url = `category/${id}`;
    return this.httpClient.delete<boolean>(url);
  }
  updateChemicalType(id: string, chemicalType: ChemicalType): Observable<void> {
    const url = `category/${id}`;
    return this.httpClient.put<void>(url, chemicalType);
  }
  saveChemicalType(chemicalType: ChemicalType): Observable<ChemicalType> {
    const url = `category`;
    return this.httpClient.post<ChemicalType>(url, chemicalType);
  }

}
