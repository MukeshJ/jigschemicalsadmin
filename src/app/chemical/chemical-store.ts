import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import {
  signalStore,
  withComputed,
  withMethods,
  withProps,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { distinctUntilChanged, Observable, pipe, switchMap, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Chemical } from '@core/domain-classes/chemical';
import { ChemicalResourceParameter } from '@core/domain-classes/chemical-resource-parameter';
import { TranslationService } from '@core/services/translation.service';
import { ChemicalService } from './chemical.service';
import { ChemicalGlobalStore } from '@shared/global-store/chemical-global-store';

export const ChemicalLocalStore = signalStore(
  withProps(() => ({
    chemicalService: inject(ChemicalService),
    globalStore: inject(ChemicalGlobalStore),
    router: inject(Router),
    toastr: inject(ToastrService),
    translationService: inject(TranslationService),
  })),

  withComputed((store) => ({
    chemicalList: store.globalStore.chemicals,
    parameters: store.globalStore.parameters,
    isLoading: store.globalStore.isLoading,
  })),

  withMethods((store) => ({
    refreshChemicals() {
      store.globalStore.loadChemicals(store.parameters());
    },
    
    searchChemicals(
      name: string,
      overrides: Partial<ChemicalResourceParameter> = {},
    ): Observable<Chemical[]> {
      return store.globalStore.searchChemicals(name, overrides);
    },

    updateParameters(params: Partial<ChemicalResourceParameter>) {
      store.globalStore.updateParameters({ ...params, skip: 0 });
      store.globalStore.loadChemicals(store.globalStore.parameters());
    },

    sortData(sort: Sort) {
      const params: ChemicalResourceParameter = {
        ...store.parameters(),
        sortActive: sort.active,
        sortDirection: sort.direction,
        orderBy: sort.direction ? `${sort.active} ${sort.direction}` : '',
        skip: 0,
      };
      store.globalStore.updateParameters(params);
      store.globalStore.loadChemicals(params);
    },

    changePage(event: PageEvent) {
      const params: ChemicalResourceParameter = {
        ...store.parameters(),
        skip: event.pageIndex * event.pageSize,
        pageSize: event.pageSize,
      };
      store.globalStore.updateParameters(params);
      store.globalStore.loadChemicals(params);
    },

    updateShowFrontendFlag: rxMethod<{ id: string; isShowInFront: boolean }>(
      pipe(
        switchMap(({ id, isShowInFront }) =>
          store.chemicalService
            .updateChemicalShowFrontendFlag(id, isShowInFront)
            .pipe(
              tapResponse({
                next: () => {
                  store.globalStore.loadChemicals(store.parameters());
                  store.toastr.success(
                    store.translationService.getValue(
                      'CHEMICAL_SHOW_FRONTEND_FLAG_UPDATED_SUCCESSFULLY',
                    ),
                  );
                },
                error: (e: any) => {
                  store.toastr.error(
                    store.translationService.getValue(`${e?.error ?? e}`),
                  );
                },
              }),
            ),
        ),
      ),
    ),

    deleteChemical: rxMethod<Chemical>(
      pipe(
        distinctUntilChanged(),
        switchMap((chemical: Chemical) =>
          store.chemicalService.deleteChemical(chemical.id).pipe(
            tapResponse({
              next: () => {
                store.globalStore.updateParameters({ name: '', skip: 0 });
                store.globalStore.loadChemicals(store.globalStore.parameters());
                store.toastr.success(
                  store.translationService.getValue(
                    'CHEMICAL_DELETED_SUCCESSFULLY',
                  ),
                );
              },
              error: (e: any) => {
                store.toastr.error(
                  store.translationService.getValue(`${e?.error ?? e}`),
                );
              },
            }),
          ),
        ),
      ),
    ),

    deleteAllChemical: rxMethod<string[]>(
      pipe(
        switchMap((ids: string[]) =>
          store.chemicalService.deleteAllChemical(ids).pipe(
            tapResponse({
              next: () => {
                store.globalStore.updateParameters({ name: '', skip: 0 });
                store.globalStore.loadChemicals(store.globalStore.parameters());
                store.toastr.success(
                  store.translationService.getValue(
                    'CHEMICAL_DELETED_SUCCESSFULLY',
                  ),
                );
              },
              error: (e: any) => {
                store.toastr.error(
                  store.translationService.getValue(`${e?.error ?? e}`),
                );
              },
            }),
          ),
        ),
      ),
    ),

    saveChemical: rxMethod<Chemical>(
      pipe(
        distinctUntilChanged(),
        switchMap((chemical: Chemical) =>
          store.chemicalService.saveChemical(chemical).pipe(
            tapResponse({
              next: () => {
                store.globalStore.updateParameters({ name: '', skip: 0 });
                store.globalStore.loadChemicals(store.globalStore.parameters());
                store.toastr.success(
                  store.translationService.getValue(
                    'CHEMICAL_SAVE_SUCCESSFULLY',
                  ),
                );
                store.router.navigate(['/chemical']);
              },
              error: (e: any) => {
                store.toastr.error(
                  store.translationService.getValue(`${e?.error ?? e}`),
                );
              },
            }),
          ),
        ),
      ),
    ),

    updateChemical: rxMethod<Chemical>(
      pipe(
        distinctUntilChanged(),
        switchMap((chemical: Chemical) =>
          store.chemicalService.updateChemical(chemical.id, chemical).pipe(
            tapResponse({
              next: () => {
                store.globalStore.loadChemicals(store.parameters());
                store.toastr.success(
                  store.translationService.getValue(
                    'CHEMICAL_UPDATED_SUCCESSFULLY',
                  ),
                );
                store.router.navigate(['/chemical']);
              },
              error: (e: any) => {
                store.toastr.error(
                  store.translationService.getValue(`${e?.error ?? e}`),
                );
              },
            }),
          ),
        ),
      ),
    ),
  })),
);
