import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { HttpInterceptorModule } from './http-interceptor.module';
import { AppStoreModule } from './store/app-store.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PendingInterceptorModule } from '@shared/loading-indicator/pending-interceptor.module';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime-ex';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    CoreModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpInterceptorModule,
    AppStoreModule,
    PendingInterceptorModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ToastrModule.forRoot()
  ],
  providers: [
    provideTranslateService({
      fallbackLang: 'en',
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json',
      }),
    }),
    provideCharts(withDefaultRegisterables()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
