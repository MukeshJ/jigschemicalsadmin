import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ReminderScheduler } from '@core/domain-classes/reminder-scheduler';
import { UserAuth } from '@core/domain-classes/user-auth';
import { SecurityService } from '@core/security/security.service';
import { CommonService } from '@core/services/common.service';
import { SignalrService } from '@core/services/signalr.service';
import { TranslationService } from '@core/services/translation.service';
import { environment } from '@environments/environment';
import { BaseComponent } from 'src/app/base.component';
import { LanguageFlag, Languages } from './languages';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { debounceTime, tap, switchMap, map, catchError } from 'rxjs/operators';
import { ChemicalService } from 'src/app/chemical/chemical.service';
import { Chemical } from '@core/domain-classes/chemical';
import { ChemicalResourceParameter } from '@core/domain-classes/chemical-resource-parameter';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          transform: 'translate3d(0,0,0)',
        })
      ),
      state(
        'out',
        style({
          transform: 'translate3d(100%, 0, 0)',
        })
      ),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out')),
    ]),
  ],
})
export class HeaderComponent extends BaseComponent implements OnInit {
  @ViewChild('selectElem', { static: true }) el: ElementRef;
  @Input()
  public lead: any;
  navbarOpen = false;
  appUserAuth: UserAuth = null;
  language: LanguageFlag;
  notificationCount: number = 0;
  notificationUserList: ReminderScheduler[] = [];
  languages: LanguageFlag[] = [];
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  isRedirecting = false;
  chemicalSearchForm!: FormGroup;
  chemicalResourceParameter = new ChemicalResourceParameter();
  chemicals$!: Observable<Chemical[]>;
  profilePath = '';
  logoImage = '';
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private securityService: SecurityService,
    private signalrService: SignalrService,
    private translationService: TranslationService,
    private commonService: CommonService,
    private chemicalService: ChemicalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.languages = Languages.languages;
    this.setTopLogAndName();
    this.setDefaultLanguage();
    this.getUserNotification();
    this.getNotificationList();
    this.companyProfileSubscription();
    this.createChemicalSearchForm();
  }

  companyProfileSubscription() {
    this.securityService.companyProfile.subscribe(profile => {
      if (profile) {
        this.logoImage = profile.logoUrl;
      }
    });
  }

  createChemicalSearchForm() {
    this.chemicalSearchForm = this.fb.group({
      chemicalNameInput: [''],
    });
    this.chemicals$ = this.chemicalSearchForm
      .get('chemicalNameInput')!
      .valueChanges.pipe(
        debounceTime(1000),
        tap(() => this.loadingSubject.next(true)),
        switchMap((value) => {
          this.chemicalResourceParameter.searchQuery = value || '';
          return this.chemicalService
            .getChemicalsDropDown(this.chemicalResourceParameter)
            .pipe(
              map((resp) => resp.body || []),
              tap(() => this.loadingSubject.next(false)),
              catchError(() => {
                this.loadingSubject.next(false);
                return of([] as Chemical[]);
              })
            );
        })
      );
  }

  selectChemical = (chemical: Chemical) => {
    if (this.isRedirecting) {
      return;
    }
    this.isRedirecting = true;
    this.chemicalSearchForm.get('chemicalNameInput')!.setValue('', { emitEvent: false });
    this.router.navigate(['/chemical/', chemical.id]).then(
      () => (this.isRedirecting = false),
      () => (this.isRedirecting = false)
    );
  };

  getUserNotification() {
    this.sub$.sink = this.signalrService.userNotification$
      .subscribe(c => {
        this.getUserNotificationCount();
        this.getNotificationList();
      });
  }

  getUserNotificationCount() {
    this.sub$.sink = this.commonService.getUserNotificationCount()
      .subscribe(c => {
        this.notificationCount = c;
      });
  }

  getNotificationList() {
    this.sub$.sink = this.commonService.getTop10UserNotification()
      .subscribe(c => {
        this.notificationUserList = c;
      });
  }

  setDefaultLanguage() {
    const lang = this.translationService.getSelectedLanguage();
    if (lang) this.setLanguageWithRefresh(lang);
  }

  setLanguageWithRefresh(lang: string) {
    this.languages.forEach((language: LanguageFlag) => {
      if (language.lang === lang) {
        language.active = true;
        this.language = language;
      } else {
        language.active = false;
      }
    });
    this.translationService.setLanguage(lang);
  }

  setNewLanguageRefresh(lang: string) {
    this.sub$.sink = this.translationService
      .setLanguage(lang)
      .subscribe((response) => {
        this.setLanguageWithRefresh(response['LANGUAGE']);
      });
  }

  setTopLogAndName() {
    this.sub$.sink = this.securityService.securityObject$.subscribe((c) => {
      if (c) {
        this.appUserAuth = c;
        if (this.appUserAuth.profilePhoto) {
          this.profilePath = environment.apiUrl + this.appUserAuth.profilePhoto;
        }
      }
    });
  }

  onLogout(): void {
    this.signalrService.logout(this.appUserAuth.id);
    this.securityService.logout();
    this.router.navigate(['/login']);
  }

  onMyProfile(): void {
    this.router.navigate(['/my-profile']);
  }

  public togglediv() {
    if (this.lead.className === 'toggled') {
      this.lead.className = '';
    } else {
      this.lead.className = 'toggled';
    }
  }
}
