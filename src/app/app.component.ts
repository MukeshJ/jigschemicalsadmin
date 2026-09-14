import { Component, DOCUMENT, inject, OnInit } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { CompanyProfile } from '@core/domain-classes/company-profile';
import { OnlineUser } from '@core/domain-classes/online-user';
import { UserAuth } from '@core/domain-classes/user-auth';
import { SecurityService } from '@core/security/security.service';
import { CommonService } from '@core/services/common.service';
import { SignalrService } from '@core/services/signalr.service';
import { TranslationService } from '@core/services/translation.service';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { BaseComponent } from './base.component';
import { LoadingService } from './loading.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet , MatProgressSpinner ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent implements OnInit {
  
  loading = false;
  constructor(
    private signalrService: SignalrService,
    private securityService: SecurityService,
    public translate: TranslateService,
    private translationService: TranslationService,
    private route: ActivatedRoute,
    private titleService: Title,
    private router: Router,
    private commonService: CommonService,
    private loadingService: LoadingService) {
    super();
    translate.addLangs(['en', 'es', 'ar', 'ru', 'cn', 'ja', 'ko']);
    translate.setFallbackLang('en');
    this.setLanguage();
    this.setProfile();
    this.companyProfileSubscription();
    const document = inject<Document>(DOCUMENT);

    this.updateCanonicalUrl(document, this.router.url);
    
    this.loadingService.loading$.subscribe((isLoading) => {
      this.loading = isLoading;
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loadingService.setLoading(true);
      }

      if (event instanceof NavigationCancel || event instanceof NavigationError) {
        this.loadingService.setLoading(false);
      }

      if (event instanceof NavigationEnd) {
        this.loadingService.setLoading(false);
        this.updateCanonicalUrl(document, event.urlAfterRedirects || event.url);
      }
    });
  }
  
  private updateCanonicalUrl(document: Document, currentUrl: string): void {
    const baseUrl = (environment.apiUrl || '').replace(/\/+$/, '');
    const cleanPath = (currentUrl || '/').split('?')[0].split('#')[0];
    const path = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
    const canonicalHref = baseUrl ? (path === '/' ? `${baseUrl}/` : `${baseUrl}${path}`) : path;

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }

    canonical.setAttribute('href', canonicalHref);
  }

  setProfile() {
    this.route.data.subscribe((data: { profile: CompanyProfile }) => {
      if (data.profile) {
        this.securityService.updateProfile(data.profile);
      }
    });
  }

  

  companyProfileSubscription() {
    this.securityService.companyProfile.subscribe(profile => {
      if (profile) {
        this.titleService.setTitle(profile.title);
      }
    });
  }

  setLanguage() {
    const currentLang = this.translationService.getSelectedLanguage();
    if (currentLang) {
      this.sub$.sink = this.translationService.setLanguage(currentLang)
        .subscribe(() => { });
    }
    else {
      const browserLang = this.translate.getBrowserLang();
      const lang = browserLang.match(/en|es|ar|ru|cn|ja|ko/) ? browserLang : 'en';
      this.sub$.sink = this.translationService.setLanguage(lang).subscribe(() => { });
    }
  }

  ngOnInit() {
    this.routerNavigate();
    this.signalrService.startConnection().then(resolve => {
      if (resolve) {
        this.signalrService.handleMessage();
        this.getAuthObj();
      }
    });
  }
  getAuthObj() {
    this.sub$.sink = this.securityService.securityObject$
      .subscribe((c: UserAuth) => {
        if (c) {
          const online: OnlineUser = {
            email: c.email,
            id: c.id,
            connectionId: this.signalrService.connectionId
          };
          this.signalrService.addUser(online);
        }
      });
  }

  routerNavigate() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) => {
         if (event.url.indexOf('search/supplier') > -1 ) {
          this.commonService.setCurrentUrl("chemical");
        }
        else  if (event.url.indexOf('supplier') > -1 || event.url.indexOf('supplier-chemical-relationship') > -1 || event.url.indexOf('search/chemical') > -1 ) {
          this.commonService.setCurrentUrl("supplier");
        }
        else if (event.url.indexOf('customer') > -1 || event.url.indexOf('customer-chemical-relationship') > -1 ) {
          this.commonService.setCurrentUrl("customer");
        }
        else if (
          event.url.indexOf('purchase-order-report') > -1
          || event.url.indexOf('sales-order-report') > -1
          || event.url.indexOf('chemical-purchase-report') > -1
          || event.url.indexOf('chemical-sales-report') > -1
          || event.url.indexOf('stock-report') > -1
          || event.url.indexOf('purchase-payment-report') > -1
          || event.url.indexOf('expense-report') > -1
          || event.url.indexOf('sales-payment-report') > -1
          || event.url.indexOf('supplier-payment-report') > -1
          || event.url.indexOf('sales-purchase-report') > -1
          || event.url.indexOf('customer-payment-report') > -1
        ) {
          this.commonService.setCurrentUrl("reports");
        }
        else if (event.url.indexOf('industry') > -1 || event.url.indexOf('industry-chemical') > -1) {
          this.commonService.setCurrentUrl("industry");
        }

        else if (event.url.indexOf('chemical') > -1 || event.url.indexOf('chemical-types') > -1 || event.url.indexOf('search/supplier') > -1 || event.url.indexOf('unit') > -1 || event.url.indexOf('tax') > -1 ) {
          this.commonService.setCurrentUrl("chemical");
        }

        else if (event.url.indexOf('inquiry') > -1 || event.url.indexOf('inquiry-status') > -1 || event.url.indexOf('inquiry-source') > -1) {
          this.commonService.setCurrentUrl("inquiry");
        }
        else if (event.url.indexOf('purchase-order-request') > -1) {
          this.commonService.setCurrentUrl("purchase-order-request");
        }
        else if (event.url.indexOf('purchase-order-return') > -1) {
          this.commonService.setCurrentUrl("purchase-order-return");
        }
        else if (event.url.indexOf('purchase-order') > -1 || event.url.indexOf('packaging-type') > -1 ) {
          this.commonService.setCurrentUrl("purchase-order");
        }
        else if (event.url.indexOf('sales-order-return') > -1) {
          this.commonService.setCurrentUrl("sales-order-return");
        }
        else if (event.url.indexOf('sales-order') > -1 || event.url.indexOf('delivery-method') > -1 || event.url.indexOf('payment-term') > -1) {
          this.commonService.setCurrentUrl("sales-order");
        }

        else if (event.url.indexOf('my-documents') > -1 || event.url.indexOf('document-categories') > -1 || event.url.indexOf('documents') > -1 || event.url.indexOf('document-audit-trails') > -1) {
          this.commonService.setCurrentUrl("documents-library");
        }
        else if (event.url.indexOf('expense') > -1 || event.url.indexOf('expense-category') > -1) {
          this.commonService.setCurrentUrl("expense");
        }

        else if (event.url.indexOf('reminders') > -1) {
          this.commonService.setCurrentUrl("reminders");
        }
        else if (event.url.indexOf('users') > -1 || event.url.indexOf('sessions') > -1) {
          this.commonService.setCurrentUrl("users");
        }
        else if (event.url.indexOf('roles') > -1) {
          this.commonService.setCurrentUrl("roles");
        }
        else if (event.url.indexOf('email-smtp') > -1 || event.url.indexOf('emailtemplate') > -1 || event.url.indexOf('send-email') > -1) {
          this.commonService.setCurrentUrl("email");
        }
        else if (event.url.indexOf('company-profile') > -1 || event.url.indexOf('country') > -1 || event.url.indexOf('cities') > -1) {
          this.commonService.setCurrentUrl("settings");
        }
        else if (event.url.indexOf('login-audit') > -1 || event.url.indexOf('logs') > -1) {
          this.commonService.setCurrentUrl("logs");
        }
        else if (event.url.indexOf('article') > -1) {
          this.commonService.setCurrentUrl("article");
        }
        else if (event.url.indexOf('testimonial') > -1) {
          this.commonService.setCurrentUrl("testimonial");
        }
        else if (event.url.indexOf('gallery') > -1) {
          this.commonService.setCurrentUrl("gallery");
        }
        else {
          this.commonService.setCurrentUrl("");
        }

      });
  }

}

