import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Supplier } from '@core/domain-classes/supplier';
import { SupplierResourceParameter } from '@core/domain-classes/supplier-resource-parameter';
import { TranslationService } from '@core/services/translation.service';
import { SupplierService } from './supplier.service';
import { SupplierGlobalStore } from '@shared/global-store/supplier-global-store';

/**
 * LOCAL STORE — supplier module/component orchestration (mirrors ChemicalLocalStore).
 *
 * Provide it per-component (`providers: [SupplierLocalStore]`). It re-exposes the
 * shared list state from SupplierGlobalStore and drives every supplier action
 * (paging / sorting / filtering / CRUD). `isSaving` is the one extra bit of
 * local state, kept so the detail form can show its save spinner.
 * Never import this store into unrelated modules — inject SupplierGlobalStore.
 */
export const SupplierLocalStore = signalStore(
  withState<{ isSaving: boolean }>({ isSaving: false }),

  withProps(() => ({
    supplierService: inject(SupplierService),
    globalStore: inject(SupplierGlobalStore),
    router: inject(Router),
    toastr: inject(ToastrService),
    translationService: inject(TranslationService),
  })),

  withComputed((store) => ({
    supplierList: store.globalStore.suppliers,
    parameters: store.globalStore.parameters,
    isLoading: store.globalStore.isLoading,
  })),

  withMethods((store) => ({
    refreshSuppliers() {
      store.globalStore.loadSuppliers(store.parameters());
    },

    updateParameters(params: Partial<SupplierResourceParameter>) {
      store.globalStore.updateParameters({ ...params, skip: 0 });
      store.globalStore.loadSuppliers(store.globalStore.parameters());
    },

    sortData(sort: Sort) {
      const params: SupplierResourceParameter = {
        ...store.parameters(),
        sortActive: sort.active,
        sortDirection: sort.direction,
        orderBy: sort.direction ? `${sort.active} ${sort.direction}` : '',
        skip: 0,
      };
      store.globalStore.updateParameters(params);
      store.globalStore.loadSuppliers(params);
    },

    changePage(event: PageEvent) {
      const params: SupplierResourceParameter = {
        ...store.parameters(),
        skip: event.pageIndex * event.pageSize,
        pageSize: event.pageSize,
      };
      store.globalStore.updateParameters(params);
      store.globalStore.loadSuppliers(params);
    },

    deleteSupplier: rxMethod<Supplier>(
      pipe(
        distinctUntilChanged(),
        switchMap((supplier: Supplier) =>
          store.supplierService.deleteSupplier(supplier.id).pipe(
            tapResponse({
              next: () => {
                store.globalStore.updateParameters({ skip: 0 });
                store.globalStore.loadSuppliers(store.globalStore.parameters());
                store.toastr.success(
                  store.translationService.getValue(
                    'SUPPLIER_DELETED_SUCCESSFULLY',
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

    saveSupplier: rxMethod<Supplier>(
      pipe(
        distinctUntilChanged(),
        tap(() => patchState(store, { isSaving: true })),
        switchMap((supplier: Supplier) =>
          store.supplierService.saveSupplier(supplier).pipe(
            tapResponse({
              next: () => {
                patchState(store, { isSaving: false });
                store.toastr.success(
                  store.translationService.getValue(
                    'SUPPLIER_SAVE_SUCCESSFULLY',
                  ),
                );
                store.router.navigate(['/supplier']);
              },
              error: (e: any) => {
                patchState(store, { isSaving: false });
                store.toastr.error(
                  store.translationService.getValue(`${e?.error ?? e}`),
                );
              },
            }),
          ),
        ),
      ),
    ),

    updateSupplier: rxMethod<Supplier>(
      pipe(
        distinctUntilChanged(),
        tap(() => patchState(store, { isSaving: true })),
        switchMap((supplier: Supplier) =>
          store.supplierService.updateSupplier(supplier.id, supplier).pipe(
            tapResponse({
              next: () => {
                patchState(store, { isSaving: false });
                store.toastr.success(
                  store.translationService.getValue(
                    'SUPPLIER_UPDATE_SUCCESSFULLY',
                  ),
                );
                store.router.navigate(['/supplier']);
              },
              error: (e: any) => {
                patchState(store, { isSaving: false });
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
