import { inject } from '@angular/core';
import { debounceTime, pipe, switchMap, tap } from 'rxjs';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { ToastrService } from 'ngx-toastr';
import { Supplier } from '@core/domain-classes/supplier';
import { SupplierResourceParameter } from '@core/domain-classes/supplier-resource-parameter';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { TranslationService } from '@core/services/translation.service';
import { SupplierService } from '../../supplier/supplier.service';

/**
 * GLOBAL STORE — shared supplier list state (mirrors ChemicalGlobalStore).
 *
 * Holds the loaded supplier list plus the query parameters. Provided in root so
 * the state survives navigation between supplier screens. Module-specific
 * orchestration lives in SupplierLocalStore.
 */
type SupplierGlobalState = {
  suppliers: Supplier[];
  parameters: SupplierResourceParameter;
  isLoading: boolean;
};

export const initialSupplierState: SupplierGlobalState = {
  suppliers: [],
  parameters: {
    fields: '',
    orderBy: '',
    searchQuery: '',
    pageSize: 10,
    skip: 0,
    name: '',
    totalCount: 0,
    id: '',
    chemicalId: '',
    supplierName: '',
    mobileNo: '',
    email: '',
    website: '',
    country: '',
    sortActive: '',
    sortDirection: '',
  },
  isLoading: false,
};

export const SupplierGlobalStore = signalStore(
  { providedIn: 'root' },

  withState(initialSupplierState),

  withMethods(
    (
      store,
      supplierService = inject(SupplierService),
      toastr = inject(ToastrService),
      translationService = inject(TranslationService),
    ) => ({
      loadSuppliers: rxMethod<SupplierResourceParameter>(
        pipe(
          debounceTime(500),
          tap(() => patchState(store, { isLoading: true })),
          switchMap((params: SupplierResourceParameter) =>
            supplierService.getSuppliers(params).pipe(
              tapResponse({
                next: (response) => {
                  const pagination = response.headers.get('x-pagination');
                  const header = pagination
                    ? (JSON.parse(pagination) as ResponseHeader)
                    : null;
                  patchState(store, {
                    suppliers: response.body ?? [],
                    isLoading: false,
                    parameters: {
                      ...store.parameters(),
                      totalCount: header ? header.totalCount : 0,
                    },
                  });
                },
                error: (error: any) => {
                  patchState(store, { isLoading: false });
                  toastr.error(
                    translationService.getValue(`${error?.error ?? error}`),
                  );
                },
              }),
            ),
          ),
        ),
      ),

      updateParameters(params: Partial<SupplierResourceParameter>) {
        patchState(store, {
          parameters: {
            ...store.parameters(),
            ...params,
          },
        });
      },
    }),
  ),

  withHooks({
    onInit(store) {
      store.loadSuppliers(initialSupplierState.parameters);
    },
  }),
);
