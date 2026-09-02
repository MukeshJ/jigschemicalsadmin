import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chemical } from '@core/domain-classes/chemical';
import { IndustryChemicals } from '@core/domain-classes/industry-chemicals';
import { ChemicalList } from '@core/domain-classes/chemical-list';

@Injectable({ providedIn: 'root' })
export class IndustryChemicalService {
    constructor(private httpClient: HttpClient) { }

    addChemicalIndustry(
        industryChemical: IndustryChemicals
    ): Observable<Chemical[]> {
        const url = 'IndustryChemical';
        return this.httpClient.post<Chemical[]>(url, industryChemical);
    }

    deleteIndustryChemcial(
        chemicalId: string,
        industryId: string
    ): Observable<boolean> {
        const url = `IndustryChemical/${chemicalId}/${industryId}`;
        return this.httpClient.delete<boolean>(url);
    }

    getChemicalsByIndustryId(id: string, skip: number, take: number, chemicalName: string, casNumber: string): Observable<ChemicalList> {
        const url = `IndustryChemical/industry/${id}?skip=${skip}&take=${take}&chemicalName=${chemicalName}&casNumber=${casNumber}`;
        return this.httpClient.get<ChemicalList>(url);
    }
}
