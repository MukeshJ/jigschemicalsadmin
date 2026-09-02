import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Industry } from '@core/domain-classes/industry';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndustryService {

  constructor(private httpClient: HttpClient) { }

  getIndustries(): Observable<Industry[]> {
    return this.httpClient.get<Industry[]>('industry');
  }

  getIndustryById(id: string): Observable<Industry> {
    return this.httpClient.get<Industry>(`industry/${id}`);
  }

  saveIndustry(industry: Industry) {
    return this.httpClient.post<Industry[]>('industry', industry);
  }
  updateIndustry(industry: Industry, id: string) {
    return this.httpClient.put<Industry[]>('industry/' + id, industry);
  }

  deleteIndustry(id: string) {
    return this.httpClient.delete<void>('industry/' + id);
  }
}
