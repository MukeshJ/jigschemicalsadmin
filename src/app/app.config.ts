import { ApplicationConfig, ErrorHandler, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { CurrencyPipe } from '@angular/common';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { provideToastr } from 'ngx-toastr';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { DateAdapter, provideCalendar } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEntityData, withEffects } from '@ngrx/data';

import { routes } from './app.routes';
import { entityConfig } from './store/entity-metadata';
import { HttpRequestInterceptor } from './http-request.interceptor';
import { CommonErrorHandlerService } from './core/error-handler/common-error-handler.service';
import { CommonDialogService } from './core/common-dialog/common-dialog.service';
import {
  PendingInterceptorService,
  PendingInterceptorServiceFactoryProvider,
} from './shared/loading-indicator/pending-interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideHttpClient(withInterceptorsFromDi()),
    provideToastr(),
    provideNativeDateAdapter(),
    provideCalendar({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    provideCharts(withDefaultRegisterables()),

    provideStore({}),
    provideEffects([]),
    provideEntityData(entityConfig, withEffects()),
    ...(isDevMode() ? [provideStoreDevtools()] : []),

    provideTranslateService({
      fallbackLang: 'en',
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json',
      }),
    }),

    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useExisting: PendingInterceptorService, multi: true },
    PendingInterceptorServiceFactoryProvider,

    { provide: ErrorHandler, useClass: CommonErrorHandlerService, deps: [HttpClient] },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    CommonDialogService,
    CurrencyPipe,
  ],
};
