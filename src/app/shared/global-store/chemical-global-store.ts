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
import { Chemical } from '@core/domain-classes/chemical';
import { ChemicalResourceParameter } from '@core/domain-classes/chemical-resource-parameter';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { TranslationService } from '@core/services/translation.service';
import { ChemicalService } from '../../chemical/chemical.service';

type ChemicalGlobalState = {
  chemicals: Chemical[];
  parameters: ChemicalResourceParameter;
  isLoading: boolean;
};

export const initialChemicalState: ChemicalGlobalState = {
  chemicals: [],
  parameters: {
    fields: '',
    orderBy: '',
    searchQuery: '',
    pageSize: 20,
    skip: 0,
    name: '',
    totalCount: 0,
    casNumber: '',
    chemicalId: '',
    isShowFront: 'all',
    categoryId: '',
    industryId: '',
    industryName: '',
    categoryName: '',
    sortActive: '',
    sortDirection: '',
  },
  isLoading: false,
};

export const ChemicalGlobalStore = signalStore(
  { providedIn: 'root' },

  withState(initialChemicalState),

  withMethods(
    (
      store,
      chemicalService = inject(ChemicalService),
      toastr = inject(ToastrService),
      translationService = inject(TranslationService),
    ) => ({
      loadChemicals: rxMethod<ChemicalResourceParameter>(
        pipe(
          debounceTime(500),
          tap(() => patchState(store, { isLoading: true })),
          switchMap((params: ChemicalResourceParameter) =>
            chemicalService.getChemicals(params).pipe(
              tapResponse({
                next: (response) => {
                  const pagination = response.headers.get('x-pagination');
                  const header = pagination
                    ? (JSON.parse(pagination) as ResponseHeader)
                    : null;
                  patchState(store, {
                    chemicals: response.body ?? [],
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

      updateParameters(params: Partial<ChemicalResourceParameter>) {
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
      store.loadChemicals(initialChemicalState.parameters);
    },
  }),
);
