import { inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Chemical } from '@core/domain-classes/chemical';
import { Observable } from 'rxjs';
import { ChemicalGlobalStore } from '@shared/global-store/chemical-global-store';

@Injectable({ providedIn: 'root' })
export class ChemicalsResolve implements Resolve<Chemical[]> {
  private readonly globalStore = inject(ChemicalGlobalStore);

  // A resolver is not a component, so it goes straight to ChemicalGlobalStore —
  // still the only thing that calls ChemicalService.getChemicals().
  resolve(): Observable<Chemical[]> {
    return this.globalStore.searchChemicals('', { pageSize: 30 });
  }
}
